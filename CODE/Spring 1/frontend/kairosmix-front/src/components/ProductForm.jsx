import { useState } from 'react';

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

    return (
        <div>
            <h2>{productToEdit ? 'Editar Producto' : 'Crear Producto'}</h2>
            <form>
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
                <button type="submit">
                    {productToEdit ? 'Actualizar' : 'Crear'}
                </button>
            </form>
        </div>
    );
}
