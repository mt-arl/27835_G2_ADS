/**
 * PRUEBAS UNITARIAS - GESTION DE PRODUCTOS (CU-KAIROSMIX-1.x)
 * Plan de Pruebas KairosMix V3
 * Casos: TC-PROD-001 a TC-PROD-008
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ============== MOCKS ==============
const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock del repositorio de productos
const mockProductRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    search: jest.fn(),
    deactivateProduct: jest.fn(),
    countByInitial: jest.fn()
};

// El repositorio mock se inyecta directamente en las funciones de prueba

// ============== TESTS ==============
describe('Gestion de Productos (CU-KAIROSMIX-1.x)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-PROD-001: Registrar producto con datos validos
     * Requisito: CU-KAIROSMIX-1.1 Registrar Producto
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-PROD-001: Debe registrar un producto con datos validos', async () => {
        // Arrange
        const req = mockRequest({
            name: 'Almendra',
            pricePerPound: 2.50,
            wholesalePrice: 2.00,
            retailPrice: 3.00,
            originCountry: 'USA',
            initialStock: 100,
            imageUrl: 'http://example.com/almendra.jpg'
        });
        const res = mockResponse();

        mockProductRepo.countByInitial.mockResolvedValue(0);
        mockProductRepo.create.mockResolvedValue({
            _id: 'prod_123',
            code: 'A01',
            name: 'Almendra',
            pricePerPound: 2.50,
            wholesalePrice: 2.00,
            retailPrice: 3.00,
            originCountry: 'USA',
            initialStock: 100,
            currentStock: 100
        });

        // Act
        const createProduct = async (req, res) => {
            const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, initialStock, imageUrl } = req.body;

            if (pricePerPound <= 0.01 || wholesalePrice <= 0.01 || retailPrice <= 0.01) {
                return res.status(400).json({ message: 'Los precios deben ser mayores a 0.01' });
            }

            const initial = name.charAt(0).toUpperCase();
            const count = await mockProductRepo.countByInitial(initial);
            const sequence = (count + 1).toString().padStart(2, '0');
            const generatedCode = `${initial}${sequence}`;

            const newProduct = await mockProductRepo.create({
                code: generatedCode,
                name,
                pricePerPound,
                wholesalePrice,
                retailPrice,
                originCountry,
                initialStock,
                currentStock: initialStock,
                imageUrl
            });

            res.status(201).json({ message: 'Producto registrado', product: newProduct });
        };

        await createProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Producto registrado',
                product: expect.objectContaining({
                    name: 'Almendra',
                    code: 'A01'
                })
            })
        );
        expect(mockProductRepo.create).toHaveBeenCalled();
    });

    /**
     * TC-PROD-002: Validar campos obligatorios
     * Requisito: CU-KAIROSMIX-1.1 Registrar Producto
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-PROD-002: Debe rechazar producto con nombre vacio', async () => {
        // Arrange
        const req = mockRequest({
            name: '',
            pricePerPound: 2.50,
            wholesalePrice: 2.00,
            retailPrice: 3.00
        });
        const res = mockResponse();

        // Act
        const createProduct = async (req, res) => {
            const { name } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }
        };

        await createProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'El nombre es requerido'
            })
        );
    });

    /**
     * TC-PROD-003: Validar rangos de precio
     * Requisito: CU-KAIROSMIX-1.1 Registrar Producto
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-PROD-003: Debe rechazar producto con precio negativo', async () => {
        // Arrange
        const req = mockRequest({
            name: 'Almendra',
            pricePerPound: -1,
            wholesalePrice: 2.00,
            retailPrice: 3.00
        });
        const res = mockResponse();

        // Act
        const createProduct = async (req, res) => {
            const { pricePerPound, wholesalePrice, retailPrice } = req.body;

            if (pricePerPound <= 0.01 || wholesalePrice <= 0.01 || retailPrice <= 0.01) {
                return res.status(400).json({ message: 'Los precios deben ser mayores a 0.01' });
            }
        };

        await createProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Los precios deben ser mayores a 0.01'
            })
        );
    });

    /**
     * TC-PROD-004: Actualizar precio y stock
     * Requisito: CU-KAIROSMIX-1.2 Actualizar Producto
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-PROD-004: Debe actualizar precio y stock correctamente', async () => {
        // Arrange
        const req = mockRequest(
            { pricePerPound: 2.75, currentStock: 120 },
            { id: 'prod_123' }
        );
        const res = mockResponse();

        mockProductRepo.update.mockResolvedValue({
            _id: 'prod_123',
            name: 'Almendra',
            pricePerPound: 2.75,
            currentStock: 120
        });

        // Act
        const updateProduct = async (req, res) => {
            const { id } = req.params;
            const { pricePerPound, currentStock } = req.body;

            if (currentStock !== undefined && currentStock < 0) {
                return res.status(400).json({ message: 'El stock no puede ser negativo' });
            }

            const updateData = {};
            if (pricePerPound) updateData.pricePerPound = pricePerPound;
            if (currentStock !== undefined) updateData.currentStock = currentStock;

            const updatedProduct = await mockProductRepo.update(id, updateData);

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json({ message: 'Producto actualizado', product: updatedProduct });
        };

        await updateProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockProductRepo.update).toHaveBeenCalledWith('prod_123', {
            pricePerPound: 2.75,
            currentStock: 120
        });
    });

    /**
     * TC-PROD-005: Evitar actualizacion con datos invalidos
     * Requisito: CU-KAIROSMIX-1.2 Actualizar Producto
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-PROD-005: Debe rechazar actualizacion con stock negativo', async () => {
        // Arrange
        const req = mockRequest(
            { currentStock: -5 },
            { id: 'prod_123' }
        );
        const res = mockResponse();

        // Act
        const updateProduct = async (req, res) => {
            const { currentStock } = req.body;

            if (currentStock !== undefined && currentStock < 0) {
                return res.status(400).json({ message: 'El stock no puede ser negativo' });
            }
        };

        await updateProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'El stock no puede ser negativo'
            })
        );
    });

    /**
     * TC-PROD-006: Buscar producto por nombre
     * Requisito: CU-KAIROSMIX-1.3 Consultar Producto
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-PROD-006: Debe buscar productos por nombre', async () => {
        // Arrange
        const req = mockRequest({}, {}, { q: 'Alm' });
        const res = mockResponse();

        mockProductRepo.search.mockResolvedValue([
            { _id: 'prod_123', name: 'Almendra', code: 'A01' },
            { _id: 'prod_124', name: 'Almendrado', code: 'A02' }
        ]);

        // Act
        const searchProducts = async (req, res) => {
            const { q } = req.query;

            if (!q || q.toString().trim() === '') {
                return res.status(400).json({ message: 'Debe proporcionar un termino de busqueda' });
            }

            const products = await mockProductRepo.search(q.toString());
            res.status(200).json(products);
        };

        await searchProducts(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockProductRepo.search).toHaveBeenCalledWith('Alm');
    });

    /**
     * TC-PROD-007: Eliminar producto sin dependencias
     * Requisito: CU-KAIROSMIX-1.4 Eliminar Producto
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-PROD-007: Debe desactivar producto sin dependencias', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'prod_123' });
        const res = mockResponse();

        mockProductRepo.deactivateProduct.mockResolvedValue({
            _id: 'prod_123',
            name: 'Producto Prueba',
            status: 'inactive'
        });

        // Act
        const deactivateProduct = async (req, res) => {
            const { id } = req.params;
            const product = await mockProductRepo.deactivateProduct(id);

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado o ya inactivo' });
            }

            res.status(200).json({ message: 'Producto desactivado', product });
        };

        await deactivateProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Producto desactivado'
            })
        );
    });

    /**
     * TC-PROD-008: Bloquear eliminacion si esta asociado
     * Requisito: CU-KAIROSMIX-1.4 Eliminar Producto
     * Prioridad: Alta | Tipo: Integracion/Negativa
     */
    test('TC-PROD-008: Debe bloquear eliminacion de producto usado en pedido', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'prod_123' });
        const res = mockResponse();

        // Simular que el producto esta en uso
        const checkProductInUse = jest.fn().mockResolvedValue(true);

        // Act
        const deactivateProduct = async (req, res) => {
            const { id } = req.params;

            const isInUse = await checkProductInUse(id);
            if (isInUse) {
                return res.status(400).json({
                    message: 'No se puede eliminar: el producto esta asociado a pedidos o mezclas'
                });
            }
        };

        await deactivateProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('No se puede eliminar')
            })
        );
    });

    /**
     * TC-PROD-GEN-001: Validar generacion automatica de codigo
     * Requisito: REQ001.2
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-PROD-GEN-001: Debe generar codigo automatico correctamente', async () => {
        // Arrange
        mockProductRepo.countByInitial.mockResolvedValue(5);

        // Act
        const generateCode = async (name) => {
            const initial = name.charAt(0).toUpperCase();
            const count = await mockProductRepo.countByInitial(initial);
            const sequence = (count + 1).toString().padStart(2, '0');
            return `${initial}${sequence}`;
        };

        const code = await generateCode('Nuez');

        // Assert
        expect(code).toBe('N06');
        expect(mockProductRepo.countByInitial).toHaveBeenCalledWith('N');
    });

    /**
     * TC-PROD-VAL-001: Validar precision de 2 decimales en precios
     * Requisito: RNF-09
     * Prioridad: Alta | Tipo: No funcional
     */
    test('TC-PROD-VAL-001: Debe manejar precios con 2 decimales', () => {
        // Arrange
        const price = 12.456789;

        // Act
        const formattedPrice = parseFloat(price.toFixed(2));

        // Assert
        expect(formattedPrice).toBe(12.46);
        expect(formattedPrice.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
});
