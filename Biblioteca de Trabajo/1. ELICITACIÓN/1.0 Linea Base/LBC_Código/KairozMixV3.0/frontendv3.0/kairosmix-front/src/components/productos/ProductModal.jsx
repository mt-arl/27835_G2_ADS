import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../services/productService.js';

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

    const inputClasses = "w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-lg outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
    const labelClasses = "flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2";

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-in]"
            onClick={handleCancel}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-11/12 max-h-[90vh] overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 border-b-[3px] border-emerald-700">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl">
                            <i className="fa-solid fa-box text-lg text-white"></i>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-bold">{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            {productToEdit && <span className="text-white/70 text-sm font-mono">{productToEdit.code}</span>}
                        </div>
                    </div>
                    <button
                        className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg transition-all duration-200 hover:bg-white/30 hover:scale-110"
                        onClick={handleCancel}
                        type="button"
                    >
                        <i className="fa-solid fa-xmark text-lg text-white"></i>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-150px)] space-y-5">
                    {/* Nombre */}
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
                                <option value="Etiopia">Etiopia</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <i className="fa-solid fa-chart-simple text-emerald-500"></i>
                                Stock Actual
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

                    {/* URL Imagen */}
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

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            <i className="fa-solid fa-circle-exclamation text-lg shrink-0"></i>
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex gap-4 pt-4 border-t border-slate-200 flex-col-reverse sm:flex-row">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-3 px-6 bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all duration-200 hover:bg-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            disabled={loading}
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
