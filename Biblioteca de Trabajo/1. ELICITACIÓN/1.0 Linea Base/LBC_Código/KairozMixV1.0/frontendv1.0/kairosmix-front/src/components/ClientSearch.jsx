import { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';
import './ClientSearch.css';

export default function ClientSearch({ onSearch }) {
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
            showAlert('warning', 'Campo vacío', 'Por favor ingrese un término de búsqueda');
            return;
        }

        setLoading(true);

        try {
            const allClients = await getClients();
            const results = allClients.filter(client => 
                client.nombre.toLowerCase().includes(query.toLowerCase()) ||
                client.cedula.includes(query) ||
                client.correo.toLowerCase().includes(query.toLowerCase()) ||
                client.telefono.includes(query)
            );
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
            const allClients = await getClients();
            onSearch(allClients);
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error', 'Error al cargar clientes: ' + error.message);
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
        <div className="client-search">
            <div className="search-header">
                <div className="search-icon">
                    <i data-lucide="search"></i>
                </div>
                <div className="search-title">
                    <h2>Buscar Clientes</h2>
                    <p>Busque por nombre, identificación, correo o teléfono</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="Ingrese nombre, cédula, correo o teléfono..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <button 
                        type="submit" 
                        className="btn-search"
                        disabled={loading}
                    >
                        <i data-lucide="search"></i>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                <div className="search-actions">
                    <button
                        type="button"
                        onClick={handleShowAll}
                        className="btn-show-all"
                        disabled={loading}
                    >
                        <i data-lucide="list"></i>
                        Mostrar Todos
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="btn-clear"
                        disabled={loading}
                    >
                        <i data-lucide="x"></i>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
}
