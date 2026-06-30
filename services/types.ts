// ============================================================
// Tipos del dominio SGID — reflejan el esquema MySQL del backend.
// Se mantienen los nombres de campo tal cual los devuelve la API
// (Pascal_Case con guion bajo) para evitar mapeos frágiles.
// ============================================================

export type ClienteRol = 'origen' | 'destino' | 'ambos';
export type DespachoEstado = 'pendiente' | 'procesado' | 'cancelado';
export type StockEstado = 'OK' | 'REORDEN';
export type TipoMovimiento = 'Recepcion' | 'Despacho';

export interface Cliente {
  Id_Cliente: number;
  Nombre: string;
  Rol: ClienteRol;
}

export interface Producto {
  Id_Producto: number;
  Codigo: string;
  Nombre: string;
  Detalle: string | null;
  Cantidad_Actual: number;
  Stock_Critico: number;
  Bodega: string;
  Pasillo: string;
  Estante: string;
}

export interface ProductoMonitoreo extends Producto {
  UltimoIngreso: string | null;
  UltimoDespacho: string | null;
  EstadoStock: StockEstado;
}

export interface RecepcionExtendida {
  Id_Recepcion: number;
  Id_Producto: number;
  CodigoProducto: string;
  NombreProducto: string;
  Id_Cliente: number;
  NombreCliente: string;
  Numero_Lote: string;
  Cantidad: number;
  Fecha: string;
  Usuario: string;
}

export interface DespachoConDetalle {
  Id_Despacho: number;
  Id_Cliente: number;
  NombreCliente: string;
  Fecha: string;
  Estado: DespachoEstado;
  Operario: string;
  Detalle?: DetalleDespachoExtendido[];
}

export interface DetalleDespachoExtendido {
  Id_Producto: number;
  CodigoProducto: string;
  NombreProducto: string;
  Cantidad: number;
}

export interface CarroItem {
  Usuario: string;
  Id_Producto: number;
  CodigoProducto: string;
  NombreProducto: string;
  Cantidad_Actual: number;
  Cantidad: number;
}

export interface MovimientoProducto {
  CodigoProducto: string;
  NombreProducto: string;
  FechaMovimiento: string;
  TipoMovimiento: TipoMovimiento;
  Cliente: string;
  Cantidad: number;
  Usuario: string;
}

export interface AuditoriaLog {
  Id_Auditoria: number;
  Id_Producto: number;
  Fecha: string;
  Cantidad_Anterior: number;
  Nueva_Cantidad: number;
  Usuario: string;
  TipoCambio: 'Incremento' | 'Reduccion';
}
