import { Request, Response } from 'express';
import { RepositoryFactory } from '../factories/RepositoryFactory.js';

// Usamos el Factory para obtener el repositorio
const clientRepo = RepositoryFactory.getClientRepository();

// --- 1. CREAR / REGISTRAR CLIENTE (TC-CLIE-001) ---
export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cedula, nombre, correo, telefono, direccion, password } = req.body;

        // Validaciones de campos requeridos
        if (!cedula || !nombre || !correo || !telefono || !direccion || !password) {
            res.status(400).json({ message: 'Todos los campos son requeridos, incluida la contraseña' });
            return;
        }

        // Validar formato de identificación (Cédula 10 o RUC 13)
        const cedulaRegex = /^\d{10}$/;
        const rucRegex = /^\d{13}$/;
        if (!cedulaRegex.test(cedula) && !rucRegex.test(cedula)) {
            res.status(400).json({ message: 'Formato de identificación inválido' });
            return;
        }

        // Validar si ya existe
        const existingClient = await clientRepo.findByCedula(cedula);
        if (existingClient) {
            res.status(400).json({ message: 'El número de identificación ya está registrado' });
            return;
        }

        // Crear cliente (El modelo se encarga de encriptar el password)
        const newClient = await clientRepo.create({
            cedula,
            nombre,
            correo,
            telefono,
            direccion,
            password,
            isActive: true
        });

        res.status(201).json({ 
            message: 'Cliente registrado exitosamente', 
            client: { nombre: newClient.nombre, correo: newClient.correo } 
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
    }
};

// --- 2. OBTENER TODOS LOS CLIENTES ---
export const getClients = async (req: Request, res: Response): Promise<void> => {
    try {
        const clients = await clientRepo.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clientes', error });
    }
};

// --- 3. OBTENER CLIENTE POR ID ---
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

// --- 4. ACTUALIZAR CLIENTE (TC-CLIE-004) ---
export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nombre, correo, telefono, direccion } = req.body;

        const updatedClient = await clientRepo.update(id, { nombre, correo, telefono, direccion });

        if (!updatedClient) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Cliente actualizado', client: updatedClient });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar cliente', error });
    }
};

// --- 5. DESACTIVAR CLIENTE (EL QUE CAUSABA EL ERROR) ---
export const deactivateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const client = await clientRepo.deactivate(id);

        if (!client) {
            res.status(404).json({ message: 'Cliente no encontrado o ya inactivo' });
            return;
        }
        res.status(200).json({ message: 'Cliente desactivado exitosamente', client });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar cliente', error });
    }
};