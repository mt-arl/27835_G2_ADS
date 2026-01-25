import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
// import './App.css';
import Login from './components/login/Login';

function App() {
    const [currentPage, setCurrentPage] = useState('products');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [currentPage]);

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
        // <Login />
    );
}

export default App;

