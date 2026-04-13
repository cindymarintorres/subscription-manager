# Prueba Tecnica — Subscription Manager

## Contexto

Imagina que te incorporas a un equipo que esta construyendo una app para gestionar suscripciones digitales. Un companero ya dejo listo el backend y el dashboard principal del frontend. Tu trabajo es completar lo que falta.

**Tiempo:** 2-3 horas  
**Stack:** Angular 19 · Node.js/Express · SQLite

### Sobre el uso de IA

Puedes usar ChatGPT, Copilot, Claude o cualquier herramienta que uses normalmente en tu dia a dia. No hay restriccion. Lo que si: despues de entregar la prueba hay una **entrevista tecnica** donde vamos a revisar tu codigo juntos, te vamos a pedir que expliques tus decisiones y que hagas modificaciones en vivo. Asegurate de entender todo lo que entregues.

---

## Entrega

1. Haz **fork** de este repositorio a tu cuenta de GitHub
2. Trabaja en tu fork
3. Cuando termines, compartenos el link a tu repositorio

No hagas PR al repo original.

---

## Como arrancar

Necesitas Node 18+ y npm. Abre dos terminales:

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev
```

```bash
# Terminal 2 - Frontend
cd frontend && npm install && npx ng serve
```

Backend en http://localhost:3000, frontend en http://localhost:4200.

---

## Antes de empezar

Tomate unos minutos para explorar lo que ya hay. Vas a trabajar mucho mas rapido si primero entiendes los patrones del proyecto.

**Archivos que vale la pena leer:**

| Archivo | Por que |
|---------|---------|
| `frontend/src/app/features/dashboard/dashboard.component.ts` | Ahi vas a ver como se usan signals, inyeccion de servicios, el nuevo `@if`/`@for`, y como se conecta todo |
| `frontend/src/app/core/services/subscription.service.ts` | El servicio que vas a completar. Los metodos que ya estan te sirven de ejemplo |
| `frontend/src/app/core/models/subscription.model.ts` | Las interfaces y las categorias disponibles |
| `frontend/src/styles/_variables.scss` | Todos los tokens del design system (colores, espaciados, radii) |
| `frontend/src/styles/_mixins.scss` | Mixins para cards, botones, inputs, responsive. Usalo, no reinventes la rueda |
| `frontend/src/app/app.routes.ts` | Las rutas. Las que faltan estan comentadas con pistas |

El backend no hay que tocarlo. Tiene CRUD completo y funciona bien.

---

## Tareas

### 1. Completar el servicio HTTP (~30 min)

**Donde:** `src/app/core/services/subscription.service.ts`

Los metodos `getAll()`, `getStats()` y `getById()` ya estan hechos. Falta implementar:

- `create()` — POST
- `update()` — PUT  
- `delete()` — DELETE

Mira los que ya estan para seguir el mismo patron. No tiene mucha ciencia.

**Que esperamos ver:**
- Que uses `HttpClient` con los generics de TypeScript
- Que las URLs se armen bien
- Que el tipado sea correcto

---

### 2. Lista de suscripciones (~30 min)

**Donde:** `src/app/features/subscriptions/subscriptions.component.ts` y `.html`

La pagina de "Mis Suscripciones" ya tiene el header, la barra de busqueda, los filtros por categoria y el resumen. Lo que falta es:

- **Implementar el filtrado** — La computed signal `filteredSubscriptions` esta vacia. Debe combinar el filtro de busqueda por nombre (`searchQuery`) y el filtro por categoria (`activeFilter`).
- **Implementar la lista** — Donde dice "La lista de suscripciones va aqui" hay que renderizar las suscripciones con `@for`. Cada item debe mostrar icono/color, nombre, categoria, precio y fecha de renovacion.
- **Implementar las acciones** — Los metodos `navigateToEdit()`, `navigateToDetail()` y `handleDelete()` estan vacios.

**Que esperamos ver:**
- Que el filtrado funcione combinando busqueda + categoria
- Que la lista siga el design system (mira los screenshots en `/screenshots/subscriptions-*.png`)
- Responsive: filas en desktop, stack en mobile
- Que se maneje el estado vacio cuando no hay resultados

---

### 3. Formulario de nueva suscripcion (~40 min)

**Donde:** `src/app/features/subscription-form/subscription-form.component.ts`

Hay que crear un formulario reactivo con estos campos:

- **Nombre** del servicio — texto, obligatorio, minimo 2 caracteres
- **Precio** — numero, obligatorio, mayor que 0
- **Ciclo de facturacion** — toggle mensual/anual
- **Categoria** — selector (las opciones estan en `CATEGORIES` del modelo)
- **Proxima fecha de pago** — date, obligatorio
- **Color de marca** — color picker, opcional (default: `#0056D2`)

Al enviar: llamar a `create()` y redirigir al dashboard.

**Que esperamos ver:**
- `FormGroup` con `Validators`
- Mensajes de error visibles cuando algo esta mal
- Que se vea bien en desktop y en mobile
- Que siga el design system (revisa los screenshots en `/screenshots/` y los mixins)

**No te olvides** de agregar la ruta en `app.routes.ts` y de importar `ReactiveFormsModule`.

---

### 4. Editar suscripcion (~20 min)

Reutiliza el mismo componente del formulario. La idea es que detecte si viene un `:id` en la ruta.

- Ruta: `/subscriptions/:id/edit`
- Cargar los datos con `getById()` y usar `patchValue()` para llenar el form
- Al enviar, llamar a `update()` en vez de `create()`

**Que esperamos ver:**
- Que un solo componente maneje los dos casos
- Que use `ActivatedRoute` para leer el parametro

---

### 5. Eliminar suscripcion (~15 min)

**Donde:** `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts`

Las cards del dashboard ya tienen un menu con las opciones "Editar" y "Eliminar" que emiten eventos (`onEdit`, `onDelete`). Solo falta:

- Mostrar un dialogo de confirmacion cuando alguien quiere eliminar
- Si confirma, llamar a `delete()` y actualizar la lista

**Que esperamos ver:**
- Un dialogo decente (overlay, card centrada, dos botones)
- Que la lista se refresque despues de borrar

---

### 6. Bonus (si te sobra tiempo)

Nada de esto es obligatorio, pero suma:

- Busqueda o filtros en el dashboard
- Animaciones en las cards (CSS o Angular animations)
- Vista de detalle en `/subscriptions/:id`
- Un componente de estado vacio reutilizable
- Toggle para pausar/reactivar una suscripcion

---

## Tips

- **Mejor 3 tareas bien hechas que 5 a medias.** Evaluamos calidad, no velocidad.
- **El dashboard es tu cheatsheet.** Si no sabes como hacer algo, mira como esta resuelto ahi.
- **No escribas CSS desde cero.** `_variables.scss` y `_mixins.scss` tienen practicamente todo lo que necesitas.
- **Mira los screenshots.** Estan en `/screenshots/` y te dan una idea clara del resultado esperado. Los screenshots son guías.
- **El backend no se toca.** Ya esta listo.

---

## Referencia visual

En `/screenshots/` vas a encontrar:

- `dashboard-desktop.png` — Dashboard en escritorio
- `dashboard-mobile.png` — Dashboard en movil
- `subscriptions-desktop.png` — Pagina de suscripciones en escritorio
- `subscriptions-mobile.png` — Pagina de suscripciones en movil
- `form-desktop.png` — Formulario en escritorio
- `form-mobile.png` — Formulario en movil
