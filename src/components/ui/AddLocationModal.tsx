'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationsAdded: () => void;
}

type PlaceType = 'pharmacy' | 'restaurant' | 'tourist_attraction';

const PLACE_TYPES: { value: PlaceType; label: string; emoji: string; unsplashQuery: string }[] = [
  { value: 'pharmacy', label: 'Farmácias', emoji: '💊', unsplashQuery: 'pharmacy-store' },
  { value: 'restaurant', label: 'Restaurantes', emoji: '🍽️', unsplashQuery: 'restaurant-interior' },
  { value: 'tourist_attraction', label: 'Pontos Turísticos', emoji: '🗺️', unsplashQuery: 'tourist-landmark' },
];

export function AddLocationModal({ isOpen, onClose, onLocationsAdded }: AddLocationModalProps) {
  const [selectedType, setSelectedType] = useState<PlaceType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = 'Erro ao obter localização. ';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Permissão negada. Verifique as configurações do navegador.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Localização indisponível no momento.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Tempo esgotado. Tente novamente.';
            break;
          default:
            errorMessage += 'Erro desconhecido.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
        console.error('Geolocation error:', err.code, err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleAddLocations = async () => {
    if (!selectedType || !userLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use Google Places API via backend proxy for better results
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Use Overpass API (OpenStreetMap) for nearby places - free and reliable
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node[${getOSMTag(selectedType)}](around:5000,${userLocation.lat},${userLocation.lng});
          way[${getOSMTag(selectedType)}](around:5000,${userLocation.lat},${userLocation.lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      const data = await response.json();

      if (!data.elements || data.elements.length === 0) {
        setError('Nenhum local encontrado próximo a você. Tente outro tipo.');
        setIsLoading(false);
        return;
      }

      // Filter and sort by distance
      const places = data.elements
        .filter((el: any) => el.tags?.name && (el.lat || el.center?.lat))
        .map((el: any) => ({
          name: el.tags.name,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          address: el.tags['addr:street'] || el.tags['addr:city'] || '',
        }))
        .slice(0, 5); // Get top 5

      if (places.length === 0) {
        setError('Nenhum local nomeado encontrado. Tente outra categoria.');
        setIsLoading(false);
        return;
      }

      const placeTypeInfo = PLACE_TYPES.find(t => t.value === selectedType);
      
      // Add locations to backend
      for (const place of places) {
        // Use Picsum Photos for reliable, random images
        const seed = place.name.replace(/\s/g, '-').toLowerCase();
        const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
        
        await fetch(`${apiUrl}/locations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: place.name,
            description: `${placeTypeInfo?.label} ${place.address ? `- ${place.address}` : ''}`,
            latitude: place.lat,
            longitude: place.lon,
            imageUrl,
          }),
        });
      }

      onLocationsAdded();
      onClose();
      setSelectedType(null);
      setUserLocation(null);
    } catch (error) {
      console.error('Error adding locations:', error);
      setError('Erro ao adicionar locais. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get OpenStreetMap tag for place type
  function getOSMTag(type: PlaceType): string {
    switch (type) {
      case 'pharmacy':
        return 'amenity=pharmacy';
      case 'restaurant':
        return 'amenity=restaurant';
      case 'tourist_attraction':
        return 'tourism=attraction';
      default:
        return 'amenity=*';
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto pointer-events-auto"
            >
              <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Adicionar Locais Próximos</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-3">
                    Selecione o tipo de local
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PLACE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedType === type.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{type.emoji}</span>
                          <div>
                            <div className="font-medium text-white">{type.label}</div>
                            <div className="text-sm text-neutral-500">
                              Encontrar os 5 mais próximos de você
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedType && !userLocation && (
                  <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-neutral-300 mb-3">
                          Precisamos da sua localização para encontrar os lugares mais próximos de você
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleGetUserLocation}
                          isLoading={isLoading}
                        >
                          Permitir Localização
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {userLocation && (
                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-sm text-green-400">
                      ✓ Localização obtida! Pronto para buscar locais próximos.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAddLocations}
                    disabled={!selectedType || !userLocation || isLoading}
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Buscando...' : 'Adicionar Locais'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

