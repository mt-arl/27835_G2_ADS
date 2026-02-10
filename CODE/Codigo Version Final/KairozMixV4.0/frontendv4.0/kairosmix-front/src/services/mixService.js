const API_URL = 'http://localhost:3000/api';

// Obtener token del cliente
const getToken = () => {
    return localStorage.getItem('clientToken');
};

/**
 * Crear una mezcla personalizada
 * @param {string} name - Nombre de la mezcla
 * @param {Array} ingredients - Lista de ingredientes [{productId, quantityLbs}]
 */
export const createMix = async (name, ingredients) => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/mixes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            ingredients
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la mezcla');
    }

    return await response.json();
};

/**
 * Obtener mezclas del usuario actual
 */
export const getMixes = async () => {
    const token = getToken();

    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/mixes`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las mezclas');
    }

    return await response.json();
};

/**
 * Obtener TODAS las mezclas (admin)
 */
export const getAllMixes = async () => {
    const response = await fetch(`${API_URL}/mixes/all`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las mezclas');
    }

    return await response.json();
};
