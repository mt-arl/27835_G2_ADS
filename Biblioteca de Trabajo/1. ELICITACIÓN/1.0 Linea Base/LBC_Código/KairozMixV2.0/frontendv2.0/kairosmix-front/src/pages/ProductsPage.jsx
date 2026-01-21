import { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import ProductSearch from '../components/ProductSearch';
import ProductTable from '../components/ProductTable';
import { deactivateProduct } from '../services/productService';

export default function ProductsPage() {
    const [productToEdit, setProductToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [searchResults, productToEdit]);

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
        <div className="page-container">
            <div className="page-header">
                <div className="page-title">
                    <i data-lucide="package"></i>
                    <div>
                        <h1>Gestión de Productos</h1>
                        <p>Administra el inventario de productos</p>
                    </div>
                </div>
                <button onClick={handleNewProduct} className="btn-primary">
                    <i data-lucide="plus"></i>
                    Nuevo Producto
                </button>
            </div>

            <div className="page-content">
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
            </div>
        </div>
    );
}
