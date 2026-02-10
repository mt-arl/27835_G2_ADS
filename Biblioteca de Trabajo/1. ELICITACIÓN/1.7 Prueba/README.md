# Plan de Pruebas - KairosMix V3

**Proyecto:** KairosMix
**Version:** 3.0
**Fecha:** 03/02/2026
**Equipo QA:** Denise Rea, Julio Viche, Camilo Orrico
**Lider del Proyecto:** Matias Lugmana

---

## Estructura de Carpetas

```
1.7 Prueba/
├── 1_PruebasUnitarias/         # Pruebas unitarias con Jest
├── 2_PruebasIntegracion/       # Pruebas de integracion con Supertest
├── 3_PruebasCargaEstres/       # Pruebas de carga con Artillery/k6
├── 4_PruebasE2E_Playwright/    # Pruebas E2E automatizadas
├── 5_PruebasOtras/             # Pruebas de seguridad y adicionales
└── README.md                   # Este archivo
```

---

## 1. Pruebas Unitarias (Jest)

**Ubicacion:** `1_PruebasUnitarias/`

### Archivos de prueba:
- `ProductController.test.js` - TC-PROD-001 a TC-PROD-008
- `ClientController.test.js` - TC-CLIE-001 a TC-CLIE-008
- `OrderController.test.js` - TC-ORD-001 a TC-ORD-012, TC-STAT-001 a TC-STAT-008
- `MixController.test.js` - TC-MIX-001 a TC-MIX-010, TC-NUT-001 a TC-NUT-003
- `RepositoryFactory.test.js` - Pruebas de patron Factory y RNF

### Ejecucion:
```bash
cd 1_PruebasUnitarias
npm install
npm test
```

### Cobertura:
```bash
npm run test:coverage
```

---

## 2. Pruebas de Integracion (Supertest)

**Ubicacion:** `2_PruebasIntegracion/`

### Archivos de prueba:
- `api.products.test.js` - Integracion API de productos
- `api.clients.test.js` - Integracion API de clientes
- `api.orders.test.js` - Integracion API de pedidos y mezclas

### Prerequisitos:
- Backend corriendo en `http://localhost:3000`

### Ejecucion:
```bash
cd 2_PruebasIntegracion
npm install
npm test
```

---

## 3. Pruebas de Carga y Estres (Artillery/k6)

**Ubicacion:** `3_PruebasCargaEstres/`

### Archivos:
- `artillery-smoke.yml` - Pruebas de humo (verificacion rapida)
- `artillery-load.yml` - Pruebas de carga normal
- `artillery-stress.yml` - Pruebas de estres
- `k6-load-test.js` - Pruebas de carga con k6
- `k6-stress-test.js` - Pruebas de estres con k6

### Ejecucion con Artillery:
```bash
cd 3_PruebasCargaEstres
npm install

# Smoke test
npm run test:smoke

# Load test
npm run test:load

# Stress test
npm run test:stress
```

### Ejecucion con k6:
```bash
# Instalar k6: https://k6.io/docs/getting-started/installation/
k6 run k6-load-test.js
k6 run k6-stress-test.js
```

### Metricas validadas:
- RNF-01: Tiempo de respuesta < 1s para consultas (95%)
- RNF-01: Tiempo de respuesta < 2s para registros (90%)
- TC-REP-006: Reporte con 10,000 registros < 7s

---

## 4. Pruebas E2E con Playwright

**Ubicacion:** `4_PruebasE2E_Playwright/`

### Archivos de prueba:
- `tests/auth.spec.js` - Autenticacion y registro de clientes
- `tests/admin-products.spec.js` - Administracion de productos
- `tests/catalog.spec.js` - Catalogo y mezclas

### Prerequisitos:
- Frontend corriendo en `http://localhost:5173`
- Backend corriendo en `http://localhost:3000`

### Ejecucion:
```bash
cd 4_PruebasE2E_Playwright
npm install
npx playwright install

# Ejecutar todas las pruebas
npm test

# Modo visual (headed)
npm run test:headed

# Modo debug
npm run test:debug

# Solo Chrome
npm run test:chrome

# Ver reporte
npm run report
```

### Navegadores soportados:
- Chromium (Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

---

## 5. Otras Pruebas

**Ubicacion:** `5_PruebasOtras/`

### Archivos:
- `pruebas-seguridad.js` - Pruebas de seguridad basicas (SQL Injection, XSS)

### Ejecucion:
```bash
cd 5_PruebasOtras
node pruebas-seguridad.js
```

---

## Matriz de Trazabilidad

| Modulo | Casos de Prueba | Archivo |
|--------|-----------------|---------|
| Productos | TC-PROD-001 a TC-PROD-008 | ProductController.test.js |
| Clientes | TC-CLIE-001 a TC-CLIE-008 | ClientController.test.js |
| Pedidos | TC-ORD-001 a TC-ORD-012 | OrderController.test.js |
| Estados | TC-STAT-001 a TC-STAT-008 | OrderController.test.js |
| Reportes | TC-REP-001 a TC-REP-008 | OrderController.test.js |
| Inventario | TC-INV-001 a TC-INV-006 | RepositoryFactory.test.js |
| Mezclas | TC-MIX-001 a TC-MIX-010 | MixController.test.js |
| Nutricion | TC-NUT-001 a TC-NUT-003 | MixController.test.js |
| No Funcionales | TC-NF-001 a TC-NF-010 | RepositoryFactory.test.js |

---

## Requisitos del Ambiente

### Backend:
- Node.js v22+
- MongoDB
- Puerto: 3000

### Frontend:
- Node.js v22+
- Vite
- Puerto: 5173

### Variables de entorno sugeridas:
```env
API_URL=http://localhost:3000/api
FRONTEND_URL=http://localhost:5173
DB_TYPE=MONGO
```

---

## Resultados Esperados

Segun el Plan de Pruebas V3:
- **Cobertura Funcional:** 100% de casos criticos
- **Defectos Criticos:** 0 abiertos
- **Tiempo de Respuesta:** < 1s (95% consultas)
- **Disponibilidad:** 98% en horario de operacion

---

## Contacto

Para dudas o reportes de defectos:
- **Email del equipo QA:** qa@kairosmix.com
- **Repositorio:** GitHub del proyecto
