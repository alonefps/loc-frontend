'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStats {
  points: number;
  locationsCreated: number;
  reviewsWritten: number;
  level: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  unlocked: boolean;
}

interface GamificationStore {
  userStats: UserStats;
  rewards: Reward[];
  addPoints: (points: number, reason: string) => void;
  incrementLocations: () => void;
  incrementReviews: () => void;
  unlockReward: (rewardId: string) => void;
  getNextReward: () => Reward | null;
}

const DEFAULT_REWARDS: Reward[] = [
  {
    id: 'first_location',
    title: '🗺️ Explorador Iniciante',
    description: 'Cadastre seu primeiro local',
    pointsRequired: 10,
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'five_locations',
    title: '🌟 Explorador Ativo',
    description: 'Cadastre 5 locais',
    pointsRequired: 50,
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'ten_locations',
    title: '👑 Mestre Explorador',
    description: 'Cadastre 10 locais',
    pointsRequired: 100,
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'first_review',
    title: '✍️ Crítico Iniciante',
    description: 'Escreva sua primeira avaliação',
    pointsRequired: 5,
    icon: '✍️',
    unlocked: false,
  },
  {
    id: 'level_5',
    title: '🚀 Nível 5',
    description: 'Alcance 250 pontos',
    pointsRequired: 250,
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 'level_10',
    title: '💎 Nível 10',
    description: 'Alcance 500 pontos',
    pointsRequired: 500,
    icon: '💎',
    unlocked: false,
  },
];

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      userStats: {
        points: 0,
        locationsCreated: 0,
        reviewsWritten: 0,
        level: 1,
      },
      rewards: DEFAULT_REWARDS,

      addPoints: (points: number, reason: string) => {
        set((state) => {
          const newPoints = state.userStats.points + points;
          const newLevel = Math.floor(newPoints / 50) + 1;
          
          // Show notification
          if (typeof window !== 'undefined') {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down';
            notification.innerHTML = `+${points} pontos: ${reason}`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
          }

          return {
            userStats: {
              ...state.userStats,
              points: newPoints,
              level: newLevel,
            },
          };
        });

        // Check for reward unlocks
        const { rewards, userStats } = get();
        rewards.forEach((reward) => {
          if (!reward.unlocked && userStats.points >= reward.pointsRequired) {
            get().unlockReward(reward.id);
          }
        });
      },

      incrementLocations: () => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            locationsCreated: state.userStats.locationsCreated + 1,
          },
        }));
        get().addPoints(10, 'Novo local cadastrado');
      },

      incrementReviews: () => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            reviewsWritten: state.userStats.reviewsWritten + 1,
          },
        }));
        get().addPoints(5, 'Avaliação escrita');
      },

      unlockReward: (rewardId: string) => {
        set((state) => ({
          rewards: state.rewards.map((reward) =>
            reward.id === rewardId ? { ...reward, unlocked: true } : reward
          ),
        }));

        // Show reward notification
        if (typeof window !== 'undefined') {
          const reward = get().rewards.find((r) => r.id === rewardId);
          if (reward) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-scale-in';
            notification.innerHTML = `
              <div class="flex items-center gap-3">
                <span class="text-3xl">${reward.icon}</span>
                <div>
                  <div class="font-bold">Recompensa Desbloqueada!</div>
                  <div class="text-sm">${reward.title}</div>
                </div>
              </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
          }
        }
      },

      getNextReward: () => {
        const { rewards, userStats } = get();
        const locked = rewards.filter((r) => !r.unlocked);
        if (locked.length === 0) return null;
        return locked.reduce((nearest, reward) =>
          reward.pointsRequired < nearest.pointsRequired ? reward : nearest
        );
      },
    }),
    {
      name: 'gamification-storage',
    }
  )
);


