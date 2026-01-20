import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/productService.js';
import './ProductModal.css';

export default function ProductModal({ isOpen, onClose, productToEdit, onSuccess }) {
    const initialFormState = {
        name: '',
        pricePerPound: '',
        wholesalePrice: '',
        retailPrice: '',
        originCountry: '',
        currentStock: '',
        imageUrl: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                pricePerPound: productToEdit.pricePerPound || '',
                wholesalePrice: productToEdit.wholesalePrice || '',
                retailPrice: productToEdit.retailPrice || '',
                originCountry: productToEdit.originCountry || '',
                currentStock: productToEdit.currentStock || '',
                imageUrl: productToEdit.imageUrl || ''
            });
        } else {
            resetForm();
        }
    }, [productToEdit, isOpen]);

    useEffect(() => {
        if (window.lucide && isOpen) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [isOpen, formData]);

    const resetForm = () => {
        setFormData(initialFormState);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, currentStock } = formData;
        
        if (!name || !pricePerPound || !wholesalePrice || !retailPrice || !originCountry || currentStock === '') {
            setError('Todos los campos son requeridos');
            return false;
        }

        const stock = parseFloat(currentStock);
        if (stock < 0) {
            setError('El stock no puede ser negativo');
            return false;
        }

        const prices = [parseFloat(pricePerPound), parseFloat(wholesalePrice), parseFloat(retailPrice)];
        if (prices.some(price => price <= 0)) {
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
            const isEditing = !!productToEdit;
            const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, currentStock, imageUrl } = formData;
            
            const productData = {
                name,
                pricePerPound: parseFloat(pricePerPound),
                wholesalePrice: parseFloat(wholesalePrice),
                retailPrice: parseFloat(retailPrice),
                originCountry,
                imageUrl,
                [isEditing ? 'currentStock' : 'initialStock']: parseFloat(currentStock)
            };

            if (isEditing) {
                await updateProduct(productToEdit._id, productData);
            } else {
                await createProduct(productData);
            }

            await window.Swal.fire({
                icon: 'success',
                title: `¡${isEditing ? 'Actualizado' : 'Creado'}!`,
                text: `Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
                confirmButtonColor: '#10b981',
                timer: 2000
            });

            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            setError('Error al guardar el producto: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-content">
                        <div className="modal-icon">
                            <i data-lucide="package"></i>
                        </div>
                        <div>
                            <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            {productToEdit && <span className="modal-code">{productToEdit.code}</span>}
                        </div>
                    </div>
                    <button className="modal-close" onClick={handleCancel} type="button">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-section">
                        <div className="form-group full-width">
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
                                    <option value="Etiopia">Etiopia</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <i data-lucide="bar-chart-3" className="label-icon"></i>
                                    Stock Actual
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

                        <div className="form-group full-width">
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
                    </div>

                    {error && <div className="error-message"><i data-lucide="alert-circle"></i> {error}</div>}

                    <div className="modal-footer">
                        <button type="button" onClick={handleCancel} className="btn-cancel" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            <i data-lucide="save" className="btn-icon"></i>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
