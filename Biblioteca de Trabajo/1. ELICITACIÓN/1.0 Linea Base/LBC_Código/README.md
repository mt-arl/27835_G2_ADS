# Línea Base - Código

Aquí se encuentra todo el código fuente y scripts del proyecto KairosMix, organizado para el desarrollo y pruebas. Esta versión marca la evolución hacia un Backend seguro con implementación de autenticación y arquitectura escalable.

## Hitos de la Versión 2.0

- Implementación de Autenticación y Autorización (Login) mediante JWT
- Seguridad de contraseñas con Hashing (Bcrypt)
- Configuración de entorno de pruebas unitarias (Jest)
- Script de poblado de datos (Seeding) para usuario Administrador

## Estructura del Proyecto

### Backend (kairosmix-back)
**Tecnologías**: Node.js + Express + TypeScript + MongoDB + Mongoose + JWT + Jest

#### Estructura de Carpetas Actualizada:

src/
├── index.ts                 # Punto de entrada del servidor
├── app.ts                   # Configuración de App y Middlewares
├── config/                  # Configuración global
│   └── Database.ts          # Singleton de conexión
├── controllers/             # Lógica de negocio
│   ├── authController.ts    # [NUEVO] Control de Login
│   ├── clientController.ts
│   ├── productController.ts
│   └── orderController.ts   # [NUEVO] Gestión de Pedidos
├── factories/               # Patrón Factory
│   └── RepositoryFactory.ts # Fábrica centralizada de repositorios
├── middleware/              # [NUEVO] Middlewares
│   └── authMiddleware.ts    # Protección de rutas (Verify Token)
├── models/                  # Modelos de Mongoose
│   ├── User.ts              # [NUEVO] Modelo de Usuario (Admin/Vendedor)
│   ├── Order.ts             # [NUEVO] Modelo de Pedido
│   ├── Client.ts
│   └── Product.ts
├── repositories/            # Patrón Repository
│   ├── MongoUserRepository.ts  # [NUEVO] Acceso a datos de Usuarios
│   ├── MongoOrderRepository.ts # [NUEVO] Acceso a datos de Pedidos
│   ├── ClientRepository.ts
│   └── ProductRepository.ts
├── routes/                  # Definición de rutas
│   ├── authRoutes.ts        # [NUEVO] Rutas públicas (Login)
│   ├── orderRoutes.ts       # [NUEVO] Rutas protegidas
│   ├── clientRoutes.ts
│   └── productRoutes.ts
└── scripts/                 # [NUEVO] Scripts de utilidad
    └── seed.ts              # Creación automática de Admin y Productos base
tests/                       # [NUEVO] Pruebas Unitarias
    ├── RepositoryFactory.test.ts
    └── MixController.test.ts

#### Dependencias principales (Nuevas):
- `bcryptjs`: Encriptación de contraseñas.
- `jsonwebtoken`: Generación y validación de Tokens (Session).
- `tsx`: Ejecución rápida de TypeScript (reemplaza a ts-node en dev).
- `jest / ts-jest`: Framework de pruebas unitarias.
- `supertest`: Pruebas de integración HTTP.

#### Scripts Actualizados:
- `npm run dev`: Modo desarrollo optimizado (tsx watch src/index.ts).
- `npm run seed`: Ejecuta el poblado de base de datos (tsx src/scripts/seed.ts).
- `npm test`: Ejecuta las pruebas unitarias (jest).
- `npm run build`: Compilación TypeScript para producción.

### Frontend (kairosmix-front)
**Tecnologías**: React 19 + Vite + JavaScript

#### Estructura de Carpetas:

src/
├── App.jsx                  # Componente principal
├── main.jsx                 # Punto de entrada
├── components/              # Componentes reutilizables
│   ├── ClientForm.jsx      # Formulario de clientes
│   ├── ClientModal.jsx     # Modal de clientes
│   ├── ClientSearch.jsx    # Búsqueda de clientes
│   ├── ClientTable.jsx     # Tabla de clientes
│   ├── ProductForm.jsx     # Formulario de productos
│   ├── ProductModal.jsx    # Modal de productos
│   ├── ProductSearch.jsx   # Búsqueda de productos
│   ├── ProductTable.jsx    # Tabla de productos
│   └── Sidebar.jsx         # Menú lateral
├── pages/                   # Páginas principales
│   ├── ClientsPage.jsx
│   └── ProductsPage.jsx
└── services/                # Servicios API
    ├── clientService.js
    └── productService.js

#### Scripts:
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run lint`: Análisis de código

## Patrones de Diseño Implementados:

1. **Singleton**: Gestión única de conexión a MongoDB (Database.ts).
2. **Factory**: Creación dinámica de repositorios (RepositoryFactory) para desacoplar la lógica de la base de datos.
3. **Repository**: Abstracción del acceso a datos (CRUDs separados de controladores).
4. **Middleware**: Interceptores para validar seguridad (JWT) antes de procesar peticiones.

## Variables de Entorno (.env):
```
MONGO_URI=mongodb://...
PORT=3000
DB_TYPE=MONGO
```

## Fecha de actualización:
20 de enero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche