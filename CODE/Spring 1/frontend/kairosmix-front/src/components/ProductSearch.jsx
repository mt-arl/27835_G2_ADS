import { useState, useEffect } from 'react';
import { searchProducts as searchProductsService, getProducts } from '../services/productService.js';
import './ProductSearch.css';

export default function ProductSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [query]);

    const showAlert = (icon, title, text) => {
        window.Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#10b981'
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            showAlert('warning', 'Campo vacío', 'Por favor ingresa un término de búsqueda');
            return;
        }

        setLoading(true);

        try {
            const results = await searchProductsService(query);
            onSearch(results);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error en la búsqueda: ' + error.message);
            onSearch([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAll = async () => {
        setLoading(true);
        setQuery('');
        
        try {
            const allProducts = await getProducts();
            onSearch(allProducts);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error al cargar productos: ' + error.message);
            onSearch([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch([]);
    };

    return (
        <div className="product-search">
            <div className="search-header">
                <div className="search-icon">
                    <i data-lucide="search"></i>
                </div>
                <div>
                    <h2>Buscar Productos</h2>
                    <p className="search-subtitle">Busque por código o nombre</p>
                </div>
            </div>
            <form onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                    <i data-lucide="search" className="input-search-icon"></i>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="q1"
                    />
                    {query && (
                        <button 
                            type="button" 
                            className="clear-input"
                            onClick={handleClear}
                        >
                            <i data-lucide="x"></i>
                        </button>
                    )}
                </div>
                <div className="search-actions">
                    <button type="submit" disabled={loading} className="btn-search">
                        <i data-lucide="search" className="btn-icon"></i>
                        {loading ? 'Buscando...' : 'BUSCAR'}
                    </button>
                    <button 
                        type="button" 
                        disabled={loading} 
                        className="btn-show-all"
                        onClick={handleShowAll}
                    >
                        <i data-lucide="list" className="btn-icon"></i>
                        {loading ? 'Cargando...' : 'VER TODOS'}
                    </button>
                </div>
            </form>
        </div>
    );
}
