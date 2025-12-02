'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Map, { Marker, Layer, Source, MapRef } from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Location, RouteStep } from '@/types/location';
import { Button } from '@/components/ui/Button';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteViewProps {
  location: Location;
  onClose: () => void;
}

export function RouteView({ location, onClose }: RouteViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Swipe gesture detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextStep(); // Swipe left = next
    } else if (isRightSwipe) {
      prevStep(); // Swipe right = previous
    }
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Fetch route when user location is available
  useEffect(() => {
    if (userLocation && location && MAPBOX_TOKEN) {
      fetchRoute();
    }
  }, [userLocation, location, MAPBOX_TOKEN]);

  const fetchRoute = async () => {
    if (!userLocation || !location || !MAPBOX_TOKEN) return;

    const [userLng, userLat] = userLocation;
    const { longitude: destLng, latitude: destLat } = location;

    try {
      // Use language from browser
      const language = navigator.language || 'pt-BR';
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${userLng},${userLat};${destLng},${destLat}?` +
        `geometries=geojson&` +
        `steps=true&` +
        `banner_instructions=true&` +
        `voice_instructions=true&` +
        `language=${language}&` +
        `overview=full&` +
        `access_token=${MAPBOX_TOKEN}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        
        setRoute({
          type: 'Feature',
          properties: {},
          geometry: routeData.geometry,
        });

        setDistance(routeData.distance);
        setDuration(routeData.duration);

        // Parse steps
        const steps: RouteStep[] = routeData.legs[0].steps.map((step: any) => ({
          instruction: step.maneuver.instruction,
          distance: step.distance,
          duration: step.duration,
          maneuver: {
            type: step.maneuver.type,
            modifier: step.maneuver.modifier,
          },
        }));
        setRouteSteps(steps);

        // Auto zoom to route bounds
        if (mapRef.current) {
          const bounds: [[number, number], [number, number]] = [
            [Math.min(userLng, destLng) - 0.01, Math.min(userLat, destLat) - 0.01],
            [Math.max(userLng, destLng) + 0.01, Math.max(userLat, destLat) + 0.01],
          ];
          mapRef.current.fitBounds(bounds, {
            padding: { top: 150, bottom: 150, left: 100, right: 100 },
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const startAnimatedRoute = () => {
    if (!route || !mapRef.current) return;
    
    setIsAnimating(true);
    setCurrentStep(0);

    // Animate through route steps
    routeSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        
        // Zoom to step location (approximate)
        if (mapRef.current && route.geometry.coordinates[index]) {
          const [lng, lat] = route.geometry.coordinates[Math.floor((index / routeSteps.length) * route.geometry.coordinates.length)];
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 2000,
            pitch: 60,
            bearing: 45,
          });
        }
      }, index * 3000);
    });

    // Reset after animation
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentStep(0);
      if (mapRef.current) {
        mapRef.current.flyTo({
          pitch: 0,
          bearing: 0,
          duration: 1000,
        });
      }
    }, routeSteps.length * 3000);
  };

  const nextStep = () => {
    if (currentStep < routeSteps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Zoom to step location
      if (mapRef.current && route?.geometry.coordinates) {
        const coordIndex = Math.floor((newStep / routeSteps.length) * route.geometry.coordinates.length);
        const [lng, lat] = route.geometry.coordinates[coordIndex];
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 17,
          duration: 1500,
          pitch: 45,
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      // Zoom to step location
      if (mapRef.current && route?.geometry.coordinates) {
        const coordIndex = Math.floor((newStep / routeSteps.length) * route.geometry.coordinates.length);
        const [lng, lat] = route.geometry.coordinates[coordIndex];
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 17,
          duration: 1500,
          pitch: 45,
        });
      }
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Mapbox token não configurado</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col">
      {/* Minimalist Header - Mobile First */}
      <div className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-800 flex-shrink-0">
        <div className="px-3 sm:px-6 py-3">
          {/* Mobile: Compact layout */}
          <div className="flex items-center justify-between gap-2">
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors flex-shrink-0"
              aria-label="Voltar"
            >
              <ArrowLeftIcon className="w-5 h-5 text-neutral-400" />
            </button>
            
            {/* Info - Responsive */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-white text-sm sm:text-base truncate">
                {location.name}
              </h2>
              {distance > 0 && (
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-400">
                  <span>📍 {formatDistance(distance)}</span>
                  <span>•</span>
                  <span>🕐 {formatDuration(duration)}</span>
                </div>
              )}
            </div>

            {/* Navigation Controls - Compact on mobile */}
            {routeSteps.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <span className="text-[10px] sm:text-xs text-neutral-400 font-mono">
                  {currentStep + 1}/{routeSteps.length}
                </span>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-1.5 sm:p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                  aria-label="Etapa anterior"
                >
                  <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === routeSteps.length - 1}
                  className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                  aria-label="Próxima etapa"
                >
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: location.longitude,
            latitude: location.latitude,
            zoom: 13,
          }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          {/* User location marker */}
          {userLocation && (
            <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
              </div>
            </Marker>
          )}

          {/* Destination marker */}
          <Marker longitude={location.longitude} latitude={location.latitude}>
            <div className="relative">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg" />
            </div>
          </Marker>

          {/* Route line */}
          {route && (
            <>
              <Source type="geojson" data={route}>
                <Layer
                  id="route-outline"
                  type="line"
                  paint={{
                    'line-color': '#1e40af',
                    'line-width': 8,
                    'line-opacity': 0.4,
                  }}
                />
                <Layer
                  id="route"
                  type="line"
                  paint={{
                    'line-color': '#3b82f6',
                    'line-width': 6,
                    'line-opacity': 0.9,
                  }}
                />
              </Source>

              {/* Animated arrow markers along route */}
              {!isAnimating && route.geometry.coordinates
                .filter((_, i) => i % Math.floor(route.geometry.coordinates.length / 5) === 0)
                .map((coord, i) => (
                  <Marker key={i} longitude={coord[0]} latitude={coord[1]}>
                    <div className="text-blue-500 animate-pulse">
                      ➤
                    </div>
                  </Marker>
                ))}
            </>
          )}
        </Map>

        {/* Current step instruction - Minimalist floating card with swipe */}
        <AnimatePresence mode="wait">
          {routeSteps.length > 0 && routeSteps[currentStep] && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-4 left-3 right-3 sm:left-6 sm:right-6 sm:top-6 z-10 max-w-2xl sm:mx-auto"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white rounded-2xl sm:rounded-3xl shadow-2xl">
                <div className="p-4 sm:p-6">
                  {/* Mobile: Compact layout */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Step number - smaller on mobile */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold">{currentStep + 1}</span>
                    </div>
                    
                    {/* Instruction - responsive text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-semibold mb-2 leading-tight">
                        {routeSteps[currentStep].instruction}
                      </p>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-blue-50">
                        <span className="flex items-center gap-1">
                          <span className="text-sm">📍</span>
                          {formatDistance(routeSteps[currentStep].distance)}
                        </span>
                        <span className="opacity-50">•</span>
                        <span className="flex items-center gap-1">
                          <span className="text-sm">🕐</span>
                          {formatDuration(routeSteps[currentStep].duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Minimalist progress bar */}
                  <div className="mt-3 sm:mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / routeSteps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Swipe indicator for mobile */}
                  <div className="mt-2 sm:hidden flex items-center justify-center gap-1 opacity-50">
                    <ChevronLeftIcon className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wider">Deslize</span>
                    <ChevronRightIcon className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

