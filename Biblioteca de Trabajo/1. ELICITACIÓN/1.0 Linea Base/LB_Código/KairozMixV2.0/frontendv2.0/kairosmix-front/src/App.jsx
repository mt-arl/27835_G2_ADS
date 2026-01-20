import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('products');

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [currentPage]);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="app-layout">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
            <main className="main-content">
                {currentPage === 'products' && <ProductsPage />}
                {currentPage === 'clients' && <ClientsPage />}
            </main>
        </div>
    );
}

export default App;
