# CLAUDE.md

## Que es esto

Prueba tecnica para Frontend Developer (junior-mid). App de gestion de suscripciones con Angular 19 y un backend en Express/SQLite.

## Comandos

```bash
cd backend && npm run dev       # API en puerto 3000
cd frontend && npx ng serve     # App en puerto 4200
cd frontend && npx ng build     # Build de produccion
```

No hay tests ni linting configurados.

## Arquitectura

**Backend** (`backend/`): Express + better-sqlite3. CRUD completo en `/api/subscriptions`. La DB usa snake_case, la API responde camelCase.

**Frontend** (`frontend/`): Angular 19 con standalone components, signals y nueva sintaxis (@if, @for). SCSS con design system "Financial Curator" (tokens en `src/styles/`). Layout responsive: sidebar en desktop, bottom nav en mobile.

El dashboard esta completo y sirve de referencia. Los componentes con TODO son los que implementa el candidato.

## Archivos importantes

- `frontend/src/app/features/dashboard/` — Referencia de patrones Angular 19
- `frontend/src/app/core/services/subscription.service.ts` — Servicio parcial (3 metodos TODO)
- `frontend/src/styles/_variables.scss` — Tokens del design system
- `frontend/src/styles/_mixins.scss` — Mixins reutilizables
- `INSTRUCTIONS.md` — Enunciado de la prueba
