// Mapeo de colores para clases de Tailwind
const colorClasses = {
    emerald: {
        badge: 'bg-emerald-500',
        editBg: 'bg-emerald-50',
        editText: 'text-emerald-500',
        editHover: 'hover:bg-emerald-100 hover:text-emerald-600',
        codeText: 'text-emerald-600'
    },
    amber: {
        badge: 'bg-amber-500',
        editBg: 'bg-amber-50',
        editText: 'text-amber-500',
        editHover: 'hover:bg-amber-100 hover:text-amber-600',
        codeText: 'text-amber-600'
    },
    purple: {
        badge: 'bg-purple-500',
        editBg: 'bg-purple-50',
        editText: 'text-purple-500',
        editHover: 'hover:bg-purple-100 hover:text-purple-600',
        codeText: 'text-purple-600'
    }
};

/**
 * AdminTable - Tabla genérica para el panel de administración
 * 
 * @param {Array} data - Datos a mostrar
 * @param {Array} columns - Configuración de columnas
 *   Cada columna: { key, label, align?, type?, render? }
 *   - type: 'text'|'money'|'badge'|'email'|'code'
 *   - render: función personalizada (item) => JSX
 * @param {Function} onEdit - Callback para editar (opcional)
 * @param {Function} onDelete - Callback para eliminar (opcional)
 * @param {string} color - Color del tema ('emerald'|'amber')
 * @param {string} emptyMessage - Mensaje cuando no hay datos
 * @param {string} emptySubMessage - Submensaje cuando no hay datos
 */
export default function AdminTable({
    data = [],
    columns = [],
    onEdit,
    onDelete,
    color = 'emerald',
    emptyMessage = 'No hay datos para mostrar',
    emptySubMessage = 'Cree un nuevo registro o realice una búsqueda diferente'
}) {
    const colors = colorClasses[color] || colorClasses.emerald;

    // Función helper para obtener valor anidado (e.g. "user.name")
    const getValue = (item, key) => {
        return key.split('.').reduce((obj, k) => obj?.[k], item);
    };

    // Renderizar celda según el tipo
    const renderCell = (item, column) => {
        const value = getValue(item, column.key);

        // Si hay render personalizado, usarlo
        if (column.render) {
            return column.render(item, value);
        }

        switch (column.type) {
            case 'money':
                return `$${(value || 0).toFixed(2)}`;

            case 'badge':
                const badgeColor = column.badgeColor?.(value) || 'bg-slate-100 text-slate-700';
                return (
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${badgeColor}`}>
                        {value}
                    </span>
                );

            case 'email':
                return (
                    <a
                        href={`mailto:${value}`}
                        className={`${colors.codeText} hover:underline`}
                    >
                        {value}
                    </a>
                );

            case 'code':
                return <span className={`font-mono font-semibold ${colors.codeText}`}>{value}</span>;

            default:
                return value;
        }
    };

    // Estado vacío
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                        <i className="fa-solid fa-inbox text-4xl text-slate-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">{emptyMessage}</h3>
                    <p className="text-sm text-slate-500">{emptySubMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Resultados</h3>
                <span className={`px-3 py-1 ${colors.badge} text-white text-sm font-bold rounded-full`}>
                    {data.length}
                </span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-100">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider ${column.align === 'right' ? 'text-right' :
                                        column.align === 'center' ? 'text-center' : 'text-left'
                                        }`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-4 py-4 text-sm ${column.align === 'right' ? 'text-right' :
                                            column.align === 'center' ? 'text-center' : 'text-left'
                                            } ${column.type === 'money' ? 'font-mono text-slate-600' : 'text-slate-800'} ${column.className || ''
                                            }`}
                                    >
                                        {renderCell(item, column)}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {onEdit && (
                                                <button
                                                    className={`w-9 h-9 flex items-center justify-center ${colors.editBg} ${colors.editText} rounded-lg transition-all duration-200 ${colors.editHover} hover:scale-110`}
                                                    onClick={() => onEdit(item)}
                                                    title="Editar"
                                                >
                                                    <i className="fa-solid fa-pen text-sm"></i>
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:scale-110"
                                                    onClick={() => onDelete(item)}
                                                    title="Eliminar"
                                                >
                                                    <i className="fa-solid fa-trash text-sm"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
