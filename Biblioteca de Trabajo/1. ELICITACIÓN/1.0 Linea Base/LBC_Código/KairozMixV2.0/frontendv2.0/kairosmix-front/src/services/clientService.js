const API_URL = 'http://localhost:3000/api/clients';

/**
 * Crear un nuevo cliente
 * @param {Object} clientData - Datos del cliente (cedula, nombre, correo, telefono, direccion)
 * @returns {Promise<Object>} Cliente creado
 */
export const createClient = async (clientData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar cliente');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener todos los clientes activos
 * @returns {Promise<Array>} Lista de clientes
 */
export const getClients = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Error al obtener clientes');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener un cliente por ID
 * @param {string} id - ID del cliente
 * @returns {Promise<Object>} Cliente encontrado
 */
export const getClientById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Cliente no encontrado');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un cliente
 * @param {string} id - ID del cliente
 * @param {Object} clientData - Datos a actualizar
 * @returns {Promise<Object>} Cliente actualizado
 */
export const updateClient = async (id, clientData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar cliente');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Desactivar un cliente
 * @param {string} id - ID del cliente
 * @returns {Promise<Object>} Cliente desactivado
 */
export const deactivateClient = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/deactivate`, {
      method: 'PATCH',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al desactivar cliente');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};
