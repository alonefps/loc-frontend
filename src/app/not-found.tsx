import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">🔍</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Página não encontrada</h2>
        <p className="text-neutral-400">
          A página que você está procurando não existe.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}

