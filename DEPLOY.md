# Deployment Instructions

## Problem
Los tokens de Vercel en el sistema no tienen permisos para deployar el proyecto blindfold-v3.

## Solution Needed

### Opción 1: Vercel Dashboard (Más fácil)
1. Ir a https://vercel.com/dashboard
2. Importar el repositorio: https://github.com/monoperrob0207-arch/blindfold-v3
3. Vercel detectará automáticamente Next.js y deployará

### Opción 2: Nuevo Token de Vercel
1. Ir a https://vercel.com/tokens
2. Crear un nuevo token con permisos de deployment
3. Agregar al archivo `.env.local`:
   ```
   VERCEL_TOKEN="tu-nuevo-token-aquí"
   ```
4. Ejecutar: `vercel --yes`

### Opción 3: Deploy con GitHub Actions
El proyecto ya tiene `.vercel/` configurado. Solo necesita:
1. Ir a GitHub > Settings > Secrets
2. Agregar `VERCEL_TOKEN` secret
3. Los deployments automáticos funcionarán

## Project Status
✅ Git push completado
✅ Build funcionando localmente
✅ Servidor local: http://localhost:3000

## Files Added
- `src/components/dashboard/AgentNetwork.tsx` - Grafo visual de agentes
- `src/components/dashboard/WorkerMonitor.tsx` - Monitor de workers
- `src/components/dashboard/LiveMetrics.tsx` - Métricas en tiempo real
- `src/components/dashboard/LiveTerminal.tsx` - Terminal de logs
- `src/components/ui/GlassComponents.tsx` - UI Kit Liquid Glass
- `src/hooks/useAgentStatus.ts` - Hooks de estado
- `vercel.json` - Configuración de Vercel

## Quick Deploy (si tienes token)
```bash
cd blindfold-v3
echo 'VERCEL_TOKEN="tu-token"' >> .env.local
vercel --yes
```
