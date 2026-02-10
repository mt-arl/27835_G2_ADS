import { useState } from 'react';

export default function Sidebar({ currentPage, onNavigate, onCollapse, onLogout, isMobileOpen, onMobileToggle }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapse = (collapsed) => {
        setIsCollapsed(collapsed);
        if (onCollapse) {
            onCollapse(collapsed);
        }
    };

    const handleMobileClose = () => {
        if (onMobileToggle) {
            onMobileToggle(false);
        }
    };

    const handleNavigate = (page) => {
        onNavigate(page);
        // Close mobile menu after navigation
        handleMobileClose();
    };

    const menuItems = [
        { id: 'products', icon: 'fa-solid fa-box', label: 'Productos' },
        { id: 'clients', icon: 'fa-solid fa-users', label: 'Clientes' },
        { id: 'orders', icon: 'fa-solid fa-clipboard-list', label: 'Pedidos' }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={handleMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 flex flex-col shadow-lg transition-all duration-300
                ${isCollapsed ? 'w-20' : 'w-64'}
                ${isMobileOpen ? 'translate-x-0 z-50' : '-translate-x-full md:translate-x-0 z-40'}
                md:z-40`}>
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between min-h-20">
                    <div
                        className="flex items-center gap-4 text-white font-bold text-lg cursor-pointer group"
                        onClick={() => handleCollapse(!isCollapsed)}
                        title={isCollapsed ? 'Expandir menú' : 'KairosMix'}
                    >
                        <i className="fa-solid fa-store text-2xl text-emerald-500 transition-all duration-200 group-hover:text-emerald-600 group-hover:scale-110"></i>
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">KairosMix</span>}
                    </div>
                    {!isCollapsed && (
                        <button
                            className="bg-emerald-500 border-none rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:bg-emerald-600 hover:scale-105 hover:shadow-lg"
                            onClick={() => handleCollapse(!isCollapsed)}
                            title="Contraer"
                        >
                            <i className="fa-solid fa-chevron-left text-white"></i>
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 px-2 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`flex items-center gap-4 py-3 px-4 mb-1 bg-transparent border-none rounded-lg text-white/70 text-sm font-medium cursor-pointer transition-all duration-200 w-full text-left hover:bg-white/10 hover:text-white
                            ${currentPage === item.id ? 'bg-white/15 text-white border-l-4 border-emerald-400' : ''}
                            ${isCollapsed ? 'justify-center px-3' : ''}`}
                            onClick={() => handleNavigate(item.id)}
                            title={isCollapsed ? item.label : ''}
                        >
                            <i className={`${item.icon} text-lg shrink-0`}></i>
                            {!isCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                    <div className={`flex items-center gap-4 text-white mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
                        <i className="fa-regular fa-circle-user text-3xl shrink-0"></i>
                        {!isCollapsed && (
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                <span className="text-sm font-semibold truncate">admin@kairozmix.com</span>
                                <span className="text-xs text-white/60">Administrador</span>
                            </div>
                        )}
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className={`flex items-center gap-3 w-full py-2.5 px-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/50
                            ${isCollapsed ? 'justify-center px-3' : ''}`}
                            title="Cerrar sesión"
                        >
                            <i className="fa-solid fa-sign-out-alt"></i>
                            {!isCollapsed && <span>Cerrar sesión</span>}
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}
