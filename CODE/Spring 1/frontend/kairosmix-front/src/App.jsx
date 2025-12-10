import { useState, useEffect } from 'react';
import ProductModal from './components/ProductModal';
import ProductSearch from './components/ProductSearch';
import ProductTable from './components/ProductTable';
import ClientForm from './components/ClientForm';
import { createClient } from './services/clientService';
import './App.css';

function App() {
    const [productToEdit, setProductToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showClientForm, setShowClientForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [searchResults, productToEdit, showClientForm]);

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
        setShowClientForm(true);
    };

    const handleCloseClientForm = () => {
        setShowClientForm(false);
    };

    const handleClientSubmit = async (clientData) => {
        setIsSubmitting(true);
        try {
            await createClient(clientData);
            alert('Cliente registrado exitosamente');
            setShowClientForm(false);
            return true;
        } catch (error) {
            alert(error.message || 'Error al registrar cliente');
            return false;
        } finally {
            setIsSubmitting(false);
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
                    <ProductTable products={searchResults} onEdit={handleEdit} />
                )}

                <ProductModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    productToEdit={productToEdit}
                    onSuccess={handleFormSuccess}
                />

                {showClientForm && (
                    <div className="modal-overlay" onClick={handleCloseClientForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <ClientForm 
                                onSubmit={handleClientSubmit}
                                onCancel={handleCloseClientForm}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
