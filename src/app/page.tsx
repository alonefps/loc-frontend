import { Suspense } from 'react';
import { HomeClient } from '@/components/home/HomeClient';
import { LoadingSpinner } from '@/components/ui/Loading';
import type { Location } from '@/types/location';

async function getLocations(): Promise<Location[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${API_URL}/locations`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch locations:', response.status);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export default async function HomePage() {
  const initialLocations = await getLocations();

  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <HomeClient initialLocations={initialLocations} />
    </Suspense>
  );
}
