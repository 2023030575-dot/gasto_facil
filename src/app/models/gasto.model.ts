export interface Gasto {

  id_gasto?: number;

  monto: number;

  establecimiento: string;

  concepto: string;

  fecha_gasto: string;

  id_categoria: number;

  metodo_pago:
    | 'EFECTIVO'
    | 'TARJETA DEBITO'
    | 'TARJETA CREDITO';

  notas?: string;

  created_at?: string;

}