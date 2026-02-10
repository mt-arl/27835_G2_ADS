# Línea Base - Código

# 🥜 KairosMix - Sistema de Gestión de Mezclas Personalizadas

Sistema web completo para la gestión de productos a granel, mezclas personalizadas y pedidos. Permite a los clientes crear mezclas personalizadas de frutos secos y productos a granel, mientras que los administradores gestionan inventario, pedidos y clientes.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Flujo de la Aplicación](#-flujo-de-la-aplicación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Despliegue](#-despliegue)

---

## ✨ Características Principales

### Para Clientes
- 🛒 **Catálogo de Productos**: Visualización de productos disponibles con precios por libra
- 🎨 **Mezclas Personalizadas**: Creación de mezclas con cantidades personalizadas en libras
- 💾 **Guardar Mezclas**: Almacenamiento de mezclas favoritas para reutilizar
- 📦 **Gestión de Pedidos**: Creación y seguimiento de pedidos
- 🔐 **Autenticación**: Sistema de login seguro para clientes

### Para Administradores
- 📊 **Dashboard Administrativo**: Panel de control con estadísticas
- 🏷️ **Gestión de Productos**: CRUD completo de productos con información nutricional
- 👥 **Gestión de Clientes**: Crear, editar y desactivar clientes
- 📋 **Gestión de Pedidos**: Visualización y actualización de estados de pedidos
- 🎯 **Gestión de Mezclas**: Administración de mezclas guardadas por clientes

### Características Técnicas
- 📱 **Diseño Responsive**: Optimizado para móvil, tablet y desktop
- 🎨 **UI/UX Moderna**: Interfaz atractiva con animaciones y transiciones
- 🔒 **Seguridad**: Autenticación con JWT y encriptación de contraseñas
- 💰 **Cálculo de Precios**: Sistema dual de precios (retail y por libra)
- 📈 **Historial de Precios**: Preservación de precios al momento de la compra

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router DOM** - Navegación
- **SweetAlert2** - Alertas y modales
- **Font Awesome** - Iconos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v9 o superior) - Viene con Node.js
- **MongoDB** (v6 o superior) - [Descargar](https://www.mongodb.com/try/download/community)
  - O una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recomendado)
- **Git** - [Descargar](https://git-scm.com/)

### Verificar instalación:
```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar v9.x.x o superior
mongod --version # Debe mostrar v6.x.x o superior (si usas MongoDB local)
```

---

## 🚀 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd KairozMixV3.0
```

### 2. Instalar Dependencias del Backend

```bash
cd backendv3.0/kairosmix-back
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd ../../frontendv3.0/kairosmix-front
npm install
```

---

## ⚙️ Configuración

### Backend - Variables de Entorno

1. Crear archivo `.env` en `backendv3.0/kairosmix-back/`:

```bash
cd backendv3.0/kairosmix-back
touch .env
```

2. Agregar las siguientes variables:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/kairosmix
# O si usas MongoDB Atlas:
# MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/kairosmix

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui

# Puerto del servidor
PORT=3000
```

**Notas importantes:**
- Cambia `tu_clave_secreta_muy_segura_aqui` por una clave aleatoria y segura
- Si usas MongoDB Atlas, reemplaza la URI con tu string de conexión
- El puerto 3000 es el predeterminado, cámbialo si está ocupado

### Frontend - Configuración de API

El frontend está configurado para conectarse a `http://localhost:3000/api` por defecto.

Si cambias el puerto del backend, actualiza las URLs en:
- `frontendv3.0/kairosmix-front/src/services/productService.js`
- `frontendv3.0/kairosmix-front/src/services/clientService.js`
- `frontendv3.0/kairosmix-front/src/services/orderService.js`
- `frontendv3.0/kairosmix-front/src/services/mixService.js`

---

## ▶️ Ejecución

### Opción 1: Ejecutar Backend y Frontend por Separado

#### Terminal 1 - Backend:
```bash
cd backendv3.0/kairosmix-back
npm run dev
```

Deberías ver:
```
🚀 Server running on port 3000
✅ [Singleton] Conexión a MongoDB establecida.
```

#### Terminal 2 - Frontend:
```bash
cd frontendv3.0/kairosmix-front
npm run dev
```

Deberías ver:
```
  VITE v7.2.6  ready in 181 ms
  
  ➜  Local:   http://localhost:5173/
```

### Opción 2: Script Combinado (Recomendado)

Puedes crear un script para ejecutar ambos simultáneamente usando `concurrently`:

```bash
# Desde la raíz del proyecto
npm install -g concurrently

# Crear package.json en la raíz si no existe
npm init -y

# Agregar script
npm pkg set scripts.dev="concurrently \"cd backendv3.0/kairosmix-back && npm run dev\" \"cd frontendv3.0/kairosmix-front && npm run dev\""

# Ejecutar
npm run dev
```

### Acceder a la Aplicación

- **Frontend (Cliente)**: http://localhost:5173/
- **Frontend (Admin)**: http://localhost:5173/admin
- **Backend API**: http://localhost:3000/api

---

## 🔄 Flujo de la Aplicación

### 1️⃣ Flujo del Cliente

```mermaid
graph TD
    A[Inicio] --> B[Login/Registro]
    B --> C[Catálogo de Productos]
    C --> D{Acción}
    D -->|Agregar a Mezcla| E[Panel de Mezcla]
    E --> F{Guardar o Pedir}
    F -->|Guardar| G[Mezclas Guardadas]
    F -->|Crear Pedido| H[Confirmación de Pedido]
    H --> I[Pedido Creado]
    G --> J[Cargar Mezcla]
    J --> E
```

#### Pasos Detallados:

1. **Autenticación**
   - El cliente inicia sesión con cédula y contraseña
   - El sistema valida credenciales y genera un token JWT

2. **Explorar Catálogo**
   - Visualiza productos disponibles con precios por libra
   - Puede buscar por nombre o categoría
   - Ve información nutricional de cada producto

3. **Crear Mezcla**
   - Selecciona productos del catálogo
   - Especifica cantidad en libras para cada producto (mínimo 0.1 lb)
   - Ve el precio total calculado en tiempo real
   - Puede ajustar cantidades o eliminar productos

4. **Guardar Mezcla** (Opcional)
   - Asigna un nombre a la mezcla
   - La mezcla se guarda con el precio actual
   - Puede reutilizarla en futuros pedidos

5. **Crear Pedido**
   - Confirma la mezcla actual
   - El sistema calcula el precio total usando `pricePerPound`
   - Se crea el pedido con estado "pendiente"
   - El precio queda congelado al momento de la compra

6. **Seguimiento**
   - Puede ver sus pedidos anteriores
   - Estados: Pendiente → Pagado → Despachado → Completado

### 2️⃣ Flujo del Administrador

```mermaid
graph TD
    A[Login Admin] --> B[Dashboard]
    B --> C{Gestión}
    C -->|Productos| D[CRUD Productos]
    C -->|Clientes| E[CRUD Clientes]
    C -->|Pedidos| F[Gestión Pedidos]
    C -->|Mezclas| G[Ver Mezclas]
    D --> H[Actualizar Stock]
    F --> I[Cambiar Estado]
```

#### Pasos Detallados:

1. **Autenticación Admin**
   - Login con credenciales de administrador
   - Acceso a `/admin`

2. **Gestión de Productos**
   - **Crear**: Agregar nuevos productos con:
     - Código único
     - Nombre y descripción
     - Categoría
     - Precios (retail y por libra)
     - Stock actual y mínimo
     - Información nutricional
   - **Editar**: Actualizar información y precios
   - **Eliminar**: Desactivar productos
   - **Buscar**: Filtrar por nombre, código o categoría

3. **Gestión de Clientes**
   - **Crear**: Registrar nuevos clientes
   - **Editar**: Actualizar datos (nombre, correo, teléfono, dirección)
   - **Desactivar**: Dar de baja clientes
   - **Buscar**: Filtrar por cédula, nombre, correo o teléfono

4. **Gestión de Pedidos**
   - Ver todos los pedidos del sistema
   - Filtrar por estado y fecha
   - Actualizar estado de pedidos:
     - Pendiente → Pagado (confirmar pago)
     - Pagado → Despachado (enviar pedido)
     - Despachado → Completado (entregado)
   - Ver detalles completos de cada pedido

5. **Gestión de Mezclas**
   - Ver mezclas guardadas por clientes
   - Analizar preferencias de productos
   - Eliminar mezclas obsoletas

---

## 📁 Estructura del Proyecto

```
KairozMixV3.0/
│
├── backendv3.0/
│   └── kairosmix-back/
│       ├── src/
│       │   ├── controller/          # Controladores de rutas
│       │   │   ├── clientController.ts
│       │   │   ├── MixController.ts
│       │   │   ├── OrderController.ts
│       │   │   └── productController.ts
│       │   ├── models/              # Modelos de Mongoose
│       │   │   ├── Client.ts
│       │   │   ├── CustomMix.ts
│       │   │   ├── Order.ts
│       │   │   └── Product.ts
│       │   ├── repositories/        # Capa de acceso a datos
│       │   │   ├── ClientRepository.ts
│       │   │   ├── MixRepository.ts
│       │   │   ├── OrderRepository.ts
│       │   │   └── ProductRepository.ts
│       │   ├── routes/              # Definición de rutas
│       │   │   ├── clientRoutes.ts
│       │   │   ├── mixRoutes.ts
│       │   │   ├── orderRoutes.ts
│       │   │   └── productRoutes.ts
│       │   ├── middleware/          # Middlewares
│       │   │   └── authMiddleware.ts
│       │   ├── factories/           # Factory pattern
│       │   │   └── RepositoryFactory.ts
│       │   ├── config/              # Configuraciones
│       │   │   └── db.ts
│       │   └── index.ts             # Punto de entrada
│       ├── .env                     # Variables de entorno
│       ├── package.json
│       └── tsconfig.json
│
└── frontendv3.0/
    └── kairosmix-front/
        ├── src/
        │   ├── components/
        │   │   ├── admin/           # Componentes admin
        │   │   │   ├── AdminSearch.jsx
        │   │   │   └── AdminTable.jsx
        │   │   ├── auth/            # Autenticación
        │   │   │   ├── Login.jsx
        │   │   │   └── ClientRegister.jsx
        │   │   ├── catalogo/        # Catálogo cliente
        │   │   │   ├── CatalogPage.jsx
        │   │   │   ├── ProductCard.jsx
        │   │   │   ├── MixPanel.jsx
        │   │   │   └── CreateOrderModal.jsx
        │   │   ├── clientes/        # Gestión clientes
        │   │   │   ├── ClientModal.jsx
        │   │   │   └── ClientForm.jsx
        │   │   └── productos/       # Gestión productos
        │   │       ├── ProductModal.jsx
        │   │       └── ProductForm.jsx
        │   ├── pages/               # Páginas principales
        │   │   ├── ClientsPage.jsx
        │   │   ├── OrdersPage.jsx
        │   │   └── ProductsPage.jsx
        │   ├── services/            # Servicios API
        │   │   ├── clientService.js
        │   │   ├── mixService.js
        │   │   ├── orderService.js
        │   │   └── productService.js
        │   ├── App.jsx              # Componente principal
        │   ├── index.css            # Estilos globales
        │   └── main.jsx             # Punto de entrada
        ├── index.html
        ├── vercel.json              # Configuración Vercel
        ├── package.json
        ├── tailwind.config.js
        └── vite.config.js
```

---

## 🔌 API Endpoints

### Autenticación

```http
POST /api/clients/login
Body: { cedula: string, password: string }
Response: { token: string, client: {...} }
```

### Productos

```http
GET    /api/products              # Obtener todos los productos
GET    /api/products/:id          # Obtener producto por ID
POST   /api/products              # Crear producto (admin)
PUT    /api/products/:id          # Actualizar producto (admin)
DELETE /api/products/:id          # Eliminar producto (admin)
```

### Clientes

```http
GET    /api/clients               # Obtener todos los clientes (admin)
GET    /api/clients/:id           # Obtener cliente por ID
POST   /api/clients               # Crear cliente
PUT    /api/clients/:id           # Actualizar cliente
PATCH  /api/clients/:id/deactivate # Desactivar cliente
```

### Mezclas

```http
GET    /api/mixes                 # Obtener mezclas del usuario
GET    /api/mixes/:id             # Obtener mezcla por ID
POST   /api/mixes                 # Crear mezcla
DELETE /api/mixes/:id             # Eliminar mezcla
```

### Pedidos

```http
GET    /api/orders                # Obtener pedidos del usuario
GET    /api/orders/:id            # Obtener pedido por ID
POST   /api/orders                # Crear pedido
PATCH  /api/orders/:id/status     # Actualizar estado (admin)
DELETE /api/orders/:id            # Cancelar pedido
```

**Formato de creación de pedido:**
```json
{
  "items": [
    {
      "productId": "abc123",
      "quantity": 0.5,
      "unit": "lbs"  // Para mezclas por libras
    },
    {
      "mixId": "xyz789",
      "quantity": 1  // Para mezclas guardadas
    }
  ]
}
```

---

## 🌐 Despliegue

### Frontend (Vercel)

1. **Preparar el proyecto:**
   ```bash
   cd frontendv3.0/kairosmix-front
   npm run build
   ```

2. **Desplegar en Vercel:**
   - Conecta tu repositorio en [Vercel](https://vercel.com)
   - Configura el directorio raíz: `frontendv3.0/kairosmix-front`
   - El archivo `vercel.json` ya está configurado para SPA routing

3. **Variables de entorno:**
   - Actualiza las URLs de API en los servicios para apuntar a tu backend en producción

### Backend (Railway/Render/Heroku)

1. **Preparar el proyecto:**
   ```bash
   cd backendv3.0/kairosmix-back
   npm run build  # Si tienes script de build
   ```

2. **Configurar variables de entorno:**
   - `MONGO_URI`: Tu string de conexión de MongoDB Atlas
   - `JWT_SECRET`: Clave secreta para JWT
   - `PORT`: Puerto (usualmente lo asigna el servicio)

3. **Desplegar:**
   - Sigue las instrucciones de tu plataforma elegida
   - Asegúrate de que el comando de inicio sea `npm run dev` o `npm start`

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo: `mongod --version`
- Revisa la URI en el archivo `.env`
- Si usas MongoDB Atlas, verifica que tu IP esté en la whitelist

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env`: `PORT=3001`
- O mata el proceso: `lsof -ti:3000 | xargs kill`

### Error: "Module not found"
- Reinstala dependencias: `rm -rf node_modules package-lock.json && npm install`

### Frontend no se conecta al Backend
- Verifica que el backend esté corriendo en el puerto correcto
- Revisa las URLs en los archivos de servicios
- Verifica CORS en el backend

---

## 📝 Notas Importantes

### Sistema de Precios
- **Productos individuales**: Usan `retailPrice` (precio de bolsa completa)
- **Mezclas por libras**: Usan `pricePerPound` (precio por libra)
- El sistema detecta automáticamente el tipo basándose en el campo `unit`

### Seguridad
- Las contraseñas se encriptan con bcrypt
- Los tokens JWT expiran después de cierto tiempo
- La cédula no puede modificarse después de crear un cliente

### Responsive Design
- Optimizado para dispositivos móviles (320px+)
- Tablets (768px+)
- Desktop (1024px+)

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---



**¡Gracias por usar KairosMix! 🥜✨**

## Fecha de actualización:
9 de febrero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche
