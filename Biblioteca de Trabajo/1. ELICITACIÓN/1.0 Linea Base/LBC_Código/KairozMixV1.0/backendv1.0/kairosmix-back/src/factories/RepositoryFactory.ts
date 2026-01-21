import { IProductRepository, MongoProductRepository } from '../repositories/ProductRepository.js';
import { IClientRepository, MongoClientRepository } from '../repositories/ClientRepository.js';

export class RepositoryFactory {
    
    // Método estático para obtener el repositorio de Productos
    static getProductRepository(): IProductRepository {
        // Leemos la variable de entorno, por defecto es 'MONGO'
        const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO'; 

        if (dbType === 'MONGO') {
            return new MongoProductRepository();
        } 
        
        // Si no es MONGO, lanzamos un error claro
        throw new Error(`[FACTORY ERROR] El tipo de BD '${dbType}' no está soportado para Productos.`);
    }

    // Método estático para obtener el repositorio de Clientes
    static getClientRepository(): IClientRepository {
        const dbType = process.env.DB_TYPE?.toUpperCase() || 'MONGO';
        
        if (dbType === 'MONGO') {
            return new MongoClientRepository();
        } 

        // Si no es MONGO, lanzamos un error claro
        throw new Error(`[FACTORY ERROR] El tipo de BD '${dbType}' no está soportado para Clientes.`);
    }
}