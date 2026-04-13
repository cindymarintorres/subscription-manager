# Prueba Tecnica: Subscription Manager App

## Contexto

Se necesita crear una prueba tecnica para evaluar candidatos a **Frontend Developer Junior-Mid** con Angular. La prueba consiste en un proyecto parcialmente implementado (patron "Complete the App") donde el candidato recibe un dashboard funcional como referencia y debe implementar las features restantes en **2-3 horas**.

**Proposito:** Evaluar competencias en Angular 19 (standalone components, signals, reactive forms, routing, servicios HTTP) junto con capacidad de seguir un design system, responsividad y calidad general de codigo.

**Diseño visual:** Basado en el proyecto "Subscription Manager App" de Stitch (project ID: `9929486056839448656`), con el design system "The Financial Curator" — estetica editorial premium con primary blue (#0056D2), tipografia Manrope + Inter, tonal layering sin bordes.

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
subscription-manager/
├── backend/                         # Node.js + Express + SQLite
│   ├── src/
│   │   ├── database.js              # SQLite setup con better-sqlite3 + seed data
│   │   ├── routes/
│   │   │   └── subscriptions.js     # CRUD endpoints + stats
│   │   └── server.js                # Express app, CORS, puerto 3000
│   ├── package.json
│   └── data/                        # SQLite DB file (auto-generated)
│
├── frontend/                        # Angular 19
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/
│   │   │   │   │   └── subscription.model.ts
│   │   │   │   └── services/
│   │   │   │       └── subscription.service.ts
│   │   │   ├── layout/
│   │   │   │   ├── layout.component.ts          # Shell con sidebar + bottom nav
│   │   │   │   ├── layout.component.html
│   │   │   │   ├── layout.component.scss
│   │   │   │   ├── sidebar/
│   │   │   │   │   └── sidebar.component.ts     # Nav desktop
│   │   │   │   └── bottom-nav/
│   │   │   │       └── bottom-nav.component.ts  # Nav mobile
│   │   │   ├── features/
│   │   │   │   ├── dashboard/                   # ✅ IMPLEMENTADO
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   ├── dashboard.component.scss
│   │   │   │   │   └── components/
│   │   │   │   │       ├── subscription-card/
│   │   │   │   │       │   ├── subscription-card.component.ts
│   │   │   │   │       │   ├── subscription-card.component.html
│   │   │   │   │       │   └── subscription-card.component.scss
│   │   │   │   │       ├── monthly-summary/
│   │   │   │   │       │   ├── monthly-summary.component.ts
│   │   │   │   │       │   ├── monthly-summary.component.html
│   │   │   │   │       │   └── monthly-summary.component.scss
│   │   │   │   │       └── upcoming-renewals/
│   │   │   │   │           ├── upcoming-renewals.component.ts
│   │   │   │   │           ├── upcoming-renewals.component.html
│   │   │   │   │           └── upcoming-renewals.component.scss
│   │   │   │   ├── subscription-form/           # 🔨 CANDIDATO IMPLEMENTA
│   │   │   │   │   └── subscription-form.component.ts  # Archivo con TODO
│   │   │   │   └── subscription-detail/         # 🔨 CANDIDATO IMPLEMENTA (bonus)
│   │   │   │       └── subscription-detail.component.ts # Archivo con TODO
│   │   │   ├── shared/
│   │   │   │   └── components/
│   │   │   │       ├── confirm-dialog/          # 🔨 CANDIDATO IMPLEMENTA
│   │   │   │       │   └── confirm-dialog.component.ts
│   │   │   │       └── empty-state/             # Componente de estado vacio (bonus)
│   │   │   │           └── empty-state.component.ts
│   │   │   ├── app.routes.ts                    # Rutas base (dashboard configurada)
│   │   │   ├── app.component.ts
│   │   │   └── app.config.ts                    # provideHttpClient, provideRouter
│   │   ├── styles/
│   │   │   ├── _variables.scss                  # Design tokens Stitch
│   │   │   ├── _typography.scss                 # Manrope + Inter
│   │   │   ├── _mixins.scss                     # Responsive mixins
│   │   │   └── styles.scss                      # Global styles
│   │   └── environments/
│   │       └── environment.ts                   # apiUrl: http://localhost:3000
│   ├── package.json
│   └── angular.json
│
├── docs/
│   └── INSTRUCTIONS.md              # Enunciado de la prueba
├── screenshots/                     # Capturas de Stitch como referencia
└── README.md                        # Setup instructions
```

---

## Backend: Express + SQLite

### Modelo de Datos

**Tabla `subscriptions`:**

| Campo | Tipo | Descripcion |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | ID unico |
| `name` | TEXT NOT NULL | Nombre del servicio |
| `price` | REAL NOT NULL | Costo por ciclo |
| `billing_cycle` | TEXT NOT NULL DEFAULT 'monthly' | "monthly" o "annual" |
| `category` | TEXT NOT NULL DEFAULT 'entertainment' | "entertainment", "software", "utilities", "lifestyle" |
| `next_payment_date` | TEXT NOT NULL | Fecha ISO (YYYY-MM-DD) |
| `color` | TEXT NOT NULL DEFAULT '#0056D2' | Color hex del brand strip |
| `icon` | TEXT | Nombre de icono o URL |
| `status` | TEXT NOT NULL DEFAULT 'active' | "active" o "paused" |
| `created_at` | TEXT DEFAULT CURRENT_TIMESTAMP | Timestamp |

### Endpoints

| Metodo | Ruta | Descripcion | Response |
|---|---|---|---|
| `GET` | `/api/subscriptions` | Listar todas | Array de subscriptions |
| `GET` | `/api/subscriptions/:id` | Obtener por ID | Subscription object |
| `POST` | `/api/subscriptions` | Crear nueva | Subscription creada |
| `PUT` | `/api/subscriptions/:id` | Actualizar | Subscription actualizada |
| `DELETE` | `/api/subscriptions/:id` | Eliminar | `{ message: "Deleted" }` |
| `GET` | `/api/subscriptions/stats/summary` | Estadisticas | `{ totalMonthly, count, annualProjection }` |

### Seed Data

```json
[
  { "name": "Netflix", "price": 15.99, "billing_cycle": "monthly", "category": "entertainment", "next_payment_date": "2026-04-24", "color": "#E50914", "icon": "tv", "status": "active" },
  { "name": "NordVPN", "price": 12.99, "billing_cycle": "monthly", "category": "software", "next_payment_date": "2026-04-24", "color": "#4687FF", "icon": "shield", "status": "active" },
  { "name": "Claude AI", "price": 20.00, "billing_cycle": "monthly", "category": "software", "next_payment_date": "2026-05-02", "color": "#D97757", "icon": "brain", "status": "active" },
  { "name": "Disney+", "price": 7.99, "billing_cycle": "monthly", "category": "entertainment", "next_payment_date": "2026-05-06", "color": "#113CCF", "icon": "star", "status": "active" }
]
```

### Mapeo de nombres Backend → Frontend

El backend usa snake_case (SQLite convention) y el frontend usa camelCase (TypeScript convention). El mapeo se hace en el backend al retornar los JSON responses con `AS` en las queries SQL, de modo que el frontend recibe directamente camelCase:

```sql
SELECT id, name, price, billing_cycle AS billingCycle, category, 
       next_payment_date AS nextPaymentDate, color, icon, status,
       created_at AS createdAt FROM subscriptions
```

### Dependencias Backend

- `express` — Server HTTP
- `better-sqlite3` — SQLite sincronico, sin async overhead
- `cors` — CORS para desarrollo local
- `nodemon` (dev) — Auto-reload

---

## Frontend: Angular 19

### Design System (Stitch "Financial Curator")

**Colores principales (variables SCSS):**
```scss
$primary: #0040a1;
$primary-container: #0056d2;
$on-primary: #ffffff;
$surface: #f8f9fa;
$surface-container-low: #f3f4f5;
$surface-container-lowest: #ffffff;
$on-surface: #191c1d;
$on-surface-variant: #424654;
$outline: #737785;
$outline-variant: #c3c6d6;
$error: #ba1a1a;
$tertiary: #822800; // Renewal pulse
```

**Tipografia:**
- Headlines: Manrope (3.5rem display, 1.5rem headlines)
- Body/UI: Inter (1.125rem titles, 0.75rem labels)

**Reglas de diseño:**
- Sin bordes 1px para separar secciones (usar background shifts)
- Cards con esquinas `xl` (0.75rem) y brand strip de 4px a la izquierda
- CTAs pill-shaped con gradiente `primary` → `primary-container`
- Glassmorphism en header flotante (80% opacity + blur 20px)
- Sombras ambient: `box-shadow: 0 20px 40px rgba(25, 28, 29, 0.04)`

### Modelo TypeScript

```typescript
export interface Subscription {
  id: number;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  category: 'entertainment' | 'software' | 'utilities' | 'lifestyle';
  nextPaymentDate: string;
  color: string;
  icon: string;
  status: 'active' | 'paused';
  createdAt?: string;
}

export interface SubscriptionStats {
  totalMonthly: number;
  count: number;
  annualProjection: number;
}
```

### Servicio (parcialmente implementado)

```typescript
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private apiUrl = environment.apiUrl + '/api/subscriptions';

  // ✅ YA IMPLEMENTADO
  getAll(): Observable<Subscription[]> { ... }
  getStats(): Observable<SubscriptionStats> { ... }
  getById(id: number): Observable<Subscription> { ... }

  // 🔨 TODO: El candidato debe implementar estos metodos
  create(subscription: Omit<Subscription, 'id' | 'createdAt'>): Observable<Subscription> { }
  update(id: number, subscription: Partial<Subscription>): Observable<Subscription> { }
  delete(id: number): Observable<void> { }
}
```

### Routing

```typescript
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // 🔨 TODO: Candidato agrega estas rutas
      // { path: 'subscriptions/new', component: SubscriptionFormComponent },
      // { path: 'subscriptions/:id/edit', component: SubscriptionFormComponent },
    ]
  }
];
```

### Componentes implementados (referencia)

**DashboardComponent:**
- Usa `signal()` para la lista de suscripciones
- Usa `computed()` para calculos derivados (total, conteo)
- Llama a `subscriptionService.getAll()` en `ngOnInit` o con `effect()`
- Renderiza `SubscriptionCardComponent` con `@for`
- Responsive: grid 4 columnas (desktop) → lista vertical (mobile)

**SubscriptionCardComponent:**
- `@Input()` subscription
- Brand strip con `[style.borderLeftColor]`
- Nombre, precio, proxima renovacion
- Boton de opciones (3 dots) — sin funcionalidad, el candidato la agrega

**LayoutComponent:**
- Sidebar fija en desktop (>768px) con `@if` para responsive
- Bottom tab nav en mobile (<768px)
- Router outlet principal
- Boton "Quick Add" flotante

---

## Tareas del Candidato

### Tarea 1: Completar el Servicio HTTP (30 min)
- Implementar `create()`, `update()`, `delete()` en `SubscriptionService`
- Seguir el patron de `getAll()` que ya existe como referencia
- **Evalua:** HttpClient, Observables, tipado TypeScript

### Tarea 2: Formulario "Agregar Suscripcion" (45-60 min)
- Crear `SubscriptionFormComponent` con Reactive Forms
- Campos: nombre (required), precio (required, > 0), ciclo (toggle monthly/annual), categoria (select), color (color picker simple), fecha proximo pago (required, fecha futura)
- Validaciones con mensajes de error visibles
- Al enviar: llamar `subscriptionService.create()` y navegar al dashboard
- Responsive: formulario centrado en desktop, fullscreen en mobile
- **Evalua:** ReactiveFormsModule, FormGroup, Validators, Router navigation, design system fidelity

### Tarea 3: Editar Suscripcion (30 min)
- Reutilizar `SubscriptionFormComponent` para edicion
- Ruta `/subscriptions/:id/edit`
- Cargar datos existentes con `ActivatedRoute.params` + `subscriptionService.getById()`
- Pre-popular el formulario con `patchValue()`
- Al enviar: llamar `update()` en vez de `create()`
- **Evalua:** Routing con parametros, reutilizacion de componentes, logica condicional

### Tarea 4: Eliminar Suscripcion (20 min)
- Agregar boton "Eliminar" en el menu de opciones de `SubscriptionCardComponent`
- Crear dialogo de confirmacion simple
- Al confirmar: llamar `subscriptionService.delete()` y actualizar la lista
- **Evalua:** Component communication (@Output), estado reactivo, UX

### Tarea 5 — Bonus (tiempo restante)
- Busqueda/filtro de suscripciones en el dashboard
- Animaciones CSS o Angular animations en las cards
- Vista de detalle `/subscriptions/:id`
- Estados vacios cuando no hay suscripciones
- Pausar/reactivar suscripcion (toggle status)

---

## Documento INSTRUCTIONS.md

El enunciado se redactara en espanol con:

1. **Bienvenida y contexto** — Escenario de equipo, que existe y que falta
2. **Instrucciones de setup** — `npm install` + `npm run dev` en ambos packages
3. **Tareas numeradas** — Cada una con criterios de aceptacion claros
4. **Capturas de referencia** — Screenshots de Stitch para las vistas a implementar
5. **Criterios de evaluacion** — Rubrica explicita:
   - Calidad de codigo y TypeScript (30%)
   - Angular idiomatico: signals, standalone, reactive forms (30%)
   - UI/UX: fidelidad al design system + responsividad (25%)
   - Bonus y mejoras propias (15%)
6. **Consejos** — "Prioriza calidad sobre cantidad", "Usa el dashboard como referencia"

---

## Verificacion

Para testear que el proyecto base funciona correctamente antes de entregarlo:

1. **Backend:** `cd backend && npm install && npm start` → verificar endpoints con curl/Postman
2. **Frontend:** `cd frontend && npm install && ng serve` → verificar dashboard carga con datos
3. **Integracion:** Dashboard muestra las 4 suscripciones del seed, total mensual correcto ($56.97), responsive funciona
4. **Archivos TODO:** Verificar que los archivos vacios tienen los TODO comments como guia
5. **Capturas:** Guardar screenshots de Stitch en `/screenshots/` para referencia del candidato
