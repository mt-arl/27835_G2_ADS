# Línea Base - Diseño

En esta carpeta están los documentos gráficos y diagramas que representan el diseño del sistema KairosMix.

## Contenido principal:

### Diagramas UML:
- **Diagramas de Casos de Uso**: Interacciones usuario-sistema
- **Diagramas de Clases**: Estructura de entidades y relaciones
- **Diagramas de Flujo**: Flujos de comunicación

### Arquitectura del Sistema:

#### Arquitectura de 3 Capas:
```
┌─────────────────────────────────┐
│   Capa de Presentación          │
│   (React Frontend)              │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│   Capa de Aplicación            │
│   (Express API REST)            │
│   - Controllers                 │
│   - Routes                      │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│   Capa de Datos                 │
│   - Repositories (Patrón)       │
│   - Models (Mongoose)           │
│   - Database (Singleton)        │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│   MongoDB (Base de Datos)       │
└─────────────────────────────────┘
```

### Patrones de Diseño:

#### 1. Singleton Pattern
- **Clase**: `Database`
- **Propósito**: Garantizar una única instancia de conexión a MongoDB
- **Implementación**: 
  - Constructor privado
  - Método estático `getInstance()`
  - Gestión centralizada de conexión

#### 2. Factory Pattern
- **Clase**: `RepositoryFactory`
- **Propósito**: Crear repositorios según tipo de BD configurado
- **Métodos**:
  - `getProductRepository()`
  - `getClientRepository()`
- **Flexibilidad**: Soporta múltiples tipos de BD mediante variable de entorno

#### 3. Repository Pattern
- **Interfaces**: 
  - `IProductRepository`
  - `IClientRepository`
- **Implementaciones**:
  - `MongoProductRepository`
  - `MongoClientRepository`
- **Propósito**: Abstraer lógica de acceso a datos
- **Operaciones CRUD**:
  - create, findAll, findById, update, delete (soft delete)

### Modelo de Datos:

#### Entidad Client:
```typescript
- cedula: string (unique)
- nombre: string
- correo: string
- telefono: string
- direccion: string
- isActive: boolean
- timestamps: createdAt, updatedAt
```

#### Entidad Product:
```typescript
- code: string (unique)
- name: string
- pricePerPound: number
- wholesalePrice: number
- retailPrice: number
- originCountry: string
- initialStock: number
- currentStock: number
- imageUrl?: string
- isActive: boolean
- timestamps: createdAt, updatedAt
```

### API REST Endpoints:

#### Productos:
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto (soft)

#### Clientes:
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obtener cliente
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente (soft)

## Fecha de inicio:
08 de enero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche