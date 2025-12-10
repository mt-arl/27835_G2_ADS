import { useState, useEffect } from 'react';
import { searchProducts as searchProductsService } from '../services/productService.js';
import './ProductSearch.css';

export default function ProductSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [query]);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            window.Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor ingresa un término de búsqueda',
                confirmButtonColor: '#10b981'
            });
            return;
        }

        setLoading(true);

        try {
            const results = await searchProductsService(query);
            onSearch(results);
        } catch (error) {
            console.error('Error:', error);
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la búsqueda: ' + error.message,
                confirmButtonColor: '#10b981'
            });
        } finally {
            setLoading(false);
        }
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
                            onClick={() => setQuery('')}
                        >
                            <i data-lucide="x"></i>
                        </button>
                    )}
                </div>
                <button type="submit" disabled={loading} className="btn-search">
                    <i data-lucide="search" className="btn-icon"></i>
                    {loading ? 'Buscando...' : 'BUSCAR'}
                </button>
            </form>
        </div>
    );
}
