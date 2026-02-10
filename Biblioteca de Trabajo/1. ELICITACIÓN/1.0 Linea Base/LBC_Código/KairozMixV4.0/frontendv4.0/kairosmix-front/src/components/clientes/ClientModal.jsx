import { useState, useEffect } from 'react';
import { createClient, updateClient } from '../../services/clientService';

export default function ClientModal({ isOpen, onClose, onSuccess, clientToEdit }) {
    const initialFormState = {
        cedula: '',
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isEditing = !!clientToEdit;

    useEffect(() => {
        if (isOpen && clientToEdit) {
            // Pre-fill form with client data when editing
            setFormData({
                cedula: clientToEdit.cedula || '',
                nombre: clientToEdit.nombre || '',
                correo: clientToEdit.correo || '',
                telefono: clientToEdit.telefono || '',
                direccion: clientToEdit.direccion || '',
                password: '' // Password is not pre-filled for security
            });
        } else if (!isOpen) {
            resetForm();
        }
    }, [isOpen, clientToEdit]);

    const resetForm = () => {
        setFormData(initialFormState);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.cedula || !formData.cedula.trim()) {
            newErrors.cedula = 'El número de identificación es requerido';
        } else {
            const cedulaRegex = /^\d{10}$/;
            const rucRegex = /^\d{13}$/;
            const passportRegex = /^[A-Za-z0-9]{6,9}$/;

            if (!cedulaRegex.test(formData.cedula) &&
                !rucRegex.test(formData.cedula) &&
                !passportRegex.test(formData.cedula)) {
                newErrors.cedula = 'Formato inválido. Debe ser: Cédula (10 dígitos), RUC (13 dígitos) o Pasaporte (6-9 caracteres)';
            }
        }

        if (!formData.nombre || !formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.correo || !formData.correo.trim()) {
            newErrors.correo = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Formato de correo electrónico inválido';
        }

        if (!formData.telefono || !formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 10 dígitos numéricos';
        }

        if (!formData.direccion || !formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        }

        // Password is only required when creating a new client
        if (!isEditing) {
            if (!formData.password || !formData.password.trim()) {
                newErrors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
        } else {
            // When editing, password is optional but must be valid if provided
            if (formData.password && formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            if (isEditing) {
                // Update existing client
                const updateData = {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    direccion: formData.direccion
                };
                // Only include password if it was changed
                if (formData.password && formData.password.trim()) {
                    updateData.password = formData.password;
                }

                await updateClient(clientToEdit._id, updateData);

                await window.Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Cliente actualizado exitosamente',
                    confirmButtonColor: '#10b981',
                    timer: 2000
                });
            } else {
                // Create new client
                await createClient(formData);

                await window.Swal.fire({
                    icon: 'success',
                    title: '¡Registrado!',
                    text: 'Cliente registrado exitosamente',
                    confirmButtonColor: '#10b981',
                    timer: 2000
                });
            }

            resetForm();
            onSuccess();
            onClose();
        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al registrar cliente',
                confirmButtonColor: '#10b981'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputClasses = (hasError) => `w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border-2 rounded-lg outline-none transition-all duration-200 placeholder:text-slate-400 ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100'}`;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-in]"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-xl w-11/12 max-h-[90vh] overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-amber-500 to-amber-600 border-b-[3px] border-amber-700">
                    <h2 className="flex items-center gap-3 text-white text-xl font-bold">
                        <i className={`fa-solid ${isEditing ? 'fa-user-edit' : 'fa-user-plus'} text-xl`}></i>
                        {isEditing ? 'Editar Cliente' : 'Registrar Cliente'}
                    </h2>
                    <button
                        className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg transition-all duration-200 hover:bg-white/30 hover:scale-110"
                        onClick={onClose}
                    >
                        <i className="fa-solid fa-xmark text-lg text-white"></i>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-5">
                    <div>
                        <label htmlFor="cedula" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <i className="fa-solid fa-id-card text-amber-500"></i>
                            Cédula / RUC / Pasaporte *
                        </label>
                        <input
                            type="text"
                            id="cedula"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            className={inputClasses(errors.cedula)}
                            placeholder="Ingrese el número de identificación"
                            maxLength="13"
                            disabled={isEditing}  // Cannot change cedula when editing
                        />
                        <span className="text-xs text-slate-500 italic mt-1 block">Cédula (10 dígitos), RUC (13 dígitos) o Pasaporte (6-9 caracteres)</span>
                        {errors.cedula && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.cedula}</span>}
                    </div>

                    <div>
                        <label htmlFor="nombre" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <i className="fa-solid fa-user text-amber-500"></i>
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={inputClasses(errors.nombre)}
                            placeholder="Ingrese el nombre completo"
                        />
                        {errors.nombre && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.nombre}</span>}
                    </div>

                    <div>
                        <label htmlFor="correo" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <i className="fa-solid fa-envelope text-amber-500"></i>
                            Correo electrónico *
                        </label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className={inputClasses(errors.correo)}
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.correo && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.correo}</span>}
                    </div>

                    <div>
                        <label htmlFor="telefono" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <i className="fa-solid fa-phone text-amber-500"></i>
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={inputClasses(errors.telefono)}
                            placeholder="0999999999"
                            maxLength="10"
                        />
                        <span className="text-xs text-slate-500 italic mt-1 block">10 dígitos numéricos</span>
                        {errors.telefono && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.telefono}</span>}
                    </div>

                    <div>
                        <label htmlFor="direccion" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <i className="fa-solid fa-location-dot text-amber-500"></i>
                            Dirección *
                        </label>
                        <textarea
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className={`${inputClasses(errors.direccion)} resize-y min-h-20`}
                            placeholder="Ingrese la dirección completa"
                            rows="3"
                        />
                        {errors.direccion && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.direccion}</span>}
                    </div>

                    <div>
                        <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <i className="fa-solid fa-lock text-amber-500"></i>
                            Contraseña {isEditing ? '(opcional)' : '*'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClasses(errors.password)}
                            placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
                        />
                        <span className="text-xs text-slate-500 italic mt-1 block">
                            {isEditing ? 'Solo ingrese una nueva contraseña si desea cambiarla' : 'Será usada para que el cliente inicie sesión'}
                        </span>
                        {errors.password && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.password}</span>}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-200 flex-col-reverse sm:flex-row">
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all duration-200 hover:bg-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <i className="fa-solid fa-xmark"></i>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-amber-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            disabled={loading}
                        >
                            <i className="fa-solid fa-check"></i>
                            {loading ? (isEditing ? 'Actualizando...' : 'Registrando...') : (isEditing ? 'Actualizar' : 'Registrar')}
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
