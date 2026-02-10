import { useState } from 'react';
import AdminSearch from '../components/admin/AdminSearch';
import AdminTable from '../components/admin/AdminTable';
import ProductModal from '../components/productos/ProductModal';
import { searchProducts, getProducts, deactivateProduct } from '../services/productService';

// Configuración de columnas para la tabla de productos
const productColumns = [
    { key: 'code', label: 'Código', type: 'code' },
    { key: 'name', label: 'Nombre', className: 'font-semibold' },
    { key: 'pricePerPound', label: 'Precio/Lb', type: 'money', align: 'right' },
    { key: 'wholesalePrice', label: 'Mayorista', type: 'money', align: 'right' },
    { key: 'retailPrice', label: 'Minorista', type: 'money', align: 'right' },
    {
        key: 'currentStock',
        label: 'Stock',
        align: 'center',
        type: 'badge',
        badgeColor: (stock) => {
            if (stock >= 50) return 'bg-emerald-100 text-emerald-700';
            if (stock >= 20) return 'bg-amber-100 text-amber-700';
            return 'bg-red-100 text-red-700';
        }
    }
];

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
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30">
                        <i className="fa-solid fa-box text-xl md:text-2xl text-white"></i>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Gestión de Productos</h1>
                        <p className="text-xs md:text-sm text-slate-500">Administra el inventario de productos</p>
                    </div>
                </div>
                <button
                    onClick={handleNewProduct}
                    className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-sm md:text-base font-semibold rounded-xl transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 w-full sm:w-auto"
                >
                    <i className="fa-solid fa-plus text-lg"></i>
                    Nuevo Producto
                </button>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
                <AdminSearch
                    color="emerald"
                    title="Buscar Productos"
                    subtitle="Busque por código o nombre"
                    placeholder="Buscar por código o nombre..."
                    onSearch={handleSearchResults}
                    searchService={searchProducts}
                    getAllService={getProducts}
                />

                {searchResults.length > 0 && (
                    <AdminTable
                        data={searchResults}
                        columns={productColumns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        color="emerald"
                        emptyMessage="No hay productos para mostrar"
                        emptySubMessage="Cree un nuevo producto o realice una búsqueda diferente"
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
