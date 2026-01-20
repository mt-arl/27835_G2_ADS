import { Request, Response } from 'express';
import { RepositoryFactory } from '../factories/RepositoryFactory.js'; // <--- FACTORY

// Usamos Factory
const clientRepo = RepositoryFactory.getClientRepository();

// Crear cliente
export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cedula, nombre, correo, telefono, direccion } = req.body;

        // ===== VALIDACIONES =====

        // Validar campos requeridos
        if (!cedula || !nombre || !correo || !telefono || !direccion) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }

        // Validar que los campos no estén vacíos (solo espacios)
        if (!cedula.trim() || !nombre.trim() || !correo.trim() || !telefono.trim() || !direccion.trim()) {
            res.status(400).json({ message: 'Los campos no pueden estar vacíos' });
            return;
        }

        // Validar formato de Número de Identificación (Cédula, RUC o Pasaporte)
        const cedulaRegex = /^\d{10}$/;  // Cédula: 10 dígitos numéricos
        const rucRegex = /^\d{13}$/;     // RUC: 13 dígitos numéricos
        const passportRegex = /^[A-Za-z0-9]{6,9}$/;  // Pasaporte: 6-9 caracteres alfanuméricos

        const isValidCedula = cedulaRegex.test(cedula);
        const isValidRuc = rucRegex.test(cedula);
        const isValidPassport = passportRegex.test(cedula);

        if (!isValidCedula && !isValidRuc && !isValidPassport) {
            res.status(400).json({ 
                message: 'Formato de identificación inválido. Debe ser: Cédula (10 dígitos), RUC (13 dígitos) o Pasaporte (6-9 caracteres alfanuméricos)' 
            });
            return;
        }

        // Validar cédula única
        const existingClient = await clientRepo.findByCedula(cedula);
        if (existingClient) {
            res.status(400).json({ message: 'El número de identificación ya está registrado' });
            return;
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            res.status(400).json({ message: 'Formato de correo electrónico inválido' });
            return;
        }

        // Validar formato de teléfono (10 dígitos)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(telefono)) {
            res.status(400).json({ message: 'Formato de teléfono inválido. Debe tener 10 dígitos numéricos' });
            return;
        }

        // ===== CREAR CLIENTE =====

        const newClient = await clientRepo.create({
            cedula,
            nombre,
            correo,
            telefono,
            direccion,
            isActive: true
        });

        res.status(201).json({ 
            message: 'Cliente registrado exitosamente', 
            client: newClient 
        });
    } catch (error: any) {
        // Error de cédula duplicada (por si acaso pasa la validación previa)
        if (error.code === 11000) {
            res.status(400).json({ message: 'El número de identificación ya está registrado' });
            return;
        }
        res.status(500).json({ message: 'Error al registrar cliente', error });
    }
};

// Obtener todos los clientes
export const getClients = async (req: Request, res: Response): Promise<void> => {
    try {
        const clients = await clientRepo.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clientes', error });
    }
};

// Obtener cliente por ID
export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const client = await clientRepo.findById(id);

        if (!client) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cliente', error });
    }
};

// Actualizar cliente
export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nombre, correo, telefono, direccion } = req.body;

        const updateData: any = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (correo !== undefined) updateData.correo = correo;
        if (telefono !== undefined) updateData.telefono = telefono;
        if (direccion !== undefined) updateData.direccion = direccion;

        const updatedClient = await clientRepo.update(id, updateData);

        if (!updatedClient) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        res.status(200).json({ 
            message: 'Cliente actualizado exitosamente', 
            client: updatedClient 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar cliente', error });
    }
};

// Desactivar cliente
export const deactivateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const client = await clientRepo.deactivate(id);

        if (!client) {
            res.status(404).json({ message: 'Cliente no encontrado o ya está inactivo' });
            return;
        }

        res.status(200).json({ 
            message: 'Cliente desactivado exitosamente', 
            client 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar cliente', error });
    }
};
