import { MOCK_SHIPMENTS, Shipment } from '@/lib/mock-data';

export async function getShipments(): Promise<Shipment[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_SHIPMENTS]), 200)
  );
}

export async function processShipment(
  id: number
): Promise<boolean> {
  console.log(
    `Mock POST /despachos/${id}/procesar (CALL sp_ProcesarDespacho)`
  );
  return true;
}
