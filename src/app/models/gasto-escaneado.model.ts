export interface GastoEscaneado {

  establecimiento: string;

  monto: number;

  fecha_gasto: string;

  metodo_pago:
    | 'EFECTIVO'
    | 'TARJETA DEBITO'
    | 'TARJETA CREDITO'
    | null;

  concepto: string;

  categoria: string | null;

  notas: string | null;

  imagen?: string;

}