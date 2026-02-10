import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, cancelOrder } from '../services/orderService';

// Configuración de estados
const STATUS_CONFIG = {
    pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente', icon: 'fa-clock' },
    pagado: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pagado', icon: 'fa-credit-card' },
    'en proceso': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'En Proceso', icon: 'fa-gears' },
    despachado: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Despachado', icon: 'fa-truck' },
    completado: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completado', icon: 'fa-check-circle' },
    cancelado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado', icon: 'fa-ban' }
};

const STATUS_OPTIONS = ['pendiente', 'pagado', 'en proceso', 'despachado', 'completado'];

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los pedidos',
                confirmButtonColor: '#10b981'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            window.Swal?.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: `El pedido ahora está "${STATUS_CONFIG[newStatus]?.label}"`,
                confirmButtonColor: '#10b981',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo actualizar el estado',
                confirmButtonColor: '#10b981'
            });
        }
    };

    const handleCancelOrder = async (orderId) => {
        const result = await window.Swal?.fire({
            title: '¿Cancelar pedido?',
            text: 'Esta acción no se puede deshacer. El stock será restaurado al inventario.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, volver'
        });

        if (!result?.isConfirmed) return;

        try {
            await cancelOrder(orderId);
            // Actualizar estado a 'cancelado' en lugar de eliminar de la lista
            setOrders(prev => prev.map(order =>
                order._id === orderId ? { ...order, status: 'cancelado' } : order
            ));
            window.Swal?.fire({
                icon: 'success',
                title: 'Pedido cancelado',
                text: 'El pedido ha sido cancelado y el stock restaurado',
                confirmButtonColor: '#10b981',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error al cancelar pedido:', error);
            window.Swal?.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo cancelar el pedido',
                confirmButtonColor: '#10b981'
            });
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        // Usar campos poblados del backend (modelo Client)
        const clientName = order.client?.nombre || '';
        const clientEmail = order.client?.correo || '';
        const matchesSearch =
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Gestión de Pedidos</h1>
                <p className="text-sm md:text-base text-slate-500">Administra todos los pedidos de los clientes</p>
            </div>

            {/* Filters Header: Search & Refresh */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 w-full max-w-md">
                    <div className="relative">
                        <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text"
                            placeholder="Buscar por ID o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>

                {/* Refresh button */}
                <button
                    onClick={loadOrders}
                    className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <i className="fa-solid fa-refresh"></i>
                    Actualizar
                </button>
            </div>

            {/* Stats Filters (Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4 mb-6">
                {/* Total Card */}
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`p-3 md:p-4 rounded-xl transition-all text-left flex items-center gap-3 ${filterStatus === 'all'
                        ? 'bg-slate-800 text-white ring-2 ring-offset-2 ring-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <i className={`fa-solid fa-list text-lg md:text-xl ${filterStatus === 'all' ? 'text-slate-400' : 'text-slate-500'}`}></i>
                    <div>
                        <p className="text-xl md:text-2xl font-bold">{orders.length}</p>
                        <p className="text-xs opacity-80">Total</p>
                    </div>
                </button>

                {/* Status Cards */}
                {['pendiente', 'pagado', 'en proceso', 'despachado', 'completado', 'cancelado'].map(status => {
                    const config = STATUS_CONFIG[status];
                    const count = orders.filter(o => o.status === status).length;
                    const isActive = filterStatus === status;

                    // Mapa de estilos activos para evitar purgado de Tailwind (clases completas)
                    const activeStylesMap = {
                        pendiente: 'bg-yellow-600 ring-yellow-600',
                        pagado: 'bg-blue-600 ring-blue-600',
                        'en proceso': 'bg-purple-600 ring-purple-600',
                        despachado: 'bg-orange-600 ring-orange-600',
                        completado: 'bg-emerald-600 ring-emerald-600',
                        cancelado: 'bg-red-600 ring-red-600'
                    };

                    // Determinar clases dinámicas
                    let activeClasses = '';
                    let inactiveClasses = 'opacity-70 hover:opacity-100 hover:shadow-sm ' + config.bg;
                    let iconColor = config.text;
                    let textColor = config.text;

                    if (isActive) {
                        // Estado activo: Fondo oscuro, texto blanco
                        const colorStyle = activeStylesMap[status] || 'bg-slate-500 ring-slate-500';
                        activeClasses = `${colorStyle} text-white ring-2 ring-offset-2 shadow-md transform scale-105`;
                        iconColor = 'text-white';
                        textColor = 'text-white';
                    }

                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`p-3 md:p-4 rounded-xl transition-all text-left flex items-center gap-3 ${isActive ? activeClasses : inactiveClasses}`}
                        >
                            <i className={`fa-solid ${config.icon} text-lg md:text-xl ${iconColor}`}></i>
                            <div>
                                <p className={`text-xl md:text-2xl font-bold ${textColor}`}>{count}</p>
                                <p className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-600'}`}>{config.label}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Orders Table/List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Cargando pedidos...</p>
                    </div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fa-solid fa-clipboard-list text-2xl text-slate-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">No hay pedidos</h3>
                    <p className="text-slate-500">
                        {filterStatus !== 'all'
                            ? `No hay pedidos con estado "${STATUS_CONFIG[filterStatus]?.label}"`
                            : 'Aún no se han registrado pedidos'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Table Header (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                        <div className="col-span-2">ID Pedido</div>
                        <div className="col-span-3">Cliente</div>
                        <div className="col-span-2">Fecha</div>
                        <div className="col-span-2">Total</div>
                        <div className="col-span-2">Estado</div>
                        <div className="col-span-1">Acciones</div>
                    </div>

                    {/* Orders List */}
                    <div className="divide-y divide-slate-100">
                        {filteredOrders.map(order => {
                            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <div key={order._id} className="hover:bg-slate-50 transition-colors">
                                    {/* Main Row */}
                                    <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                                        {/* ID */}
                                        <div className="col-span-2 mb-2 lg:mb-0">
                                            <span className="lg:hidden text-xs text-slate-500 mr-2">ID:</span>
                                            <span className="font-mono text-sm font-semibold text-slate-700">
                                                #{order._id?.slice(-8).toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Cliente */}
                                        <div className="col-span-3 mb-2 lg:mb-0">
                                            <p className="text-sm font-medium text-slate-700">{order.client?.nombre || 'Admin'}</p>
                                            <p className="text-xs text-slate-500">{order.client?.correo || 'admin@kairos.com'}</p>
                                        </div>

                                        {/* Fecha */}
                                        <div className="col-span-2 mb-2 lg:mb-0">
                                            <span className="lg:hidden text-xs text-slate-500 mr-2">Fecha:</span>
                                            <span className="text-sm text-slate-600">{formatDate(order.createdAt)}</span>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-2 mb-2 lg:mb-0">
                                            <span className="lg:hidden text-xs text-slate-500 mr-2">Total:</span>
                                            <span className="text-sm font-bold text-emerald-600">
                                                ${(order.total || 0).toFixed(2)}
                                            </span>
                                        </div>


                                        {/* Estado */}
                                        <div className="col-span-2 mb-2 lg:mb-0">
                                            {order.status === 'cancelado' ? (
                                                // Badge fijo para pedidos cancelados
                                                <span className={`px-3 py-1.5 text-sm font-medium rounded-lg inline-flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text}`}>
                                                    <i className="fa-solid fa-ban text-xs"></i>
                                                    Cancelado
                                                </span>
                                            ) : (
                                                // Selector para estados activos
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border-0 cursor-pointer ${statusConfig.bg} ${statusConfig.text}`}
                                                >
                                                    {STATUS_OPTIONS.map(status => (
                                                        <option key={status} value={status}>
                                                            {STATUS_CONFIG[status].label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        {/* Acciones */}
                                        <div className="col-span-1 flex items-center gap-2">
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Cancelar pedido"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Ver detalles"
                                            >
                                                <i className={`fa-solid fa-chevron-down transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                                            <div className="pt-3">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Productos del pedido:</h4>
                                                <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                                                    {order.items?.map((item, idx) => {
                                                        // Obtener nombre del producto o mezcla (objetos poblados)
                                                        const itemName = item.product?.name || item.customMix?.name || 'Producto';
                                                        const itemQty = item.quantity || 0;
                                                        const itemPrice = item.priceAtPurchase || 0;

                                                        return (
                                                            <div key={idx} className="flex justify-between items-center p-3">
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-700">
                                                                        {item.customMix ? '🌼 ' : ''}{itemName}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {itemQty.toFixed(2)} lbs × ${itemPrice.toFixed(2)}
                                                                    </p>
                                                                </div>
                                                                <span className="text-sm font-semibold text-slate-700">
                                                                    ${(itemQty * itemPrice).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="mt-3 flex justify-end">
                                                    <div className="text-right">
                                                        <span className="text-sm text-slate-500">Total del pedido:</span>
                                                        <p className="text-xl font-bold text-emerald-600">${(order.total || 0).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}


        </div>
    );
}
