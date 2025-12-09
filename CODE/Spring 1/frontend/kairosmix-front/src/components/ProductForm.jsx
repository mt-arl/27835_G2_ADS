import { useState } from 'react';
import { createProduct, updateProduct } from '../services/productService.js';
import './ProductForm.css';

export default function ProductForm({ productToEdit, onSuccess }) {
    const [formData, setFormData] = useState({
        name: productToEdit?.name || '',
        pricePerPound: productToEdit?.pricePerPound || '',
        wholesalePrice: productToEdit?.wholesalePrice || '',
        retailPrice: productToEdit?.retailPrice || '',
        originCountry: productToEdit?.originCountry || '',
        currentStock: productToEdit?.currentStock || '',
        imageUrl: productToEdit?.imageUrl || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
       const { name, value } = e.target;
       setError(''); // Limpiar errores cuando el usuario escribe
       setFormData({
           ...formData,
           [name]: value
       });
   };

    const validateForm = () => {
        // Validar campos requeridos
        if (!formData.name || !formData.pricePerPound || !formData.wholesalePrice || 
            !formData.retailPrice || !formData.originCountry || formData.currentStock === '') {
            setError('Todos los campos son requeridos');
            return false;
        }

        // Validar que currentStock sea >= 0
        if (parseFloat(formData.currentStock) < 0) {
            setError('El stock no puede ser negativo');
            return false;
        }

        // Validar que los precios sean > 0
        const pricePerPound = parseFloat(formData.pricePerPound);
        const wholesalePrice = parseFloat(formData.wholesalePrice);
        const retailPrice = parseFloat(formData.retailPrice);

        if (pricePerPound <= 0 || wholesalePrice <= 0 || retailPrice <= 0) {
            setError('Los precios deben ser mayores a 0');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const productData = {
                name: formData.name,
                pricePerPound: parseFloat(formData.pricePerPound),
                wholesalePrice: parseFloat(formData.wholesalePrice),
                retailPrice: parseFloat(formData.retailPrice),
                originCountry: formData.originCountry,
                currentStock: parseFloat(formData.currentStock),
                imageUrl: formData.imageUrl
            };

            if (productToEdit) {
                // Modo edición
                await updateProduct(productToEdit._id, productData);
                alert('Producto actualizado exitosamente');
            } else {
                // Modo creación
                await createProduct(productData);
                alert('Producto creado exitosamente');
                setFormData({
                    name: '', pricePerPound: '', wholesalePrice: '', retailPrice: '',
                    originCountry: '', currentStock: '', imageUrl: ''
                });
            }
            
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Error al guardar el producto: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{productToEdit ? 'Editar Producto' : 'Crear Producto'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio por Libra:</label>
                    <input 
                        type="number" 
                        name="pricePerPound" 
                        value={formData.pricePerPound}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio Mayorista:</label>
                    <input 
                        type="number" 
                        name="wholesalePrice" 
                        value={formData.wholesalePrice}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio Minorista:</label>
                    <input 
                        type="number" 
                        name="retailPrice" 
                        value={formData.retailPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>País de Origen:</label>
                    <input 
                        type="text" 
                        name="originCountry" 
                        value={formData.originCountry}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock Actual:</label>
                    <input 
                        type="number" 
                        name="currentStock" 
                        value={formData.currentStock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>URL Imagen:</label>
                    <input 
                        type="text" 
                        name="imageUrl" 
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                     {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : (productToEdit ? 'Actualizar' : 'Crear')}
                </button>
            </form>
        </div>
    );
}
