import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { createCustomMix } from '../src/controller/MixController.js';
import { RepositoryFactory } from '../src/factories/RepositoryFactory.js';

// --- MOCKS ---
const mockRequest = () => {
    const req: any = {};
    req.body = {};
    req.user = { id: 'user_123' }; 
    return req;
};

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockProductRepo = { findById: jest.fn() };
const mockMixRepo = { 
    create: jest.fn().mockImplementation((data: any) => Promise.resolve({ ...data, _id: 'new_mix_id' }))
};

describe('Módulo de Mezclas (CU-KAIROSMIX-4.x)', () => {
    
    beforeEach(() => {
        jest.spyOn(RepositoryFactory, 'getProductRepository').mockReturnValue(mockProductRepo as any);
        jest.spyOn(RepositoryFactory, 'getMixRepository').mockReturnValue(mockMixRepo as any);
        jest.clearAllMocks();
    });

    // Cubre: TC-MIX-004 (Cálculo dinámico precio) y TC-NUT-002 (Agregación nutricional)
    // Fuente: Informe_Plan_Pruebas_KairosMixV2.docx
    test('[TC-MIX-004 & TC-NUT-002] Validar cálculo de precios y nutrición ponderada', async () => {
        const req = mockRequest();
        const res = mockResponse();
        
        // Datos de prueba según el Plan: Productos con precios y macros definidos
        mockProductRepo.findById
            .mockResolvedValueOnce({ _id: 'p1', name: 'Almendras', pricePerPound: 10, currentStock: 50, nutritionalInfo: { calories: 100 } })
            .mockResolvedValueOnce({ _id: 'p2', name: 'Pasas', pricePerPound: 5, currentStock: 50, nutritionalInfo: { calories: 50 } });

        req.body = {
            name: 'Mezcla Energética', // TC-MIX-001
            ingredients: [
                { productId: 'p1', quantityLbs: 2 }, // $20, 200 cal
                { productId: 'p2', quantityLbs: 1 }  // $5, 50 cal
            ]
        };

        await createCustomMix(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        
        // Validación de Integridad de Datos (NF-009)
        expect(mockMixRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            totalPrice: 25.00,   // (10*2) + (5*1)
            totalCalories: 250,  // (100*2) + (50*1)
            totalWeight: 3
        }));
    });

    // Cubre escenario negativo implícito en TC-ORD-002 (Stock insuficiente al usar productos)
    test('[Negativo] Bloquear creación si no hay stock suficiente (Validación de Inventario)', async () => {
        const req = mockRequest();
        const res = mockResponse();

        mockProductRepo.findById.mockResolvedValue({ 
            name: 'Almendras', 
            currentStock: 1, // Stock bajo
            pricePerPound: 10 
        });

        req.body = {
            name: 'Mezcla Sin Stock',
            ingredients: [ { productId: 'p1', quantityLbs: 5 } ] // Pide más de lo que hay
        };

        await createCustomMix(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('Stock insuficiente')
        }));
    });
});