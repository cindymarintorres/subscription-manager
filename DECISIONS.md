# Decisiones técnicas

## Tarea 1 — Servicio HTTP

**Qué hice:** Implementé los tres métodos faltantes (`create`, `update`, `delete`) en `subscription.service.ts` siguiendo el mismo patrón de los métodos existentes: `HttpClient` con generics tipados explícitamente, misma `apiUrl` como base, y retorno directo del Observable sin `pipe` innecesario.

**Por qué:** El patrón ya establecido era claro — una capa de servicio delgada que devuelve `Observable<T>` sin procesamiento adicional. Añadir más capas (catchError, map) habría sido sobreingeniería para lo que el backend ya entrega en camelCase y formato correcto.

**Alternativas consideradas:** Podría haber usado un interceptor global para manejo de errores HTTP, pero dado que el proyecto no tiene uno definido y la tarea no lo requería, mantuve los errores como observables nativos para que cada componente los maneje según su contexto.

---

## Tarea 2 — Lista de suscripciones

**Qué hice:** Implementé `filteredSubscriptions` como un `computed()` que combina ambos filtros en una sola pasada sobre el array. Reemplacé el placeholder HTML con un `@for` iterando sobre `filteredSubscriptions()`. Añadí métodos de navegación y delegué el delete al `confirmDeleteId` signal para controlar el diálogo.

**Por qué:** Un `computed()` que combina el filtro de búsqueda y categoría en una única operación es más eficiente que dos señales intermedias. Angular recalcula automáticamente cuando cambia `searchQuery` o `activeFilter`, sin necesidad de efectos ni subscripciones manuales.

**Alternativas consideradas:** Podría haber separado los filtros en dos `computed()` encadenados, pero concatenar el filtrado en uno solo es más legible y evita generación de arrays intermedios.

---

## Tarea 3 — Formulario de nueva suscripción

**Qué hice:** Creé un `FormGroup` tipado con `FormGroup<SubscriptionForm>` usando el tipo genérico de Angular 14+. Cada control es `nonNullable` para evitar `| null` en los tipos de valor. El toggle de ciclo de facturación usa dos botones con `setValue()` en lugar de un `<select>`, lo cual se alinea mejor con el diseño visual.

**Por qué:** Reactive Forms con generics tipados elimina el uso de `any` y da autocompletado completo. El toggle visual es más intuitivo para una elección binaria que un dropdown.

**Alternativas consideradas:** Template-driven forms habrían simplificado el código, pero son más difíciles de testear y menos predecibles con signals. El tipo genérico en `FormGroup` podría omitirse, pero añade seguridad de tipos en los getters.

---

## Tarea 4 — Editar suscripción

**Qué hice:** Reutilicé exactamente el mismo componente de formulario (`SubscriptionFormComponent`). El componente detecta si existe un `id` en `ActivatedRoute.snapshot.paramMap` en `ngOnInit()`. Si lo hay, llama `getById()` y usa `patchValue()` para precargar el formulario. El título y el botón de submit cambian según `isEditMode` (una propiedad computada del `editId` signal).

**Por qué:** Un único componente para crear y editar reduce duplicación de código. La detección en `ngOnInit` con `snapshot` es suficiente porque la ruta no cambia mientras el componente está activo.

**Alternativas consideradas:** Podría haber usado `ActivatedRoute.params` (Observable) en vez de `snapshot`, lo que permitiría reaccionar a cambios de parámetro sin destruir el componente. Para este caso de uso es innecesario: no hay navegación entre distintos `/edit` sin recargar el componente.

---

## Tarea 5 — Confirm dialog + delete

**Qué hice:** Implementé `ConfirmDialogComponent` con un overlay fijo semitransparente y una card centrada con animaciones de entrada (`fade-in` + `slide-up`). Usa `input()` y `output()` de la API signal-based de Angular 17+. El estado del diálogo en la lista de suscripciones se controla con un signal `confirmDeleteId: signal<number | null>(null)` — si es `null`, el diálogo no se muestra; si tiene un ID, se muestra con ese contexto.

**Por qué:** El signal `confirmDeleteId` modela el estado de UI de forma explícita y reactiva. No necesito un flag booleano separado: el ID nulo actúa como flag. Esto evita que se pueda tener el diálogo abierto sin contexto de qué eliminar.

**Alternativas consideradas:** Podría haber usado un servicio de diálogo con `Subject` o un overlay gestionado desde un componente host. Para la escala de este proyecto, el enfoque inline con `@if (confirmDeleteId() !== null)` es más simple y no requiere infraestructura adicional.

---

## Bonus 1 — Vista de detalle

**Qué hice:** Componente standalone que carga la suscripción por ID de ruta en `ngOnInit`. La plantilla usa dos bloques `@if` separados (uno para loading, otro para el contenido) porque Angular no permite `@else if` con alias `as`. La ruta `/subscriptions/:id` se registró **después** de `/subscriptions/new` para evitar que "new" sea interpretado como un ID numérico por el router.

**Por qué:** El orden de rutas en Angular es secuencial: registrar `/new` antes que `/:id` garantiza que "new" se resuelva al formulario y no intente cargar el detalle con ID "new".

**Alternativas consideradas:** Usar un guard de ruta que valide que el parámetro sea un número, o nombrar la ruta de creación de forma que no colisione (e.g., `/subscriptions/create`).

---

## Bonus 2 — Empty state reutilizable

**Qué hice:** Componente standalone con cuatro `input()` signal-based: `title`, `message`, `actionLabel` y `actionRoute`. Si `actionLabel` y `actionRoute` están presentes, renderiza un enlace con `routerLink`. Estilos inline con `@use` del design system para no generar un archivo SCSS separado innecesario.

**Por qué:** Un componente de empty state reutilizable evita duplicar el mismo HTML en cada lista o pantalla vacía. Los inputs opcionales con defaults hacen que sea usar‑y-olvidar: puedes instanciarlo sin props y tiene sentido visual.

**Alternativas consideradas:** Podría haberlo implementado como una directiva estructural, pero un componente es más semántico y más fácil de estilizar independientemente.

---

## Bonus 3 — Filtros del dashboard y navegación desde add-card

**Qué hice:** Agregué tres mejoras al `DashboardComponent` que no estaban en las instrucciones originales:

1. **Filtro por categoría:** Un signal `categoryFilter: signal<string>('all')` que cicla entre `all → entertainment → software → utilities → lifestyle → all` al hacer clic. El label del botón cambia al nombre de la categoría activa (ej. "Entretenimiento") y se activa visualmente cuando el filtro no es `'all'`. Al llegar al final del ciclo vuelve a mostrar todas.

2. **Ordenamiento por precio:** Un signal `priceSort: signal<'none' | 'asc' | 'desc'>` que alterna entre tres estados. El label cambia a "Precio ↑" o "Precio ↓" según el orden activo. Ambos filtros (categoría y precio) se componen dentro del mismo `computed()` `activeSubscriptions` — primero filtra por categoría, luego ordena — sin llamadas extra al backend.

3. **Card "Agregar Suscripción" funcional:** La tarjeta con borde punteado del dashboard ahora llama a `navigateToNew()` que rutea a `/subscriptions/new`. Se añadió `role="button"` y `tabindex="0"` para accesibilidad, y `:focus-visible` en el SCSS para navegación por teclado.

**Por qué:** Los botones de filtro ya existían en el diseño pero no hacían nada — dejarlos inertes sería una regresión visible en la demo. Implementar ambos filtros como signals que se componen en un `computed()` es O(n) por pasada y no requiere estado adicional. La card de agregar era claramente un CTA que debía navegar al formulario.

**Alternativas consideradas:** Para categoría podría haber mostrado un dropdown/popover con checkboxes en lugar del ciclo. Para precio, un rango numérico con slider sería más preciso. Ambas opciones requieren componentes de UI adicionales y no hay librerías de UI en el proyecto — el ciclo de estados es la opción más pragmática sin dependencias.

---

## Notas generales

- **Versión de Angular:** 19 (con APIs de Angular 17+ para `input()`, `output()`)
- **Patrón principal:** standalone components + signals + reactive forms
- **Por qué signals sobre RxJS para estado local:** Los signals de Angular son síncronos, más simples de leer y debuggear, y Angular los integra nativamente con `@if`/`@for`. No necesito `async pipe` ni manejar subscripciones manualmente para estado de UI. RxJS sigue siendo la herramienta correcta para las llamadas HTTP (que son inherentemente asíncronas), pero el estado de componente local se gestiona mejor con signals.
- **Por qué no `BehaviorSubject`:** En Angular 19, `BehaviorSubject` para estado de componente es un antipatrón cuando signals están disponibles. Señales tienen detección de cambios optimizada de Angular y no requieren `.pipe(takeUntilDestroyed())` para evitar leaks.
