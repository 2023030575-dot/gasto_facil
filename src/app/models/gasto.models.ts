//categoria.model.ts
export interface Categoria {

  id_categoria: number;

  nombre_categoria: string;

  color: string;

  created_at: string;
  

}

//gasto.model.ts
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

export interface GastoConCategoria extends Gasto {

  categorias: Categoria;

}
//gasto-escaneado.model.ts
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

}

