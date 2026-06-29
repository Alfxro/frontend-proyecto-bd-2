import { MOCK_AUDIT_LOGS, AuditLog } from '@/lib/mock-data';

export async function getAuditLogsByProduct(
  productId: number,
  startDate?: string,
  endDate?: string
): Promise<AuditLog[]> {
  return new Promise((resolve) => {
    const filtered = MOCK_AUDIT_LOGS.filter(
      (log) => log.productId === productId
    );
    setTimeout(() => resolve(filtered), 200);
  });
}
