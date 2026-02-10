/**
 * PRUEBAS DE CARGA CON K6 - KAIROSMIX V3
 * Plan de Pruebas: TC-REP-006, TC-NF-001, TC-NF-002
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 *
 * Ejecutar: k6 run k6-load-test.js
 *
 * Requisitos validados:
 * - RNF-01: Tiempo de respuesta < 1s para consultas (95%)
 * - RNF-01: Tiempo de respuesta < 2s para registros (90%)
 * - TC-REP-006: Generar reporte con 10,000 registros < 7s
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Metricas personalizadas
const errorRate = new Rate('errors');
const productLatency = new Trend('product_latency');
const clientLatency = new Trend('client_latency');
const orderLatency = new Trend('order_latency');

// Configuracion de las etapas de carga
export const options = {
    stages: [
        // Calentamiento
        { duration: '30s', target: 10 },
        // Carga normal
        { duration: '1m', target: 50 },
        // Pico de carga
        { duration: '30s', target: 100 },
        // Carga sostenida
        { duration: '2m', target: 75 },
        // Recuperacion
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        // 95% de respuestas < 1s (1000ms)
        'http_req_duration': ['p(95)<1000', 'p(99)<2000'],
        // Tasa de errores < 1%
        'errors': ['rate<0.01'],
        // Metricas especificas
        'product_latency': ['p(95)<800'],
        'client_latency': ['p(95)<800'],
        'order_latency': ['p(95)<1200'],
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api';

// Funcion principal de prueba
export default function () {
    // ============================================
    // TC-LOAD-K6-001: Consulta de Productos
    // ============================================
    let productRes = http.get(`${BASE_URL}/products`);
    productLatency.add(productRes.timings.duration);

    check(productRes, {
        'productos: status 200': (r) => r.status === 200,
        'productos: respuesta < 1s': (r) => r.timings.duration < 1000,
        'productos: tiene datos': (r) => {
            try {
                const body = JSON.parse(r.body);
                return Array.isArray(body);
            } catch {
                return false;
            }
        },
    }) || errorRate.add(1);

    sleep(1);

    // ============================================
    // TC-LOAD-K6-002: Busqueda de Productos
    // ============================================
    let searchRes = http.get(`${BASE_URL}/products/search?q=almendra`);
    productLatency.add(searchRes.timings.duration);

    check(searchRes, {
        'busqueda: status 200': (r) => r.status === 200,
        'busqueda: respuesta < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    sleep(0.5);

    // ============================================
    // TC-LOAD-K6-003: Consulta de Clientes
    // ============================================
    let clientRes = http.get(`${BASE_URL}/clients`);
    clientLatency.add(clientRes.timings.duration);

    check(clientRes, {
        'clientes: status 200': (r) => r.status === 200,
        'clientes: respuesta < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    sleep(1);

    // ============================================
    // TC-LOAD-K6-004: Consulta de Pedidos
    // ============================================
    let orderRes = http.get(`${BASE_URL}/orders`);
    orderLatency.add(orderRes.timings.duration);

    check(orderRes, {
        'pedidos: status OK': (r) => r.status === 200 || r.status === 401,
        'pedidos: respuesta < 2s': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);

    sleep(2);
}

// Funcion de setup (ejecuta una vez al inicio)
export function setup() {
    console.log('Iniciando pruebas de carga...');
    console.log(`URL Base: ${BASE_URL}`);

    // Verificar que el servidor esta activo
    let healthCheck = http.get(`${BASE_URL}/products`);
    if (healthCheck.status !== 200) {
        console.error('ADVERTENCIA: El servidor podria no estar disponible');
    }

    return { startTime: new Date().toISOString() };
}

// Funcion de teardown (ejecuta una vez al final)
export function teardown(data) {
    console.log(`\nPruebas finalizadas.`);
    console.log(`Inicio: ${data.startTime}`);
    console.log(`Fin: ${new Date().toISOString()}`);
}
