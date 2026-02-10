import { useState, useEffect } from 'react';
import { getMixes } from '../../services/mixService';

export default function MyMixesPanel({ isOpen, onClose }) {
    const [mixes, setMixes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedMix, setExpandedMix] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadMixes();
        }
    }, [isOpen]);

    const loadMixes = async () => {
        setLoading(true);
        try {
            const data = await getMixes();
            setMixes(data);
        } catch (error) {
            console.error('Error al cargar mezclas:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar tus mezclas',
                confirmButtonColor: '#10b981'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 bg-linear-to-r from-emerald-500 to-emerald-600 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Mis Mezclas</h2>
                            <p className="text-sm text-white/80">Tus mezclas personalizadas guardadas</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    ) : mixes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-1">No tienes mezclas guardadas</h3>
                            <p className="text-sm text-slate-500">Crea tu primera mezcla personalizada desde el catálogo</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mixes.map((mix) => (
                                <div
                                    key={mix._id}
                                    className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
                                >
                                    {/* Mix Header */}
                                    <button
                                        onClick={() => setExpandedMix(expandedMix === mix._id ? null : mix._id)}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                    <path d="M2 17l10 5 10-5" />
                                                    <path d="M2 12l10 5 10-5" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-800">{mix.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {mix.ingredients?.length || 0} ingredientes • {(mix.totalWeight || 0).toFixed(2)} lbs
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-emerald-600">
                                                ${(mix.totalPrice || 0).toFixed(2)}
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={`text-slate-400 transition-transform ${expandedMix === mix._id ? 'rotate-180' : ''}`}
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* Mix Details (Expanded) */}
                                    {expandedMix === mix._id && (
                                        <div className="px-4 pb-4 border-t border-slate-200">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-3 mb-2">
                                                Ingredientes
                                            </p>
                                            <div className="space-y-2">
                                                {mix.ingredients?.map((ingredient, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between text-sm py-2 px-3 bg-white rounded-lg"
                                                    >
                                                        <span className="text-slate-700">{ingredient.productName}</span>
                                                        <div className="text-right">
                                                            <span className="text-slate-500">{ingredient.quantityLbs} lbs</span>
                                                            <span className="text-slate-400 mx-2">×</span>
                                                            <span className="text-emerald-600 font-medium">
                                                                ${(ingredient.priceAtMoment || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-sm text-slate-500">
                                                    Creada: {new Date(mix.createdAt).toLocaleDateString('es-EC')}
                                                </span>
                                                <span className="text-lg font-bold text-emerald-600">
                                                    Total: ${(mix.totalPrice || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
