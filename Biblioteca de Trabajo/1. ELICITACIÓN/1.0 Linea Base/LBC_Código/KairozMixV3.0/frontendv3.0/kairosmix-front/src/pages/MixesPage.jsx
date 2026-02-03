import { useState } from 'react';
import AdminSearch from '../components/admin/AdminSearch';
import AdminTable from '../components/admin/AdminTable';
import { getAllMixes } from '../services/mixService';

// Configuración de columnas para la tabla de mezclas
const mixColumns = [
    { key: 'name', label: 'Nombre', className: 'font-semibold' },
    {
        key: 'client.nombre',
        label: 'Cliente',
        render: (item) => item.client?.nombre || 'N/A'
    },
    {
        key: 'totalWeight', label: 'Peso Total', align: 'right',
        render: (item) => `${(item.totalWeight || 0).toFixed(2)} lbs`
    },
    { key: 'totalPrice', label: 'Precio Total', type: 'money', align: 'right' },
    {
        key: 'ingredients',
        label: 'Ingredientes',
        align: 'center',
        render: (item) => (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
                {item.ingredients?.length || 0}
            </span>
        )
    },
    {
        key: 'createdAt',
        label: 'Fecha',
        render: (item) => {
            if (!item.createdAt) return 'N/A';
            return new Date(item.createdAt).toLocaleDateString('es-EC', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
    }
];

export default function MixesPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMix, setSelectedMix] = useState(null);

    const showAlert = (icon, title, text) => {
        window.Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#10b981'
        });
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const handleViewDetails = (mix) => {
        setSelectedMix(mix);
        // Mostrar detalles de la mezcla
        const ingredientsList = mix.ingredients?.map(i =>
            `• ${i.productName}: ${i.quantityLbs} lbs @ $${i.priceAtMoment}`
        ).join('<br>') || 'Sin ingredientes';

        window.Swal.fire({
            icon: 'info',
            title: mix.name,
            html: `
                <div class="text-left">
                    <p class="mb-2"><strong>Cliente:</strong> ${mix.client?.nombre || 'N/A'}</p>
                    <p class="mb-2"><strong>Email:</strong> ${mix.client?.correo || 'N/A'}</p>
                    <hr class="my-3">
                    <p class="mb-2 font-semibold">Ingredientes:</p>
                    <div class="text-sm text-gray-600">${ingredientsList}</div>
                    <hr class="my-3">
                    <div class="flex justify-between">
                        <span>Peso total:</span>
                        <span class="font-semibold">${(mix.totalWeight || 0).toFixed(2)} lbs</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Precio total:</span>
                        <span class="font-bold text-emerald-600">$${(mix.totalPrice || 0).toFixed(2)}</span>
                    </div>
                </div>
            `,
            confirmButtonColor: '#10b981',
            width: '400px'
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30">
                        <i className="fa-solid fa-blender text-2xl text-white"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de Mezclas</h1>
                        <p className="text-sm text-slate-500">Visualiza las mezclas creadas por los clientes</p>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
                <AdminSearch
                    color="purple"
                    title="Buscar Mezclas"
                    subtitle="Busque por nombre o cliente"
                    placeholder="Buscar por nombre de mezcla..."
                    onSearch={handleSearchResults}
                    getAllService={getAllMixes}
                />

                {searchResults.length > 0 && (
                    <AdminTable
                        data={searchResults}
                        columns={mixColumns}
                        onEdit={handleViewDetails}
                        color="purple"
                        emptyMessage="No hay mezclas para mostrar"
                        emptySubMessage="Los clientes aún no han creado mezclas"
                    />
                )}
            </div>
        </div>
    );
}
