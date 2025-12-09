import { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductSearch from './components/ProductSearch';
import ProductTable from './components/ProductTable';
import './App.css';

function App() {
    const [productToEdit, setProductToEdit] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchResults, setSearchResults] = useState([]);

    const handleFormSuccess = () => {
        setProductToEdit(null);
        setRefreshKey(refreshKey + 1);
    };

    const handleSearch = async (query) => {
        try {
            const { searchProducts: searchProductsService } = await import('./services/productService.js');
            const results = await searchProductsService(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="app">
            <h1>Gestión de Productos - KairosMix</h1>
            <ProductForm 
                productToEdit={productToEdit} 
                onSuccess={handleFormSuccess}
            />
            <ProductSearch onSearch={handleSearch} />
            <ProductTable 
                products={searchResults} 
                onEdit={setProductToEdit}
            />
        </div>
    );
}

export default App;
