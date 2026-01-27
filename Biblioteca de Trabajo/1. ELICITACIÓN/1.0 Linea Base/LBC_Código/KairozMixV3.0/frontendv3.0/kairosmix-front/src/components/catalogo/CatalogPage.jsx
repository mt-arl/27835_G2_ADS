import { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import { logout, getCurrentUser } from '../../services/authService';
import ProductCard from './ProductCard';

function CatalogPage({ onLogout }) {
    const [products, setProducts] = useState([]);
    const [mixProducts, setMixProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMixPanel, setShowMixPanel] = useState(false);
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
            setMixProducts(prev => [...prev, product]);
        }
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

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const mixTotal = mixProducts.reduce((sum, p) => sum + (p.price || 0), 0);

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
                                    className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Mix Button */}
                            <button
                                onClick={() => setShowMixPanel(!showMixPanel)}
                                className="relative flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    <p className="text-sm font-semibold text-slate-700">{user?.nombre || 'Cliente'}</p>
                                    <p className="text-xs text-slate-500">{user?.correo}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Cerrar sesión"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Mobile Search */}
            <div className="md:hidden px-4 py-3 bg-white border-b border-slate-100">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAddToMix={handleAddToMix}
                                    isInMix={mixProducts.some(p => p._id === product._id)}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* Mix Panel */}
                <aside className={`fixed lg:sticky top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white border-l border-slate-200 shadow-xl lg:shadow-none transition-transform duration-300 z-40 ${showMixPanel ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}>
                    <div className="flex flex-col h-full">
                        {/* Panel Header */}
                        <div className="p-4 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800">Mi Mezcla</h2>
                                <button
                                    onClick={() => setShowMixPanel(false)}
                                    className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                {mixProducts.length} producto{mixProducts.length !== 1 ? 's' : ''} seleccionado{mixProducts.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Mix Items */}
                        <div className="flex-1 overflow-y-auto p-4">
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
                                        <div key={product._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0">
                                                {product.imagen ? (
                                                    <img src={product.imagen} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{product.name}</p>
                                                <p className="text-sm text-emerald-600 font-medium">${product.price?.toFixed(2)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddToMix(product)}
                                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Panel Footer */}
                        {mixProducts.length > 0 && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-slate-600">Total estimado</span>
                                    <span className="text-xl font-bold text-emerald-600">${mixTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleClearMix}
                                        className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                    <button className="flex-1 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-colors">
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Overlay for mobile */}
            {showMixPanel && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setShowMixPanel(false)}
                />
            )}
        </div>
    );
}

export default CatalogPage;
