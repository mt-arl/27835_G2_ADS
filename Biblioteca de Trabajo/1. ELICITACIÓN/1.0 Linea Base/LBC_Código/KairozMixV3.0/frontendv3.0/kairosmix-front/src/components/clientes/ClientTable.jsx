import { useEffect } from 'react';

export default function ClientTable({ clients, onDelete }) {
    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [clients]);

    if (!clients || clients.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                        <i data-lucide="inbox" className="w-10 h-10 text-slate-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay clientes para mostrar</h3>
                    <p className="text-sm text-slate-500">Registre un nuevo cliente o realice una búsqueda diferente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Resultados</h3>
                <span className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">{clients.length}</span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Identificación</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Correo</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Teléfono</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Dirección</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clients.map((client) => (
                            <tr key={client._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-4 text-sm font-mono text-slate-700">{client.cedula}</td>
                                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{client.nombre}</td>
                                <td className="px-4 py-4 text-sm">
                                    <a
                                        href={`mailto:${client.correo}`}
                                        className="text-amber-600 hover:text-amber-700 hover:underline"
                                    >
                                        {client.correo}
                                    </a>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600">{client.telefono}</td>
                                <td className="px-4 py-4 text-sm text-slate-600 max-w-48 truncate">{client.direccion}</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:scale-110"
                                            onClick={() => onDelete(client)}
                                            title="Eliminar cliente"
                                        >
                                            <i data-lucide="trash-2" className="w-4.5 h-4.5"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
