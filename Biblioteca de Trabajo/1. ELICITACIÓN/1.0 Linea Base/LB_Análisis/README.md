# Línea Base - Análisis

Esta carpeta contiene los documentos y diagramas relacionados con la fase de análisis del proyecto KairosMix.

## Proyecto KairosMix
Sistema de gestión empresarial para administración de productos y clientes con arquitectura MERN Stack.

## Contenido principal:
- Diagramas de casos de uso
- Diagramas de actividades
- Análisis de requisitos funcionales y no funcionales
- Documentación de procesos de negocio
- Modelado de datos (Entidades: Client, Product)

## Módulos del Sistema:

### 1. Módulo de Clientes
- Gestión CRUD de clientes
- Atributos: cédula, nombre, correo, teléfono, dirección
- Validación de unicidad por cédula
- Soft delete (isActive)

### 2. Módulo de Productos
- Gestión CRUD de productos
- Atributos: código, nombre, precios (por libra, mayorista, minorista)
- Control de inventario (stock inicial y actual)
- Gestión de país de origen e imágenes
- Soft delete (isActive)

## Arquitectura del Sistema:
- **Patrón Repository**: Abstracción de acceso a datos
- **Patrón Factory**: Creación de repositorios
- **Patrón Singleton**: Gestión de conexión a BD

## Fecha de inicio:
08 de enero de 2026

## Responsables:
Matías Lugmaña, Camilo Orrico, Denise Rea, Julio Viche