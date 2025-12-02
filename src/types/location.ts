export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  // Gamification fields (optional for now)
  rating?: number; // 1-5 stars
  reviewCount?: number;
  discount?: string; // e.g., "Chope grátis após 22h"
  category?: 'restaurant' | 'pharmacy' | 'tourist_attraction' | 'user_created';
  userCreated?: boolean;
  userId?: string;
}

export interface LocationCardProps {
  location: Location;
  onSelect?: (location: Location) => void;
  isSelected?: boolean;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface RouteState {
  from: MapLocation | null;
  to: MapLocation | null;
  isNavigating: boolean;
  distance?: number;
  duration?: number;
  steps?: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    modifier?: string;
  };
}

export interface UserStats {
  userId: string;
  points: number;
  locationsCreated: number;
  reviewsWritten: number;
  level: number;
  nextReward: number; // points needed for next reward
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  unlocked: boolean;
}

