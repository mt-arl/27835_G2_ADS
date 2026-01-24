import { useState, useEffect } from 'react';
import { createClient } from '../services/clientService';
import './ClientModal.css';

export default function ClientModal({ isOpen, onClose, onSuccess }) {
    const initialFormState = {
        cedula: '',
        nombre: '',
        correo: '',
        telefono: '',
        direccion: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    useEffect(() => {
        if (window.lucide && isOpen) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [isOpen, formData]);

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
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        setLoading(true);

        try {
            await createClient(formData);
            
            await window.Swal.fire({
                icon: 'success',
                title: '¡Registrado!',
                text: 'Cliente registrado exitosamente',
                confirmButtonColor: '#10b981',
                timer: 2000
            });

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

    return (
        <div className="client-modal-overlay" onClick={onClose}>
            <div className="client-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="client-modal-header">
                    <h2>
                        <i data-lucide="user-plus"></i>
                        Registrar Cliente
                    </h2>
                    <button className="close-button" onClick={onClose}>
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="client-form">
                    <div className="form-group">
                        <label htmlFor="cedula">
                            <i data-lucide="credit-card"></i>
                            Cédula / RUC / Pasaporte *
                        </label>
                        <input
                            type="text"
                            id="cedula"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            className={errors.cedula ? 'input-error' : ''}
                            placeholder="Ingrese el número de identificación"
                            maxLength="13"
                        />
                        <span className="help-text">Cédula (10 dígitos), RUC (13 dígitos) o Pasaporte (6-9 caracteres)</span>
                        {errors.cedula && <span className="error">{errors.cedula}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombre">
                            <i data-lucide="user"></i>
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? 'input-error' : ''}
                            placeholder="Ingrese el nombre completo"
                        />
                        {errors.nombre && <span className="error">{errors.nombre}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="correo">
                            <i data-lucide="mail"></i>
                            Correo electrónico *
                        </label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className={errors.correo ? 'input-error' : ''}
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.correo && <span className="error">{errors.correo}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">
                            <i data-lucide="phone"></i>
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={errors.telefono ? 'input-error' : ''}
                            placeholder="0999999999"
                            maxLength="10"
                        />
                        <span className="help-text">10 dígitos numéricos</span>
                        {errors.telefono && <span className="error">{errors.telefono}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion">
                            <i data-lucide="map-pin"></i>
                            Dirección *
                        </label>
                        <textarea
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className={errors.direccion ? 'input-error' : ''}
                            placeholder="Ingrese la dirección completa"
                            rows="3"
                        />
                        {errors.direccion && <span className="error">{errors.direccion}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            <i data-lucide="x"></i>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            <i data-lucide="check"></i>
                            {loading ? 'Registrando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
