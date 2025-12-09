export default function ProductTable({ products, onEdit }) {
    if (!products || products.length === 0) {
        return <p>No hay productos para mostrar</p>;
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Resultados ({products.length})</h3>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '10px'
            }}>
                <thead style={{ backgroundColor: '#f5f5f5' }}>
                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Código</th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Nombre</th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Precio/Lb</th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Mayorista</th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Minorista</th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Stock</th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} style={{ 
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer'
                        }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.code}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.name}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>${product.pricePerPound.toFixed(2)}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>${product.wholesalePrice.toFixed(2)}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>${product.retailPrice.toFixed(2)}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.currentStock}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                <button 
                                    onClick={() => onEdit(product)}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
