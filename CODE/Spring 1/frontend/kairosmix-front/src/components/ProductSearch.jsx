import { useState } from 'react';
import { searchProducts as searchProductsService } from '../services/productService.js';

export default function ProductSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            alert('Por favor ingresa un término de búsqueda');
            return;
        }

        setLoading(true);

        try {
            const results = await searchProductsService(query);
            onSearch(results);
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la búsqueda: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Buscar Productos</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por código o nombre"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>
        </div>
    );
}
