import { useState, useEffect } from 'react';

export default function Sidebar({ currentPage, onNavigate, onCollapse }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [isCollapsed]);

    useEffect(() => {
        if (onCollapse) {
            onCollapse(isCollapsed);
        }
    }, [isCollapsed, onCollapse]);

    const menuItems = [
        { id: 'products', icon: 'package', label: 'Productos' },
        { id: 'clients', icon: 'users', label: 'Clientes' }
    ];

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 flex flex-col shadow-lg z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between min-h-20">
                <div
                    className="flex items-center gap-4 text-white font-bold text-lg cursor-pointer group"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Expandir menú' : 'KairosMix'}
                >
                    <i data-lucide="store" className="w-8 h-8 text-emerald-500 transition-all duration-200 group-hover:text-emerald-600 group-hover:scale-110"></i>
                    {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">KairosMix</span>}
                </div>
                {!isCollapsed && (
                    <button
                        className="bg-emerald-500 border-none rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:bg-emerald-600 hover:scale-105 hover:shadow-lg"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title="Contraer"
                    >
                        <i data-lucide="chevron-left" className="w-5 h-5 text-white"></i>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 px-2 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`flex items-center gap-4 py-3 px-4 mb-1 bg-transparent border-none rounded-lg text-white/70 text-sm font-medium cursor-pointer transition-all duration-200 w-full text-left hover:bg-white/10 hover:text-white
                            ${currentPage === item.id ? 'bg-emerald-500 text-white' : ''}
                            ${isCollapsed ? 'justify-center px-3' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        title={isCollapsed ? item.label : ''}
                    >
                        <i data-lucide={item.icon} className="w-5 h-5 shrink-0"></i>
                        {!isCollapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
                <div className={`flex items-center gap-4 text-white ${isCollapsed ? 'justify-center' : ''}`}>
                    <i data-lucide="user-circle" className="w-9 h-9 shrink-0"></i>
                    {!isCollapsed && (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold">Usuario</span>
                            <span className="text-xs text-white/60">Administrador</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
