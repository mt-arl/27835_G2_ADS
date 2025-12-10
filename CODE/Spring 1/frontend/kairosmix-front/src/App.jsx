import { useState, useEffect } from 'react';
import ProductModal from './components/ProductModal';
import ProductSearch from './components/ProductSearch';
import ProductTable from './components/ProductTable';
import './App.css';

function App() {
    const [productToEdit, setProductToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [searchResults, productToEdit]);

    const handleFormSuccess = () => {
        setProductToEdit(null);
        setIsModalOpen(false);
        setSearchResults([]);
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleNewProduct = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProductToEdit(null);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="app-icon">
                            <i data-lucide="store"></i>
                        </div>
                        <div className="header-text">
                            <h1>KairosMix</h1>
                            <p className="header-subtitle">Sistema de Gestión de Productos</p>
                        </div>
                    </div>
                    <nav className="header-nav">
                        <button onClick={handleNewProduct} className="btn-new-product">
                            <i data-lucide="plus" className="nav-icon"></i>
                            Nuevo Producto
                        </button>
                    </nav>
                </div>
            </header>

            <main className="app-container">
                <ProductSearch onSearch={handleSearchResults} />
                
                {searchResults.length > 0 && (
                    <ProductTable products={searchResults} onEdit={handleEdit} />
                )}

                <ProductModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    productToEdit={productToEdit}
                    onSuccess={handleFormSuccess}
                />
            </main>
        </div>
    );
}

export default App;
