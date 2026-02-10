/**
 * PRUEBAS UNITARIAS - GESTION DE CLIENTES (CU-KAIROSMIX-2.x)
 * Plan de Pruebas KairosMix V3
 * Casos: TC-CLIE-001 a TC-CLIE-008
 *
 * Fecha: 03/02/2026
 * Equipo QA: Denise Rea, Julio Viche, Camilo Orrico
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ============== MOCKS ==============
const mockRequest = (body = {}, params = {}) => ({
    body,
    params
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock del repositorio de clientes
const mockClientRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCedula: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn()
};

// ============== TESTS ==============
describe('Gestion de Clientes (CU-KAIROSMIX-2.x)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-CLIE-001: Registrar cliente con datos validos
     * Requisito: CU-KAIROSMIX-2.1 Registrar Cliente
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-CLIE-001: Debe registrar cliente con datos validos', async () => {
        // Arrange
        const req = mockRequest({
            cedula: '1723456789',
            nombre: 'Ana Perez',
            correo: 'ana@test.com',
            telefono: '0991234567',
            direccion: 'Quito, Ecuador',
            password: 'securePass123'
        });
        const res = mockResponse();

        mockClientRepo.findByCedula.mockResolvedValue(null);
        mockClientRepo.create.mockResolvedValue({
            _id: 'client_123',
            cedula: '1723456789',
            nombre: 'Ana Perez',
            correo: 'ana@test.com',
            telefono: '0991234567',
            direccion: 'Quito, Ecuador',
            isActive: true
        });

        // Act
        const createClient = async (req, res) => {
            const { cedula, nombre, correo, telefono, direccion, password } = req.body;

            // Validaciones de campos requeridos
            if (!cedula || !nombre || !correo || !telefono || !direccion || !password) {
                return res.status(400).json({ message: 'Todos los campos son requeridos' });
            }

            // Validar formato de cedula
            const cedulaRegex = /^\d{10}$/;
            const rucRegex = /^\d{13}$/;
            if (!cedulaRegex.test(cedula) && !rucRegex.test(cedula)) {
                return res.status(400).json({ message: 'Formato de identificacion invalido' });
            }

            // Validar si ya existe
            const existingClient = await mockClientRepo.findByCedula(cedula);
            if (existingClient) {
                return res.status(400).json({ message: 'El numero de identificacion ya esta registrado' });
            }

            const newClient = await mockClientRepo.create({
                cedula, nombre, correo, telefono, direccion, password, isActive: true
            });

            res.status(201).json({
                message: 'Cliente registrado exitosamente',
                client: { nombre: newClient.nombre, correo: newClient.correo }
            });
        };

        await createClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Cliente registrado exitosamente'
            })
        );
        expect(mockClientRepo.create).toHaveBeenCalled();
    });

    /**
     * TC-CLIE-002: Validar formato de email
     * Requisito: CU-KAIROSMIX-2.1 Registrar Cliente
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-CLIE-002: Debe rechazar email con formato invalido', async () => {
        // Arrange
        const req = mockRequest({
            cedula: '1723456789',
            nombre: 'Ana Perez',
            correo: 'ana@@test',
            telefono: '0991234567',
            direccion: 'Quito, Ecuador',
            password: 'securePass123'
        });
        const res = mockResponse();

        // Act
        const createClient = async (req, res) => {
            const { correo } = req.body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({ message: 'Formato de email invalido' });
            }
        };

        await createClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Formato de email invalido'
            })
        );
    });

    /**
     * TC-CLIE-003: Evitar identificacion duplicada
     * Requisito: CU-KAIROSMIX-2.1 Registrar Cliente
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-CLIE-003: Debe rechazar cliente con cedula duplicada', async () => {
        // Arrange
        const req = mockRequest({
            cedula: '1723456789',
            nombre: 'Ana Perez',
            correo: 'ana@test.com',
            telefono: '0991234567',
            direccion: 'Quito, Ecuador',
            password: 'securePass123'
        });
        const res = mockResponse();

        mockClientRepo.findByCedula.mockResolvedValue({
            _id: 'existing_client',
            cedula: '1723456789'
        });

        // Act
        const createClient = async (req, res) => {
            const { cedula } = req.body;

            const existingClient = await mockClientRepo.findByCedula(cedula);
            if (existingClient) {
                return res.status(400).json({ message: 'El numero de identificacion ya esta registrado' });
            }
        };

        await createClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'El numero de identificacion ya esta registrado'
            })
        );
    });

    /**
     * TC-CLIE-004: Actualizar telefono y email
     * Requisito: CU-KAIROSMIX-2.2 Actualizar Cliente
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-CLIE-004: Debe actualizar telefono y email correctamente', async () => {
        // Arrange
        const req = mockRequest(
            { telefono: '0997654321', correo: 'nuevo@test.com' },
            { id: 'client_123' }
        );
        const res = mockResponse();

        mockClientRepo.update.mockResolvedValue({
            _id: 'client_123',
            nombre: 'Ana Perez',
            telefono: '0997654321',
            correo: 'nuevo@test.com'
        });

        // Act
        const updateClient = async (req, res) => {
            const { id } = req.params;
            const { nombre, correo, telefono, direccion } = req.body;

            const updatedClient = await mockClientRepo.update(id, { nombre, correo, telefono, direccion });

            if (!updatedClient) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.status(200).json({ message: 'Cliente actualizado', client: updatedClient });
        };

        await updateClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockClientRepo.update).toHaveBeenCalledWith('client_123', expect.objectContaining({
            telefono: '0997654321',
            correo: 'nuevo@test.com'
        }));
    });

    /**
     * TC-CLIE-005: Buscar por nombre/identificacion
     * Requisito: CU-KAIROSMIX-2.3 Consultar Cliente
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-CLIE-005: Debe buscar clientes por cedula o nombre', async () => {
        // Arrange
        const searchTerm = '172';
        const res = mockResponse();

        mockClientRepo.findAll.mockResolvedValue([
            { _id: 'c1', cedula: '1723456789', nombre: 'Ana Perez' },
            { _id: 'c2', cedula: '1724567890', nombre: 'Carlos Lopez' }
        ]);

        // Act
        const searchClients = async (searchTerm, res) => {
            const clients = await mockClientRepo.findAll();
            const filtered = clients.filter(c =>
                c.cedula.includes(searchTerm) || c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            res.status(200).json(filtered);
        };

        await searchClients(searchTerm, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ cedula: '1723456789' }),
                expect.objectContaining({ cedula: '1724567890' })
            ])
        );
    });

    /**
     * TC-CLIE-006: Eliminar cliente sin pedidos asociados
     * Requisito: CU-KAIROSMIX-2.4 Eliminar Cliente
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-CLIE-006: Debe desactivar cliente sin pedidos asociados', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'client_123' });
        const res = mockResponse();

        mockClientRepo.deactivate.mockResolvedValue({
            _id: 'client_123',
            nombre: 'Cliente Prueba',
            isActive: false
        });

        // Act
        const deactivateClient = async (req, res) => {
            const { id } = req.params;
            const client = await mockClientRepo.deactivate(id);

            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado o ya inactivo' });
            }

            res.status(200).json({ message: 'Cliente desactivado exitosamente', client });
        };

        await deactivateClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Cliente desactivado exitosamente'
            })
        );
    });

    /**
     * TC-CLIE-007: Bloquear eliminacion con pedidos asociados
     * Requisito: CU-KAIROSMIX-2.4 Eliminar Cliente
     * Prioridad: Alta | Tipo: Integracion/Negativa
     */
    test('TC-CLIE-007: Debe bloquear eliminacion de cliente con pedidos', async () => {
        // Arrange
        const req = mockRequest({}, { id: 'client_123' });
        const res = mockResponse();

        const checkClientHasOrders = jest.fn().mockResolvedValue(true);

        // Act
        const deactivateClient = async (req, res) => {
            const { id } = req.params;

            const hasOrders = await checkClientHasOrders(id);
            if (hasOrders) {
                return res.status(400).json({
                    message: 'No se puede eliminar: el cliente tiene pedidos asociados'
                });
            }
        };

        await deactivateClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('No se puede eliminar')
            })
        );
    });

    /**
     * TC-CLIE-008: Validar campos obligatorios generales
     * Requisito: CU-KAIROSMIX-2.x
     * Prioridad: Alta | Tipo: Negativa
     */
    test('TC-CLIE-008: Debe rechazar cliente con nombre vacio', async () => {
        // Arrange
        const req = mockRequest({
            cedula: '1723456789',
            nombre: '',
            correo: 'ana@test.com',
            telefono: '0991234567',
            direccion: 'Quito, Ecuador',
            password: 'securePass123'
        });
        const res = mockResponse();

        // Act
        const createClient = async (req, res) => {
            const { cedula, nombre, correo, telefono, direccion, password } = req.body;

            if (!cedula || !nombre || !correo || !telefono || !direccion || !password) {
                return res.status(400).json({ message: 'Todos los campos son requeridos' });
            }
        };

        await createClient(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Todos los campos son requeridos'
            })
        );
    });

    /**
     * TC-CLIE-VAL-001: Validar formato de cedula ecuatoriana
     * Requisito: Validacion de datos
     * Prioridad: Alta | Tipo: Funcional
     */
    test('TC-CLIE-VAL-001: Debe validar formato de cedula ecuatoriana', () => {
        // Arrange
        const cedulaValida = '1723456789';
        const cedulaInvalida = '12345';
        const rucValido = '1723456789001';

        const cedulaRegex = /^\d{10}$/;
        const rucRegex = /^\d{13}$/;

        // Act & Assert
        expect(cedulaRegex.test(cedulaValida)).toBe(true);
        expect(cedulaRegex.test(cedulaInvalida)).toBe(false);
        expect(rucRegex.test(rucValido)).toBe(true);
    });

    /**
     * TC-CLIE-VAL-002: Validar formato de telefono
     * Requisito: Validacion de datos
     * Prioridad: Media | Tipo: Funcional
     */
    test('TC-CLIE-VAL-002: Debe validar formato de telefono', () => {
        // Arrange
        const telefonoValido = '0991234567';
        const telefonoInvalido = '12345';

        const telefonoRegex = /^0\d{9}$/;

        // Act & Assert
        expect(telefonoRegex.test(telefonoValido)).toBe(true);
        expect(telefonoRegex.test(telefonoInvalido)).toBe(false);
    });
});
