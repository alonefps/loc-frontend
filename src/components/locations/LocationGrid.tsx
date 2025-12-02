'use client';

import { motion } from 'framer-motion';
import { LocationCard } from './LocationCard';
import { LoadingSkeleton } from '@/components/ui/Loading';
import type { Location } from '@/types/location';

interface LocationGridProps {
  locations: Location[];
  isLoading?: boolean;
  onSelectLocation?: (location: Location) => void;
  selectedLocationId?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function LocationGrid({ 
  locations, 
  isLoading, 
  onSelectLocation,
  selectedLocationId 
}: LocationGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          Nenhum local encontrado
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {locations.map((location) => (
        <motion.div key={location.id} variants={item}>
          <LocationCard
            location={location}
            onSelect={onSelectLocation}
            isSelected={location.id === selectedLocationId}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

