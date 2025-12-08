import { Request, Response } from 'express';
import { MongoClientRepository } from '../repositories/ClientRepository.js';

const clientRepo = new MongoClientRepository();

// Crear cliente
export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cedula, nombre, correo, telefono, direccion } = req.body;

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
        // Error de cédula duplicada
        if (error.code === 11000) {
            res.status(400).json({ message: 'La cédula ya está registrada' });
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
