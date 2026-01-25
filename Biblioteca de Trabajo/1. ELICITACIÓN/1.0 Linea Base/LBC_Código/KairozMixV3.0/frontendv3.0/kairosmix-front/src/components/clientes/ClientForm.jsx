import { useState } from 'react';
import { createClient } from '../services/clientService';

const ClientForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

      setFormData({ cedula: '', nombre: '', correo: '', telefono: '', direccion: '' });
      setErrors({});
      onSuccess();
      onCancel();
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

  const inputClasses = (hasError) => `w-full px-4 py-3 text-base text-slate-800 bg-slate-50 border-2 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400 ${hasError ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100'}`;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-5 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-center text-2xl font-bold text-slate-800 mb-6">Registrar Cliente</h2>

      <div className="mb-5">
        <label htmlFor="cedula" className="block text-sm font-semibold text-slate-700 mb-2">
          Número de Identificación: <span className="text-red-500">*</span>
        </label>
        <input
          id="cedula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          className={inputClasses(errors.cedula)}
          placeholder="Cédula, RUC o Pasaporte"
          maxLength={13}
        />
        {errors.cedula && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.cedula}</span>}
        <small className="text-xs text-slate-500 italic mt-1 block">Cédula (10 dígitos), RUC (13 dígitos) o Pasaporte (6-9 caracteres)</small>
      </div>

      <div className="mb-5">
        <label htmlFor="nombre" className="block text-sm font-semibold text-slate-700 mb-2">
          Nombre del Cliente: <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={inputClasses(errors.nombre)}
          placeholder="Ingrese el nombre completo"
        />
        {errors.nombre && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.nombre}</span>}
      </div>

      <div className="mb-5">
        <label htmlFor="correo" className="block text-sm font-semibold text-slate-700 mb-2">
          Correo Electrónico: <span className="text-red-500">*</span>
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          className={inputClasses(errors.correo)}
          placeholder="ejemplo@correo.com"
        />
        {errors.correo && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.correo}</span>}
      </div>

      <div className="mb-5">
        <label htmlFor="telefono" className="block text-sm font-semibold text-slate-700 mb-2">
          Número de Teléfono: <span className="text-red-500">*</span>
        </label>
        <input
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={inputClasses(errors.telefono)}
          placeholder="0987654321"
          maxLength={10}
        />
        {errors.telefono && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.telefono}</span>}
        <small className="text-xs text-slate-500 italic mt-1 block">10 dígitos numéricos</small>
      </div>

      <div className="mb-5">
        <label htmlFor="direccion" className="block text-sm font-semibold text-slate-700 mb-2">
          Dirección: <span className="text-red-500">*</span>
        </label>
        <input
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={inputClasses(errors.direccion)}
          placeholder="Ingrese la dirección completa"
        />
        {errors.direccion && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.direccion}</span>}
      </div>

      <div className="flex gap-4 mt-8 justify-center flex-col sm:flex-row">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:bg-slate-300 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
