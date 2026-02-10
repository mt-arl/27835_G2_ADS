/**
 * PRUEBAS DE ESTRES CON K6 - KAIROSMIX V3
 * Plan de Pruebas: TC-INV-006 (Concurrencia), TC-NF-005 (Integridad)
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 *
 * Ejecutar: k6 run k6-stress-test.js
 *
 * Objetivo: Identificar punto de quiebre del sistema
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Metricas de estres
const errors = new Rate('errors');
const failedRequests = new Counter('failed_requests');
const successfulRequests = new Counter('successful_requests');

// Configuracion de estres
export const options = {
    stages: [
        // Rampa inicial
        { duration: '1m', target: 50 },
        // Incremento agresivo
        { duration: '2m', target: 150 },
        // Pico maximo
        { duration: '1m', target: 300 },
        // Mantener carga alta
        { duration: '3m', target: 200 },
        // Pico extremo
        { duration: '30s', target: 400 },
        // Recuperacion
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        // Umbrales mas permisivos para estres
        'http_req_duration': ['p(95)<3000', 'p(99)<5000'],
        'errors': ['rate<0.05'], // Hasta 5% de errores aceptable en estres
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api';

export default function () {
    // ============================================
    // GRUPO 1: Consultas Concurrentes Masivas
    // ============================================
    group('Consultas Concurrentes', function () {
        let responses = http.batch([
            ['GET', `${BASE_URL}/products`],
            ['GET', `${BASE_URL}/clients`],
            ['GET', `${BASE_URL}/orders`],
        ]);

        responses.forEach((res, i) => {
            let passed = check(res, {
                'status OK': (r) => r.status === 200 || r.status === 401,
            });

            if (passed) {
                successfulRequests.add(1);
            } else {
                failedRequests.add(1);
                errors.add(1);
            }
        });
    });

    sleep(0.1); // Minimo tiempo entre iteraciones

    // ============================================
    // GRUPO 2: Busquedas Intensivas
    // ============================================
    group('Busquedas Intensivas', function () {
        const searchTerms = ['a', 'e', 'i', 'o', 'u', 'almendra', 'nuez'];
        const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        let res = http.get(`${BASE_URL}/products/search?q=${term}`);

        let passed = check(res, {
            'busqueda OK': (r) => r.status === 200 || r.status === 400,
            'respuesta < 3s': (r) => r.timings.duration < 3000,
        });

        if (!passed) {
            errors.add(1);
        }
    });

    sleep(0.1);

    // ============================================
    // GRUPO 3: Simulacion de Flujo de Usuario
    // ============================================
    group('Flujo Usuario Rapido', function () {
        // Ver productos
        let prodRes = http.get(`${BASE_URL}/products`);
        check(prodRes, { 'productos OK': (r) => r.status === 200 }) || errors.add(1);

        // Ver pedidos (puede requerir auth)
        let orderRes = http.get(`${BASE_URL}/orders`);
        check(orderRes, {
            'pedidos accesible': (r) => r.status === 200 || r.status === 401,
        }) || errors.add(1);
    });

    sleep(0.2);
}

export function setup() {
    console.log('='.repeat(60));
    console.log('INICIANDO PRUEBAS DE ESTRES');
    console.log('='.repeat(60));
    console.log(`URL: ${BASE_URL}`);
    console.log('Objetivo: Encontrar punto de quiebre');
    console.log('');

    return { startTime: Date.now() };
}

export function teardown(data) {
    const duration = (Date.now() - data.startTime) / 1000;
    console.log('');
    console.log('='.repeat(60));
    console.log('PRUEBAS DE ESTRES FINALIZADAS');
    console.log('='.repeat(60));
    console.log(`Duracion total: ${duration.toFixed(2)} segundos`);
}
