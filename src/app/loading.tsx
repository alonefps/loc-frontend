export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-neutral-400">Carregando...</p>
      </div>
    </div>
  );
}

