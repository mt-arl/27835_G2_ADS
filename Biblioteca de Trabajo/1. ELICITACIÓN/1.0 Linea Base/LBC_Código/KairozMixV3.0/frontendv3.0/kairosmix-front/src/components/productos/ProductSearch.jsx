import { useState } from 'react';
import { searchProducts as searchProductsService, getProducts } from '../../services/productService.js';

export default function ProductSearch({ onSearch }) {
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
            showAlert('warning', 'Campo vacío', 'Por favor ingresa un término de búsqueda');
            return;
        }

        setLoading(true);

        try {
            const results = await searchProductsService(query);
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
            const allProducts = await getProducts();
            onSearch(allProducts);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error al cargar productos: ' + error.message);
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
                <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                    <i className="fa-solid fa-magnifying-glass text-xl text-white"></i>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Buscar Productos</h2>
                    <p className="text-sm text-slate-500">Busque por código o nombre</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input */}
                <div className="relative flex gap-3 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por código o nombre..."
                            className="w-full pl-12 pr-10 py-3 text-base text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        />
                        {query && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
                                onClick={handleClear}
                            >
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl transition-all duration-200 hover:bg-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
                        onClick={handleShowAll}
                    >
                        <i className="fa-solid fa-list"></i>
                        {loading ? 'Cargando...' : 'Ver Todos'}
                    </button>
                </div>
            </form>
        </div>
    );
}
