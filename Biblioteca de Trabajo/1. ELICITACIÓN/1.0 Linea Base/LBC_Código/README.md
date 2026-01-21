# Línea Base - Código

Código fuente y scripts del proyecto KairosMix con arquitectura Backend segura, autenticación JWT y pruebas unitarias.

## Hitos de la Versión 2.0

- Autenticación y Autorización (Login) mediante JWT
- Seguridad de contraseñas con Hashing (Bcrypt)
- Pruebas unitarias (Jest)
- Script de poblado de datos (Seeding)

## Backend (kairosmix-back)

**Tecnologías**: Node.js + Express + TypeScript + MongoDB + Mongoose + JWT + Jest

**Carpetas principales**:
- `src/controllers/` - Lógica de negocio (auth, client, product, order)
- `src/models/` - Modelos Mongoose (User, Order, Client, Product)
- `src/repositories/` - Patrón Repository (MongoUserRepository, MongoOrderRepository, etc.)
- `src/middleware/` - Middlewares (authMiddleware)
- `src/routes/` - Rutas (authRoutes, orderRoutes, clientRoutes, productRoutes)
- `src/scripts/` - Scripts de utilidad (seed.ts)
- `tests/` - Pruebas unitarias

**Dependencias principales**:
- `bcryptjs`, `jsonwebtoken`, `tsx`, `jest`, `supertest`

**Scripts**:
- `npm run dev` - Desarrollo
- `npm run seed` - Poblado de BD
- `npm test` - Pruebas unitarias
- `npm run build` - Compilación

## Frontend (kairosmix-front)

**Tecnologías**: React 19 + Vite + JavaScript

**Carpetas principales**:
- `src/components/` - Componentes reutilizables (formularios, modales, tablas)
- `src/pages/` - Páginas (ClientsPage, ProductsPage)
- `src/services/` - Servicios API

**Scripts**:
- `npm run dev` - Desarrollo
- `npm run build` - Producción
- `npm run lint` - Análisis de código

## Patrones de Diseño

1. **Singleton** - Gestión única de conexión a MongoDB
2. **Factory** - Creación dinámica de repositorios
3. **Repository** - Abstracción del acceso a datos
4. **Middleware** - Validación de seguridad (JWT)

## Variables de Entorno

```
MONGO_URI=mongodb://...
PORT=3000
DB_TYPE=MONGO
```

## Fecha de actualización:
20 de enero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche