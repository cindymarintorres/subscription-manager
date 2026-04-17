# Decisiones técnicas

## Tarea 1 — Servicio HTTP

**Qué hice:** Armé los métodos que faltaban (`create`, `update`, `delete`) en `subscription.service.ts`. Seguí el mismo patrón de lo que ya estaba: usar `HttpClient` con los tipos genéricos bien definidos y la misma ruta base de la API. Devolví el Observable directo sin `pipe`

**Por qué:** Me guié por el patrón que ya tenía el código. Quería dejar la capa de servicio súper delgada y que solo devolviera un `Observable<T>`. El backend ya manda todo ordenado y en camelCase, así que colocar un catchError o un map me parecía agregar complejidad innecesaria.

**Alternativas consideradas:** Pensé en armar un interceptor global para manejar los errores HTTP. Como el proyecto no tenia uno por defecto y la prueba no solicitaba agregar el mismo, preferí mantenerlo simple y dejar que los errores se manejen dentro de cada componente.

---

## Tarea 2 — Lista de suscripciones

**Qué hice:** Creé un signal `computed()` llamado `filteredSubscriptions`. Este signal combina la búsqueda por texto y el filtro de categoría iterando una sola vez sobre todo el array. En el HTML quité el texto de relleno y metí un `@for` que itera sobre este signal. También conecté el borrado a un signal `confirmDeleteId` para manejar el modal.

**Por qué:** Usar un `computed()` para ambos filtros es súper eficiente, no tuve que armar dos señales intermedias al hilo. Lo bueno de Angular 19 es que recalcula esto solo cuando cambias el texto o la categoría. No existe la necesidad de agregar effects o desuscribirme a mano.

**Alternativas consideradas:** Tuve la idea de separar los filtros en dos `computed()` distintos. Al final preferí juntar la lógica en uno solo para que quedara más fácil de leer, y de paso me ahorro crear arrays de sobra en la memoria.

---

## Tarea 3 — Formulario de nueva suscripción

**Qué hice:** Armé un `FormGroup` pasándole como generics `FormGroup<SubscriptionForm>`, aprovechando la API estricta de Angular. Puse cada control como `nonNullable` para no tener que manejar tipo de datos nulos. Para el ciclo de facturación, armé un toggle visual con dos botones usando `setValue()` en lugar del clásico `<select>`.

**Por qué:** Tipar los Reactive Forms evita el uso de `any` y ayuda el autocompletado en el editor. El toggle con botones queda mucho más limpio y moderno visualmente para elegir entre solo dos opciones, se adapta mejor al diseño.

**Alternativas consideradas:** Los formularios por template (template-driven) eran una opción para escribir menos. Pero la verdad es que son más tediosos de testear y pueden dar dolores de cabeza con signals. Podría no haber tipado el `FormGroup`, pero perder el tipado en los getters se sentía como un retroceso.

---

## Tarea 4 — Editar suscripción

**Qué hice:** Reutilicé tal cual el componente que armé para crear (`SubscriptionFormComponent`). El componente mira el `ngOnInit()`, y si encuentra un `id` en `ActivatedRoute.snapshot.paramMap`, llama a `getById()` y rellena los datos con `patchValue()`. Cambié cosas como el título y el botón dinámicamente usando una propiedad `isEditMode`, computada a partir del signal `editId`.

**Por qué:** Armar otro componente casi igual para editar era reescribir código. Con leer el parámetro usando `snapshot` en el init alcanza perfecto. El usuario no va a estar cambiando de `/edit/1` a `/edit/2` con el componente ya abierto, así que no es necesario escuchar cambios en tiempo real en la ruta.

**Alternativas consideradas:** Pensé en escuchar `ActivatedRoute.params` como Observable por si cambiaba el ID de repente. Pero para este caso era complicarse demasiado. Al no tener navegación paralela entre ediciones, leer el id inicial hace todo mucho más simple y directo.

---

## Tarea 5 — Confirm dialog + delete

**Qué hice:** Creé un componente `ConfirmDialogComponent` flotante, centrado y con animaciones de entrada chulas (`fade-in` y `slide-up`). Lo armé con las nuevas APIs de Angular: `input()` y `output()` con signals. En la vista principal uso un signal `confirmDeleteId` que empieza en `null`. Si le pasas un ID válido, el modal se muestra.

**Por qué:** Manejar el estado del modal directo con el ID a eliminar y un signal en `null` me pareció lo justo y adecuado. Me ahorro tener crear una variable booleana separada,para mostrar u ocultar. Si el signal vale null, modal oculto; si tiene número, sabemos que mostrar y qué borrar. Imposible que se trabe por tener un estado inconsistente.

**Alternativas consideradas:** Consideré hacer algo robusto con un servicio global, un `Subject` y renderizar overlays a mano desde un nodo raíz. Para el tamaño de lo que necesitaba la prueba, me bastó poner un `@if (confirmDeleteId() !== null)` y renderizarlo integrado ahí mismo.

---

## Bonus 1 — Vista de detalle

**Qué hice:** Me armé un componente standalone normal que saca el ID de la ruta en el `ngOnInit` y carga la data. En la vista usé dos `@if` distintos (uno para el loader, otro para los datos). Mantuve esto separado porque en Angular no se puede hacer `@else if` asignando alias `as`. Ojo, tuve cuidado de registrar la ruta `/:id` recién *después* de `/new` en mi router.

**Por qué:** Las rutas de Angular se leen de arriba a abajo. Si ponía la ruta con parámetro arriba, al entrar a "new" el sistema iba a pensar que buscaba una suscripción con ID "new" e iba a tirar error en red. El orden importaba.

**Alternativas consideradas:** Pude haberle puesto un guard a la ruta para atajar que el parámetro fuera puramente numérico. O también cambiar la URL de creación a algo inconfundible como `/create`. Preferí el orden estricto de rutas que es fácil e igual de efectivo.

---

## Bonus 2 — Empty state reutilizable

**Qué hice:** Hice un componente pequeño, standalone, y agregue inputs basados en signal para: `title`, `message`, `actionLabel` y `actionRoute`. Si le pasas datos de acción, dibuja el boton y la ruta correspondientes con `routerLink`. Agregue SCSS inline importándolo con `@use`, para no llenar la carpeta de archivos.

**Por qué:** Para reutilizar el HTML y no tener que escribirlo en cada componente que lo necesite. Lo dejé flexible y con algunos valores default. Sirve para invocarlo donde sea.

**Alternativas consideradas:** Se me ocurrió que una directiva estructural para el empty state pintaba bien, pero a la larga un componente es mucho más claro estructuralmente. También es mas fácil aislarle un poco de estilo.

---

## Bonus 3 — Filtros del dashboard y navegación desde add-card

**Qué hice:** Le agregue tres cosas al `DashboardComponent` que no formaban parte de las reglas iniciales:

1. **Filtro por categoría:** Agregue un signal que guarda la categoría activa (`all` por defecto) y va rotando al clickear. Empieza en Todas, pasa por Entretenimiento, Software, etc… y da la vuelta. Cambia el label dinámicamente y se resalta si hay filtro.
2. **Ordenamiento por precio:** Agregue otro signal para ciclar entre tres formas de ordenar: nada, precio mayor y menor (`none`, `asc`, `desc`). Estos filtros no afectan al backend, los combiné directo en un `computed()` (`activeSubscriptions`), filtrando primero y ordenando después en un solo viaje.
3. **Card "Agregar":** Hice que esa tarjeta punteada no esté solo de adorno y te mande de verdad al `/subscriptions/new`. También le sumé unos detallitos de accesibilidad como `role="button"` para que sea amigable teclear sobre él.

**Por qué:** Se mostraba un poco vacio el dashboard, y me pareció que los filtros inactivos rompían un poco la inmersión del diseño. Meter signals encadenados en un `computed()` daba resultados súper rápidos sin quemar ciclos de memoria. 

**Alternativas consideradas:** Poner modales de checkbox para las categorías o rangos numéricos con un slider para el precio. Al final, no existía librería de botones o inputs pre-armados en el proyecto.

---

## Notas generales

- **Versión de Angular:** Usé la versión 19 y aproveché varias APIs modernas (como el signal-based `input()` y `output()`).
- **Patrón principal:** Todos componentes standalone. Todo el estado interno llevado con signals y manejo de formularios completamente reactivos.
- **Signals vs RxJS:** Lo mío con los signals en estado local es por una cuestión de legibilidad. Cero async pipes, ni subscripciones colgadas dando vueltas. Son simples y síncronos. Guardo el RxJS solo para llamadas a endpoints HTTP, que es donde el poder del asincronismo brilla.
- **Cero BehaviorSubject:** Usar `BehaviorSubject` para controlar variables de estado de un componente en Angular 19 ya huele raro. Un signal vuela y viene listo para detección de cambios optimizada, además evita esos famosos memory leaks en el estado local.

## Correcciones post-revisión

- **`PriceSort` como enum:** Reemplacé el union type `'none' | 'asc' | 'desc'` por un enum. 
La ventaja concreta es que si en algún momento agrego un nuevo estado de orden, TypeScript 
me avisa en compilación si hay un switch que no lo cubre. También aproveché para usar 
`signal.update()` en el toggle, que es el patrón correcto cuando el nuevo valor depende del anterior.

- **`forkJoin` en `loadData()`:** Había una race condition entre `getAll()` y `getStats()` — 
el loading se apagaba cuando terminaba `getStats()` independientemente de si `getAll()` 
había respondido. Lo resolví con `forkJoin` para que ambas peticiones terminen antes de 
ocultar el spinner.

- **Delete sin recargar:** Después de eliminar, el componente hacía un nuevo `loadData()` 
completo al servidor. Lo reemplacé con `subscriptions.update()` filtrando el ID localmente. 
Apliqué el mismo patrón en el dashboard.

- **Memory leak en `SubscriptionFormComponent`:** Las suscripciones de `ngOnInit` y `onSubmit` 
quedaban activas si el usuario navegaba antes de recibir respuesta del servidor. Lo corregí 
con `takeUntilDestroyed(this.destroyRef)` de `@angular/core/rxjs-interop`.

- **Payload de `create()`:** Estaba enviando `status: 'active'` desde el cliente, lo cual 
no tiene sentido — el estado inicial es responsabilidad del backend. Lo excluí del tipo 
usando `Omit` en la firma del servicio.

- **`CATEGORIES` en el detail:** La constante estaba asignada como propiedad de instancia 
sin necesidad. El único uso era dentro de `getCategoryLabel()`, así que la llamo directo 
desde ahí sin pasarla por `this`.

- **Lazy loading en rutas:** En vez de importar los componentes directamente en `app.routes.ts`, 
usé `loadComponent` para que cada módulo se descargue solo cuando el usuario navega a esa ruta.