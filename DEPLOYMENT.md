# 🚀 Deploy Guide - Frontend

## Deploy na Vercel (Recomendado)

### Opção 1: Dashboard (Mais Fácil)

1. **Acesse** [vercel.com](https://vercel.com)
2. **Sign in** com GitHub
3. **Import Project**
4. **Selecione** o repositório
5. **Configure**:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
   NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_mapbox
   ```

7. **Deploy** 🚀

### Opção 2: CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Production
vercel --prod
```

---

## Obter Token Mapbox

### Passo a Passo

1. **Acesse** [mapbox.com](https://mapbox.com)
2. **Sign up** (gratuito)
3. **Dashboard** > **Access Tokens**
4. **Copie** o token padrão ou crie novo
5. **Adicione** ao `.env.local` ou Vercel

### Token Gratuito
- ✅ 50,000 carregamentos/mês
- ✅ Geolocalização
- ✅ Directions API
- ✅ Sem cartão de crédito

---

## Configuração de Variáveis

### Desenvolvimento (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

### Produção (Vercel)
```env
NEXT_PUBLIC_API_URL=https://locations-api.onrender.com
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

⚠️ **Importante**: Backend deve estar no Render antes!

---

## Checklist Pré-Deploy

### Código
- [ ] `npm run build` sem erros
- [ ] `npm run lint` sem warnings
- [ ] `npm run type-check` ok
- [ ] Imagens otimizadas
- [ ] Variáveis de ambiente configuradas

### Performance
- [ ] Lazy loading implementado
- [ ] Code splitting configurado
- [ ] Images com next/image
- [ ] Fonts otimizadas

### SEO
- [ ] Metadata configurada
- [ ] OG tags (opcional)
- [ ] Sitemap (opcional)
- [ ] Robots.txt (opcional)

---

## Pós-Deploy

### 1. Testar

```bash
# URL da Vercel
https://seu-app.vercel.app

# Verificar
✅ Página carrega
✅ Locais aparecem
✅ Mapa funciona
✅ Rota traçada
✅ Mobile responsivo
```

### 2. Configurar Domínio (Opcional)

1. **Vercel Dashboard** > **Domains**
2. **Add Domain**
3. **Configure DNS** no seu provedor
4. **Aguarde** propagação (5-30 min)

### 3. Analytics (Opcional)

Vercel Analytics é gratuito:
1. Dashboard > Analytics
2. Enable
3. Ver métricas em tempo real

---

## Troubleshooting

### Erro: "API não responde"

**Causa**: Backend não está rodando ou URL incorreta

**Solução**:
```env
# Verifique a URL
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com

# Teste manualmente
curl https://seu-backend.onrender.com/locations
```

### Erro: "Mapbox token inválido"

**Causa**: Token incorreto ou não configurado

**Solução**:
1. Gere novo token no Mapbox
2. Adicione ao Vercel
3. Redeploy

### Build falha

**Causa**: Erros de TypeScript ou dependências

**Solução**:
```bash
# Local
npm run build

# Ver erros
npm run type-check

# Corrigir e tentar novamente
```

### Mapa não carrega

**Causa**: Token Mapbox não configurado

**Solução**:
1. Adicione `NEXT_PUBLIC_MAPBOX_TOKEN` na Vercel
2. Redeploy
3. Hard refresh (Ctrl+Shift+R)

---

## Performance

### Vercel (Free Tier)
- ✅ 100 GB de largura de banda
- ✅ Deploy ilimitados
- ✅ SSL automático
- ✅ CDN global
- ✅ Serverless functions (100h/mês)

### Otimizações Automáticas
- Image optimization
- Font optimization
- Code splitting
- Compression (gzip/brotli)
- Caching

---

## URLs Importantes

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs

### Mapbox
- Dashboard: https://account.mapbox.com
- Docs: https://docs.mapbox.com

---

## Comandos Úteis

```bash
# Build local
npm run build

# Preview production build
npm start

# Analyze bundle
npm run build -- --analyze

# Type check
npm run type-check

# Lint
npm run lint
```

---

## CI/CD

### Automático (Vercel + GitHub)

1. **Push** para `main`
2. **Vercel** detecta
3. **Build** automático
4. **Deploy** se sucesso
5. **URL** gerada

### Manual

```bash
vercel --prod
```

---

## Monitoramento

### Vercel Analytics (Gratuito)

- Page views
- Unique visitors  
- Top pages
- Performance metrics
- Real-time data

### Web Vitals

Vercel monitora automaticamente:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- FID (First Input Delay)

---

## Exemplo Completo

```bash
# 1. Preparar
cd frontend
npm install
npm run build

# 2. Deploy Vercel
vercel --prod

# 3. Configurar variáveis
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN production

# 4. Redeploy
vercel --prod

# 5. Testar
curl https://seu-app.vercel.app
```

---

## 🎉 Deploy Concluído!

Sua aplicação está no ar em:
- **Frontend**: https://seu-app.vercel.app
- **Backend**: https://seu-backend.onrender.com

**Próximo passo**: Criar vídeo demonstrativo! 🎥

---

**Desenvolvido e deployado com ❤️**

