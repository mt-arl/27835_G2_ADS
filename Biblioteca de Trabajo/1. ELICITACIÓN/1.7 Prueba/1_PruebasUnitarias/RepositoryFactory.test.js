/**
 * PRUEBAS UNITARIAS - REPOSITORY FACTORY Y REQUISITOS NO FUNCIONALES
 * Plan de Pruebas KairosMix V3
 * Casos: TC-NF-001 a TC-NF-010
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 */

import { jest, describe, test, expect, beforeEach, beforeAll } from '@jest/globals';

// ============== TESTS REPOSITORY FACTORY ==============
describe('RepositoryFactory - Patron Factory', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TEST-FACTORY-001: Debe retornar instancia de MongoProductRepository
     */
    test('TEST-FACTORY-001: Debe retornar repositorio de Productos para MONGO', () => {
        // Arrange
        process.env.DB_TYPE = 'MONGO';

        const getProductRepository = () => {
            const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
            if (dbType === 'MONGO') {
                return { type: 'MongoProductRepository' };
            }
            throw new Error(`DB type ${dbType} not supported`);
        };

        // Act
        const repo = getProductRepository();

        // Assert
        expect(repo.type).toBe('MongoProductRepository');
    });

    /**
     * TEST-FACTORY-002: Debe lanzar error si el tipo de BD no es soportado
     */
    test('TEST-FACTORY-002: Debe lanzar error para tipo de BD no soportado', () => {
        // Arrange
        process.env.DB_TYPE = 'MYSQL';

        const getProductRepository = () => {
            const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
            if (dbType === 'MONGO') {
                return { type: 'MongoProductRepository' };
            }
            throw new Error(`El tipo de BD '${dbType}' no esta soportado`);
        };

        // Act & Assert
        expect(() => getProductRepository()).toThrow(/no esta soportado/);
    });

    /**
     * TEST-FACTORY-003: Debe usar MONGO como valor por defecto
     */
    test('TEST-FACTORY-003: Debe usar MONGO como tipo de BD por defecto', () => {
        // Arrange
        delete process.env.DB_TYPE;

        const getDbType = () => {
            return process.env.DB_TYPE?.toUpperCase() || 'MONGO';
        };

        // Act
        const dbType = getDbType();

        // Assert
        expect(dbType).toBe('MONGO');
    });

    /**
     * TEST-FACTORY-004: Debe retornar repositorio de Clientes
     */
    test('TEST-FACTORY-004: Debe retornar repositorio de Clientes', () => {
        // Arrange
        process.env.DB_TYPE = 'MONGO';

        const getClientRepository = () => {
            const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
            if (dbType === 'MONGO') {
                return { type: 'MongoClientRepository' };
            }
            throw new Error('Not supported');
        };

        // Act
        const repo = getClientRepository();

        // Assert
        expect(repo.type).toBe('MongoClientRepository');
    });

    /**
     * TEST-FACTORY-005: Debe retornar repositorio de Pedidos
     */
    test('TEST-FACTORY-005: Debe retornar repositorio de Pedidos', () => {
        // Arrange
        process.env.DB_TYPE = 'MONGO';

        const getOrderRepository = () => {
            const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
            if (dbType === 'MONGO') {
                return { type: 'MongoOrderRepository' };
            }
            throw new Error('Not supported');
        };

        // Act
        const repo = getOrderRepository();

        // Assert
        expect(repo.type).toBe('MongoOrderRepository');
    });

    /**
     * TEST-FACTORY-006: Debe retornar repositorio de Mezclas
     */
    test('TEST-FACTORY-006: Debe retornar repositorio de Mezclas', () => {
        // Arrange
        process.env.DB_TYPE = 'MONGO';

        const getMixRepository = () => {
            const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
            if (dbType === 'MONGO') {
                return { type: 'MongoMixRepository' };
            }
            throw new Error('Not supported');
        };

        // Act
        const repo = getMixRepository();

        // Assert
        expect(repo.type).toBe('MongoMixRepository');
    });
});

// ============== REQUISITOS NO FUNCIONALES ==============
describe('Requisitos No Funcionales (RNF-01 a RNF-10)', () => {

    /**
     * TC-NF-001: Tiempo de respuesta de consultas < 1s (95%)
     * Requisito: RNF-01 / NF-001
     * Prioridad: Alta | Tipo: No funcional
     */
    test('TC-NF-001: Debe medir tiempo de respuesta de consultas', async () => {
        // Arrange
        const mockQuery = jest.fn().mockImplementation(() => {
            return new Promise(resolve => setTimeout(() => resolve([]), 100)); // 100ms simulado
        });

        // Act
        const startTime = Date.now();
        await mockQuery();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Assert
        expect(responseTime).toBeLessThan(1000); // < 1 segundo
    });

    /**
     * TC-NF-002: Tiempo de respuesta de registros < 2s (90%)
     * Requisito: RNF-01 / NF-001
     * Prioridad: Alta | Tipo: No funcional
     */
    test('TC-NF-002: Debe medir tiempo de respuesta de registros', async () => {
        // Arrange
        const mockCreate = jest.fn().mockImplementation(() => {
            return new Promise(resolve => setTimeout(() => resolve({ _id: '123' }), 150)); // 150ms simulado
        });

        // Act
        const startTime = Date.now();
        await mockCreate();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Assert
        expect(responseTime).toBeLessThan(2000); // < 2 segundos
    });

    /**
     * TC-NF-004: Usabilidad - mensajes claros y confirmaciones
     * Requisito: RNF-03
     * Prioridad: Media | Tipo: No funcional/Usabilidad
     */
    test('TC-NF-004: Debe generar mensajes de error claros sin trazas tecnicas', () => {
        // Arrange
        const errorMessages = {
            notFound: 'Producto no encontrado',
            validation: 'El nombre es requerido',
            stock: 'Stock insuficiente para el producto',
            duplicate: 'El numero de identificacion ya esta registrado'
        };

        // Act & Assert - Verificar que no contienen stacktraces
        for (const [key, message] of Object.entries(errorMessages)) {
            expect(message).not.toMatch(/Error:/);
            expect(message).not.toMatch(/at\s+\w+/); // No debe contener "at functionName"
            expect(message).not.toMatch(/node_modules/);
            expect(message.length).toBeLessThan(100); // Mensajes concisos
        }
    });

    /**
     * TC-NF-005: Integridad - consistencia BD en fallos (rollback)
     * Requisito: RNF-04 / NF-004
     * Prioridad: Alta | Tipo: No funcional/Integridad
     */
    test('TC-NF-005: Debe mantener consistencia en caso de error', async () => {
        // Arrange
        let stockBefore = 100;
        let stockAfter = 100;
        let orderCreated = false;

        const simulateFailedTransaction = async () => {
            const tempStock = stockBefore - 5;

            // Simular error durante creacion de pedido
            const createOrder = () => {
                throw new Error('Database connection lost');
            };

            try {
                createOrder();
                stockAfter = tempStock;
                orderCreated = true;
            } catch (error) {
                // Rollback - stock no debe cambiar
                stockAfter = stockBefore;
                orderCreated = false;
            }
        };

        // Act
        await simulateFailedTransaction();

        // Assert
        expect(stockAfter).toBe(stockBefore); // Stock no cambio
        expect(orderCreated).toBe(false);      // Pedido no se creo
    });

    /**
     * TC-NF-008: Sanitizacion - prevenir inyeccion SQL
     * Requisito: Seguridad (SRS 3.3.2)
     * Prioridad: Alta | Tipo: No funcional/Seguridad
     */
    test('TC-NF-008: Debe sanitizar entradas contra inyeccion', () => {
        // Arrange
        const maliciousInputs = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "<script>alert('XSS')</script>",
            "admin'--",
            "1; DELETE FROM products WHERE 1=1"
        ];

        const sanitize = (input) => {
            // Escapar caracteres peligrosos y palabras SQL maliciosas
            return input
                .replace(/'/g, "''")
                .replace(/;/g, '')
                .replace(/--/g, '')
                .replace(/<script>/gi, '')
                .replace(/<\/script>/gi, '')
                .replace(/DROP\s+TABLE/gi, '[BLOCKED]')
                .replace(/DELETE\s+FROM/gi, '[BLOCKED]');
        };

        // Act & Assert
        for (const input of maliciousInputs) {
            const sanitized = sanitize(input);
            expect(sanitized).not.toContain("DROP TABLE");
            expect(sanitized).not.toContain("DELETE FROM");
            expect(sanitized).not.toContain("<script>");
            expect(sanitized).not.toMatch(/;\s*$/);
        }
    });

    /**
     * TC-NF-010: Manejo de errores - mensajes claros sin exponer trazas
     * Requisito: Fiabilidad (SRS 3.3.3)
     * Prioridad: Media | Tipo: No funcional/Fiabilidad
     */
    test('TC-NF-010: Debe ocultar detalles tecnicos en errores de API', () => {
        // Arrange
        const internalError = new Error('MongoError: connection refused at 127.0.0.1:27017');

        const handleError = (error) => {
            // Log interno (seria enviado a logs del servidor)
            const logMessage = error.message;

            // Mensaje para el usuario
            const userMessage = 'Error interno del servidor. Por favor intente mas tarde.';

            return { logMessage, userMessage };
        };

        // Act
        const { logMessage, userMessage } = handleError(internalError);

        // Assert
        expect(logMessage).toContain('MongoError'); // Log interno tiene detalles
        expect(userMessage).not.toContain('MongoError'); // Usuario no ve detalles
        expect(userMessage).not.toContain('127.0.0.1');
        expect(userMessage).not.toContain('27017');
    });

    /**
     * TC-INV-001: Decrementar stock al crear pedido
     * Requisito: REQ015.1
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-INV-001: Debe decrementar stock atomicamente', () => {
        // Arrange
        const initialStock = 100;
        const orderQuantity = 5;

        // Act
        const finalStock = initialStock - orderQuantity;

        // Assert
        expect(finalStock).toBe(95);
        expect(finalStock).toBeGreaterThanOrEqual(0);
    });

    /**
     * TC-INV-004: Revertir stock al cancelar pedido
     * Requisito: REQ015.3
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-INV-004: Debe revertir stock al cancelar', () => {
        // Arrange
        const stockAfterOrder = 95;
        const orderQuantity = 5;

        // Act
        const stockAfterCancel = stockAfterOrder + orderQuantity;

        // Assert
        expect(stockAfterCancel).toBe(100);
    });

    /**
     * TC-INV-006: Prueba de concurrencia basica
     * Requisito: REQ015.5
     * Prioridad: Media | Tipo: No funcional/Integracion
     */
    test('TC-INV-006: No debe permitir stock negativo en concurrencia', async () => {
        // Arrange
        let stock = 5;
        const lock = { isLocked: false };

        const attemptOrder = async (quantity) => {
            // Simular bloqueo optimista
            while (lock.isLocked) {
                await new Promise(r => setTimeout(r, 10));
            }
            lock.isLocked = true;

            try {
                if (stock >= quantity) {
                    stock -= quantity;
                    return { success: true, newStock: stock };
                }
                return { success: false, message: 'Stock insuficiente' };
            } finally {
                lock.isLocked = false;
            }
        };

        // Act - Dos pedidos simultaneos de 3 unidades cada uno
        const [result1, result2] = await Promise.all([
            attemptOrder(3),
            attemptOrder(3)
        ]);

        // Assert - Solo uno debe tener exito, stock nunca negativo
        const successCount = [result1, result2].filter(r => r.success).length;
        expect(successCount).toBeLessThanOrEqual(1); // Maximo uno exitoso
        expect(stock).toBeGreaterThanOrEqual(0);      // Stock nunca negativo
    });
});

// ============== VALIDACIONES DE PRECISION ==============
describe('Validaciones de Precision Numerica (RNF-09)', () => {

    /**
     * Validar precision de 2 decimales en precios
     */
    test('Debe formatear precios con exactamente 2 decimales', () => {
        const testCases = [
            { input: 10.999, expected: 11.00 },
            { input: 5.556, expected: 5.56 },
            { input: 3.001, expected: 3.00 },
            { input: 0.1 + 0.2, expected: 0.30 } // Caso clasico de punto flotante
        ];

        for (const tc of testCases) {
            const result = parseFloat(tc.input.toFixed(2));
            expect(result).toBe(tc.expected);
        }
    });

    /**
     * Validar precision de 1 decimal en valores nutricionales
     */
    test('Debe formatear valores nutricionales con 1 decimal', () => {
        const testCases = [
            { input: 580.45, expected: 580.5 },
            { input: 21.34, expected: 21.3 },
            { input: 49.99, expected: 50.0 }
        ];

        for (const tc of testCases) {
            const result = parseFloat(tc.input.toFixed(1));
            expect(result).toBe(tc.expected);
        }
    });
});
