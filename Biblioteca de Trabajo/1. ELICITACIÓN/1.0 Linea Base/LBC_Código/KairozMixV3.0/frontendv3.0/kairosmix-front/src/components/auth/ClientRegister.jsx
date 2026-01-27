import { useState } from 'react';
import { registerClient } from '../../services/authService';

function ClientRegister({ onRegisterSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula es requerida';
        } else if (!/^\d{10}$/.test(formData.cedula)) {
            newErrors.cedula = 'La cédula debe tener 10 dígitos';
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Ingresa un correo válido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{10}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 10 dígitos';
        }

        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...clientData } = formData;
            await registerClient(clientData);

            window.Swal?.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                confirmButtonColor: '#10b981'
            });

            if (onRegisterSuccess) {
                onRegisterSuccess();
            }
        } catch (error) {
            setErrors({ general: error.message || 'Error al registrar. Intente nuevamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    const getInputClass = (fieldName) => `w-full h-12 px-4 text-base text-slate-800 bg-slate-50 border-2 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400
        ${errors[fieldName]
            ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'
        }`;

    const ErrorMessage = ({ field }) => errors[field] && (
        <span className="text-xs font-medium text-red-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors[field]}
        </span>
    );

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-900">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-emerald-500/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-100 h-100 bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-emerald-400/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 md:p-8 my-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="w-16 h-16 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-[0_8px_30px_-5px_rgba(16,185,129,0.5)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black bg-linear-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent tracking-tight">
                            KairosMix
                        </h1>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Crear cuenta</h2>
                    <p className="text-sm text-slate-500">Completa tus datos para registrarte</p>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{errors.general}</span>
                        </div>
                    )}

                    {/* Cedula & Nombre */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="cedula" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <line x1="8" y1="10" x2="16" y2="10" />
                                    <line x1="8" y1="14" x2="12" y2="14" />
                                </svg>
                                Cédula
                            </label>
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                className={getInputClass('cedula')}
                                placeholder="1234567890"
                                value={formData.cedula}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <ErrorMessage field="cedula" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="nombre" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={getInputClass('nombre')}
                                placeholder="Juan Pérez"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoComplete="name"
                            />
                            <ErrorMessage field="nombre" />
                        </div>
                    </div>

                    {/* Correo */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="correo" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            className={getInputClass('correo')}
                            placeholder="tu@correo.com"
                            value={formData.correo}
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        <ErrorMessage field="correo" />
                    </div>

                    {/* Telefono & Direccion */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="telefono" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Teléfono
                            </label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                className={getInputClass('telefono')}
                                placeholder="0999999999"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoComplete="tel"
                            />
                            <ErrorMessage field="telefono" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="direccion" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                className={getInputClass('direccion')}
                                placeholder="Av. Principal 123"
                                value={formData.direccion}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoComplete="street-address"
                            />
                            <ErrorMessage field="direccion" />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className={`${getInputClass('password')} pr-11`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <ErrorMessage field="password" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Confirmar
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                className={getInputClass('confirmPassword')}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            <ErrorMessage field="confirmPassword" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 w-full h-13 text-base font-bold text-white rounded-xl transition-all duration-300 mt-2
                            ${isLoading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Registrando...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="8.5" cy="7" r="4" />
                                    <line x1="20" y1="8" x2="20" y2="14" />
                                    <line x1="23" y1="11" x2="17" y2="11" />
                                </svg>
                                <span>Crear cuenta</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline underline-offset-2 transition-colors"
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ClientRegister;
