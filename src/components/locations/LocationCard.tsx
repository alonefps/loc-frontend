'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { LocationCardProps } from '@/types/location';
import { MapPinIcon, ArrowTopRightOnSquareIcon, StarIcon, SparklesIcon, TagIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export function LocationCard({ location, onSelect, isSelected }: LocationCardProps) {
  const handleViewOnMap = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onSelect?.(location);
  };

  // Parse enriched description
  const parseDescription = () => {
    const lines = location.description.split('\n').filter(line => line.trim());
    const stars = lines[0]?.match(/^⭐+$/)?.[0] || '';
    const offer = lines.find(line => line.startsWith('🎁 OFERTA:'))?.replace('🎁 OFERTA:', '').trim();
    const category = lines.find(line => line.startsWith('📍 Categoria:'))?.replace('📍 Categoria:', '').trim();
    const mainDescription = lines.find(line => !line.startsWith('⭐') && !line.startsWith('🎁') && !line.startsWith('📍')) || location.description;
    
    return {
      stars: stars.length,
      offer,
      category,
      description: mainDescription
    };
  };

  const parsed = parseDescription();
  const rating = location.rating || parsed.stars;
  const discount = location.discount || parsed.offer;

  const renderStars = () => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-4 h-4 text-yellow-500" />
          ) : (
            <StarIcon key={star} className="w-4 h-4 text-neutral-600" />
          )
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="elevated"
        className={`overflow-hidden cursor-pointer transition-all group ${
          isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''
        }`}
        onClick={() => onSelect?.(location)}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {location.userCreated && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" />
                Criado por usuário
              </span>
            )}
            {discount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <TagIcon className="w-3 h-3" />
                Oferta
              </span>
            )}
          </div>

          {/* Title and rating */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
              {location.name}
            </h3>
            {rating > 0 && (
              <div className="flex items-center gap-2">
                {renderStars()}
                {location.reviewCount && (
                  <span className="text-xs text-white/80">
                    ({location.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 min-h-[2.5rem]">
            {parsed.description}
          </p>

          {/* Discount info */}
          {discount && (
            <div className="p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                {discount}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          </div>

          {onSelect && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleViewOnMap}
              className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Ver Rota
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

