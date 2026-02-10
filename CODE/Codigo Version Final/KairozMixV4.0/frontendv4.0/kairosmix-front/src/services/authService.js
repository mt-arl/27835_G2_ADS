const API_URL = 'http://localhost:3000/api';

/**
 * Registrar un nuevo cliente
 * @param {Object} clientData - Datos del cliente (cedula, nombre, correo, telefono, direccion, password)
 * @returns {Promise<Object>} Cliente registrado
 */
export const registerClient = async (clientData) => {
    try {
        const response = await fetch(`${API_URL}/clients`, {
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
 * Iniciar sesión de cliente
 * @param {Object} credentials - Credenciales (correo, password)
 * @returns {Promise<Object>} Datos del usuario y token
 */
export const loginClient = async (credentials) => {
    try {
        // DEBUG: Ver qué se envía al backend
        console.log('🔐 Enviando al backend:', JSON.stringify(credentials, null, 2));

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Credenciales inválidas');
        }

        // Guardar datos de sesión en localStorage
        if (data.token) {
            localStorage.setItem('clientToken', data.token);
        }
        if (data.client || data.user) {
            localStorage.setItem('clientData', JSON.stringify(data.client || data.user));
        }

        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Cerrar sesión del cliente
 */
export const logout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
};

/**
 * Verificar si hay una sesión activa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('clientToken');
};

/**
 * Obtener datos del usuario actual
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
    const userData = localStorage.getItem('clientData');
    return userData ? JSON.parse(userData) : null;
};

/**
 * Obtener el token de autenticación
 * @returns {string|null}
 */
export const getToken = () => {
    return localStorage.getItem('clientToken');
};
