# Frontend — Subscription Manager

App en Angular 19 con standalone components, signals y la nueva sintaxis de control flow (`@if`, `@for`).

## Levantar

```bash
npm install
npx ng serve
```

Abre http://localhost:4200. Necesitas que el backend este corriendo en el puerto 3000.

## Que ya esta hecho

- **Dashboard** completo con tarjetas de suscripcion, resumen mensual y widget de renovaciones.
- **Layout responsive** con sidebar en desktop y bottom nav en mobile (breakpoint: 768px).
- **Design system** con tokens SCSS, tipografia (Manrope + Inter) y mixins listos para usar.
- **Servicio** con `getAll()`, `getStats()` y `getById()` funcionando.
- **Modelo** con interfaces TypeScript tipadas.

Revisa el dashboard para entender los patrones. Es la referencia de lo que esperamos.

## Que falta por hacer

Los archivos con TODO estan en su sitio, solo hay que implementarlos:

- `src/app/core/services/subscription.service.ts` → Faltan `create()`, `update()`, `delete()`
- `src/app/features/subscription-form/subscription-form.component.ts` → Formulario de crear/editar
- `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts` → Dialogo de confirmacion
- `src/app/features/subscription-detail/subscription-detail.component.ts` → Vista de detalle (bonus)
- `src/app/app.routes.ts` → Las rutas nuevas estan comentadas, hay que descomentarlas

## Estructura

```
src/
├── app/
│   ├── core/
│   │   ├── models/subscription.model.ts    → Interfaces y constantes
│   │   └── services/subscription.service.ts → Servicio HTTP (parcial)
│   ├── layout/                              → Shell de la app (sidebar + bottom nav)
│   ├── features/
│   │   ├── dashboard/                       → Ya implementado - REFERENCIA
│   │   ├── subscription-form/               → Por implementar
│   │   └── subscription-detail/             → Por implementar (bonus)
│   ├── shared/components/                   → confirm-dialog por implementar
│   ├── app.routes.ts                        → Rutas (tiene TODOs)
│   └── app.config.ts                        → Providers (HttpClient, Router)
├── styles/
│   ├── _variables.scss  → Colores, spacing, radii, breakpoints
│   ├── _typography.scss → Clases de tipografia (Manrope + Inter)
│   └── _mixins.scss     → card, card-with-strip, btn-primary, btn-secondary, input-field, glass, responsive
└── environments/
    └── environment.ts   → apiUrl: http://localhost:3000
```

## Design system rapido

Los estilos siguen el sistema "Financial Curator". Lo basico:

- **Sin bordes** para separar secciones. Usa cambios de fondo (tonal layering).
- **Cards** con esquinas redondeadas (`$radius-lg`) y una franja de 4px a la izquierda con el color de marca.
- **Botones principales** con forma de pastilla y gradiente azul.
- **Colores:** azul primario `#0056D2`, superficies claras `#f8f9fa`, texto `#191c1d`.

Mira `_variables.scss` y `_mixins.scss` antes de escribir CSS. Casi todo lo que necesitas ya esta ahi.
