# Backend — Subscription Manager API

API REST hecha con Express y SQLite (better-sqlite3). No necesitas modificar nada de aca, esta todo funcionando.

## Levantar

```bash
npm install
npm run dev
```

Corre en http://localhost:3000. La base de datos se crea sola con 4 suscripciones de ejemplo la primera vez que arranca.

## Endpoints

| Metodo   | Ruta                              | Que hace                        |
|----------|-----------------------------------|---------------------------------|
| `GET`    | `/api/subscriptions`              | Trae todas las suscripciones    |
| `GET`    | `/api/subscriptions/:id`          | Trae una por ID                 |
| `POST`   | `/api/subscriptions`              | Crea una nueva                  |
| `PUT`    | `/api/subscriptions/:id`          | Actualiza una existente         |
| `DELETE` | `/api/subscriptions/:id`          | Elimina una                     |
| `GET`    | `/api/subscriptions/stats/summary`| Total mensual, conteo, proyeccion anual |

## Estructura

```
src/
├── server.js          → Entry point. Levanta Express en el puerto 3000.
├── database.js        → Conexion a SQLite, crea la tabla y mete los datos iniciales.
└── routes/
    └── subscriptions.js → Todos los endpoints CRUD + estadisticas.
```

## Datos de ejemplo

La DB arranca con estas suscripciones:

| Servicio   | Precio  | Categoria       | Color     |
|------------|---------|-----------------|-----------|
| Netflix    | $15.99  | Entertainment   | `#E50914` |
| NordVPN    | $12.99  | Software        | `#4687FF` |
| Claude AI  | $20.00  | Software        | `#D97757` |
| Disney+    | $7.99   | Entertainment   | `#113CCF` |

## Nota sobre los campos

La base de datos usa snake_case (`billing_cycle`, `next_payment_date`) pero la API responde en camelCase (`billingCycle`, `nextPaymentDate`). La conversion se hace con aliases SQL, asi que desde el frontend siempre vas a recibir camelCase.
