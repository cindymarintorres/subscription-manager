# Subscription Manager

App para gestionar suscripciones digitales (Netflix, NordVPN, Claude AI, Disney+, etc).

Este repo es una prueba tecnica para la posicion de **Frontend Developer**. Lee `INSTRUCTIONS.md` para ver que hay que hacer.

## Levantar el proyecto

Necesitas Node.js 18+ y npm.

Abre dos terminales:

```bash
# Terminal 1 - API
cd backend
npm install
npm run dev
```

```bash
# Terminal 2 - App
cd frontend
npm install
npx ng serve
```

- API: http://localhost:3000
- App: http://localhost:4200

## Que hay dentro

```
├── backend/        → API en Express + SQLite. Ya esta completa, no hay que tocarla.
├── frontend/       → Angular 19. Tiene un dashboard funcional y componentes por implementar.
├── screenshots/    → Capturas del diseño de referencia.
└── INSTRUCTIONS.md → El enunciado con las tareas.
```

Cada carpeta tiene su propio README con mas detalle.
