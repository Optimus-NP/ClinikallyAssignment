// ProductsApi.ts
import axios from 'axios';

export interface OfferTypes {
  type: string;
  isValid: boolean;
}

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string[];
  images: string[];
  rating: number;
  offers: OfferTypes[];
}

export interface PaginatedProductsOutput {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
}

const API_BASE_URL = 'http://10.0.0.172:3000/api/products/';

const DEFAULT_PAGE_NUMBER: number = 1;
const DEFAULT_PAGE_LIMIT: number = 10;

export interface FetchProductsProps {
  pageNumber?: number;
  pageLimit?: number;
}

// Function to fetch products
export const fetchProducts = async (fetchProductsProps: FetchProductsProps): Promise<Product[]> => {
  try {
    const pageNumber: number = fetchProductsProps.pageNumber ?? DEFAULT_PAGE_NUMBER;
    const pageLimit: number = fetchProductsProps.pageLimit ?? DEFAULT_PAGE_LIMIT;

    const response = await axios.get<PaginatedProductsOutput>(`${API_BASE_URL}/paginated?page=${pageNumber}&limit=${pageLimit}`);
    console.log(response.data.products.map(product => product.id));
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (productId: string): Promise<Product> => {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/single/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product: ${productId}`, error);
      throw error;
    }
  };
