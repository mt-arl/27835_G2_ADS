# Plan de Implementación: Sistema de Autenticación para Clientes

Sistema de registro, login y catálogo de productos para clientes de KairosMix, utilizando los endpoints existentes del backend.

---

## Endpoints del Backend

| Función  | Método | URL                                    | Campos                                                |
| -------- | ------ | -------------------------------------- | ----------------------------------------------------- |
| Registro | POST   | `http://localhost:3000/api/clients`    | cedula, nombre, correo, telefono, direccion, password |
| Login    | POST   | `http://localhost:3000/api/auth/login` | correo, password                                      |

---

## Propuesta de Cambios

### Servicios

#### [NEW] authService.js

Servicio de autenticación para clientes:
- `registerClient(clientData)` - Registrar nuevo cliente
- `loginClient(credentials)` - Iniciar sesión de cliente
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar si hay sesión activa
- `getCurrentUser()` - Obtener datos del usuario actual

---

### Componentes de Autenticación

#### [NEW] ClientLogin.jsx

Login para clientes con:
- Campos: correo y password
- Validación de formulario
- Enlace a registro para nuevos usuarios
- Diseño moderno consistente con el branding de KairosMix

> **CAMBIO TEMPORAL:** Se removió temporalmente la validación de mínimo 6 caracteres en la contraseña del login para pruebas. Restaurar antes de producción.

#### [NEW] ClientRegister.jsx

Formulario de registro con:
- Campos: cédula, nombre, correo, teléfono, dirección, password
- Confirmación de password
- Validación de todos los campos
- Enlace a login para usuarios existentes

---

### Vista de Catálogo (Cliente)

#### [NEW] ProductCard.jsx

Tarjeta de producto para el catálogo con:
- Imagen del producto (o placeholder)
- Nombre y descripción
- Precio
- Botón para agregar a la mezcla

#### [NEW] CatalogPage.jsx

Página principal del cliente con:
- Header con logo, nombre de usuario y botón logout
- Grid de productos disponibles (usando ProductCard)
- Barra lateral o carrito con productos seleccionados para la mezcla
- Búsqueda/filtro de productos

---

### App Principal

#### [MODIFY] App.jsx

Actualizar con:
- Estado de autenticación del cliente
- Renderizado condicional: Login/Register vs Catálogo
- Paso de funciones de navegación entre vistas

---

## Flujo de Usuario

```
Usuario visita la app
        |
        v
  ¿Tiene cuenta?
     /      \
   No        Sí
    |         |
    v         v
 Registro   Login
    |         |
    v         v
 Completa   Ingresa
formulario  credenciales
    |         |
    v         |
 Registro     |
 exitoso -----+
              |
              v
         ¿Válido?
          /    \
        No      Sí
         |       |
         v       v
      Error   Catálogo
         |    de Productos
         |       |
         v       v
       Login  Seleccionar
              productos
                 |
                 v
            Crear mezcla
```

---

## Plan de Verificación

### Pruebas Manuales en Navegador

1. **Probar Registro**
   - Ejecutar `npm run dev` en el directorio del frontend
   - Abrir `http://localhost:5173` en el navegador
   - Completar el formulario de registro con datos de prueba
   - Verificar que el registro sea exitoso y redirija a login

2. **Probar Login**
   - Ingresar con las credenciales del usuario recién creado
   - Verificar que el login redirija al catálogo

3. **Probar Catálogo**
   - Verificar que se muestren los productos disponibles
   - Verificar que se puedan seleccionar productos
   - Verificar el botón de logout

> **IMPORTANTE:** El backend debe estar corriendo en `http://localhost:3000` para que las pruebas funcionen.

---

## Diseño Visual

El diseño seguirá el estilo establecido en el login de admin:
- Colores: Emerald (verde) como primario, Slate para neutros
- Gradientes y sombras para efecto de profundidad
- Animaciones sutiles para interactividad
- Tipografía Inter
- Bordes redondeados (rounded-xl, rounded-2xl)
