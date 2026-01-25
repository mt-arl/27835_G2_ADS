import { useState, useEffect } from 'react';
import ClientModal from '../components/clientes/ClientModal';
import ClientSearch from '../components/clientes/ClientSearch';
import ClientTable from '../components/clientes/ClientTable';
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
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/30">
                        <i data-lucide="users" className="w-7 h-7 text-white"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1>
                        <p className="text-sm text-slate-500">Administra la base de clientes</p>
                    </div>
                </div>
                <button
                    onClick={handleNewClient}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
                >
                    <i data-lucide="user-plus" className="w-5 h-5"></i>
                    Nuevo Cliente
                </button>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
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
