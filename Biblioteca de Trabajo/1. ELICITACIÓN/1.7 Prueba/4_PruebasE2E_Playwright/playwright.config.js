/**
 * CONFIGURACION DE PLAYWRIGHT - KAIROSMIX V3
 * Plan de Pruebas: Pruebas E2E Automatizadas
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Directorio de tests
    testDir: './tests',

    // Timeout global para cada test
    timeout: 30 * 1000,

    // Timeout para expect
    expect: {
        timeout: 5000
    },

    // Ejecutar tests en paralelo
    fullyParallel: true,

    // Fallar el build si hay test.only en CI
    forbidOnly: !!process.env.CI,

    // Reintentos en CI
    retries: process.env.CI ? 2 : 0,

    // Workers en paralelo
    workers: process.env.CI ? 1 : undefined,

    // Reporter
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],

    // Configuracion compartida
    use: {
        // URL base del frontend
        baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',

        // Capturar trace solo en fallo
        trace: 'on-first-retry',

        // Capturar screenshots en fallo
        screenshot: 'only-on-failure',

        // Capturar video
        video: 'on-first-retry',

        // Opciones del navegador
        headless: true,

        // Viewport por defecto
        viewport: { width: 1280, height: 720 },
    },

    // Proyectos para diferentes navegadores
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        // Pruebas mobile
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // Servidor de desarrollo local
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
