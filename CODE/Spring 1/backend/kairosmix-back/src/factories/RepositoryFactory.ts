// --- Importaciones Existentes ---
import { IProductRepository, MongoProductRepository } from '../repositories/ProductRepository.js';
import { IClientRepository, MongoClientRepository } from '../repositories/ClientRepository.js';

// --- NUEVAS IMPORTACIONES (Auth y Pedidos) ---
// Asegúrate de que estos archivos exporten tanto la Interfaz como la Clase
import { IUserRepository, MongoUserRepository } from '../repositories/MongoUserRepository.js';
import { IOrderRepository, MongoOrderRepository } from '../repositories/MongoOrderRepository.js';

export class RepositoryFactory {
    
    // ---------------------------------------------------------
    // 1. Repositorio de Productos
    // ---------------------------------------------------------
    static getProductRepository(): IProductRepository {
        const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO'; 

        if (dbType === 'MONGO') {
            return new MongoProductRepository();
        } 
        
        throw new Error(`[FACTORY ERROR] El tipo de BD '${dbType}' no está soportado para Productos.`);
    }

    // ---------------------------------------------------------
    // 2. Repositorio de Clientes
    // ---------------------------------------------------------
    static getClientRepository(): IClientRepository {
        const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
        
        if (dbType === 'MONGO') {
            return new MongoClientRepository();
        } 

        throw new Error(`[FACTORY ERROR] El tipo de BD '${dbType}' no está soportado para Clientes.`);
    }

    // ---------------------------------------------------------
    // 3. NUEVO: Repositorio de Usuarios (Login/Auth)
    // ---------------------------------------------------------
    static getUserRepository(): IUserRepository {
        const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
        
        if (dbType === 'MONGO') {
            return new MongoUserRepository();
        } 

        throw new Error(`[FACTORY ERROR] El tipo de BD '${dbType}' no está soportado para Usuarios.`);
    }

    // ---------------------------------------------------------
    // 4. NUEVO: Repositorio de Pedidos (Orders)
    // ---------------------------------------------------------
    static getOrderRepository(): IOrderRepository {
        const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
        
        if (dbType === 'MONGO') {
            return new MongoOrderRepository();
        } 

        throw new Error(`[FACTORY ERROR] El tipo de BD '${dbType}' no está soportado para Pedidos.`);
    }
}