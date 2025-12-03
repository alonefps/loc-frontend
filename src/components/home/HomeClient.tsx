"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  PlusIcon,
  UserCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { LocationGrid } from "@/components/locations/LocationGrid";
import { LoadingSpinner } from "@/components/ui/Loading";
import { AddLocationModal } from "@/components/ui/AddLocationModal";
import { CreateLocationModal } from "@/components/ui/CreateLocationModal";
import { UserProfile } from "@/components/gamification/UserProfile";
import { useLocationStore } from "@/store/locationStore";
import { useGamificationStore } from "@/store/gamificationStore";
import { locationsApi } from "@/lib/api";
import type { Location } from "@/types/location";

const MapboxMap = dynamic(
  () =>
    import("@/components/map/MapboxMap").then((mod) => ({
      default: mod.MapboxMap,
    })),
  {
    ssr: false,
    loading: () => <LoadingSpinner size="lg" />,
  }
);

const RouteView = dynamic(
  () =>
    import("@/components/route/RouteView").then((mod) => ({
      default: mod.RouteView,
    })),
  {
    ssr: false,
    loading: () => <LoadingSpinner size="lg" />,
  }
);

interface HomeClientProps {
  initialLocations: Location[];
}

export function HomeClient({ initialLocations }: HomeClientProps) {
  const {
    locations,
    selectedLocation,
    isLoading,
    setLocations,
    setSelectedLocation,
    setIsLoading,
    setError,
  } = useLocationStore();

  const { userStats } = useGamificationStore();

  const [showMap, setShowMap] = useState(false);
  const [showRouteView, setShowRouteView] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const displayLocations = useMemo(
    () => (locations.length > 0 ? locations : initialLocations),
    [locations, initialLocations]
  );

  const handleSelectLocation = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      setShowRouteView(true);
    },
    [setSelectedLocation]
  );

  const handleRefreshLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await locationsApi.getAll();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Erro ao carregar locais.");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setLocations, setError]);

  const toggleMap = useCallback(() => setShowMap((prev) => !prev), []);
  const toggleProfile = useCallback(() => setShowProfile((prev) => !prev), []);
  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddModalOpen(false), []);

  const handleCloseRouteView = useCallback(() => {
    setShowRouteView(false);
    setSelectedLocation(null);
  }, [setSelectedLocation]);

  if (showRouteView && selectedLocation) {
    return (
      <RouteView location={selectedLocation} onClose={handleCloseRouteView} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900">
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 backdrop-blur-lg bg-neutral-900/95">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-base sm:text-xl font-bold gradient-text hidden xs:block">
                Locations
              </h1>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 sm:gap-3"
            >
              <button
                onClick={toggleProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full hover:scale-105 transition-transform active:scale-95"
              >
                <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] sm:text-xs text-neutral-400 leading-none">
                    Nv.{userStats.level}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-blue-400 leading-none">
                    {userStats.points}
                  </span>
                </div>
              </button>

              <button
                onClick={openCreateModal}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-1 sm:gap-2 shadow-lg"
                title="Criar Local"
              >
                <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Criar</span>
              </button>

              <button
                onClick={openAddModal}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all hover:scale-105 active:scale-95 bg-blue-500 text-white flex items-center gap-1 sm:gap-2"
                title="Buscar Próximos"
              >
                <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Buscar</span>
              </button>

              <button
                onClick={toggleMap}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-neutral-300 rounded-full transition-colors hover:bg-neutral-800 hover:text-white active:scale-95"
              >
                {showMap ? "⋮⋮" : "🗺️"}
              </button>
            </motion.nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <div
            className={`${showProfile ? "lg:col-span-9" : "lg:col-span-12"}`}
          >
            {!showMap ? (
              <>
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 sm:mb-16 grid lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-6">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                      Descubra
                      <br />
                      <span className="gradient-text">Lugares Incríveis</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-neutral-400 max-w-xl">
                      Explore, avalie e compartilhe locais. Ganhe pontos e
                      desbloqueie recompensas! 🎉
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={openCreateModal}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
                      >
                        ✨ Cadastrar Local
                      </button>
                      <button
                        onClick={toggleMap}
                        className="px-8 py-4 bg-neutral-800 text-white rounded-full font-semibold hover:scale-105 transition-transform"
                      >
                        Ver Mapa
                      </button>
                    </div>
                  </div>

                  <div className="hidden lg:block h-[400px] relative">
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl overflow-hidden relative">
                      <img
                        src="/_static/assets/loc.png"
                        alt="Locations Map"
                        className="w-full h-full object-contain p-8 animate-fade-in"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
                    </div>
                  </div>
                </motion.section>

                <section id="locations" className="space-y-6 sm:space-y-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                      Todos os Locais
                    </h3>
                    <p className="text-neutral-400">
                      {displayLocations.length}{" "}
                      {displayLocations.length === 1
                        ? "local disponível"
                        : "locais disponíveis"}
                    </p>
                  </motion.div>

                  <LocationGrid
                    locations={displayLocations}
                    isLoading={isLoading}
                    onSelectLocation={handleSelectLocation}
                    selectedLocationId={selectedLocation?.id}
                  />
                </section>
              </>
            ) : (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[calc(100vh-12rem)] rounded-3xl overflow-hidden shadow-2xl"
              >
                <MapboxMap
                  locations={displayLocations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={setSelectedLocation}
                />
              </motion.section>
            )}
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-3"
              >
                <div className="sticky top-24">
                  <UserProfile />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-neutral-800 mt-16 sm:mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <p className="text-sm text-neutral-400">© 2025 Locations</p>
          </div>
        </div>
      </footer>

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onLocationsAdded={handleRefreshLocations}
      />

      <CreateLocationModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onLocationCreated={handleRefreshLocations}
      />
    </div>
  );
}
