import { RepositoryFactory } from '../src/factories/RepositoryFactory';
import { MongoProductRepository } from '../src/repositories/ProductRepository';

describe('RepositoryFactory', () => {
    
    // Antes de cada prueba, aseguramos que el entorno sea MONGO
    beforeAll(() => {
        process.env.DB_TYPE = 'MONGO';
    });

    test('debe retornar una instancia de MongoProductRepository cuando el tipo es MONGO', () => {
        const repo = RepositoryFactory.getProductRepository();
        expect(repo).toBeInstanceOf(MongoProductRepository);
    });

    test('debe lanzar un error si intentamos pedir un repo no soportado', () => {
        process.env.DB_TYPE = 'MYSQL'; // Cambiamos la variable a algo falso
        
        expect(() => {
            RepositoryFactory.getProductRepository();
        }).toThrow(/no está soportado/); // Regex para buscar parte del mensaje de error
    });
});