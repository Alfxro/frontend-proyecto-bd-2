import { MOCK_PRODUCTS, Product } from '@/lib/mock-data';

export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_PRODUCTS]), 200)
  );
}

export async function createProduct(
  product: Omit<Product, 'id' | 'stock'>
): Promise<boolean> {
  console.log('Mock POST /productos:', product);
  return true;
}
