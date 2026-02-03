import { useState } from 'react';

// Mapeo de colores para clases de Tailwind
const colorClasses = {
    emerald: {
        gradient: 'from-emerald-400 to-emerald-600',
        gradientHover: 'hover:from-emerald-600 hover:to-emerald-700',
        shadow: 'shadow-emerald-500/30',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        bgHover: 'hover:bg-emerald-200',
        focus: 'focus:border-emerald-500 focus:ring-emerald-100'
    },
    amber: {
        gradient: 'from-amber-400 to-amber-600',
        gradientHover: 'hover:from-amber-600 hover:to-amber-700',
        shadow: 'shadow-amber-500/30',
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        bgHover: 'hover:bg-amber-200',
        focus: 'focus:border-amber-500 focus:ring-amber-100'
    },
    purple: {
        gradient: 'from-purple-400 to-purple-600',
        gradientHover: 'hover:from-purple-600 hover:to-purple-700',
        shadow: 'shadow-purple-500/30',
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        bgHover: 'hover:bg-purple-200',
        focus: 'focus:border-purple-500 focus:ring-purple-100'
    }
};

export default function AdminSearch({
    color = 'emerald',
    title = 'Buscar',
    subtitle = 'Busque por cualquier campo',
    placeholder = 'Buscar...',
    onSearch,
    searchService,
    getAllService
}) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const colors = colorClasses[color] || colorClasses.emerald;

    const showAlert = (icon, title, text) => {
        window.Swal?.fire({
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
            let results;
            if (searchService) {
                results = await searchService(query);
            } else if (getAllService) {
                // Búsqueda local si no hay servicio de búsqueda
                const allItems = await getAllService();
                results = allItems.filter(item =>
                    Object.values(item).some(value =>
                        String(value).toLowerCase().includes(query.toLowerCase())
                    )
                );
            }
            onSearch(results || []);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error en la búsqueda: ' + error.message);
            onSearch([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAll = async () => {
        if (!getAllService) return;

        setLoading(true);
        setQuery('');

        try {
            const allItems = await getAllService();
            onSearch(allItems);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error al cargar datos: ' + error.message);
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
                <div className={`w-12 h-12 flex items-center justify-center bg-linear-to-br ${colors.gradient} rounded-xl shadow-lg ${colors.shadow}`}>
                    <i className="fa-solid fa-magnifying-glass text-xl text-white"></i>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    <p className="text-sm text-slate-500">{subtitle}</p>
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
                            placeholder={placeholder}
                            className={`w-full pl-12 pr-10 py-3 text-base text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 ${colors.focus} focus:bg-white focus:ring-4`}
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
                        className={`flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r ${colors.gradient} text-white font-semibold rounded-xl transition-all duration-300 ${colors.gradientHover} hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide`}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-3 ${colors.bg} ${colors.text} font-semibold rounded-xl transition-all duration-200 ${colors.bgHover} disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide`}
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
