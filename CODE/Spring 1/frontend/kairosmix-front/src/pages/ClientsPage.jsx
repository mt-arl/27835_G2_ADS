import { useState, useEffect } from 'react';
import ClientModal from '../components/ClientModal';
import ClientSearch from '../components/ClientSearch';
import ClientTable from '../components/ClientTable';
import { deactivateClient } from '../services/clientService';

export default function ClientsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [searchResults]);

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
        setIsModalOpen(false);
        setSearchResults([]);
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const handleNewClient = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (client) => {
        const result = await showConfirm(
            '¿Eliminar cliente?',
            `¿Está seguro que desea eliminar al cliente <strong>"${client.nombre}"</strong>?<br><br>Esta acción no se puede deshacer.`,
            'Sí, eliminar'
        );
        
        if (!result.isConfirmed) return;

        try {
            await deactivateClient(client._id);
            showAlert('success', 'Cliente eliminado', 'El cliente se ha eliminado exitosamente');
            setSearchResults(prev => prev.filter(c => c._id !== client._id));
        } catch (error) {
            showAlert('error', 'Error', error.message || 'Error al eliminar cliente');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-title">
                    <i data-lucide="users"></i>
                    <div>
                        <h1>Gestión de Clientes</h1>
                        <p>Administra la base de clientes</p>
                    </div>
                </div>
                <button onClick={handleNewClient} className="btn-primary">
                    <i data-lucide="user-plus"></i>
                    Nuevo Cliente
                </button>
            </div>

            <div className="page-content">
                <ClientSearch onSearch={handleSearchResults} />
                
                {searchResults.length > 0 && (
                    <ClientTable 
                        clients={searchResults}
                        onDelete={handleDelete}
                    />
                )}

                <ClientModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={handleFormSuccess}
                />
            </div>
        </div>
    );
}
