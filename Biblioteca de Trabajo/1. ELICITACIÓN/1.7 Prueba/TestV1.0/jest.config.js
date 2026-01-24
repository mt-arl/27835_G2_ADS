/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // 1. Usar ts-jest para compilar los archivos de prueba
  preset: 'ts-jest/presets/default-esm', 
  
  // 2. Entorno de Node
  testEnvironment: 'node',
  
  // 3. Extensiones que deben tratarse como Módulos (ESM)
  extensionsToTreatAsEsm: ['.ts'],
  
  // 4. Mapeo de nombres (CRÍTICO para tus imports con .js)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  // 5. Configuración de transformación
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};