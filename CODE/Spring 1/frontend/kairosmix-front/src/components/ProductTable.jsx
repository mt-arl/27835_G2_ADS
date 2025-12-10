import { useEffect } from 'react';
import './ProductTable.css';

export default function ProductTable({ products, onEdit }) {
    useEffect(() => {
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    }, [products]);

    if (!products || products.length === 0) {
        return (
            <div className="product-table">
                <div className="empty-state">
                    <div className="empty-icon">
                        <i data-lucide="inbox"></i>
                    </div>
                    <h3>No hay productos para mostrar</h3>
                    <p>Cree un nuevo producto o realice una búsqueda diferente</p>
                </div>
            </div>
        );
    }

    const getStockBadgeClass = (stock) => {
        if (stock >= 50) return 'high';
        if (stock >= 20) return 'medium';
        return 'low';
    };

    return (
        <div className="product-table">
            <div className="table-header">
                <h3>Resultados</h3>
                <span className="results-badge">{products.length}</span>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio/Lb</th>
                            <th>Mayorista</th>
                            <th>Minorista</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="code-cell">{product.code}</td>
                                <td className="name-cell">{product.name}</td>
                                <td className="price-cell">${product.pricePerPound.toFixed(2)}</td>
                                <td className="price-cell">${product.wholesalePrice.toFixed(2)}</td>
                                <td className="price-cell">${product.retailPrice.toFixed(2)}</td>
                                <td className="stock-cell">
                                    <span className={`stock-badge ${getStockBadgeClass(product.currentStock)}`}>
                                        {product.currentStock}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    <div className="action-buttons">
                                        <button 
                                            className="icon-button edit-icon"
                                            onClick={() => onEdit(product)}
                                            title="Editar producto"
                                        >
                                            <i data-lucide="pencil"></i>
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
