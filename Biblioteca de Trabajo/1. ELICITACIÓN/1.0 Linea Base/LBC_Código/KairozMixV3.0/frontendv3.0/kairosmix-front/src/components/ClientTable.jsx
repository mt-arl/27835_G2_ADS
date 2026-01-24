import { useEffect } from 'react';
import './ClientTable.css';

export default function ClientTable({ clients, onDelete }) {
    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [clients]);

    if (!clients || clients.length === 0) {
        return (
            <div className="client-table">
                <div className="empty-state">
                    <div className="empty-icon">
                        <i data-lucide="inbox"></i>
                    </div>
                    <h3>No hay clientes para mostrar</h3>
                    <p>Registre un nuevo cliente o realice una búsqueda diferente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="client-table">
            <div className="table-header">
                <h3>Resultados</h3>
                <span className="results-badge">{clients.length}</span>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client._id}>
                                <td className="id-cell">{client.cedula}</td>
                                <td className="name-cell">{client.nombre}</td>
                                <td className="email-cell">
                                    <a href={`mailto:${client.correo}`}>{client.correo}</a>
                                </td>
                                <td className="phone-cell">{client.telefono}</td>
                                <td className="address-cell">{client.direccion}</td>
                                <td className="action-cell">
                                    <div className="action-buttons">
                                        <button 
                                            className="icon-button delete-icon"
                                            onClick={() => onDelete(client)}
                                            title="Eliminar cliente"
                                        >
                                            <i data-lucide="trash-2"></i>
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
