const API_URL = 'http://localhost:3000/products';

export const createProduct = async (productData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Error al crear producto');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener productos');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
       try {
           const response = await fetch(`${API_URL}/${id}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(productData)
           });
           if (!response.ok) throw new Error('Error al actualizar producto');
           return await response.json();
       } catch (error) {
           console.error('Error:', error);
           throw error;
       }
   };
