#!/bin/bash

echo "🚀 Setting up Locations Frontend..."
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Creating environment file..."
if [ ! -f .env.local ]; then
  cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=
EOF
  echo "✅ .env.local created"
  echo ""
  echo "⚠️  IMPORTANT: Add your Mapbox token to .env.local"
  echo "   Get it at: https://account.mapbox.com/access-tokens/"
else
  echo "⚠️  .env.local already exists"
fi

echo ""
echo "✅ Setup completed!"
echo ""
echo "📖 Next steps:"
echo "   1. Get Mapbox token: https://mapbox.com"
echo "   2. Add token to .env.local"
echo "   3. Make sure backend is running on http://localhost:3001"
echo "   4. Run 'npm run dev'"
echo "   5. Access http://localhost:3000"
echo ""

