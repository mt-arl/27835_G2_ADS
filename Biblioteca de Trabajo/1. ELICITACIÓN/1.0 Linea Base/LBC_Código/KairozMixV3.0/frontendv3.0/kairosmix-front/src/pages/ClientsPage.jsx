import { useState } from 'react';
import AdminSearch from '../components/admin/AdminSearch';
import AdminTable from '../components/admin/AdminTable';
import ClientModal from '../components/clientes/ClientModal';
import { getClients, deactivateClient } from '../services/clientService';

// Configuración de columnas para la tabla de clientes
const clientColumns = [
    { key: 'cedula', label: 'Identificación', type: 'code' },
    { key: 'nombre', label: 'Nombre', className: 'font-semibold' },
    { key: 'correo', label: 'Correo', type: 'email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'direccion', label: 'Dirección', className: 'max-w-48 truncate' }
];

export default function ClientsPage() {
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
                        <i className="fa-solid fa-users text-2xl text-white"></i>
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
                    <i className="fa-solid fa-user-plus text-lg"></i>
                    Nuevo Cliente
                </button>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
                <AdminSearch
                    color="amber"
                    title="Buscar Clientes"
                    subtitle="Busque por nombre, identificación, correo o teléfono"
                    placeholder="Ingrese nombre, cédula, correo o teléfono..."
                    onSearch={handleSearchResults}
                    getAllService={getClients}
                />

                {searchResults.length > 0 && (
                    <AdminTable
                        data={searchResults}
                        columns={clientColumns}
                        onDelete={handleDelete}
                        color="amber"
                        emptyMessage="No hay clientes para mostrar"
                        emptySubMessage="Registre un nuevo cliente o realice una búsqueda diferente"
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
