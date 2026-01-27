import { useState } from 'react';
import ProductModal from '../components/productos/ProductModal';
import ProductSearch from '../components/productos/ProductSearch';
import ProductTable from '../components/productos/ProductTable';
import { deactivateProduct } from '../services/productService';

export default function ProductsPage() {
    const [productToEdit, setProductToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

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
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30">
                        <i className="fa-solid fa-box text-2xl text-white"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>
                        <p className="text-sm text-slate-500">Administra el inventario de productos</p>
                    </div>
                </div>
                <button
                    onClick={handleNewProduct}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                    <i className="fa-solid fa-plus text-lg"></i>
                    Nuevo Producto
                </button>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
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
