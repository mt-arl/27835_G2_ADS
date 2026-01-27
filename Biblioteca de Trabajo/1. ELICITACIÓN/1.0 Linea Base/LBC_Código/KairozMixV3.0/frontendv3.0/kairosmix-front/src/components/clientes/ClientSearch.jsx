import { useState } from 'react';
import { getClients } from '../../services/clientService';

export default function ClientSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const showAlert = (icon, title, text) => {
        window.Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#10b981'
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            showAlert('warning', 'Campo vacío', 'Por favor ingrese un término de búsqueda');
            return;
        }

        setLoading(true);

        try {
            const allClients = await getClients();
            const results = allClients.filter(client =>
                client.nombre.toLowerCase().includes(query.toLowerCase()) ||
                client.cedula.includes(query) ||
                client.correo.toLowerCase().includes(query.toLowerCase()) ||
                client.telefono.includes(query)
            );
            onSearch(results);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error en la búsqueda: ' + error.message);
            onSearch([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAll = async () => {
        setLoading(true);
        setQuery('');

        try {
            const allClients = await getClients();
            onSearch(allClients);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error al cargar clientes: ' + error.message);
            onSearch([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch([]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                    <i className="fa-solid fa-magnifying-glass text-xl text-white"></i>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Buscar Clientes</h2>
                    <p className="text-sm text-slate-500">Busque por nombre, identificación, correo o teléfono</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input Group */}
                <div className="flex gap-3 flex-col sm:flex-row">
                    <input
                        type="text"
                        placeholder="Ingrese nombre, cédula, correo o teléfono..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-4 py-3 text-base text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={handleShowAll}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-medium rounded-lg transition-all duration-200 hover:bg-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <i className="fa-solid fa-list"></i>
                        Mostrar Todos
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg transition-all duration-200 hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <i className="fa-solid fa-xmark"></i>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
}
