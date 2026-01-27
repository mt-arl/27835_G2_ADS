import { useState } from 'react';
import { createProduct, updateProduct } from '../services/productService.js';

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

    const inputClasses = "w-full px-4 py-3 text-base text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2";

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                    <i className="fa-solid fa-box text-2xl text-white"></i>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <p className="text-sm text-slate-500">Complete los datos del producto</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre del Producto */}
                <div>
                    <label className={labelClasses}>
                        <i className="fa-solid fa-box text-emerald-500"></i>
                        Nombre del Producto
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Café Premium"
                        className={inputClasses}
                        required
                    />
                </div>

                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClasses}>
                            <i className="fa-solid fa-dollar-sign text-emerald-500"></i>
                            Precio/Lb
                        </label>
                        <input
                            type="number"
                            name="pricePerPound"
                            value={formData.pricePerPound}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>
                            <i className="fa-solid fa-dollar-sign text-emerald-500"></i>
                            Mayorista
                        </label>
                        <input
                            type="number"
                            name="wholesalePrice"
                            value={formData.wholesalePrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>
                            <i className="fa-solid fa-dollar-sign text-emerald-500"></i>
                            Minorista
                        </label>
                        <input
                            type="number"
                            name="retailPrice"
                            value={formData.retailPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>

                {/* País y Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>
                            <i className="fa-solid fa-globe text-emerald-500"></i>
                            País de Origen
                        </label>
                        <select
                            name="originCountry"
                            value={formData.originCountry}
                            onChange={handleChange}
                            className={inputClasses}
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
                    <div>
                        <label className={labelClasses}>
                            <i className="fa-solid fa-chart-simple text-emerald-500"></i>
                            Stock Inicial
                        </label>
                        <input
                            type="number"
                            name="currentStock"
                            value={formData.currentStock}
                            onChange={handleChange}
                            placeholder="0"
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>

                {/* URL de Imagen */}
                <div>
                    <label className={labelClasses}>
                        <i className="fa-solid fa-image text-emerald-500"></i>
                        URL de Imagen (opcional)
                    </label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className={inputClasses}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        <i className="fa-solid fa-circle-exclamation text-lg shrink-0"></i>
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        <i className="fa-solid fa-floppy-disk"></i>
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
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:bg-slate-200"
                    >
                        <i className="fa-solid fa-xmark"></i>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
}
