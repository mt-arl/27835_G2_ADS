# Línea Base - Requisitos

Carpeta que contiene la especificación completa de requisitos del sistema KairosMix.

## Proyecto KairosMix
Sistema de gestión empresarial para la administración de productos y clientes.

## Contenido principal:
- Documento SRS (Especificación de Requisitos de Software)
- Historias de Usuario
- Casos de Uso Extendidos
- Backlog del Producto

## Requisitos Funcionales:

### RF-001: Gestión de Productos
- **RF-001.1**: El sistema debe permitir registrar nuevos productos con código único, nombre, precios y stock
- **RF-001.2**: El sistema debe permitir consultar la lista de todos los productos activos
- **RF-001.3**: El sistema debe permitir actualizar información de productos existentes
- **RF-001.4**: El sistema debe permitir eliminar productos de forma lógica (soft delete)
- **RF-001.5**: El sistema debe permitir búsqueda de productos por código o nombre
- **RF-001.6**: El sistema debe almacenar tres tipos de precios: por libra, mayorista y minorista
- **RF-001.7**: El sistema debe mantener registro de stock inicial y actual
- **RF-001.8**: El sistema debe permitir asociar imagen al producto

### RF-002: Gestión de Clientes
- **RF-002.1**: El sistema debe permitir registrar nuevos clientes con cédula única
- **RF-002.2**: El sistema debe validar que no existan clientes duplicados por cédula
- **RF-002.3**: El sistema debe permitir consultar la lista de todos los clientes activos
- **RF-002.4**: El sistema debe permitir actualizar datos de clientes existentes
- **RF-002.5**: El sistema debe permitir eliminar clientes de forma lógica (soft delete)
- **RF-002.6**: El sistema debe almacenar: cédula, nombre, correo, teléfono y dirección
- **RF-002.7**: El sistema debe permitir búsqueda de clientes por cédula o nombre

### RF-003: Interfaz de Usuario
- **RF-003.1**: El sistema debe proporcionar una interfaz web responsive
- **RF-003.2**: El sistema debe incluir menú de navegación lateral
- **RF-003.3**: El sistema debe mostrar datos en tablas con opciones de búsqueda
- **RF-003.4**: El sistema debe usar modales para creación y edición de registros
- **RF-003.5**: El sistema debe mostrar notificaciones de operaciones exitosas/fallidas

## Requisitos No Funcionales:

### RNF-001: Rendimiento
- El sistema debe responder a peticiones en menos de 2 segundos
- El sistema debe soportar al menos 100 usuarios concurrentes

### RNF-002: Seguridad
- El sistema debe implementar CORS para controlar acceso desde frontend
- El sistema debe validar datos en backend antes de almacenar
- Las contraseñas y datos sensibles deben almacenarse de forma segura

### RNF-003: Escalabilidad
- La arquitectura debe permitir agregar nuevos módulos sin afectar existentes
- El sistema debe usar patrones de diseño para facilitar mantenimiento
- El código debe estar tipado (TypeScript) para reducir errores

### RNF-004: Disponibilidad
- El sistema debe estar disponible 99% del tiempo
- El sistema debe manejar errores de conexión a BD de forma elegante

### RNF-005: Mantenibilidad
- El código debe seguir principios SOLID
- El código debe estar documentado
- Se deben implementar patrones de diseño reconocidos

### RNF-006: Usabilidad
- La interfaz debe ser intuitiva y fácil de usar
- Los formularios deben incluir validaciones en tiempo real
- Los mensajes de error deben ser claros y descriptivos

### RNF-007: Compatibilidad
- El frontend debe funcionar en navegadores modernos (Chrome, Firefox, Edge)
- El sistema debe ser responsive para dispositivos móviles

## Restricciones Técnicas:
- Backend desarrollado en Node.js con TypeScript
- Frontend desarrollado en React 19
- Base de datos MongoDB
- API REST para comunicación cliente-servidor
- Uso obligatorio de patrones: Singleton, Factory, Repository

## Actores del Sistema:
1. **Administrador**: Usuario con acceso completo a gestión de productos y clientes
2. **Sistema**: Entidad que gestiona la persistencia y validación de datos

## Fecha de inicio:
08 de enero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche