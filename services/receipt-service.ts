import { MOCK_RECEIPTS, Receipt } from '@/lib/mock-data';

export async function getReceipts(): Promise<Receipt[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_RECEIPTS]), 200)
  );
}

export async function createReceipt(receipt: {
  productId: number;
  clientId: number;
  quantity: number;
  batch: string;
}): Promise<boolean> {
  console.log(
    'Mock POST /recepciones (CALL sp_RegistrarRecepcion):',
    receipt
  );
  return true;
}
