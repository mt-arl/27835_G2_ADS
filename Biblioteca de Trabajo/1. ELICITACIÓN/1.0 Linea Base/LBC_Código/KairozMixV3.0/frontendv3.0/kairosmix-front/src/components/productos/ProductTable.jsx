export default function ProductTable({ products, onEdit, onDelete }) {
    const getStockBadgeClasses = (stock) => {
        const base = "px-3 py-1 text-sm font-bold rounded-full";
        if (stock >= 50) return `${base} bg-emerald-100 text-emerald-700`;
        if (stock >= 20) return `${base} bg-amber-100 text-amber-700`;
        return `${base} bg-red-100 text-red-700`;
    };

    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                        <i className="fa-solid fa-inbox text-4xl text-slate-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay productos para mostrar</h3>
                    <p className="text-sm text-slate-500">Cree un nuevo producto o realice una búsqueda diferente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Resultados</h3>
                <span className="px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">{products.length}</span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Código</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Precio/Lb</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Mayorista</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Minorista</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Stock</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-4 text-sm font-mono font-semibold text-emerald-600">{product.code}</td>
                                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{product.name}</td>
                                <td className="px-4 py-4 text-sm text-slate-600 text-right font-mono">${product.pricePerPound.toFixed(2)}</td>
                                <td className="px-4 py-4 text-sm text-slate-600 text-right font-mono">${product.wholesalePrice.toFixed(2)}</td>
                                <td className="px-4 py-4 text-sm text-slate-600 text-right font-mono">${product.retailPrice.toFixed(2)}</td>
                                <td className="px-4 py-4 text-center">
                                    <span className={getStockBadgeClasses(product.currentStock)}>
                                        {product.currentStock.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="w-9 h-9 flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-lg transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-110"
                                            onClick={() => onEdit(product)}
                                            title="Editar producto"
                                        >
                                            <i className="fa-solid fa-pen text-sm"></i>
                                        </button>
                                        <button
                                            className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:scale-110"
                                            onClick={() => onDelete(product)}
                                            title="Eliminar producto"
                                        >
                                            <i className="fa-solid fa-trash text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
