import { create } from 'zustand';
import type { Location, MapLocation, RouteState } from '@/types/location';

interface LocationStore {
  locations: Location[];
  selectedLocation: Location | null;
  routeState: RouteState;
  isLoading: boolean;
  error: string | null;
  
  setLocations: (locations: Location[]) => void;
  setSelectedLocation: (location: Location | null) => void;
  setRouteState: (state: Partial<RouteState>) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRoute: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  selectedLocation: null,
  routeState: {
    from: null,
    to: null,
    isNavigating: false,
  },
  isLoading: false,
  error: null,

  setLocations: (locations) => set({ locations }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setRouteState: (state) => set((prev) => ({
    routeState: { ...prev.routeState, ...state }
  })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearRoute: () => set({
    routeState: { from: null, to: null, isNavigating: false },
    selectedLocation: null,
  }),
}));

