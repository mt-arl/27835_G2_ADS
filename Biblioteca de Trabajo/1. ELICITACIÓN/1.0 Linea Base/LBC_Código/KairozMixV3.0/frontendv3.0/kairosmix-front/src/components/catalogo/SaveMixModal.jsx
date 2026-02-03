import { useState } from 'react';

export default function SaveMixModal({
    isOpen,
    onClose,
    mixProducts,
    totalPrice,
    totalWeight,
    onSave,
    isSaving
}) {
    const [mixName, setMixName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!mixName.trim()) {
            setError('Por favor ingresa un nombre para tu mezcla');
            return;
        }
        setError('');
        onSave(mixName.trim());
    };

    const handleClose = () => {
        setMixName('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-5 bg-linear-to-r from-emerald-500 to-emerald-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Guardar Mezcla</h2>
                            <p className="text-sm text-white/80">Dale un nombre a tu mezcla personalizada</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Mix Name Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Nombre de la mezcla
                        </label>
                        <input
                            type="text"
                            value={mixName}
                            onChange={(e) => setMixName(e.target.value)}
                            placeholder="Ej: Mi mezcla energética"
                            className={`w-full px-4 py-3 text-base border-2 rounded-xl outline-none transition-all duration-200 ${error
                                    ? 'border-red-300 bg-red-50 focus:border-red-400'
                                    : 'border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'
                                }`}
                            disabled={isSaving}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Mix Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Resumen de ingredientes</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {mixProducts.map(product => (
                                <div key={product._id} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">{product.name}</span>
                                    <span className="font-medium text-slate-700">
                                        {product.quantityLbs} lb × ${(product.pricePerPound || 0).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 mt-3 pt-3 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Peso total</span>
                                <span className="font-semibold text-slate-700">{totalWeight.toFixed(2)} lbs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Precio total</span>
                                <span className="text-lg font-bold text-emerald-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={isSaving}
                            className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-3 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    Guardar Mezcla
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
