import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (!formData.name || !formData.pricePerPound || !formData.wholesalePrice || 
            !formData.retailPrice || !formData.originCountry || formData.currentStock === '') {
            setError('Todos los campos son requeridos');
            return false;
        }

        if (parseFloat(formData.currentStock) < 0) {
            setError('El stock no puede ser negativo');
            return false;
        }

        const prices = [formData.pricePerPound, formData.wholesalePrice, formData.retailPrice];
        if (prices.some(price => parseFloat(price) <= 0)) {
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

            const isEditing = !!productToEdit;
            
            if (isEditing) {
                await updateProduct(productToEdit._id, productData);
            } else {
                await createProduct(productData);
            }

            window.Swal.fire({
                icon: 'success',
                title: isEditing ? '¡Actualizado!' : '¡Creado!',
                text: `Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
                confirmButtonColor: '#10b981'
            });

            if (!isEditing) {
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
        <div className="product-form">
            <div className="form-header">
                <div className="form-icon">
                    <i data-lucide="package"></i>
                </div>
                <div>
                    <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <p className="form-subtitle">Complete los datos del producto</p>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        <i data-lucide="package" className="label-icon"></i>
                        Nombre del Producto
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Café Premium"
                        required
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <i data-lucide="dollar-sign" className="label-icon"></i>
                            Precio/Lb
                        </label>
                        <input 
                            type="number" 
                            name="pricePerPound" 
                            value={formData.pricePerPound}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <i data-lucide="dollar-sign" className="label-icon"></i>
                            Mayorista
                        </label>
                        <input 
                            type="number" 
                            name="wholesalePrice" 
                            value={formData.wholesalePrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <i data-lucide="dollar-sign" className="label-icon"></i>
                            Minorista
                        </label>
                        <input 
                            type="number" 
                            name="retailPrice" 
                            value={formData.retailPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <i data-lucide="globe" className="label-icon"></i>
                            País de Origen
                        </label>
                        <select
                            name="originCountry"
                            value={formData.originCountry}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar país</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Brasil">Brasil</option>
                            <option value="México">México</option>
                            <option value="Perú">Perú</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Panamá">Panamá</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Chile">Chile</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            <i data-lucide="bar-chart-3" className="label-icon"></i>
                            Stock Inicial
                        </label>
                        <input 
                            type="number" 
                            name="currentStock" 
                            value={formData.currentStock}
                            onChange={handleChange}
                            placeholder="0"
                            required
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>
                        <i data-lucide="image" className="label-icon"></i>
                        URL de Imagen (opcional)
                    </label>
                    <input 
                        type="text" 
                        name="imageUrl" 
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                        <i data-lucide="save" className="btn-icon"></i>
                        {loading ? 'Enviando...' : (productToEdit ? 'ACTUALIZAR' : 'CREAR')}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => {
                            setFormData({
                                name: '', 
                                pricePerPound: '', 
                                wholesalePrice: '', 
                                retailPrice: '',
                                originCountry: '', 
                                currentStock: '', 
                                imageUrl: ''
                            });
                            setError('');
                        }}
                        className="btn-secondary"
                    >
                        <i data-lucide="x" className="btn-icon"></i>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
}
