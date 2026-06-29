export interface Client {
  id: number;
  nombre: string;
  rol: 'ORIGEN' | 'DESTINO';
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
  stockCritico: number;
  bodega: string;
  pasillo: string;
  estante: string;
}

export interface Receipt {
  id: number;
  fecha: string;
  productoNombre: string;
  lote: string;
  cantidad: number;
  usuario: string;
}

export interface ShipmentItem {
  productoId: number;
  nombre: string;
  cantidad: number;
}

export interface Shipment {
  id: number;
  fecha: string;
  estado: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO';
  clienteId: number;
  clienteNombre: string;
  items: ShipmentItem[];
}

export interface AuditLog {
  id: number;
  fecha: string;
  productoId: number;
  anterior: number;
  nueva: number;
  usuario: string;
  tipo: 'AUMENTO' | 'REDUCCIÓN';
}

// ==========================================
// ESTADO GLOBAL EN MEMORIA (Tablas del Sistema)
// ==========================================

let clients: Client[] = [
  {
    id: 1,
    nombre: 'Distribuidora del Norte S.A.',
    rol: 'ORIGEN'
  },
  {
    id: 2,
    nombre: 'Logística Central S.A.',
    rol: 'DESTINO'
  },
  {
    id: 3,
    nombre: 'Importaciones Alajuela',
    rol: 'ORIGEN'
  },
  {
    id: 4,
    nombre: 'Sucursal Grecia Centro',
    rol: 'DESTINO'
  }
];

let products: Product[] = [
  {
    id: 1,
    codigo: 'TOR-38',
    nombre: 'Tornillos de Anclaje 3/8',
    stock: 12,
    stockCritico: 15,
    bodega: 'Bodega Principal A',
    pasillo: 'Pasillo 4',
    estante: 'Estante C'
  },
  {
    id: 2,
    codigo: 'UTP-C6',
    nombre: 'Cable UTP Categoría 6',
    stock: 85,
    stockCritico: 20,
    bodega: 'Bodega Principal A',
    pasillo: 'Pasillo 2',
    estante: 'Estante A'
  }
];

let receipts: Receipt[] = [
  {
    id: 101,
    fecha: '2026-06-15 08:30:11',
    productoNombre: 'Tornillos de Anclaje 3/8',
    lote: 'L-TOR-991',
    cantidad: 50,
    usuario: 'j.vargas'
  }
];

let shipments: Shipment[] = [
  {
    id: 201,
    fecha: '2026-06-14 14:20:00',
    estado: 'PROCESADO',
    clienteId: 2,
    clienteNombre: 'Logística Central S.A.',
    items: [
      {
        productoId: 1,
        nombre: 'Tornillos de Anclaje 3/8',
        cantidad: 5
      }
    ]
  }
];

let auditLogs: AuditLog[] = [
  {
    id: 1,
    fecha: '2026-06-15 08:30:11',
    productoId: 1,
    anterior: 0,
    nueva: 50,
    usuario: 'j.vargas',
    tipo: 'AUMENTO'
  }
];

const getTimestamp = () =>
  new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);

// ==========================================
// CONTROLADOR DE OPERACIONES (Capa DB Engine)
// ==========================================

export const db = {
  // --- CLIENTES ---
  getClients: () => [...clients],
  getClientById: (id: number) =>
    clients.find((c) => c.id === id),
  createClient: (
    nombre: string,
    rol: 'ORIGEN' | 'DESTINO'
  ) => {
    const newClient: Client = {
      id: clients.length + 1,
      nombre,
      rol
    };
    clients.push(newClient);
    return newClient;
  },
  updateClient: (
    id: number,
    nombre: string,
    rol: 'ORIGEN' | 'DESTINO'
  ) => {
    clients = clients.map((c) =>
      c.id === id ? { ...c, nombre, rol } : c
    );
    return true;
  },
  deleteClient: (id: number) => {
    clients = clients.filter((c) => c.id !== id);
    return true;
  },

  // --- PRODUCTOS ---
  getProducts: () => [...products],
  getProductById: (id: number) =>
    products.find((p) => p.id === id),
  createProduct: (p: Omit<Product, 'id' | 'stock'>) => {
    const newProduct: Product = {
      ...p,
      id: products.length + 1,
      stock: 0
    };
    products.push(newProduct);
    return newProduct;
  },
  updateProduct: (
    id: number,
    p: Omit<Product, 'id' | 'stock'>
  ) => {
    products = products.map((prod) =>
      prod.id === id ? { ...prod, ...p } : prod
    );
    return true;
  },
  deleteProduct: (id: number) => {
    products = products.filter((p) => p.id !== id);
    return true;
  },

  // --- RECEPCIONES (CALL sp_RegistrarRecepcion) ---
  getReceipts: () => [...receipts],
  registerRecepcion: (
    productoId: number,
    clienteId: number,
    cantidad: number,
    lote: string
  ) => {
    const product = products.find(
      (p) => p.id === productoId
    );
    if (!product) return false;

    const anterior = product.stock;
    product.stock += cantidad;

    // Almacenar traza delta inmutable en auditoría
    auditLogs.push({
      id: auditLogs.length + 1,
      fecha: getTimestamp(),
      productoId,
      anterior,
      nueva: product.stock,
      usuario: 'j.vargas',
      tipo: 'AUMENTO'
    });

    // Guardar registro histórico de recepciones
    receipts.push({
      id: receipts.length + 101,
      fecha: getTimestamp(),
      productoNombre: product.nombre,
      lote,
      cantidad,
      usuario: 'j.vargas'
    });
    return true;
  },

  // --- DESPACHOS (CALL sp_ProcesarDespacho) ---
  getShipments: () => [...shipments],
  getShipmentById: (id: number) =>
    shipments.find((s) => s.id === id),
  createShipment: (clienteId: number) => {
    const client = clients.find((c) => c.id === clienteId);
    const newShipment: Shipment = {
      id: shipments.length + 201,
      fecha: getTimestamp(),
      estado: 'PENDIENTE',
      clienteId,
      clienteNombre: client ? client.nombre : 'Desconocido',
      items: []
    };
    shipments.push(newShipment);
    return newShipment;
  },
  addItemToShipment: (
    shipmentId: number,
    productoId: number,
    cantidad: number
  ) => {
    const shipment = shipments.find(
      (s) => s.id === shipmentId
    );
    const product = products.find(
      (p) => p.id === productoId
    );
    if (!shipment || !product) return false;

    shipment.items.push({
      productoId,
      nombre: product.nombre,
      cantidad
    });
    return true;
  },
  procesarDespacho: (
    shipmentId: number,
    accion: 'procesar' | 'cancelar'
  ) => {
    const shipment = shipments.find(
      (s) => s.id === shipmentId
    );
    if (!shipment || shipment.estado !== 'PENDIENTE')
      return false;

    if (accion === 'cancelar') {
      shipment.estado = 'CANCELADO';
      return true;
    }

    // Descontar existencias físicas reales del inventario global
    shipment.items.forEach((item) => {
      const product = products.find(
        (p) => p.id === item.productoId
      );
      if (product) {
        const anterior = product.stock;
        product.stock = Math.max(
          0,
          product.stock - item.cantidad
        );

        auditLogs.push({
          id: auditLogs.length + 1,
          fecha: getTimestamp(),
          productoId: item.productoId,
          anterior,
          nueva: product.stock,
          usuario: 'j.vargas',
          tipo: 'REDUCCIÓN'
        });
      }
    });

    shipment.estado = 'PROCESADO';
    return true;
  },

  // --- AUDITORÍA DE VARIACIONES ---
  getAuditLogs: (
    productoId: number,
    inicio?: string,
    fin?: string
  ) => {
    return auditLogs.filter((log) => {
      if (log.productoId !== productoId) return false;
      if (inicio && log.fecha.substring(0, 10) < inicio)
        return false;
      if (fin && log.fecha.substring(0, 10) > fin)
        return false;
      return true;
    });
  }
};
