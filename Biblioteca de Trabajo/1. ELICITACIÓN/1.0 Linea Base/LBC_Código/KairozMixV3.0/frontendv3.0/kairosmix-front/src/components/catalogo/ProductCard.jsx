function ProductCard({ product, onAddToMix, isInMix }) {
    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-emerald-200 hover:-translate-y-1">
            {/* Product Image */}
            <div className="relative h-48 bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden">
                {product.imagen ? (
                    <img
                        src={product.imagen}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-emerald-600 rounded-full shadow-sm">
                        {product.category}
                    </span>
                )}

                {/* In Mix Indicator */}
                {isInMix && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between gap-3">
                    {/* Price */}
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Precio</span>
                        <span className="text-xl font-bold text-emerald-600">
                            ${product.price?.toFixed(2) || '0.00'}
                        </span>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => onAddToMix(product)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                            ${isInMix
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25'
                            }`}
                    >
                        {isInMix ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Quitar
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Agregar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
