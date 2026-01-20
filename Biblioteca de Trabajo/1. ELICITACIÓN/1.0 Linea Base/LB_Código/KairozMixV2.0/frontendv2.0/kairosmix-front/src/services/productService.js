const API_URL = 'http://localhost:3000/api/products';

const handleResponse = async (response, errorMessage) => {
    if (!response.ok) throw new Error(errorMessage);
    return await response.json();
};

export const createProduct = async (productData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return handleResponse(response, 'Error al crear producto');
};

export const getProducts = async () => {
    const response = await fetch(API_URL);
    return handleResponse(response, 'Error al obtener productos');
};

export const updateProduct = async (id, productData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return handleResponse(response, 'Error al actualizar producto');
};

export const searchProducts = async (query) => {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response, 'Error en la búsqueda');
};

export const getProductById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response, 'Producto no encontrado');
};

export const deactivateProduct = async (id) => {
    const response = await fetch(`${API_URL}/${id}/deactivate`, {
        method: 'PATCH'
    });
    return handleResponse(response, 'Error al eliminar producto');
};
