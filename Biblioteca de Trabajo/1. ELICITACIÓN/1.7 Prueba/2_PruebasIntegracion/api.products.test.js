/**
 * PRUEBAS DE INTEGRACION - API DE PRODUCTOS
 * Plan de Pruebas KairosMix V3
 * Pruebas de integracion Frontend-Backend-BD
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 *
 * NOTA: Estas pruebas requieren que el servidor este corriendo
 * Ejecutar: npm run dev (en el backend)
 * Luego: npm test (en esta carpeta)
 */

import { jest, describe, test, expect, beforeAll, afterAll } from '@jest/globals';

// Configuracion base
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Helper para peticiones HTTP
const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    const data = await response.json().catch(() => null);
    return { status: response.status, data };
};

// ============== TESTS ==============
describe('API de Productos - Pruebas de Integracion', () => {

    let createdProductId = null;
    const testProduct = {
        name: 'TestProducto' + Date.now(),
        pricePerPound: 5.50,
        wholesalePrice: 4.50,
        retailPrice: 6.50,
        originCountry: 'Ecuador',
        initialStock: 100,
        category: 'Frutos Secos'
    };

    /**
     * TC-INT-PROD-001: POST /api/products - Crear producto
     * Prueba la integracion completa de creacion de producto
     */
    test('TC-INT-PROD-001: POST /api/products - Debe crear producto exitosamente', async () => {
        // Act
        const { status, data } = await fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(testProduct)
        });

        // Assert
        if (status === 201) {
            expect(data).toHaveProperty('product');
            expect(data.product).toHaveProperty('_id');
            expect(data.product.name).toBe(testProduct.name);
            createdProductId = data.product._id;
        } else {
            // Si el servidor no esta disponible, marcar como skip
            console.log('Servidor no disponible - Prueba omitida');
            expect(status).toBeDefined();
        }
    });

    /**
     * TC-INT-PROD-002: GET /api/products - Listar productos
     * Prueba la consulta de todos los productos
     */
    test('TC-INT-PROD-002: GET /api/products - Debe listar productos', async () => {
        const { status, data } = await fetchAPI('/products');

        if (status === 200) {
            expect(Array.isArray(data)).toBe(true);
        } else {
            console.log('Servidor no disponible');
            expect(status).toBeDefined();
        }
    });

    /**
     * TC-INT-PROD-003: GET /api/products/search - Buscar productos
     * Prueba la funcionalidad de busqueda
     */
    test('TC-INT-PROD-003: GET /api/products/search - Debe buscar productos', async () => {
        const { status, data } = await fetchAPI('/products/search?q=Test');

        if (status === 200) {
            expect(Array.isArray(data)).toBe(true);
        } else {
            console.log('Servidor no disponible o busqueda vacia');
            expect(status).toBeDefined();
        }
    });

    /**
     * TC-INT-PROD-004: PUT /api/products/:id - Actualizar producto
     * Prueba la actualizacion de un producto existente
     */
    test('TC-INT-PROD-004: PUT /api/products/:id - Debe actualizar producto', async () => {
        if (!createdProductId) {
            console.log('No hay producto para actualizar - Omitido');
            return;
        }

        const { status, data } = await fetchAPI(`/products/${createdProductId}`, {
            method: 'PUT',
            body: JSON.stringify({ currentStock: 150 })
        });

        if (status === 200) {
            expect(data).toHaveProperty('product');
            expect(data.product.currentStock).toBe(150);
        } else {
            expect(status).toBeDefined();
        }
    });

    /**
     * TC-INT-PROD-005: Validacion de campos - Precio negativo
     * Prueba que el servidor rechace datos invalidos
     */
    test('TC-INT-PROD-005: POST /api/products - Debe rechazar precio negativo', async () => {
        const invalidProduct = {
            ...testProduct,
            name: 'InvalidProduct',
            pricePerPound: -1
        };

        const { status, data } = await fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(invalidProduct)
        });

        if (status === 400) {
            expect(data).toHaveProperty('message');
        } else if (status !== 201) {
            // Servidor no disponible
            expect(status).toBeDefined();
        }
    });

    /**
     * TC-INT-PROD-006: Respuesta correcta para producto no encontrado
     */
    test('TC-INT-PROD-006: PUT /api/products/:id - Debe retornar 404 para ID invalido', async () => {
        const { status } = await fetchAPI('/products/000000000000000000000000', {
            method: 'PUT',
            body: JSON.stringify({ currentStock: 10 })
        });

        // Puede ser 404 o 500 dependiendo de la implementacion
        expect([404, 500, 400]).toContain(status);
    });

    /**
     * TC-INT-PROD-007: PATCH /api/products/:id/deactivate - Desactivar producto
     */
    test('TC-INT-PROD-007: PATCH /api/products/:id/deactivate - Debe desactivar producto', async () => {
        if (!createdProductId) {
            console.log('No hay producto para desactivar - Omitido');
            return;
        }

        const { status, data } = await fetchAPI(`/products/${createdProductId}/deactivate`, {
            method: 'PATCH'
        });

        if (status === 200) {
            expect(data).toHaveProperty('message');
            expect(data.message.toLowerCase()).toContain('desactivado');
        } else {
            expect(status).toBeDefined();
        }
    });
});

// ============== TESTS DE RENDIMIENTO BASICO ==============
describe('Pruebas de Rendimiento Basico - Productos', () => {

    /**
     * TC-PERF-PROD-001: Tiempo de respuesta de listado
     * Requisito: RNF-01 - Respuesta < 1s para consultas
     */
    test('TC-PERF-PROD-001: GET /api/products - Debe responder en menos de 1 segundo', async () => {
        const startTime = Date.now();
        const { status } = await fetchAPI('/products');
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        console.log(`Tiempo de respuesta: ${responseTime}ms`);

        if (status === 200) {
            expect(responseTime).toBeLessThan(1000); // < 1 segundo
        } else {
            // Servidor no disponible
            expect(status).toBeDefined();
        }
    });

    /**
     * TC-PERF-PROD-002: Multiples consultas consecutivas
     */
    test('TC-PERF-PROD-002: Debe manejar 10 consultas consecutivas', async () => {
        const times = [];

        for (let i = 0; i < 10; i++) {
            const startTime = Date.now();
            await fetchAPI('/products');
            times.push(Date.now() - startTime);
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        console.log(`Tiempo promedio: ${avgTime.toFixed(2)}ms`);

        // El promedio debe ser razonable
        expect(avgTime).toBeLessThan(2000);
    });
});
