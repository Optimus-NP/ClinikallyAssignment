// ProductsApi.ts
import axios from 'axios';

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string[];
  images: string[];
  rating: number;
}

const API_BASE_URL = 'http://10.0.0.172:3000/api/products/';

// Function to fetch products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (productId: string): Promise<Product> => {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product: ${productId}`, error);
      throw error;
    }
  };
