'use client';

export function HeroAnimation() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute inset-4 bg-gradient-to-l from-purple-500 to-blue-500 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute inset-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-40"></div>
      </div>
    </div>
  );
}



