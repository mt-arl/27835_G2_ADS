import { useState } from 'react';
import { createProduct, updateProduct } from '../../../services/productService.js';

export default function ProductForm({ productToEdit, onSuccess }) {
    const [formData, setFormData] = useState({
        code: productToEdit?.code || '',
        name: productToEdit?.name || '',
        description: productToEdit?.description || '',
        category: productToEdit?.category || 'General',
        pricePerPound: productToEdit?.pricePerPound || '',
        wholesalePrice: productToEdit?.wholesalePrice || '',
        retailPrice: productToEdit?.retailPrice || '',
        originCountry: productToEdit?.originCountry || '',
        currentStock: productToEdit?.currentStock || '',
        minStock: productToEdit?.minStock || '0',
        status: productToEdit?.status || 'active',
        imageUrl: productToEdit?.imageUrl || '',
        nutritionalInfo: {
            calories: productToEdit?.nutritionalInfo?.calories || '0',
            protein: productToEdit?.nutritionalInfo?.protein || '0',
            fat: productToEdit?.nutritionalInfo?.fat || '0',
            carbs: productToEdit?.nutritionalInfo?.carbs || '0'
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');

        // Handle nested nutritionalInfo fields
        if (name.startsWith('nutritionalInfo.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                nutritionalInfo: {
                    ...formData.nutritionalInfo,
                    [field]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        if (!formData.code || !formData.name || !formData.pricePerPound || !formData.wholesalePrice ||
            !formData.retailPrice || !formData.originCountry || formData.currentStock === '') {
            setError('Todos los campos requeridos deben ser completados');
            return false;
        }

        if (parseFloat(formData.currentStock) < 0 || parseFloat(formData.minStock) < 0) {
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
                code: formData.code,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                pricePerPound: parseFloat(formData.pricePerPound),
                wholesalePrice: parseFloat(formData.wholesalePrice),
                retailPrice: parseFloat(formData.retailPrice),
                originCountry: formData.originCountry,
                currentStock: parseFloat(formData.currentStock),
                minStock: parseFloat(formData.minStock),
                status: formData.status,
                imageUrl: formData.imageUrl,
                nutritionalInfo: {
                    calories: parseFloat(formData.nutritionalInfo.calories),
                    protein: parseFloat(formData.nutritionalInfo.protein),
                    fat: parseFloat(formData.nutritionalInfo.fat),
                    carbs: parseFloat(formData.nutritionalInfo.carbs)
                }
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
                    code: '', name: '', description: '', category: 'General',
                    pricePerPound: '', wholesalePrice: '', retailPrice: '',
                    originCountry: '', currentStock: '', minStock: '0', status: 'active',
                    imageUrl: '',
                    nutritionalInfo: { calories: '0', protein: '0', fat: '0', carbs: '0' }
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
                {/* Código del Producto */}
                <div>
                    <label className={labelClasses}>
                        <i className="fa-solid fa-barcode text-emerald-500"></i>
                        Código del Producto
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Ej: CAFE-001"
                        className={inputClasses}
                        required
                        disabled={!!productToEdit}
                    />
                    {productToEdit && <p className="text-xs text-slate-500 mt-1">El código no se puede modificar</p>}
                </div>

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

                {/* Descripción */}
                <div>
                    <label className={labelClasses}>
                        <i className="fa-solid fa-align-left text-emerald-500"></i>
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descripción detallada del producto..."
                        className={inputClasses}
                        rows="3"
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label className={labelClasses}>
                        <i className="fa-solid fa-tag text-emerald-500"></i>
                        Categoría
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="General">General</option>
                        <option value="Café">Café</option>
                        <option value="Té">Té</option>
                        <option value="Especias">Especias</option>
                        <option value="Frutos Secos">Frutos Secos</option>
                        <option value="Granos">Granos</option>
                        <option value="Otro">Otro</option>
                    </select>
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

                {/* País y Estado */}
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
                            <i className="fa-solid fa-circle-check text-emerald-500"></i>
                            Estado
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={inputClasses}
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>
                </div>

                {/* Stock Actual y Mínimo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                        <label className={labelClasses}>
                            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                            Stock Mínimo
                        </label>
                        <input
                            type="number"
                            name="minStock"
                            value={formData.minStock}
                            onChange={handleChange}
                            placeholder="0"
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Información Nutricional */}
                <div className="border-t border-slate-200 pt-5">
                    <div className="flex items-center gap-2 mb-4">
                        <i className="fa-solid fa-apple-whole text-emerald-500 text-lg"></i>
                        <h3 className="text-base font-bold text-slate-800">Información Nutricional (por 100g)</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className={labelClasses}>
                                <i className="fa-solid fa-fire text-orange-500"></i>
                                Calorías
                            </label>
                            <input
                                type="number"
                                name="nutritionalInfo.calories"
                                value={formData.nutritionalInfo.calories}
                                onChange={handleChange}
                                placeholder="0"
                                step="0.1"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <i className="fa-solid fa-drumstick-bite text-red-500"></i>
                                Proteínas (g)
                            </label>
                            <input
                                type="number"
                                name="nutritionalInfo.protein"
                                value={formData.nutritionalInfo.protein}
                                onChange={handleChange}
                                placeholder="0"
                                step="0.1"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <i className="fa-solid fa-droplet text-yellow-500"></i>
                                Grasas (g)
                            </label>
                            <input
                                type="number"
                                name="nutritionalInfo.fat"
                                value={formData.nutritionalInfo.fat}
                                onChange={handleChange}
                                placeholder="0"
                                step="0.1"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <i className="fa-solid fa-wheat-awn text-amber-600"></i>
                                Carbohidratos (g)
                            </label>
                            <input
                                type="number"
                                name="nutritionalInfo.carbs"
                                value={formData.nutritionalInfo.carbs}
                                onChange={handleChange}
                                placeholder="0"
                                step="0.1"
                                className={inputClasses}
                            />
                        </div>
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
                                code: '', name: '', description: '', category: 'General',
                                pricePerPound: '', wholesalePrice: '', retailPrice: '',
                                originCountry: '', currentStock: '', minStock: '0', status: 'active',
                                imageUrl: '',
                                nutritionalInfo: { calories: '0', protein: '0', fat: '0', carbs: '0' }
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
