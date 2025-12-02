'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CameraIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { useGamificationStore } from '@/store/gamificationStore';

interface CreateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationCreated: () => void;
}

const CATEGORIES = [
  { value: 'restaurant', label: 'Restaurante', emoji: '🍽️' },
  { value: 'bar', label: 'Bar/Balada', emoji: '🍺' },
  { value: 'cafe', label: 'Café', emoji: '☕' },
  { value: 'tourist_attraction', label: 'Ponto Turístico', emoji: '🗺️' },
  { value: 'park', label: 'Parque', emoji: '🌳' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'other', label: 'Outro', emoji: '📍' },
];

export function CreateLocationModal({ isOpen, onClose, onLocationCreated }: CreateLocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    discount: '',
    rating: 5,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { incrementLocations } = useGamificationStore();

  const handleGetLocation = () => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.category || !userLocation) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload image to placeholder service (use Cloudinary, Imgur, or your own backend)
      let imageUrl = 'https://via.placeholder.com/800x600/1e293b/ffffff?text=Local';
      
      if (imageFile) {
        // For now, use a placeholder. In production, upload to cloud storage
        // const formData = new FormData();
        // formData.append('file', imageFile);
        // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        // const uploadData = await uploadRes.json();
        // imageUrl = uploadData.url;
        imageUrl = imagePreview || imageUrl;
      } else {
        // Use Picsum for random images based on category
        const seed = formData.name.replace(/\s/g, '-').toLowerCase();
        imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Build rich description with all info
      let enrichedDescription = formData.description;
      
      // Add rating stars
      if (formData.rating > 0) {
        const stars = '⭐'.repeat(formData.rating);
        enrichedDescription = `${stars}\n\n${enrichedDescription}`;
      }
      
      // Add discount/offer
      if (formData.discount) {
        enrichedDescription += `\n\n🎁 OFERTA: ${formData.discount}`;
      }
      
      // Add category tag
      const categoryLabel = CATEGORIES.find(c => c.value === formData.category)?.label;
      if (categoryLabel) {
        enrichedDescription += `\n\n📍 Categoria: ${categoryLabel}`;
      }
      
      const response = await fetch(`${apiUrl}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: enrichedDescription,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Erro ao criar local');
      }

      incrementLocations();
      onLocationCreated();
      handleClose();
    } catch (error) {
      console.error('Error creating location:', error);
      setError('Erro ao criar local. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', category: '', discount: '', rating: 5 });
    setUserLocation(null);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto pointer-events-auto my-8"
            >
              <div className="sticky top-0 z-10 px-6 py-4 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-lg flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Cadastrar Local</h2>
                  <p className="text-sm text-neutral-400 mt-1">Compartilhe lugares incríveis e ganhe pontos!</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-neutral-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Foto do Local
                  </label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative h-48 rounded-xl overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-600 transition-colors">
                        <CameraIcon className="w-12 h-12 text-neutral-500 mb-2" />
                        <span className="text-sm text-neutral-400">Clique para adicionar foto</span>
                        <span className="text-xs text-neutral-500 mt-1">(opcional)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Nome do Local *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Restaurante do João"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Categoria *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.category === cat.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className="text-sm font-medium text-white">{cat.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Conte sobre sua experiência neste local..."
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Sua Avaliação
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <StarIcon
                          className={`w-8 h-8 ${
                            star <= formData.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount/Benefit */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Promoção ou Benefício <span className="text-neutral-500">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="Ex: Chope grátis após 22h, 10% de desconto"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                {!userLocation ? (
                  <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-neutral-300 mb-3">
                          Precisamos da localização do lugar
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleGetLocation}
                          isLoading={isLoading}
                        >
                          Capturar Localização
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-sm text-green-400">
                      ✓ Localização capturada: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" fullWidth onClick={handleClose} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.description || !formData.category || !userLocation || isLoading}
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Criando...' : '🎉 Cadastrar (+10 pontos)'}
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

