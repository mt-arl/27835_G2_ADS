const API_URL = 'http://localhost:3000/api';

// Obtener token del cliente
const getToken = () => {
    return localStorage.getItem('clientToken');
};

/**
 * Crear un nuevo pedido
 * @param {Array} items - Lista de items [{productId, quantity}, {mixId, quantity}]
 */
export const createOrder = async (items) => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el pedido');
    }

    return await response.json();
};

/**
 * Obtener pedidos del usuario actual
 */
export const getOrders = async () => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener los pedidos');
    }

    return await response.json();
};

/**
 * Obtener TODOS los pedidos (admin)
 */
export const getAllOrders = async () => {
    const token = getToken();

    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener los pedidos');
    }

    return await response.json();
};

/**
 * Actualizar estado de un pedido
 * @param {string} id - ID del pedido
 * @param {string} status - Nuevo estado (pendiente, pagado, despachado, completado)
 */
export const updateOrderStatus = async (id, status) => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el estado del pedido');
    }

    return await response.json();
};

/**
 * Cancelar/eliminar un pedido (solo en estado pendiente para clientes)
 * @param {string} id - ID del pedido
 */
export const cancelOrder = async (id) => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cancelar el pedido');
    }

    return await response.json();
};

/**
 * Obtener un pedido por ID
 * @param {string} id - ID del pedido
 */
export const getOrderById = async (id) => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener el pedido');
    }

    return await response.json();
};
