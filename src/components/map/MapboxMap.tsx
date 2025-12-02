'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl, Layer, Source } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from '@/types/location';
import { Button } from '@/components/ui/Button';
import { MapPinIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect?: (location: Location | null) => void;
}

interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
}

export function MapboxMap({ locations, selectedLocation, onLocationSelect }: MapboxMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Get user location on mount with high accuracy
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Fallback to approximate location (Rio de Janeiro)
          setUserLocation([-43.1729, -22.9068]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Watch position for real-time updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => console.error('Error watching position:', error),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Fly to selected location
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 14,
        duration: 2000,
      });
    }
  }, [selectedLocation]);

  const getRoute = useCallback(async () => {
    if (!userLocation || !selectedLocation || !MAPBOX_TOKEN) {
      console.error('Missing requirements for route:', { userLocation, selectedLocation, MAPBOX_TOKEN: !!MAPBOX_TOKEN });
      return;
    }

    setIsLoadingRoute(true);
    const [userLng, userLat] = userLocation;
    const { longitude: destLng, latitude: destLat } = selectedLocation;

    try {
      // Use Mapbox Directions API with driving-traffic for best routes
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${userLng},${userLat};${destLng},${destLat}?` +
        `geometries=geojson&` +
        `overview=full&` +
        `steps=true&` +
        `access_token=${MAPBOX_TOKEN}`
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        const routeGeometry = routeData.geometry;
        
        setRoute({
          type: 'Feature',
          properties: {},
          geometry: routeGeometry,
        });

        setRouteInfo({
          distance: routeData.distance,
          duration: routeData.duration,
        });

        setIsNavigating(true);

        // Fit map to show entire route
        if (mapRef.current) {
          const bounds: [[number, number], [number, number]] = [
            [Math.min(userLng, destLng) - 0.01, Math.min(userLat, destLat) - 0.01],
            [Math.max(userLng, destLng) + 0.01, Math.max(userLat, destLat) + 0.01],
          ];
          
          mapRef.current.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: 100, right: 100 },
            duration: 1000,
          });
        }
      } else {
        throw new Error('No routes found');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      alert('Erro ao traçar rota. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoadingRoute(false);
    }
  }, [userLocation, selectedLocation, MAPBOX_TOKEN]);

  const clearRoute = () => {
    setRoute(null);
    setRouteInfo(null);
    setIsNavigating(false);
    onLocationSelect?.(null);
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-2xl">
        <div className="text-center space-y-2">
          <p className="text-neutral-500">Mapbox token não configurado</p>
          <p className="text-xs text-neutral-400">Configure NEXT_PUBLIC_MAPBOX_TOKEN no .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -43.1729,
          latitude: -22.9068,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
          onGeolocate={(e) => {
            setUserLocation([e.coords.longitude, e.coords.latitude]);
          }}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
            </div>
          </Marker>
        )}

        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onLocationSelect?.(location);
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`cursor-pointer transition-all ${
                selectedLocation?.id === location.id ? 'z-10' : ''
              }`}
            >
              <MapPinIcon 
                className={`w-8 h-8 drop-shadow-lg ${
                  selectedLocation?.id === location.id
                    ? 'text-red-500 scale-125'
                    : 'text-blue-600'
                }`}
              />
            </motion.div>
          </Marker>
        ))}

        {/* Route layer */}
        {route && (
          <Source type="geojson" data={route}>
            <Layer
              id="route"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 5,
                'line-opacity': 0.9,
              }}
            />
            <Layer
              id="route-outline"
              type="line"
              paint={{
                'line-color': '#1e40af',
                'line-width': 7,
                'line-opacity': 0.4,
              }}
            />
          </Source>
        )}
      </Map>

      {/* Selected location card */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 shadow-xl border border-neutral-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-white">{selectedLocation.name}</h3>
                <p className="text-sm text-neutral-400 line-clamp-2">
                  {selectedLocation.description}
                </p>
                {routeInfo && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-blue-400">
                    <span>📍 {formatDistance(routeInfo.distance)}</span>
                    <span>🕐 {formatDuration(routeInfo.duration)}</span>
                  </div>
                )}
              </div>
              <button
                onClick={clearRoute}
                className="p-2 hover:bg-neutral-700 rounded-full transition-colors flex-shrink-0"
              >
                <XMarkIcon className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {userLocation && !isNavigating && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                className="mt-4"
                onClick={getRoute}
                isLoading={isLoadingRoute}
              >
                {isLoadingRoute ? 'Traçando rota...' : '🚗 Iniciar Rota'}
              </Button>
            )}

            {!userLocation && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-400">
                  ⚠️ Permita o acesso à localização para traçar rotas
                </p>
              </div>
            )}

            {isNavigating && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Rota ativa</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearRoute}
                  className="flex items-center gap-2"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Nova Rota
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

