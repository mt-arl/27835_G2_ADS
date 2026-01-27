import { useState } from 'react';
import { loginClient } from '../../services/authService';

function ClientLogin({ onLogin, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        correo: '',
        password: ''
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

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Ingresa un correo válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
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
            const result = await loginClient(formData);

            if (onLogin) {
                onLogin(result);
            }
        } catch (error) {
            setErrors({ general: error.message || 'Error al iniciar sesión. Intente nuevamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-900">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-emerald-500/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-100 h-100 bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-emerald-400/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-105 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-8 md:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-3 mb-6">
                        {/* Logo */}
                        <div className="w-18 h-18 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-[0_8px_30px_-5px_rgba(16,185,129,0.5)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-[28px] font-black bg-linear-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent tracking-tight">
                            KairosMix
                        </h1>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">¡Bienvenido!</h2>
                    <p className="text-sm text-slate-500">Ingresa a tu cuenta para ver nuestro catálogo</p>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{errors.general}</span>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="correo" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            className={`w-full h-13 px-4 text-base text-slate-800 bg-slate-50 border-2 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400
                                ${errors.correo
                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                    : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'
                                }`}
                            placeholder="tu@correo.com"
                            value={formData.correo}
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.correo && (
                            <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {errors.correo}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
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
                                className={`w-full h-13 px-4 pr-12 text-base text-slate-800 bg-slate-50 border-2 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400
                                    ${errors.password
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                        : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'
                                    }`}
                                placeholder="Ingresa tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-2 w-full h-14 text-base font-bold text-white rounded-xl transition-all duration-300 mt-2
                            ${isLoading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Iniciando sesión...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                <span>Iniciar Sesión</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        ¿No tienes una cuenta?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline underline-offset-2 transition-colors"
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ClientLogin;
