import { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({ onCancel, onSuccess }) => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        name: '',
        pricePerPound: '',
        wholesalePrice: '',
        retailPrice: '',
        originCountry: '',
        initialStock: '',
        imageUrl: ''
    });

    const [errors, setErrors] = useState({});

    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // --- REQ001.5: Validaciones Locales ---
    const validate = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.originCountry.trim()) newErrors.originCountry = 'El país es obligatorio';
        
        // Validar Precios (> 0.01)
        const validatePrice = (val, fieldName) => {
            const num = parseFloat(val);
            if (!val || isNaN(num) || num <= 0.01) {
                newErrors[fieldName] = 'Debe ser mayor a $0.01';
            }
        };

        validatePrice(formData.pricePerPound, 'pricePerPound');
        validatePrice(formData.wholesalePrice, 'wholesalePrice');
        validatePrice(formData.retailPrice, 'retailPrice');

        // Validar Stock (Entero positivo)
        const stock = parseFloat(formData.initialStock);
        if (!formData.initialStock || isNaN(stock) || stock <= 0 || !Number.isInteger(stock)) {
            newErrors.initialStock = 'Debe ser un número entero positivo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- REQ001.6: Integración (Envío al Backend) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            window.Swal?.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
            return;
        }

        try {
            // Convertir tipos de datos antes de enviar
            const payload = {
                ...formData,
                pricePerPound: parseFloat(formData.pricePerPound),
                wholesalePrice: parseFloat(formData.wholesalePrice),
                retailPrice: parseFloat(formData.retailPrice),
                initialStock: parseInt(formData.initialStock)
            };

            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                window.Swal?.fire({
                    title: '¡Éxito!',
                    text: `Producto registrado con código: ${data.product.code}`,
                    icon: 'success'
                });
                onSuccess(); // Avisar al padre que se guardó
            } else {
                window.Swal?.fire('Error', data.message || 'Error al guardar', 'error');
            }

        } catch (error) {
            console.error(error);
            window.Swal?.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Registrar Nuevo Producto</h2>
                <p>Ingresa los detalles para generar el código automáticamente.</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Nombre */}
                    <div className="form-group">
                        <label>Nombre del Producto *</label>
                        <input 
                            type="text" name="name" 
                            className="form-control" 
                            onChange={handleChange} value={formData.name} 
                        />
                        {errors.name && <small className="error-msg">{errors.name}</small>}
                    </div>

                    {/* País */}
                    <div className="form-group">
                        <label>País de Origen *</label>
                        <input 
                            type="text" name="originCountry" 
                            className="form-control" 
                            onChange={handleChange} value={formData.originCountry} 
                        />
                        {errors.originCountry && <small className="error-msg">{errors.originCountry}</small>}
                    </div>
                </div>

                <div className="form-grid">
                    {/* Precios */}
                    <div className="form-group">
                        <label>Precio Libra ($) *</label>
                        <input type="number" step="0.01" name="pricePerPound" className="form-control" onChange={handleChange} value={formData.pricePerPound} />
                        {errors.pricePerPound && <small className="error-msg">{errors.pricePerPound}</small>}
                    </div>
                    <div className="form-group">
                        <label>Precio Mayorista ($) *</label>
                        <input type="number" step="0.01" name="wholesalePrice" className="form-control" onChange={handleChange} value={formData.wholesalePrice} />
                        {errors.wholesalePrice && <small className="error-msg">{errors.wholesalePrice}</small>}
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Precio Minorista ($) *</label>
                        <input type="number" step="0.01" name="retailPrice" className="form-control" onChange={handleChange} value={formData.retailPrice} />
                        {errors.retailPrice && <small className="error-msg">{errors.retailPrice}</small>}
                    </div>
                    {/* Stock */}
                    <div className="form-group">
                        <label>Stock Inicial (Unidades/Lbs) *</label>
                        <input type="number" name="initialStock" className="form-control" onChange={handleChange} value={formData.initialStock} />
                        {errors.initialStock && <small className="error-msg">{errors.initialStock}</small>}
                    </div>
                </div>

                {/* Imagen */}
                <div className="form-group">
                    <label>URL de Imagen (Opcional)</label>
                    <input 
                        type="text" name="imageUrl" 
                        placeholder="https://..."
                        className="form-control" 
                        onChange={handleChange} value={formData.imageUrl} 
                    />
                </div>

                <div className="btn-group">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Guardar Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;