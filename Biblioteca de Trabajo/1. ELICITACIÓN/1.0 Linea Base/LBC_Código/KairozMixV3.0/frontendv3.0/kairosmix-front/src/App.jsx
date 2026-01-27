import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import ClientLogin from './components/auth/ClientLogin';
import ClientRegister from './components/auth/ClientRegister';
import CatalogPage from './components/catalogo/CatalogPage';
import { isAuthenticated, logout } from './services/authService';

// Componente para el área de cliente
function ClientArea() {
    const [view, setView] = useState(isAuthenticated() ? 'catalog' : 'login');

    const handleClientLogin = () => {
        setView('catalog');
    };

    const handleClientLogout = () => {
        logout();
        setView('login');
    };

    const handleSwitchToRegister = () => setView('register');
    const handleSwitchToLogin = () => setView('login');
    const handleRegisterSuccess = () => setView('login');

    // Mostrar registro si el view es 'register'
    if (view === 'register') {
        return (
            <ClientRegister
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
            />
        );
    }

    // Mostrar catálogo si está autenticado y view es 'catalog'
    if (view === 'catalog' && isAuthenticated()) {
        return <CatalogPage onLogout={handleClientLogout} />;
    }

    // Por defecto mostrar login
    return (
        <ClientLogin
            onLogin={handleClientLogin}
            onSwitchToRegister={handleSwitchToRegister}
        />
    );
}

// Componente para el área de administrador
function AdminArea() {
    const [currentPage, setCurrentPage] = useState('products');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-emerald-50">
            <Sidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onCollapse={setIsSidebarCollapsed}
            />
            <main className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                {currentPage === 'products' && <ProductsPage />}
                {currentPage === 'clients' && <ClientsPage />}
            </main>
        </div>
    );
}

// App principal con React Router
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas de cliente */}
                <Route path="/" element={<ClientArea />} />
                <Route path="/register" element={
                    <ClientRegister
                        onRegisterSuccess={() => window.location.href = '/'}
                        onSwitchToLogin={() => window.location.href = '/'}
                    />
                } />

                {/* Rutas de administrador */}
                <Route path="/admin" element={<AdminArea />} />

                {/* Redirigir rutas no encontradas */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
