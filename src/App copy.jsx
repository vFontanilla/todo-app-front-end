import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State to store the fetched product (singular)
  const [product, setProduct] = useState(null); // Changed to null for a single product
  // State for the product ID to fetch
  const [productId, setProductId] = useState(''); // State for the input field
  // State to store the ID that was actually searched (to trigger useEffect)
  const [currentSearchId, setCurrentSearchId] = useState('');

  // State for loading indicator
  const [loading, setLoading] = useState(false); // Initial state can be false as no fetch on mount
  // State for error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if currentSearchId is not empty
    if (!currentSearchId) {
      setProduct(null); // Clear product if search ID is empty
      setLoading(false);
      setError(null);
      return;
    }

    // Function to fetch data for a specific product from the backend
    const fetchProduct = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors
        setProduct(null); // Clear previous product data

        // Construct the API URL for a specific product
        const API_URL = `http://localhost:3001/api/products/${currentSearchId}`;

        const response = await fetch(API_URL);

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
          // If response is not OK, throw an error
          // Handle 404 specifically for "Product not found"
          if (response.status === 404) {
            throw new Error(`Product with ID ${currentSearchId} not found.`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        setProduct(data); // Update the product state with fetched data
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(`Error: ${err.message}`); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching (whether success or error)
      }
    };

    fetchProduct(); // Call the fetch function when currentSearchId changes
  }, [currentSearchId]); // Dependency array: re-run effect when currentSearchId changes

  // Handler for input field changes
  const handleInputChange = (event) => {
    setProductId(event.target.value);
  };

  // Handler for button click
  const handleSearchClick = () => {
    // Only update currentSearchId if productId is not empty
    if (productId.trim() !== '') {
      setCurrentSearchId(productId.trim());
    } else {
      // If input is empty, clear the search and any displayed product/error
      setCurrentSearchId('');
      setProduct(null);
      setError(null);
    }
  };

  return (
    <div className="App p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Fetch Specific Product</h1>

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="number" // Use number type for ID input
          value={productId}
          onChange={handleInputChange}
          placeholder="Enter Product ID"
          className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        />
        <button
          onClick={handleSearchClick}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
        >
          Fetch Product
        </button>
      </div>

      {loading && <p className="text-center text-blue-500">Loading product...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && !product && currentSearchId && (
        <p className="text-center text-gray-600">No product found with ID: {currentSearchId}</p>
      )}

      {!loading && !error && product && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>
          <p className="text-lg text-green-600 font-medium mb-2">${parseFloat(product.price).toFixed(2)}</p>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>
      )}

      {!loading && !error && !currentSearchId && !product && (
        <p className="text-center text-gray-600">Enter an ID and click "Fetch Product" to see details.</p>
      )}
    </div>
  );
}

export default App
