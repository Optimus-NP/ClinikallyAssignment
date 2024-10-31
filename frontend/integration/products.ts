// ProductsApi.ts
import axios from 'axios';

const DISCOUNTED_PERCENTAGE = 10;

export interface OfferTypes {
  type: string;
  isValid: boolean;
  discountPercentage?: number;
}

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
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

export interface ProductInventory {
  id: number;
  stockAvailable: boolean;
  areOnlyFewItemsLeft: boolean;
}

export interface PaginatedProductsInventoryOutput {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: ProductInventory[];
}

export interface PincodeOutput {
  pincode: number;
  logisticsProvider: string;
  turnAroundTime: string;
  isSameDayDeliveryPossible: boolean;
  expiryTimeForSameDayDelivery: number;
}

const API_BASE_URL = 'http://10.0.0.172:3000/api/products';
const API_PRODUCT_INVENTORY_BASE_URL = 'http://10.0.0.172:3000/api/inventory';

const DEFAULT_PAGE_NUMBER: number = 1;
const DEFAULT_PAGE_LIMIT: number = 10;

export interface FetchProductsProps {
  pageNumber?: number;
  pageLimit?: number;
}

export class PincodeNotFound extends Error {

}
const updateDiscountedPrice = async (product: Product) => {
  if (product.offers.length >= 1) {
    let maxDiscount = DISCOUNTED_PERCENTAGE;
    product.offers.forEach(offer => maxDiscount = Math.max(maxDiscount, offer?.discountPercentage ?? DISCOUNTED_PERCENTAGE));
    product.discountedPrice = product.discountedPrice ?? ((100 - maxDiscount) * product.price) / 100;
  }
}

// Function to fetch products
export const fetchProducts = async (fetchProductsProps: FetchProductsProps): Promise<Product[]> => {
  try {
    const pageNumber: number = fetchProductsProps.pageNumber ?? DEFAULT_PAGE_NUMBER;
    const pageLimit: number = fetchProductsProps.pageLimit ?? DEFAULT_PAGE_LIMIT;

    const response = await axios.get<PaginatedProductsOutput>(`${API_BASE_URL}/paginated?page=${pageNumber}&limit=${pageLimit}`);
    console.log(response.data.products.map(product => product.id));
    response.data.products.forEach(product => updateDiscountedPrice(product));
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (productId: string): Promise<Product> => {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/single/${productId}`);
      updateDiscountedPrice(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product: ${productId}`, error);
      throw error;
    }
  };

  export const fetchProductInventory = async (productId: string): Promise<ProductInventory> => {
    try {
      const response = await axios.get<ProductInventory>(`${API_PRODUCT_INVENTORY_BASE_URL}/single/${productId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product: ${productId}`, error);
      throw error;
    }
  };

  export const fetchPincodeAvailability = async (pincode: string): Promise<PincodeOutput> => {
    try {
      const response = await axios.get<PincodeOutput>(`${API_PRODUCT_INVENTORY_BASE_URL}/pincode/${pincode}`);
      if (response.status == 404) {
        throw new PincodeNotFound("Pincode Not Found");
      }
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pincode: ${pincode}`, error);
      throw error;
    }
  };
function max(maxDiscount: number, discountPercentage: number | undefined): number {
  throw new Error('Function not implemented.');
}

