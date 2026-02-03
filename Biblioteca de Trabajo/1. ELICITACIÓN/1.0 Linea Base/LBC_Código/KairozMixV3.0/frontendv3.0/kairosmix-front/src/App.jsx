import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import Login from './components/auth/Login';
import ClientRegister from './components/auth/ClientRegister';
import CatalogPage from './components/catalogo/CatalogPage';
import NotFoundPage from './components/NotFoundPage';
import { isAuthenticated, logout, getCurrentUser } from './services/authService';

const ADMIN_EMAIL = 'admin@kairozmix.com';

// Helper para verificar si el usuario actual es admin
const isAdminUser = () => {
    const user = getCurrentUser();
    return isAuthenticated() && user?.email === ADMIN_EMAIL;
};

// Componente para el área de cliente
function ClientArea() {
    const [view, setView] = useState(isAuthenticated() ? 'catalog' : 'login');

    const handleLogin = () => {
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
        <Login
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
        />
    );
}

// Componente para el área de administrador (protegida - solo accesible si ya está logueado como admin)
function AdminArea() {
    const [currentPage, setCurrentPage] = useState('products');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Si no es admin, mostrar página no encontrada (oculta existencia de /admin)
    if (!isAdminUser()) {
        return <NotFoundPage />;
    }

    const handleAdminLogout = () => {
        logout();
        window.location.href = '/';
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-emerald-50">
            <Sidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onCollapse={setIsSidebarCollapsed}
                onLogout={handleAdminLogout}
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
                {/* Ruta principal - área de clientes */}
                <Route path="/" element={<ClientArea />} />

                {/* Ruta de registro */}
                <Route path="/register" element={
                    <ClientRegister
                        onRegisterSuccess={() => window.location.href = '/'}
                        onSwitchToLogin={() => window.location.href = '/'}
                    />
                } />

                {/* Ruta de administrador - solo accesible si está logueado como admin */}
                <Route path="/admin" element={<AdminArea />} />

                {/* Cualquier otra ruta - página no encontrada */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
