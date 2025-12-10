import { useState } from 'react';
import './ClientForm.css';

const ClientForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validar campos requeridos
    if (!formData.cedula || !formData.cedula.trim()) {
      newErrors.cedula = 'El número de identificación es requerido';
    } else {
      // Validar formato de identificación (Cédula, RUC o Pasaporte)
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
    if (validate()) {
      const success = await onSubmit(formData);
      if (success) {
        // Reset form on success
        setFormData({ cedula: '', nombre: '', correo: '', telefono: '', direccion: '' });
        setErrors({});
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <h2>Registrar Cliente</h2>
      
      <div className="form-group">
        <label htmlFor="cedula">Número de Identificación: <span className="required">*</span></label>
        <input 
          id="cedula"
          name="cedula" 
          value={formData.cedula} 
          onChange={handleChange}
          className={errors.cedula ? 'input-error' : ''}
          placeholder="Cédula, RUC o Pasaporte"
          maxLength={13}
        />
        {errors.cedula && <span className="error">{errors.cedula}</span>}
        <small className="help-text">Cédula (10 dígitos), RUC (13 dígitos) o Pasaporte (6-9 caracteres)</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Cliente: <span className="required">*</span></label>
        <input 
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
        <label htmlFor="correo">Correo Electrónico: <span className="required">*</span></label>
        <input 
          id="correo"
          name="correo" 
          type="email" 
          value={formData.correo} 
          onChange={handleChange}
          className={errors.correo ? 'input-error' : ''}
          placeholder="ejemplo@correo.com"
        />
        {errors.correo && <span className="error">{errors.correo}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="telefono">Número de Teléfono: <span className="required">*</span></label>
        <input 
          id="telefono"
          name="telefono" 
          value={formData.telefono} 
          onChange={handleChange}
          className={errors.telefono ? 'input-error' : ''}
          placeholder="0987654321"
          maxLength={10}
        />
        {errors.telefono && <span className="error">{errors.telefono}</span>}
        <small className="help-text">10 dígitos numéricos</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="direccion">Dirección: <span className="required">*</span></label>
        <input 
          id="direccion"
          name="direccion" 
          value={formData.direccion} 
          onChange={handleChange}
          className={errors.direccion ? 'input-error' : ''}
          placeholder="Ingrese la dirección completa"
        />
        {errors.direccion && <span className="error">{errors.direccion}</span>}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
