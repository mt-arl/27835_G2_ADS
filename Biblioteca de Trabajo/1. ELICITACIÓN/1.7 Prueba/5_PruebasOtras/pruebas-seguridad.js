/**
 * PRUEBAS DE SEGURIDAD BASICAS - KAIROSMIX V3
 * Plan de Pruebas: TC-NF-008, TC-NF-009
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 *
 * Requisitos:
 * - Sanitizacion de inputs (TC-NF-008)
 * - Transmision segura HTTPS (TC-NF-009)
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

/**
 * TC-SEC-001: Prueba de inyeccion SQL basica
 */
async function testSQLInjection() {
    console.log('\n=== TC-SEC-001: Prueba de Inyeccion SQL ===');

    const maliciousInputs = [
        "'; DROP TABLE products; --",
        "1' OR '1'='1",
        "admin'--",
        "1; DELETE FROM products WHERE 1=1",
        "'; SELECT * FROM users; --"
    ];

    for (const input of maliciousInputs) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(input)}`);
            const status = response.status;

            if (status === 200 || status === 400) {
                console.log(`  [PASS] Input "${input.substring(0, 20)}..." - Manejado correctamente (${status})`);
            } else if (status === 500) {
                console.log(`  [WARN] Input "${input.substring(0, 20)}..." - Error 500 (posible vulnerabilidad)`);
            }
        } catch (error) {
            console.log(`  [INFO] Input "${input.substring(0, 20)}..." - Error de conexion`);
        }
    }
}

/**
 * TC-SEC-002: Prueba de XSS basica
 */
async function testXSS() {
    console.log('\n=== TC-SEC-002: Prueba de XSS ===');

    const xssPayloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "javascript:alert('XSS')",
        "<svg onload=alert('XSS')>"
    ];

    for (const payload of xssPayloads) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(payload)}`);
            const data = await response.text();

            // Verificar que el payload no se refleja sin sanitizar
            if (!data.includes('<script>') && !data.includes('onerror=')) {
                console.log(`  [PASS] Payload XSS sanitizado correctamente`);
            } else {
                console.log(`  [WARN] Payload XSS podria reflejarse`);
            }
        } catch (error) {
            console.log(`  [INFO] Error de conexion`);
        }
    }
}

/**
 * TC-SEC-003: Headers de seguridad
 */
async function testSecurityHeaders() {
    console.log('\n=== TC-SEC-003: Headers de Seguridad ===');

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const headers = response.headers;

        const securityHeaders = [
            'x-content-type-options',
            'x-frame-options',
            'x-xss-protection',
            'strict-transport-security',
            'content-security-policy'
        ];

        for (const header of securityHeaders) {
            const value = headers.get(header);
            if (value) {
                console.log(`  [PASS] ${header}: ${value}`);
            } else {
                console.log(`  [INFO] ${header}: No presente (recomendado agregar)`);
            }
        }
    } catch (error) {
        console.log(`  [INFO] Error de conexion`);
    }
}

/**
 * TC-SEC-004: Validacion de autenticacion
 */
async function testAuthentication() {
    console.log('\n=== TC-SEC-004: Validacion de Autenticacion ===');

    // Intentar acceder a recursos protegidos sin token
    const protectedEndpoints = ['/orders', '/mixes'];

    for (const endpoint of protectedEndpoints) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            const status = response.status;

            if (status === 401 || status === 403) {
                console.log(`  [PASS] ${endpoint} - Requiere autenticacion (${status})`);
            } else if (status === 200) {
                console.log(`  [WARN] ${endpoint} - Accesible sin autenticacion`);
            } else {
                console.log(`  [INFO] ${endpoint} - Status: ${status}`);
            }
        } catch (error) {
            console.log(`  [INFO] ${endpoint} - Error de conexion`);
        }
    }
}

// Ejecutar todas las pruebas
async function runSecurityTests() {
    console.log('================================================');
    console.log('PRUEBAS DE SEGURIDAD - KAIROSMIX V3');
    console.log('================================================');
    console.log(`URL Base: ${API_BASE_URL}`);
    console.log(`Fecha: ${new Date().toISOString()}`);

    await testSQLInjection();
    await testXSS();
    await testSecurityHeaders();
    await testAuthentication();

    console.log('\n================================================');
    console.log('PRUEBAS FINALIZADAS');
    console.log('================================================');
}

// Ejecutar si es llamado directamente
runSecurityTests().catch(console.error);

export { testSQLInjection, testXSS, testSecurityHeaders, testAuthentication };
