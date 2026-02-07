import { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import { createMix } from '../../services/mixService';
import { createOrder } from '../../services/orderService';
import { logout, getCurrentUser } from '../../services/authService';
import ProductCard from './ProductCard';
import SaveMixModal from './SaveMixModal';
import MixPanel from './MixPanel';
import CreateOrderModal from './CreateOrderModal';

function CatalogPage({ onLogout }) {
    const [products, setProducts] = useState([]);
    const [mixProducts, setMixProducts] = useState([]); // Cada item incluye quantityLbs
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMixPanel, setShowMixPanel] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [switchToSavedTab, setSwitchToSavedTab] = useState(false); // Para cambiar a pestaña Guardadas
    // Estados para pedidos
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderProducts, setOrderProducts] = useState([]);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const user = getCurrentUser();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los productos',
                confirmButtonColor: '#10b981'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToMix = (product) => {
        const isInMix = mixProducts.some(p => p._id === product._id);

        if (isInMix) {
            setMixProducts(prev => prev.filter(p => p._id !== product._id));
        } else {
            // Agregar con cantidad default de 1 lb
            setMixProducts(prev => [...prev, { ...product, quantityLbs: 1 }]);
            setShowMixPanel(true);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        // Validar mínimo 0.1 lbs
        const quantity = Math.max(0.1, parseFloat(newQuantity) || 0.1);
        setMixProducts(prev =>
            prev.map(p => p._id === productId ? { ...p, quantityLbs: quantity } : p)
        );
    };

    const handleLogout = () => {
        logout();
        if (onLogout) {
            onLogout();
        }
    };

    const handleClearMix = () => {
        window.Swal?.fire({
            icon: 'warning',
            title: '¿Limpiar mezcla?',
            text: '¿Estás seguro de que deseas quitar todos los productos de tu mezcla?',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setMixProducts([]);
            }
        });
    };

    const handleConfirmMix = () => {
        setShowSaveModal(true);
    };

    const handleSaveMix = async (mixName) => {
        setIsSaving(true);

        try {
            const ingredients = mixProducts.map(p => ({
                productId: p._id,
                quantityLbs: p.quantityLbs
            }));

            await createMix(mixName, ingredients);

            window.Swal?.fire({
                icon: 'success',
                title: '¡Mezcla guardada!',
                text: `Tu mezcla "${mixName}" ha sido guardada exitosamente`,
                confirmButtonColor: '#10b981'
            });

            setShowSaveModal(false);
            setMixProducts([]);
            // Cambiar a pestaña Guardadas para mostrar la nueva mezcla
            setSwitchToSavedTab(prev => !prev); // Toggle para disparar el efecto
        } catch (error) {
            console.error('Error al guardar mezcla:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo guardar la mezcla',
                confirmButtonColor: '#10b981'
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handler para abrir modal de creación de pedido desde una mezcla guardada
    const handleCreateOrderFromMix = (productsFromMix) => {
        setOrderProducts(productsFromMix);
        setShowOrderModal(true);
    };

    // Handler para cargar productos de una mezcla guardada en el mixer
    const handleLoadMixProducts = (productsFromMix) => {
        setMixProducts(productsFromMix);
        setShowMixPanel(true);
    };

    // Handler para confirmar y crear el pedido
    const handleConfirmOrder = async (orderItems) => {
        setIsCreatingOrder(true);
        try {
            const items = orderItems.map(item => ({
                productId: item._id,
                quantity: item.quantityLbs
            }));

            console.log('Items enviados al backend:', items);
            await createOrder(items);

            window.Swal?.fire({
                icon: 'success',
                title: '¡Pedido creado!',
                text: 'Tu pedido ha sido registrado exitosamente',
                confirmButtonColor: '#10b981'
            });

            setShowOrderModal(false);
            setOrderProducts([]);
        } catch (error) {
            console.error('Error al crear pedido:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo crear el pedido',
                confirmButtonColor: '#10b981'
            });
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular totales con cantidades
    const mixTotal = mixProducts.reduce((sum, p) => sum + ((p.pricePerPound || 0) * p.quantityLbs), 0);
    const mixWeight = mixProducts.reduce((sum, p) => sum + p.quantityLbs, 0);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                                KairosMix
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border-2 border-transparent rounded-xl outline-none transition-all focus:bg-white focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Mix Button */}
                            <button
                                onClick={() => setShowMixPanel(!showMixPanel)}
                                className="relative flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                <span className="hidden sm:inline">Mi Mezcla</span>
                                {mixProducts.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {mixProducts.length}
                                    </span>
                                )}
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-slate-700">{user?.nombre || 'Usuario'}</p>
                                    <p className="text-xs text-slate-500">{user?.correo || user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Cerrar sesión"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Main Content */}
                <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${showMixPanel ? 'lg:mr-80' : ''}`}>
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h1>
                        <p className="text-slate-500">Selecciona los productos para crear tu mezcla personalizada</p>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                                <p className="text-slate-500 font-medium">Cargando productos...</p>
                            </div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-1">No se encontraron productos</h3>
                            <p className="text-slate-500">Intenta con otros términos de búsqueda</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-6">
                            {filteredProducts.map(product => (
                                <div key={product._id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] min-w-[280px]">
                                    <ProductCard
                                        product={product}
                                        onAddToMix={handleAddToMix}
                                        isInMix={mixProducts.some(p => p._id === product._id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Mix Panel */}
                <MixPanel
                    isOpen={showMixPanel}
                    onClose={() => setShowMixPanel(false)}
                    mixProducts={mixProducts}
                    onRemoveProduct={handleAddToMix}
                    onQuantityChange={handleQuantityChange}
                    mixTotal={mixTotal}
                    mixWeight={mixWeight}
                    onClear={handleClearMix}
                    onSave={handleConfirmMix}
                    onCreateOrder={handleCreateOrderFromMix}
                    onLoadMixProducts={handleLoadMixProducts}
                    switchToSavedTab={switchToSavedTab}
                />
            </div>

            {/* Overlay for mobile */}
            {showMixPanel && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setShowMixPanel(false)}
                />
            )}

            {/* Save Mix Modal */}
            <SaveMixModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                mixProducts={mixProducts}
                totalPrice={mixTotal}
                totalWeight={mixWeight}
                onSave={handleSaveMix}
                isSaving={isSaving}
            />

            {/* Create Order Modal */}
            <CreateOrderModal
                isOpen={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                initialProducts={orderProducts}
                allProducts={products}
                onConfirm={handleConfirmOrder}
                isLoading={isCreatingOrder}
            />

        </div>
    );
}

export default CatalogPage;
