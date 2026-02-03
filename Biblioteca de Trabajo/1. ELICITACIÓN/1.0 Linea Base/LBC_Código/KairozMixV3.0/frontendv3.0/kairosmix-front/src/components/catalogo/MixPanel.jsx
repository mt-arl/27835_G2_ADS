import { useState, useEffect } from 'react';
import { getMixes } from '../../services/mixService';

export default function MixPanel({
    isOpen,
    onClose,
    mixProducts,
    onRemoveProduct,
    onQuantityChange,
    mixTotal,
    mixWeight,
    onClear,
    onSave
}) {
    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'saved'
    const [savedMixes, setSavedMixes] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [expandedMix, setExpandedMix] = useState(null);

    useEffect(() => {
        if (isOpen && activeTab === 'saved') {
            loadSavedMixes();
        }
    }, [isOpen, activeTab]);

    const loadSavedMixes = async () => {
        setLoadingSaved(true);
        try {
            const data = await getMixes();
            setSavedMixes(data);
        } catch (error) {
            console.error('Error al cargar mezclas:', error);
        } finally {
            setLoadingSaved(false);
        }
    };

    if (!isOpen) return null;

    return (
        <aside className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white border-l border-slate-200 shadow-xl transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Panel Header with Tabs */}
                <div className="border-b border-slate-100">
                    <div className="flex items-center justify-between p-4 pb-0">
                        <h2 className="text-lg font-bold text-slate-800">Mi Mezcla</h2>
                        <button
                            onClick={onClose}
                            className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex mt-3">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'create'
                                    ? 'text-emerald-600 border-emerald-500'
                                    : 'text-slate-500 border-transparent hover:text-slate-700'
                                }`}
                        >
                            Crear Nueva
                            {mixProducts.length > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                                    {mixProducts.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'saved'
                                    ? 'text-purple-600 border-purple-500'
                                    : 'text-slate-500 border-transparent hover:text-slate-700'
                                }`}
                        >
                            Guardadas
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'create' ? (
                        /* CREATE TAB */
                        <div className="p-4">
                            {mixProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Tu mezcla está vacía</h3>
                                    <p className="text-xs text-slate-500">Agrega productos del catálogo</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {mixProducts.map(product => (
                                        <div key={product._id} className="p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-start gap-3 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                                                    <p className="text-xs text-slate-500">${(product.pricePerPound || 0).toFixed(2)}/lb</p>
                                                </div>
                                                <button
                                                    onClick={() => onRemoveProduct(product)}
                                                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {/* Quantity Input */}
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500">Cantidad:</label>
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    step="0.1"
                                                    value={product.quantityLbs}
                                                    onChange={(e) => onQuantityChange(product._id, e.target.value)}
                                                    className="w-20 px-2 py-1 text-sm text-center border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                                                />
                                                <span className="text-xs text-slate-500">lbs</span>
                                                <span className="ml-auto text-sm font-semibold text-emerald-600">
                                                    ${((product.pricePerPound || 0) * product.quantityLbs).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* SAVED TAB */
                        <div className="p-4">
                            {loadingSaved ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                                </div>
                            ) : savedMixes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                            <path d="M2 17l10 5 10-5" />
                                            <path d="M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-1">Sin mezclas guardadas</h3>
                                    <p className="text-xs text-slate-500">Crea tu primera mezcla y guárdala</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {savedMixes.map(mix => (
                                        <div key={mix._id} className="bg-slate-50 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setExpandedMix(expandedMix === mix._id ? null : mix._id)}
                                                className="w-full p-3 flex items-center justify-between hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                                                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                            <path d="M2 17l10 5 10-5" />
                                                            <path d="M2 12l10 5 10-5" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-semibold text-slate-700">{mix.name}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {mix.ingredients?.length || 0} ingredientes
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-purple-600">
                                                        ${(mix.totalPrice || 0).toFixed(2)}
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className={`text-slate-400 transition-transform ${expandedMix === mix._id ? 'rotate-180' : ''}`}
                                                    >
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </div>
                                            </button>
                                            {expandedMix === mix._id && (
                                                <div className="px-3 pb-3 border-t border-slate-200">
                                                    <div className="mt-2 space-y-1">
                                                        {mix.ingredients?.map((ing, idx) => (
                                                            <div key={idx} className="flex justify-between text-xs py-1">
                                                                <span className="text-slate-600">{ing.productName}</span>
                                                                <span className="text-slate-500">{ing.quantityLbs} lbs</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-sm">
                                                        <span className="text-slate-500">Total:</span>
                                                        <span className="font-bold text-purple-600">${(mix.totalPrice || 0).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Solo visible en tab Create con productos */}
                {activeTab === 'create' && mixProducts.length > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Peso total</span>
                                <span className="font-semibold text-slate-700">{mixWeight.toFixed(2)} lbs</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">Total</span>
                                <span className="text-xl font-bold text-emerald-600">${mixTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onClear}
                                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={onSave}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-colors"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
