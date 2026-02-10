import { useState, useEffect } from 'react';

export default function CreateOrderModal({
    isOpen,
    onClose,
    initialProducts,
    onConfirm,
    isLoading
}) {
    const [orderItems, setOrderItems] = useState([]);

    // Sincronizar con productos iniciales cuando cambian
    useEffect(() => {
        if (initialProducts) {
            setOrderItems(initialProducts);
        }
    }, [initialProducts]);

    if (!isOpen) return null;

    const handleQuantityChange = (productId, newQuantity) => {
        const quantity = Math.max(0.1, parseFloat(newQuantity) || 0.1);
        setOrderItems(prev =>
            prev.map(item =>
                item._id === productId ? { ...item, quantityLbs: quantity } : item
            )
        );
    };

    const handleRemoveItem = (productId) => {
        setOrderItems(prev => prev.filter(item => item._id !== productId));
    };

    const totalPrice = orderItems.reduce(
        (sum, item) => sum + (item.pricePerPound || 0) * item.quantityLbs,
        0
    );

    const totalWeight = orderItems.reduce(
        (sum, item) => sum + item.quantityLbs,
        0
    );

    const handleConfirm = () => {
        if (orderItems.length === 0) {
            window.Swal?.fire({
                icon: 'warning',
                title: 'Pedido vacío',
                text: 'Agrega productos desde el catálogo antes de confirmar',
                confirmButtonColor: '#10b981'
            });
            return;
        }
        onConfirm(orderItems);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-orange-500 to-orange-600">
                    <div>
                        <h2 className="text-xl font-bold text-white">Confirmar Pedido</h2>
                        <p className="text-sm text-orange-100">Revisa tu pedido antes de confirmar</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {orderItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-1">Pedido vacío</h3>
                            <p className="text-xs text-slate-500">Cierra este modal y agrega productos desde el catálogo</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orderItems.map(item => (
                                <div key={item._id} className="p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-start gap-3 mb-2">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500">${(item.pricePerPound || 0).toFixed(2)}/lb</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item._id)}
                                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500">Cantidad:</label>
                                        <input
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            value={item.quantityLbs}
                                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                            className="w-20 px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                        />
                                        <span className="text-xs text-slate-500">lbs</span>
                                        <span className="ml-auto text-sm font-bold text-orange-600">
                                            ${((item.pricePerPound || 0) * item.quantityLbs).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Nota de ayuda */}
                    {orderItems.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <p className="text-xs text-blue-700">
                                ¿Necesitas más productos? Cierra este modal y agrégalos desde el catálogo.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50">
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Productos</span>
                            <span className="font-medium text-slate-700">{orderItems.length} items</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Peso total</span>
                            <span className="font-medium text-slate-700">{totalWeight.toFixed(2)} lbs</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-slate-700">Total</span>
                            <span className="text-2xl font-bold text-orange-600">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading || orderItems.length === 0}
                            className="flex-1 py-3 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 11 12 14 22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                    Confirmar Pedido
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
