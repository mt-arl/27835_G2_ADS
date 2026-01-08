# Línea Base - Código

Aquí se encuentra todo el código fuente y scripts del proyecto KairosMix, organizado para el desarrollo y pruebas.

## Estructura del Proyecto

### Backend (kairosmix-back)
**Tecnologías**: Node.js + Express + TypeScript + MongoDB + Mongoose

#### Estructura de Carpetas:
```
src/
├── index.ts                 # Punto de entrada del servidor
├── controller/              # Controladores (lógica de negocio)
│   ├── clientController.ts
│   └── productController.ts
├── database/                # Gestión de BD
│   └── Database.ts         # Singleton de conexión
├── factories/               # Patrón Factory
│   └── RepositoryFactory.ts
├── models/                  # Modelos de Mongoose
│   ├── Client.ts
│   └── Product.ts
├── repositories/            # Patrón Repository
│   ├── ClientRepository.ts
│   └── ProductRepository.ts
└── routes/                  # Definición de rutas
    ├── clientRoutes.ts
    └── productRoutes.ts
```

#### Dependencias principales:
- `express`: Framework web
- `mongoose`: ODM para MongoDB
- `cors`: Middleware CORS
- `dotenv`: Variables de entorno
- `typescript`: Tipado estático

#### Scripts:
- `npm run dev`: Modo desarrollo con nodemon
- `npm run build`: Compilación TypeScript
- `npm start`: Ejecución producción

### Frontend (kairosmix-front)
**Tecnologías**: React 19 + Vite + JavaScript

#### Estructura de Carpetas:
```
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
```

#### Dependencias principales:
- `react`: 19.2.0
- `react-dom`: 19.2.0
- `vite`: Build tool y dev server
- `eslint`: Linter de código

#### Scripts:
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run lint`: Análisis de código

## Patrones de Diseño Implementados:

1. **Singleton**: Gestión única de conexión a MongoDB
2. **Factory**: Creación dinámica de repositorios según tipo de BD
3. **Repository**: Abstracción del acceso a datos

## Variables de Entorno (.env):
```
MONGO_URI=mongodb://...
PORT=3000
DB_TYPE=MONGO
```

## Fecha de inicio:
08 de enero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche