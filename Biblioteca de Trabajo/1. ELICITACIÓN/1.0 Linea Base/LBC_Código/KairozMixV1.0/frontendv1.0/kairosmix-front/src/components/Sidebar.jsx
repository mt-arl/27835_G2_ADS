import { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({ currentPage, onNavigate }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [isCollapsed]);

    const menuItems = [
        { id: 'products', icon: 'package', label: 'Productos' },
        { id: 'clients', icon: 'users', label: 'Clientes' }
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div 
                    className="sidebar-logo" 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ cursor: 'pointer' }}
                    title={isCollapsed ? 'Expandir menú' : 'KairosMix'}
                >
                    <i data-lucide="store"></i>
                    {!isCollapsed && <span>KairosMix</span>}
                </div>
                {!isCollapsed && (
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title="Contraer"
                    >
                        <i data-lucide="chevron-left"></i>
                    </button>
                )}
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        title={isCollapsed ? item.label : ''}
                    >
                        <i data-lucide={item.icon}></i>
                        {!isCollapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <i data-lucide="user-circle"></i>
                    {!isCollapsed && (
                        <div className="user-info">
                            <span className="user-name">Usuario</span>
                            <span className="user-role">Administrador</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
