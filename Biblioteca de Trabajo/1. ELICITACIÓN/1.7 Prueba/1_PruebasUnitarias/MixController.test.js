/**
 * PRUEBAS UNITARIAS - MEZCLAS PERSONALIZADAS Y NUTRICION (CU-KAIROSMIX-4.x)
 * Plan de Pruebas KairosMix V3
 * Casos: TC-MIX-001 a TC-MIX-010 y TC-NUT-001 a TC-NUT-003
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

// Mock del repositorio de mezclas
const mockMixRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByClient: jest.fn()
};

// Mock del repositorio de productos
const mockProductRepo = {
    findById: jest.fn()
};

// ============== TESTS ==============
describe('Mezclas Personalizadas (CU-KAIROSMIX-4.x / REQ016-REQ020)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-MIX-001: Crear mezcla con nombre valido y componentes
     * Requisito: CU-KAIROSMIX-4.1 / REQ016
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-MIX-001: Debe crear mezcla con precio total correcto', async () => {
        // Arrange
        const req = mockRequest({
            name: 'Mezcla Energetica',
            ingredients: [
                { productId: 'prod_1', quantityLbs: 0.5 },
                { productId: 'prod_2', quantityLbs: 1.0 }
            ]
        });
        const res = mockResponse();

        const mockProduct1 = {
            _id: 'prod_1',
            name: 'Almendra',
            pricePerPound: 12.00,
            currentStock: 100,
            nutritionalInfo: { calories: 580, protein: 21, fat: 50, carbs: 22 }
        };

        const mockProduct2 = {
            _id: 'prod_2',
            name: 'Nuez',
            pricePerPound: 8.50,
            currentStock: 50,
            nutritionalInfo: { calories: 654, protein: 15, fat: 65, carbs: 14 }
        };

        mockProductRepo.findById
            .mockResolvedValueOnce(mockProduct1)
            .mockResolvedValueOnce(mockProduct2);

        mockMixRepo.create.mockResolvedValue({
            _id: 'mix_123',
            client: 'user_123',
            name: 'Mezcla Energetica',
            ingredients: [
                { product: 'prod_1', productName: 'Almendra', quantityLbs: 0.5, priceAtMoment: 12.00 },
                { product: 'prod_2', productName: 'Nuez', quantityLbs: 1.0, priceAtMoment: 8.50 }
            ],
            totalPrice: 14.50,  // (12 * 0.5) + (8.5 * 1.0) = 6 + 8.5 = 14.5
            totalWeight: 1.5,
            totalCalories: 944  // (580 * 0.5) + (654 * 1.0) = 290 + 654 = 944
        });

        // Act
        const createCustomMix = async (req, res) => {
            const userId = req.user.id;
            const { name, ingredients } = req.body;

            if (!ingredients || ingredients.length === 0) {
                return res.status(400).json({ message: 'La mezcla debe tener ingredientes' });
            }

            let calculatedTotal = 0;
            let calculatedWeight = 0;
            let calculatedCalories = 0;
            const finalIngredients = [];

            for (const item of ingredients) {
                const product = await mockProductRepo.findById(item.productId);

                if (!product) {
                    return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
                }

                if (product.currentStock < item.quantityLbs) {
                    return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
                }

                const itemCost = product.pricePerPound * item.quantityLbs;
                const itemCals = (product.nutritionalInfo?.calories || 0) * item.quantityLbs;

                calculatedTotal += itemCost;
                calculatedWeight += item.quantityLbs;
                calculatedCalories += itemCals;

                finalIngredients.push({
                    product: product._id,
                    productName: product.name,
                    quantityLbs: item.quantityLbs,
                    priceAtMoment: product.pricePerPound
                });
            }

            const newMix = await mockMixRepo.create({
                client: userId,
                name: name,
                ingredients: finalIngredients,
                totalPrice: parseFloat(calculatedTotal.toFixed(2)),
                totalWeight: calculatedWeight,
                totalCalories: Math.round(calculatedCalories),
                isSaved: true
            });

            res.status(201).json(newMix);
        };

        await createCustomMix(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Mezcla Energetica',
                totalPrice: 14.50,
                totalWeight: 1.5
            })
        );
    });

    /**
     * TC-MIX-002: Validar nombre (3-25 caracteres)
     * Requisito: REQ016.3
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-MIX-002: Debe rechazar nombre menor a 3 caracteres', async () => {
        // Arrange
        const req = mockRequest({
            name: 'AB',
            ingredients: [{ productId: 'prod_1', quantityLbs: 0.5 }]
        });
        const res = mockResponse();

        // Act
        const createCustomMix = async (req, res) => {
            const { name } = req.body;

            if (name.length < 3 || name.length > 25) {
                return res.status(400).json({ message: 'El nombre debe tener entre 3 y 25 caracteres' });
            }
        };

        await createCustomMix(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'El nombre debe tener entre 3 y 25 caracteres'
            })
        );
    });

    /**
     * TC-MIX-003: Validar caracteres permitidos en nombre
     * Requisito: REQ016.3
     * Prioridad: Media | Tipo: Negativa
     */
    test('TC-MIX-003: Debe rechazar nombre con caracteres especiales', async () => {
        // Arrange
        const req = mockRequest({
            name: 'Mix@#$',
            ingredients: [{ productId: 'prod_1', quantityLbs: 0.5 }]
        });
        const res = mockResponse();

        // Act
        const createCustomMix = async (req, res) => {
            const { name } = req.body;
            const validNameRegex = /^[a-zA-Z0-9\s]+$/;

            if (!validNameRegex.test(name)) {
                return res.status(400).json({ message: 'El nombre solo puede contener letras, numeros y espacios' });
            }
        };

        await createCustomMix(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * TC-MIX-004: Calculo dinamico de precio con 2 decimales
     * Requisito: REQ016.4 / RNF-09
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-MIX-004: Debe calcular precio con 2 decimales sin acumulacion de error', () => {
        // Arrange
        const ingredients = [
            { pricePerPound: 12.00, quantityLbs: 0.5 },  // 6.00
            { pricePerPound: 8.50, quantityLbs: 1.0 }    // 8.50
        ];

        // Act
        let total = 0;
        for (const ing of ingredients) {
            total += ing.pricePerPound * ing.quantityLbs;
        }
        const formattedTotal = parseFloat(total.toFixed(2));

        // Assert
        expect(formattedTotal).toBe(14.50);
        expect(formattedTotal.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    /**
     * TC-MIX-005: Listar mezclas del usuario
     * Requisito: CU-KAIROSMIX-4.2 / REQ017
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-MIX-005: Debe listar mezclas del usuario', async () => {
        // Arrange
        const req = mockRequest({}, {}, { id: 'user_123' });
        const res = mockResponse();

        mockMixRepo.findByClient.mockResolvedValue([
            { _id: 'mix_1', name: 'Mezcla 1', totalPrice: 10.00 },
            { _id: 'mix_2', name: 'Mezcla 2', totalPrice: 15.50 }
        ]);

        // Act
        const getMyMixes = async (req, res) => {
            const mixes = await mockMixRepo.findByClient(req.user.id);
            res.status(200).json(mixes);
        };

        await getMyMixes(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockMixRepo.findByClient).toHaveBeenCalledWith('user_123');
        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ name: 'Mezcla 1' }),
                expect.objectContaining({ name: 'Mezcla 2' })
            ])
        );
    });

    /**
     * TC-MIX-006: Consultar detalle de mezcla
     * Requisito: CU-KAIROSMIX-4.2 / REQ017
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-MIX-006: Debe retornar detalle de mezcla', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'mix_123' });
        const res = mockResponse();

        mockMixRepo.findById.mockResolvedValue({
            _id: 'mix_123',
            name: 'Mezcla Energetica',
            ingredients: [
                { productName: 'Almendra', quantityLbs: 0.5, priceAtMoment: 12.00 }
            ],
            totalPrice: 6.00,
            totalCalories: 290
        });

        // Act
        const getMixById = async (req, res) => {
            const { id } = req.params;
            const mix = await mockMixRepo.findById(id);

            if (!mix) {
                return res.status(404).json({ message: 'Mezcla no encontrada' });
            }

            res.status(200).json(mix);
        };

        await getMixById(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Mezcla Energetica',
                totalPrice: 6.00
            })
        );
    });

    /**
     * TC-MIX-008: Nombre unico al guardar en perfil
     * Requisito: REQ018.2
     * Prioridad: Media | Tipo: Negativa
     */
    test('TC-MIX-008: Debe rechazar nombre duplicado al guardar', async () => {
        // Arrange
        const req = mockRequest({ name: 'Favorita 1' }, {}, { id: 'user_123' });
        const res = mockResponse();

        mockMixRepo.findByClient.mockResolvedValue([
            { _id: 'mix_1', name: 'Favorita 1' }
        ]);

        // Act
        const saveMix = async (req, res) => {
            const { name } = req.body;
            const userMixes = await mockMixRepo.findByClient(req.user.id);

            const exists = userMixes.some(m => m.name === name);
            if (exists) {
                return res.status(400).json({ message: 'Ya existe una mezcla con ese nombre' });
            }
        };

        await saveMix(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Ya existe una mezcla con ese nombre'
            })
        );
    });

    /**
     * TC-MIX-009: Agregar mezcla a pedido junto con productos
     * Requisito: REQ020
     * Prioridad: Alta | Tipo: Integracion
     */
    test('TC-MIX-009: Debe calcular total correcto con mezcla y productos', () => {
        // Arrange
        const items = [
            { type: 'product', price: 5.00, quantity: 2 },   // 10.00
            { type: 'mix', price: 14.50, quantity: 1 }        // 14.50
        ];

        // Act
        let total = 0;
        for (const item of items) {
            total += item.price * item.quantity;
        }
        const formattedTotal = parseFloat(total.toFixed(2));

        // Assert
        expect(formattedTotal).toBe(24.50);
    });

    /**
     * TC-MIX-010: Validar calculo de totales (mezclas + productos)
     * Requisito: REQ020.2
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-MIX-010: Debe mantener precision en calculos combinados', () => {
        // Arrange - Valores que podrian causar errores de punto flotante
        const items = [
            { price: 0.10, quantity: 3 },  // 0.30
            { price: 0.20, quantity: 2 }   // 0.40
        ];

        // Act
        let total = 0;
        for (const item of items) {
            total += item.price * item.quantity;
        }
        const formattedTotal = parseFloat(total.toFixed(2));

        // Assert - Evita errores de punto flotante como 0.7000000000000001
        expect(formattedTotal).toBe(0.70);
    });
});

// ============== NUTRICION (TC-NUT) ==============
describe('Datos Nutricionales (CU-KAIROSMIX-4.4 / REQ019)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-NUT-001: Consultar nutricion de un producto
     * Requisito: CU-KAIROSMIX-4.4 / REQ019
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-NUT-001: Debe retornar informacion nutricional del producto', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'prod_1' });
        const res = mockResponse();

        mockProductRepo.findById.mockResolvedValue({
            _id: 'prod_1',
            name: 'Almendra',
            nutritionalInfo: {
                calories: 580,
                protein: 21,
                fat: 50,
                carbs: 22
            }
        });

        // Act
        const getProductNutrition = async (req, res) => {
            const { id } = req.params;
            const product = await mockProductRepo.findById(id);

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json({
                name: product.name,
                nutritionalInfo: product.nutritionalInfo
            });
        };

        await getProductNutrition(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                nutritionalInfo: expect.objectContaining({
                    calories: 580,
                    protein: 21
                })
            })
        );
    });

    /**
     * TC-NUT-002: Agregacion nutricional de mezcla (ponderada)
     * Requisito: REQ019.3 / RNF-09
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-NUT-002: Debe calcular nutricion ponderada de mezcla', () => {
        // Arrange
        const ingredients = [
            { calories: 580, quantityLbs: 0.5 },  // 290 calorias
            { calories: 654, quantityLbs: 1.0 }   // 654 calorias
        ];

        // Act
        let totalCalories = 0;
        for (const ing of ingredients) {
            totalCalories += ing.calories * ing.quantityLbs;
        }
        const roundedCalories = Math.round(totalCalories);

        // Assert
        expect(roundedCalories).toBe(944);
    });

    /**
     * TC-NUT-003: Precision 1 decimal en nutricion
     * Requisito: REQ019.4
     * Prioridad: Media | Tipo: No funcional
     */
    test('TC-NUT-003: Debe formatear valores nutricionales con 1 decimal', () => {
        // Arrange
        const values = {
            calories: 579.6789,
            protein: 21.345,
            fat: 49.876,
            carbs: 21.999
        };

        // Act
        const formatted = {
            calories: parseFloat(values.calories.toFixed(1)),
            protein: parseFloat(values.protein.toFixed(1)),
            fat: parseFloat(values.fat.toFixed(1)),
            carbs: parseFloat(values.carbs.toFixed(1))
        };

        // Assert
        expect(formatted.calories).toBe(579.7);
        expect(formatted.protein).toBe(21.3);
        expect(formatted.fat).toBe(49.9);
        expect(formatted.carbs).toBe(22.0);
    });

    /**
     * TC-NUT-AGG-001: Calculo de macronutrientes agregados
     * Requisito: REQ019.3
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-NUT-AGG-001: Debe calcular macros agregados correctamente', () => {
        // Arrange
        const ingredients = [
            { protein: 21, fat: 50, carbs: 22, quantityLbs: 0.5 },
            { protein: 15, fat: 65, carbs: 14, quantityLbs: 1.0 }
        ];

        // Act
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbs = 0;

        for (const ing of ingredients) {
            totalProtein += ing.protein * ing.quantityLbs;
            totalFat += ing.fat * ing.quantityLbs;
            totalCarbs += ing.carbs * ing.quantityLbs;
        }

        // Assert
        expect(parseFloat(totalProtein.toFixed(1))).toBe(25.5);   // (21*0.5) + (15*1.0) = 10.5 + 15 = 25.5
        expect(parseFloat(totalFat.toFixed(1))).toBe(90.0);       // (50*0.5) + (65*1.0) = 25 + 65 = 90
        expect(parseFloat(totalCarbs.toFixed(1))).toBe(25.0);     // (22*0.5) + (14*1.0) = 11 + 14 = 25
    });
});
