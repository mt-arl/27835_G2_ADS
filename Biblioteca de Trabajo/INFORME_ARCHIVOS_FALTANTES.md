# Informe de Archivos Faltantes - Biblioteca de Trabajo KairosMix

**Fecha de Análisis:** 20 de enero de 2026  
**Proyecto:** KairosMix - Sistema de Gestión Empresarial  
**Analista:** Ingeniero de Análisis y Diseño de Software  
**Código del Proyecto:** 27835_G2_ADS

---

## Resumen Ejecutivo

Este informe documenta los artefactos faltantes en la Biblioteca de Trabajo del proyecto KairosMix, identificando las carpetas que carecen de documentación completa y sugiriendo los documentos que deberían crearse para mantener la integridad del repositorio del proyecto.

### Estado General
- **Total de Carpetas Analizadas:** 21
- **Carpetas con Documentación Completa:** 13
- **Carpetas con Documentación Parcial:** 3
- **Carpetas Vacías o Sin Documentación:** 5

---

## Archivos Faltantes Críticos

### 1. ELICITACIÓN

#### 1.7 Prueba (Primera Carpeta)
**Estado:** Vacía (solo contiene .gitkeep)  
**Documentos Faltantes:**
- Plan de Pruebas del Sistema
- Casos de Prueba Funcionales
- Casos de Prueba No Funcionales
- Matriz de Trazabilidad de Pruebas
- Resultados de Ejecución de Pruebas
- Informe de Cobertura de Pruebas

**Prioridad:** ALTA  
**Impacto:** Sin documentación de pruebas no hay evidencia de validación y verificación del sistema.

**Sugerencia de Nomenclatura:**
- `G2_Plan_de_Pruebas_V1.0.pdf`
- `G2_Casos_de_Prueba_Funcionales_V1.0.xlsx`
- `G2_Casos_de_Prueba_No_Funcionales_V1.0.xlsx`
- `G2_Matriz_Trazabilidad_Pruebas_V1.0.xlsx`
- `G2_Resultados_Ejecucion_Pruebas_V1.0.pdf`
- `G2_Informe_Cobertura_V1.0.pdf`

---

#### 1.7 Reporte de Errores
**Estado:** Contiene README pero sin documentos  
**Documentos Faltantes:**
- Registro de Defectos y Errores
- Matriz de Seguimiento de Bugs
- Reportes de Errores Críticos
- Análisis de Causa Raíz

**Prioridad:** MEDIA  
**Impacto:** Dificulta el seguimiento y resolución sistemática de errores.

**Sugerencia de Nomenclatura:**
- `G2_Registro_Defectos_V1.0.xlsx`
- `G2_Matriz_Seguimiento_Bugs_V1.0.xlsx`
- `G2_Reporte_Errores_Criticos_V1.0.pdf`
- `G2_Analisis_Causa_Raiz_V1.0.pdf`

---

#### 1.8 Prueba (Segunda Carpeta)
**Estado:** Contiene README pero sin documentos  
**Documentos Faltantes:**
- Pruebas de Integración
- Pruebas de Aceptación de Usuario (UAT)
- Pruebas de Regresión
- Pruebas de Rendimiento
- Pruebas de Seguridad

**Prioridad:** ALTA  
**Impacto:** Falta documentación de pruebas especializadas y de aceptación.

**Sugerencia de Nomenclatura:**
- `G2_Pruebas_Integracion_V1.0.pdf`
- `G2_Pruebas_Aceptacion_UAT_V1.0.xlsx`
- `G2_Pruebas_Regresion_V1.0.pdf`
- `G2_Pruebas_Rendimiento_V1.0.pdf`
- `G2_Pruebas_Seguridad_V1.0.pdf`

---

### 2. DISEÑOS

#### 3.1.3 Casos de Uso Extendido (DISEÑOS)
**Estado:** Vacía (README indica referencia a ELICITACIÓN)  
**Documentos Faltantes:**
- Diagramas UML de Casos de Uso
- Especificación Visual de Interacciones

**Prioridad:** BAJA  
**Impacto:** Los casos de uso ya están documentados en la sección de ELICITACIÓN. Esta carpeta es redundante.

**Recomendación:** Considerar eliminar esta carpeta o crear enlaces simbólicos a la documentación en ELICITACIÓN.

---

## Archivos Faltantes Opcionales pero Recomendados

### 1. ELICITACIÓN / 1.0 Línea Base

#### LB_Diseño
**Documentos Presentes:** README únicamente  
**Documentos Recomendados:**
- Versiones específicas de diagramas aprobados
- Documentación de cambios en diseño
- Capturas de decisiones de diseño críticas

**Sugerencia de Nomenclatura:**
- `LB_Diagramas_Casos_Uso_V1.0.pdf`
- `LB_Diagramas_Secuencia_V1.0.pdf`
- `LB_Diagramas_Actividades_V1.0.pdf`
- `LB_Log_Cambios_Diseno_V1.0.xlsx`

---

### 2. PERFIL PROYECTO

**Documentos Presentes:** 
- `G2_Perfil-Proyecto.pdf`

**Documentos Recomendados Adicionales:**
- Charter del Proyecto
- Matriz de Stakeholders
- Análisis de Riesgos
- Plan de Comunicaciones
- Plan de Gestión de Calidad

**Sugerencia de Nomenclatura:**
- `G2_Charter_Proyecto_V1.0.pdf`
- `G2_Matriz_Stakeholders_V1.0.xlsx`
- `G2_Analisis_Riesgos_V1.0.pdf`
- `G2_Plan_Comunicaciones_V1.0.pdf`
- `G2_Plan_Gestion_Calidad_V1.0.pdf`

---

## Análisis por Categoría

### Documentación de Requisitos
**Estado:** COMPLETA (95%)
- Especificación RS: ✅
- Historias de Usuario: ✅
- Casos de Uso Extendido: ✅
- Backlog: ✅ (2 versiones)
- Matriz IREB: ⚠️ No encontrada (puede estar en otras bibliotecas)

### Documentación de Diseño
**Estado:** COMPLETA (100%)
- Patrones de Diseño: ✅
- Arquitectura: ✅ (2 versiones)
- Diagrama de Clases: ✅ (3 versiones)
- Diagrama de Componentes: ✅ (Backend y Frontend)

### Documentación de Gestión
**Estado:** PARCIAL (70%)
- Perfil Proyecto: ✅
- Cronograma: ✅
- Actas de Reunión: ✅ (1 acta)
- Actas Adicionales: ❌ Solo 1 acta presente

### Documentación de Pruebas
**Estado:** CRÍTICO (0%)
- Plan de Pruebas: ❌
- Casos de Prueba: ❌
- Resultados de Pruebas: ❌
- Reporte de Errores: ❌

### Líneas Base
**Estado:** COMPLETA (90%)
- LB_Análisis: ✅
- LB_Código: ✅ (2 versiones)
- LB_Requisitos: ✅
- LB_Diseño: ⚠️ Solo README

---

## Recomendaciones Prioritarias

### Prioridad 1 - CRÍTICA (Acción Inmediata)
1. **Crear documentación de pruebas completa** en carpeta `1.7 Prueba`
2. **Desarrollar plan de pruebas** con casos de prueba funcionales y no funcionales
3. **Implementar sistema de reporte de errores** con matriz de seguimiento

### Prioridad 2 - ALTA (Corto Plazo)
4. **Documentar pruebas especializadas** en carpeta `1.8 Prueba`
5. **Crear actas de reunión adicionales** para mantener registro histórico
6. **Añadir documentos de gestión** al Perfil del Proyecto

### Prioridad 3 - MEDIA (Mediano Plazo)
7. **Completar LB_Diseño** con versiones aprobadas de diagramas
8. **Crear matriz IREB** si no existe en biblioteca maestra
9. **Documentar lecciones aprendidas** del proyecto

### Prioridad 4 - BAJA (Mejora Continua)
10. **Consolidar carpetas duplicadas** (1.7 Prueba y 1.8 Prueba)
11. **Resolver redundancia** en casos de uso extendido
12. **Añadir documentación de despliegue** y operaciones

---

## Métricas de Completitud

| Categoría | Completitud | Crítico | Alto | Medio | Bajo |
|-----------|-------------|---------|------|-------|------|
| Requisitos | 95% | 0 | 0 | 1 | 0 |
| Diseño | 100% | 0 | 0 | 0 | 1 |
| Gestión | 70% | 0 | 1 | 1 | 1 |
| Pruebas | 0% | 3 | 0 | 0 | 0 |
| Líneas Base | 90% | 0 | 0 | 1 | 0 |
| **TOTAL** | **71%** | **3** | **1** | **3** | **2** |

---

## Plan de Acción Sugerido

### Semana 1-2 (20 Ene - 02 Feb 2026)
- [ ] Crear Plan de Pruebas del Sistema
- [ ] Desarrollar Casos de Prueba Funcionales para módulos Cliente y Producto
- [ ] Establecer Plantilla de Reporte de Errores
- [ ] Iniciar Matriz de Seguimiento de Bugs

### Semana 3-4 (03 Feb - 16 Feb 2026)
- [ ] Ejecutar Casos de Prueba y documentar resultados
- [ ] Crear Casos de Prueba No Funcionales (Seguridad, Rendimiento)
- [ ] Documentar Pruebas de Integración Backend-Frontend
- [ ] Generar Informe de Cobertura de Pruebas

### Semana 5-6 (17 Feb - 02 Mar 2026)
- [ ] Realizar Pruebas de Aceptación de Usuario (UAT)
- [ ] Completar documentación de LB_Diseño
- [ ] Crear documentos adicionales de gestión del proyecto
- [ ] Consolidar lecciones aprendidas

---

## Notas Adicionales

### Observaciones Positivas
1. ✅ Excelente versionamiento en documentos existentes (V1.0, V2.0)
2. ✅ Estructura de carpetas bien organizada y consistente
3. ✅ README completos con tablas de versionamiento estándar
4. ✅ Código fuente bien organizado en dos versiones (V1.0 y V2.0)
5. ✅ Documentación de diseño muy completa con múltiples iteraciones

### Áreas de Mejora Identificadas
1. ⚠️ Falta crítica de documentación de pruebas y QA
2. ⚠️ Solo 1 acta de reunión (debería haber más en proyectos activos)
3. ⚠️ Carpetas duplicadas que generan confusión (1.7 Prueba y 1.8 Prueba)
4. ⚠️ Carpeta redundante de Casos de Uso en DISEÑOS
5. ⚠️ Falta documentación de despliegue y operaciones

### Riesgos Identificados
- **Alto:** Sin documentación de pruebas no hay evidencia de calidad del sistema
- **Medio:** Falta de actas puede indicar problemas de comunicación del equipo
- **Bajo:** Estructura duplicada puede causar confusión en el futuro

---

## Responsables Sugeridos

| Área Faltante | Responsable Sugerido | Fecha Objetivo |
|---------------|---------------------|----------------|
| Plan de Pruebas | Denise Rea | 27/01/2026 |
| Casos de Prueba | Matías Lugmaña | 03/02/2026 |
| Reporte de Errores | Camilo Orrico | 27/01/2026 |
| Pruebas Especializadas | Julio Viche | 10/02/2026 |
| Documentación Gestión | Todo el equipo | 17/02/2026 |

---

## Conclusiones

La Biblioteca de Trabajo del proyecto KairosMix presenta una **base sólida de documentación** en las áreas de requisitos y diseño (95-100% de completitud), sin embargo, existe una **deficiencia crítica en la documentación de pruebas y QA** (0% de completitud).

Para mantener la integridad del proyecto y asegurar la calidad del sistema, es **imperativo priorizar la creación de documentación de pruebas** en las próximas 2 semanas.

La estructura general es excelente y demuestra buenas prácticas de ingeniería de software, requiriendo principalmente la completitud de los artefactos de validación y verificación.

---

**Elaborado por:** Ingeniero de Análisis y Diseño de Software  
**Fecha:** 20 de enero de 2026  
**Versión del Informe:** 1.0  
**Próxima Revisión:** 03 de febrero de 2026
