import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { cancelOrder, createOrder } from '../src/controller/OrderController.js'; // Asegúrate de exportar createOrder
import { RepositoryFactory } from '../src/factories/RepositoryFactory.js';

// --- MOCKS ---
const mockRequest = () => {
    const req: any = {};
    req.params = { id: 'order_123' };
    req.body = {};
    req.user = { id: 'admin_user' };
    return req;
};

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock de Producto (con save para verificar updates)
const mockProduct = {
    _id: 'prod_1',
    name: 'Granola',
    retailPrice: 5.00,
    currentStock: 10,
    save: jest.fn().mockResolvedValue(true)
};

// Mock de Pedido
const mockOrder = {
    _id: 'order_123',
    status: 'pendiente',
    items: [ { product: 'prod_1', quantity: 2 } ],
    save: jest.fn().mockResolvedValue(true)
};

const mockOrderRepo = { 
    findById: jest.fn(),
    create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, _id: 'new_order' }))
};
const mockProductRepo = { findById: jest.fn() };
const mockMixRepo = { findById: jest.fn() };

describe('Módulo de Pedidos e Inventario (CU-KAIROSMIX-3.x & REQ015)', () => {

    beforeEach(() => {
        jest.spyOn(RepositoryFactory, 'getOrderRepository').mockReturnValue(mockOrderRepo as any);
        jest.spyOn(RepositoryFactory, 'getProductRepository').mockReturnValue(mockProductRepo as any);
        jest.spyOn(RepositoryFactory, 'getMixRepository').mockReturnValue(mockMixRepo as any);
        jest.clearAllMocks();
        
        // Reset de valores iniciales
        mockProduct.currentStock = 10; 
        mockOrder.status = 'pendiente';
    });

    // Cubre: TC-INV-001 (Decrementar stock al crear) y TC-ORD-001 (Registrar pedido)
    // Fuente: Informe_Plan_Pruebas_KairosMixV2.docx [cite: 65, 59]
    test('[TC-INV-001 & TC-ORD-001] Crear pedido y decrementar stock (Integración)', async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = {
            items: [ { productId: 'prod_1', quantity: 3 } ] // Compra 3 unidades
        };

        mockProductRepo.findById.mockResolvedValue(mockProduct);

        await createOrder(req, res);

        // 1. Verifica creación del pedido
        expect(res.status).toHaveBeenCalledWith(201);
        expect(mockOrderRepo.create).toHaveBeenCalled();

        // 2. Verifica decremento de stock (10 - 3 = 7)
        expect(mockProduct.currentStock).toBe(7);
        expect(mockProduct.save).toHaveBeenCalled();
    });

    // Cubre: TC-ORD-010 (Cancelar pedido) y TC-INV-004 (Revertir inventario)
    // Fuente: Informe_Plan_Pruebas_KairosMixV2.docx [cite: 59, 65]
    test('[TC-ORD-010 & TC-INV-004] Cancelar pedido y revertir stock (Rollback)', async () => {
        const req = mockRequest();
        const res = mockResponse();

        // Simulamos que el pedido ya fue creado y descontó stock (Stock actual simulado = 7)
        mockProduct.currentStock = 7; 
        
        mockOrderRepo.findById.mockResolvedValue(mockOrder); // El pedido tiene qty: 2
        mockProductRepo.findById.mockResolvedValue(mockProduct);

        await cancelOrder(req, res);

        // 1. Verifica cambio de estado
        expect(mockOrder.status).toBe('cancelado');
        
        // 2. Verifica reversión de stock (7 + 2 = 9)
        // Nota: En el mockProduct inicial pusimos 10, si asumimos flujo continuo. 
        // Aquí validamos que sume la cantidad del pedido (2) al stock actual (7).
        expect(mockProduct.currentStock).toBe(9); 
        expect(mockProduct.save).toHaveBeenCalled();
        
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('stock restaurado')
        }));
    });

    // Cubre: TC-ORD-011 (Cancelar pedido ya cancelado) 
    test('[TC-ORD-011] Bloquear cancelación de pedido ya despachado o cancelado', async () => {
        const req = mockRequest();
        const res = mockResponse();

        const despachadoOrder = { ...mockOrder, status: 'despachado' };
        mockOrderRepo.findById.mockResolvedValue(despachadoOrder);

        await cancelOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('No se puede cancelar')
        }));
    });
});