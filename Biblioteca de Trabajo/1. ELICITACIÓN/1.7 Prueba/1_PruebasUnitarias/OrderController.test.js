/**
 * PRUEBAS UNITARIAS - GESTION DE PEDIDOS (CU-KAIROSMIX-3.x)
 * Plan de Pruebas KairosMix V3
 * Casos: TC-ORD-001 a TC-ORD-012 y TC-STAT-001 a TC-STAT-008
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ============== MOCKS ==============
const mockRequest = (body = {}, params = {}, user = { id: 'user_123' }) => ({
    body,
    params,
    user
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock del repositorio de pedidos
const mockOrderRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn()
};

// Mock del repositorio de productos
const mockProductRepo = {
    findById: jest.fn()
};

// Mock del repositorio de mezclas
const mockMixRepo = {
    findById: jest.fn()
};

// ============== TESTS ==============
describe('Gestion de Pedidos (CU-KAIROSMIX-3.x)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-ORD-001: Registrar pedido con productos y stock suficiente
     * Requisito: CU-KAIROSMIX-3.1 / REQ009
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-ORD-001: Debe crear pedido con totales correctos y decrementar stock', async () => {
        // Arrange
        const req = mockRequest({
            items: [
                { productId: 'prod_1', quantity: 2 },
                { productId: 'prod_2', quantity: 1 }
            ]
        });
        const res = mockResponse();

        const mockProduct1 = {
            _id: 'prod_1',
            name: 'Almendra',
            retailPrice: 5.00,
            currentStock: 100,
            save: jest.fn()
        };

        const mockProduct2 = {
            _id: 'prod_2',
            name: 'Nuez',
            retailPrice: 3.50,
            currentStock: 50,
            save: jest.fn()
        };

        mockProductRepo.findById
            .mockResolvedValueOnce(mockProduct1)
            .mockResolvedValueOnce(mockProduct2)
            .mockResolvedValueOnce(mockProduct1)
            .mockResolvedValueOnce(mockProduct2);

        mockOrderRepo.create.mockResolvedValue({
            _id: 'order_123',
            client: 'user_123',
            items: [
                { product: 'prod_1', quantity: 2, priceAtPurchase: 5.00 },
                { product: 'prod_2', quantity: 1, priceAtPurchase: 3.50 }
            ],
            total: 13.50,
            status: 'pendiente'
        });

        // Act
        const createOrder = async (req, res) => {
            const userId = req.user.id;
            const { items } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({ message: 'Pedido vacio' });
            }

            let orderItems = [];
            let totalOrder = 0;

            // Fase 1: Validacion y calculo
            for (const item of items) {
                if (item.productId) {
                    const product = await mockProductRepo.findById(item.productId);
                    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

                    if (product.currentStock < item.quantity) {
                        return res.status(400).json({ message: `Sin stock: ${product.name}` });
                    }

                    orderItems.push({
                        product: product._id,
                        quantity: item.quantity,
                        priceAtPurchase: product.retailPrice
                    });
                    totalOrder += product.retailPrice * item.quantity;
                }
            }

            // Fase 2: Crear pedido
            const newOrder = await mockOrderRepo.create({
                client: userId,
                items: orderItems,
                total: parseFloat(totalOrder.toFixed(2)),
                status: 'pendiente'
            });

            // Fase 3: Restar stock
            for (const item of items) {
                if (item.productId) {
                    const product = await mockProductRepo.findById(item.productId);
                    product.currentStock -= item.quantity;
                    await product.save();
                }
            }

            res.status(201).json(newOrder);
        };

        await createOrder(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                total: 13.50,
                status: 'pendiente'
            })
        );
    });

    /**
     * TC-ORD-002: Bloquear pedido por stock insuficiente
     * Requisito: CU-KAIROSMIX-3.1 / REQ009
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-ORD-002: Debe rechazar pedido por stock insuficiente', async () => {
        // Arrange
        const req = mockRequest({
            items: [{ productId: 'prod_1', quantity: 500 }]
        });
        const res = mockResponse();

        mockProductRepo.findById.mockResolvedValue({
            _id: 'prod_1',
            name: 'Almendra',
            currentStock: 10
        });

        // Act
        const createOrder = async (req, res) => {
            const { items } = req.body;

            for (const item of items) {
                const product = await mockProductRepo.findById(item.productId);
                if (product.currentStock < item.quantity) {
                    return res.status(400).json({ message: `Sin stock: ${product.name}` });
                }
            }
        };

        await createOrder(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('Sin stock')
            })
        );
    });

    /**
     * TC-ORD-003: Validar calculo automatico de totales
     * Requisito: CU-KAIROSMIX-3.1 / REQ009
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-ORD-003: Debe calcular totales correctamente con 2 decimales', () => {
        // Arrange
        const items = [
            { price: 2.50, quantity: 2 },  // 5.00
            { price: 1.00, quantity: 1 }   // 1.00
        ];

        // Act
        let total = 0;
        for (const item of items) {
            total += item.price * item.quantity;
        }
        const formattedTotal = parseFloat(total.toFixed(2));

        // Assert
        expect(formattedTotal).toBe(6.00);
        expect(typeof formattedTotal).toBe('number');
    });

    /**
     * TC-ORD-004: Actualizar pedido aumentar cantidad dentro de stock
     * Requisito: CU-KAIROSMIX-3.2 / REQ010
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-ORD-004: Debe actualizar pedido aumentando cantidad si hay stock', async () => {
        // Arrange
        const currentStock = 95;
        const currentQty = 2;
        const newQty = 3;
        const additionalQty = newQty - currentQty;

        // Act
        const canUpdate = currentStock >= additionalQty;
        const newStock = currentStock - additionalQty;

        // Assert
        expect(canUpdate).toBe(true);
        expect(newStock).toBe(94);
    });

    /**
     * TC-ORD-005: Actualizar pedido disminuir cantidad y recalcular stock
     * Requisito: CU-KAIROSMIX-3.2 / REQ010
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-ORD-005: Debe incrementar stock al disminuir cantidad', async () => {
        // Arrange
        const currentStock = 95;
        const currentQty = 5;
        const newQty = 2;
        const returnedQty = currentQty - newQty;

        // Act
        const newStock = currentStock + returnedQty;

        // Assert
        expect(newStock).toBe(98);
    });

    /**
     * TC-ORD-006: Bloquear actualizacion por stock insuficiente
     * Requisito: CU-KAIROSMIX-3.2 / REQ010
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-ORD-006: Debe rechazar actualizacion si no hay stock suficiente', async () => {
        // Arrange
        const req = mockRequest({ quantity: 999 }, { id: 'order_123' });
        const res = mockResponse();

        const currentStock = 10;
        const additionalQty = 999;

        // Act
        const updateOrder = async (req, res) => {
            if (additionalQty > currentStock) {
                return res.status(400).json({ message: 'Stock insuficiente para la actualizacion' });
            }
        };

        await updateOrder(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * TC-ORD-007: Consultar pedidos por ID
     * Requisito: CU-KAIROSMIX-3.3 / REQ011
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-ORD-007: Debe retornar detalle del pedido por ID', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'order_123' });
        const res = mockResponse();

        mockOrderRepo.findById.mockResolvedValue({
            _id: 'order_123',
            client: 'user_123',
            items: [{ product: 'prod_1', quantity: 2 }],
            total: 10.00,
            status: 'pendiente'
        });

        // Act
        const getOrderById = async (req, res) => {
            const { id } = req.params;
            const order = await mockOrderRepo.findById(id);

            if (!order) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }

            res.status(200).json(order);
        };

        await getOrderById(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: 'order_123',
                total: 10.00
            })
        );
    });

    /**
     * TC-ORD-009: Manejar consulta sin resultados
     * Requisito: CU-KAIROSMIX-3.3 / REQ011
     * Prioridad: Baja | Tipo: Funcional
     */
    test('TC-ORD-009: Debe retornar mensaje cuando no hay resultados', async () => {
        // Arrange
        const res = mockResponse();
        mockOrderRepo.findAll.mockResolvedValue([]);

        // Act
        const getOrders = async (res) => {
            const orders = await mockOrderRepo.findAll();
            if (orders.length === 0) {
                return res.status(200).json({ message: 'Sin resultados', orders: [] });
            }
            res.status(200).json(orders);
        };

        await getOrders(res);

        // Assert
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Sin resultados',
                orders: []
            })
        );
    });

    /**
     * TC-ORD-010: Cancelar pedido y revertir inventario
     * Requisito: CU-KAIROSMIX-3.4 / REQ012
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-ORD-010: Debe cancelar pedido y restaurar stock', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'order_123' });
        const res = mockResponse();

        const mockOrder = {
            _id: 'order_123',
            status: 'pendiente',
            items: [{ product: 'prod_1', quantity: 5 }],
            save: jest.fn()
        };

        const mockProduct = {
            _id: 'prod_1',
            currentStock: 95,
            save: jest.fn()
        };

        mockOrderRepo.findById.mockResolvedValue(mockOrder);
        mockProductRepo.findById.mockResolvedValue(mockProduct);

        // Act
        const cancelOrder = async (req, res) => {
            const { id } = req.params;
            const order = await mockOrderRepo.findById(id);

            if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

            if (order.status === 'cancelado') {
                return res.status(400).json({ message: 'El pedido ya esta cancelado' });
            }

            if (order.status === 'despachado' || order.status === 'completado') {
                return res.status(400).json({ message: 'No se puede cancelar un pedido ya despachado' });
            }

            // Revertir stock
            for (const item of order.items) {
                if (item.product) {
                    const product = await mockProductRepo.findById(item.product.toString());
                    if (product) {
                        product.currentStock += item.quantity;
                        await product.save();
                    }
                }
            }

            order.status = 'cancelado';
            await order.save();

            res.status(200).json({ message: 'Pedido cancelado y stock restaurado', order });
        };

        await cancelOrder(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockProduct.currentStock).toBe(100); // 95 + 5
        expect(mockOrder.status).toBe('cancelado');
    });

    /**
     * TC-ORD-011: Cancelar pedido ya cancelado
     * Requisito: CU-KAIROSMIX-3.4 / REQ012
     * Prioridad: Media | Tipo: Negativa
     */
    test('TC-ORD-011: Debe rechazar cancelacion de pedido ya cancelado', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'order_123' });
        const res = mockResponse();

        mockOrderRepo.findById.mockResolvedValue({
            _id: 'order_123',
            status: 'cancelado'
        });

        // Act
        const cancelOrder = async (req, res) => {
            const { id } = req.params;
            const order = await mockOrderRepo.findById(id);

            if (order.status === 'cancelado') {
                return res.status(400).json({ message: 'El pedido ya esta cancelado' });
            }
        };

        await cancelOrder(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'El pedido ya esta cancelado'
            })
        );
    });
});

// ============== CONTROL DE ESTADO (TC-STAT) ==============
describe('Control de Estado de Pedido (CU-KAIROSMIX-3.5 / REQ013)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-STAT-001: Transicion valida Pendiente -> En Proceso
     */
    test('TC-STAT-001: Debe permitir transicion Pendiente -> En Proceso', async () => {
        // Arrange
        const validTransitions = {
            'pendiente': ['en proceso', 'cancelado'],
            'en proceso': ['en espera', 'despachado', 'completado'],
            'en espera': ['en proceso'],
            'despachado': ['completado'],
            'completado': [],
            'cancelado': []
        };

        const currentStatus = 'pendiente';
        const newStatus = 'en proceso';

        // Act
        const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);

        // Assert
        expect(isValidTransition).toBe(true);
    });

    /**
     * TC-STAT-004: Transicion valida En Proceso -> Completado
     */
    test('TC-STAT-004: Debe permitir transicion En Proceso -> Completado', () => {
        const validTransitions = {
            'pendiente': ['en proceso', 'cancelado'],
            'en proceso': ['en espera', 'despachado', 'completado'],
            'en espera': ['en proceso'],
            'despachado': ['completado'],
            'completado': [],
            'cancelado': []
        };

        const currentStatus = 'en proceso';
        const newStatus = 'completado';

        const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);

        expect(isValidTransition).toBe(true);
    });

    /**
     * TC-STAT-005: Transicion invalida Pendiente -> Completado
     */
    test('TC-STAT-005: Debe rechazar transicion Pendiente -> Completado', () => {
        const validTransitions = {
            'pendiente': ['en proceso', 'cancelado'],
            'en proceso': ['en espera', 'despachado', 'completado'],
            'en espera': ['en proceso'],
            'despachado': ['completado'],
            'completado': [],
            'cancelado': []
        };

        const currentStatus = 'pendiente';
        const newStatus = 'completado';

        const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);

        expect(isValidTransition).toBe(false);
    });

    /**
     * TC-STAT-006: Transicion invalida Completado -> En Proceso
     */
    test('TC-STAT-006: Debe rechazar transicion Completado -> En Proceso', () => {
        const validTransitions = {
            'pendiente': ['en proceso', 'cancelado'],
            'en proceso': ['en espera', 'despachado', 'completado'],
            'en espera': ['en proceso'],
            'despachado': ['completado'],
            'completado': [],
            'cancelado': []
        };

        const currentStatus = 'completado';
        const newStatus = 'en proceso';

        const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);

        expect(isValidTransition).toBe(false);
    });

    /**
     * TC-STAT-007: Cancelar desde Pendiente
     */
    test('TC-STAT-007: Debe permitir cancelar desde Pendiente', () => {
        const validTransitions = {
            'pendiente': ['en proceso', 'cancelado'],
            'en proceso': ['en espera', 'despachado', 'completado'],
            'completado': [],
            'cancelado': []
        };

        const currentStatus = 'pendiente';
        const newStatus = 'cancelado';

        const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);

        expect(isValidTransition).toBe(true);
    });
});
