'use client';

import { motion } from 'framer-motion';
import { useGamificationStore } from '@/store/gamificationStore';
import { TrophyIcon, MapPinIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';

export function UserProfile() {
  const { userStats, rewards, getNextReward } = useGamificationStore();
  const nextReward = getNextReward();
  const unlockedRewards = rewards.filter((r) => r.unlocked);
  
  const progressToNext = nextReward
    ? ((userStats.points / nextReward.pointsRequired) * 100).toFixed(0)
    : 100;

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Nível {userStats.level}</h3>
            <p className="text-blue-100 text-sm">{userStats.points} pontos</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-8 h-8" />
          </div>
        </div>

        {nextReward && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Próxima recompensa</span>
              <span className="font-semibold">{progressToNext}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="text-xs text-blue-100">
              {nextReward.title} - {nextReward.pointsRequired - userStats.points} pontos restantes
            </p>
          </div>
        )}
      </motion.div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.locationsCreated}</p>
              <p className="text-xs text-neutral-400">Locais criados</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.reviewsWritten}</p>
              <p className="text-xs text-neutral-400">Avaliações</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rewards */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-yellow-500" />
          Recompensas
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                reward.unlocked
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-neutral-800 bg-neutral-900/50 grayscale opacity-50'
              }`}
            >
              <span className="text-3xl mb-1">{reward.icon}</span>
              <p className="text-xs text-center text-neutral-300 font-medium">{reward.title.split(' ')[1]}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Earn */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <h4 className="font-semibold text-white mb-3">Como Ganhar Pontos</h4>
        <ul className="space-y-2 text-sm text-neutral-400">
          <li className="flex items-center gap-2">
            <span className="text-green-500">+10</span> Cadastrar novo local
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">+5</span> Escrever avaliação
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">+2</span> Visitar local
          </li>
        </ul>
      </div>
    </div>
  );
}

