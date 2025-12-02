# Locations App - Frontend

Aplicação web moderna desenvolvida com **Next.js 16**, **React 19**, **TypeScript**, **Mapbox** e **Three.js**.

## 🚀 Tecnologias

- **Next.js 16** - App Router com Server e Client Components
- **React 19** - Última versão com melhoras de performance
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utility-first
- **Framer Motion** - Animações fluidas
- **Three.js + React Three Fiber** - Animações 3D
- **Mapbox GL** - Mapas interativos
- **Zustand** - Gerenciamento de estado
- **Axios** - Requisições HTTP

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_aqui
```

## 🔑 Obter Token do Mapbox

1. Acesse [mapbox.com](https://mapbox.com)
2. Crie uma conta gratuita
3. Vá em Account > Access Tokens
4. Copie o token padrão ou crie um novo
5. Cole no `.env.local`

## 🏃 Executar

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

Acesse: http://localhost:3000

## 🎨 Design System

### Cores

- **Background**: Branco/Preto (dark mode)
- **Primary**: Neutral 900/White
- **Accent**: Gradiente azul/roxo

### Componentes

- `Card` - Container com variantes glass, elevated
- `Button` - Botões com estados e animações
- `Modal` - Diálogos animados
- `Loading` - Spinners e skeletons

### Animações

- Framer Motion para transições suaves
- Three.js para hero animation 3D
- Stagger children em grids

## 📁 Estrutura

```
src/
├── app/              # Pages (App Router)
├── components/       # Componentes React
│   ├── ui/          # Componentes base
│   ├── locations/   # Componentes de locais
│   ├── map/         # Mapa Mapbox
│   └── three/       # Animações 3D
├── lib/             # Utilitários
├── store/           # Zustand stores
├── types/           # TypeScript types
└── styles/          # CSS global
```

## 🗺️ Funcionalidades

### Server Components
- Renderização inicial de dados
- SEO otimizado
- Performance melhorada

### Client Components
- Interações do usuário
- Mapbox com rotas
- Animações Three.js
- Gerenciamento de estado

### Mapbox Integration
- Exibir locais no mapa
- Obter localização do usuário
- Traçar rota da posição atual até destino
- Markers interativos

## 📱 Responsividade

Design mobile-first com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deploy na Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

Ou conecte o repositório no dashboard da Vercel.

### Variáveis de Ambiente (Vercel)

Configure no dashboard:
- `NEXT_PUBLIC_API_URL` - URL do backend (Render)
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Token do Mapbox

## 🧪 Testes

```bash
# Type check
npm run type-check

# Lint
npm run lint
```

## 📝 Componentes Principais

### LocationCard
Card com imagem, informações e botão de ação.

### LocationGrid
Grid responsivo com animações stagger.

### MapboxMap
Mapa interativo com markers, rotas e controles.

### HeroAnimation
Esfera 3D animada com Three.js.

## 🎯 Features

- ✅ Server Components para SEO
- ✅ Client Components para interação
- ✅ Mapbox com rotas
- ✅ Animações 3D com Three.js
- ✅ Animações 2D com Framer Motion
- ✅ Design minimalista Apple/Netflix
- ✅ Mobile-first responsive
- ✅ Dark mode suporte
- ✅ TypeScript strict
- ✅ Performance otimizada

## 🌐 Integração com Backend

A aplicação consome a API do backend NestJS:

```typescript
GET /locations       - Listar todos
GET /locations/:id   - Buscar por ID
POST /locations      - Criar
PUT /locations/:id   - Atualizar
DELETE /locations/:id - Deletar
```

## 📚 Documentação

- [Next.js Docs](https://nextjs.org/docs)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
- [Three.js](https://threejs.org/docs)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'feat: add nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Pull Request

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ usando Next.js, Mapbox e Three.js**
