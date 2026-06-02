import { Injectable } from '@angular/core';
import { Supabase } from '../services/supabase';
import { GastoConCategoria } from '../models/gasto.models';

@Injectable({
  providedIn: 'root',
})
export class Gastofacil {
  constructor( private supabase: Supabase) {}

  async obtenerCategorias() {

    const { data, error } = await this.supabase
      .getClient()
      .from('categorias')
      .select('*')
      .order('nombre_categoria');

    if (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }

    return data;

  }

  async guardarGasto(gastoDB: any) {

    const client = this.supabase.getClient();

    const { data, error } = await client
      .from('gastos')
      .insert([gastoDB])
      .select();

    if (error) {
      console.error('Error insertando gasto:', error);
      throw error;
    }

    return data;
  }

  async obtenerGastosDelMes(mes: number, año: number) {

    const client = this.supabase.getClient();

    const inicio = new Date(año, mes - 1, 1);
    const fin = new Date(año, mes, 1); // siguiente mes

    console.log({ mes, año, inicio, fin });

    const { data, error } = await client
      .from('v_gastos')
      .select('*')
      .gte('fecha_gasto', inicio.toISOString().split('T')[0])
      .lt('fecha_gasto', fin.toISOString().split('T')[0]); // 👈 importante: lt, no lte

    if (error) throw error;

    return data;
  }

  async obtenerGastos() : Promise<GastoConCategoria[]> {

    const { data,error } = await this.supabase.getClient()
                                                        .from ('gastos')
                                                        .select(`
                                                            *,
                                                            categorias(
                                                            id_categoria,
                                                            nombre_categoria
                                                            )
                                                        `)
                                                        .order('id_gasto', {ascending: false});
    if (error){
      console.error('Error al obtener los gastos: ', error.message);
      throw error;
    }
    return data ?? [];
  }

  async obtenerDashboardAbsoluto(): Promise<{
    total_semana: number;
    total_hoy: number;
    cantidad_gastos_hoy: number;
    top_categorias: { nombre: string; total: number }[];
  }> {
    // .rpc() invoca directamente la función que creamos en Postgres
    const { data, error } = await this.supabase.getClient().rpc('obtener_dashboard_gastos');

    if (error) {
      console.error('Error en RPC dashboard:', error.message);
      throw error;
    }

    return data;
  }

  async borrarGasto(id_gasto: number) {
    const client = this.supabase.getClient();

    const { data, error } = await client
                                      .from('gastos')
                                      .delete()
                                      .eq('id_gasto', id_gasto)
                                      .select();

    if (error) {
      console.error('Error eliminando el gasto en Supabase:', error);
      throw error;
    }

    return data;
  }

  async guardarUpdateGasto(gastoDB: any) {
    const client = this.supabase.getClient();

    // Si viene un id_gasto, extraemos los datos para actualizar sin duplicar llaves
    if (gastoDB.id_gasto) {
      const { id_gasto, ...datosAActualizar } = gastoDB;
      
      const { data, error } = await client
        .from('gastos')
        .update(datosAActualizar)
        .eq('id_gasto', id_gasto)
        .select();

      if (error) {
        console.error('Error actualizando gasto en Supabase:', error);
        throw error;
      }
      return data;
    } 
    
    // Si NO viene id_gasto, es una inserción limpia (El código original de tu compañero)
    else {
      const { data, error } = await client
        .from('gastos')
        .insert([gastoDB])
        .select();

      if (error) {
        console.error('Error insertando gasto en Supabase:', error);
        throw error;
      }
      return data;
    }
  }
}
