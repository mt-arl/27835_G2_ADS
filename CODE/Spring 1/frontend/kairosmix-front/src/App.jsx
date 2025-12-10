import { useState, useEffect } from 'react';
import ProductModal from './components/ProductModal';
import ProductSearch from './components/ProductSearch';
import ProductTable from './components/ProductTable';
import ClientModal from './components/ClientModal';
import { deactivateProduct } from './services/productService';
import './App.css';

function App() {
    const [productToEdit, setProductToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [searchResults, productToEdit, isClientModalOpen]);

    const showAlert = (icon, title, text) => {
        window.Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#10b981'
        });
    };

    const showConfirm = async (title, html, confirmText) => {
        return await window.Swal.fire({
            icon: 'warning',
            title,
            html,
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancelar'
        });
    };

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

    const handleNewClient = () => {
        setIsClientModalOpen(true);
    };

    const handleCloseClientModal = () => {
        setIsClientModalOpen(false);
    };

    const handleDelete = async (product) => {
        const result = await showConfirm(
            '¿Eliminar producto?',
            `¿Está seguro que desea eliminar el producto <strong>"${product.name}"</strong>?<br><br>Esta acción no se puede deshacer.`,
            'Sí, eliminar'
        );
        
        if (!result.isConfirmed) return;

        try {
            await deactivateProduct(product._id);
            showAlert('success', 'Producto eliminado', 'El producto se ha eliminado exitosamente');
            setSearchResults(prev => prev.filter(p => p._id !== product._id));
        } catch (error) {
            showAlert('error', 'Error', error.message || 'Error al eliminar producto');
        }
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
                        <button onClick={handleNewClient} className="btn-new-client">
                            <i data-lucide="user-plus" className="nav-icon"></i>
                            Nuevo Cliente
                        </button>
                    </nav>
                </div>
            </header>

            <main className="app-container">
                <ProductSearch onSearch={handleSearchResults} />
                
                {searchResults.length > 0 && (
                    <ProductTable 
                        products={searchResults} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}

                <ProductModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    productToEdit={productToEdit}
                    onSuccess={handleFormSuccess}
                />

                <ClientModal 
                    isOpen={isClientModalOpen}
                    onClose={handleCloseClientModal}
                    onSuccess={handleFormSuccess}
                />
            </main>
        </div>
    );
}

export default App;
