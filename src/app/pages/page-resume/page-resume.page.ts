import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Gastofacil } from 'src/app/services/gastofacil';
import { categoriaService } from '../../services/categoria';
import {
  restaurantOutline,
  cardOutline,
  carOutline,
  appsOutline
} from 'ionicons/icons';
type GastoRaw = {
  monto: number;
  fecha_gasto: string;
  id_categoria: number;
  nombre_categoria: string;
  color: string;
};
@Component({
  selector: 'app-page-resume',
  templateUrl: './page-resume.page.html',
  styleUrls: ['./page-resume.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon]
})
export class PageResumePage implements OnInit {
  
  total: number = 0;

  desglose: any[] = [];

  topCategoria: any = null;

  donutStyle: string = '';
  
  constructor(
    private gastoService: Gastofacil,
    public categoriaUI: categoriaService
  ) { 
        addIcons({
      restaurantOutline,
      cardOutline,
      carOutline,
      appsOutline
    });

  }

  async ionViewWillEnter() {
    await this.cargarResumen();
  }

  ionViewWillLeave() {
    this.total = 0;
    this.desglose = [];
    this.topCategoria = null;
    this.donutStyle = '';
  }

  getColor(nombre: string): string {
    const key = nombre.toLowerCase();

    const map: Record<string, string> = {
      comida: '#eaf8f0',
      transporte: '#edf4ff',
      salud: '#fff0f0',
      entretenimiento: '#f2eaff',
      otros: '#f0f2f6',
    };

    return map[key] ?? '#f0f2f6';
  }

  generarResumen(gastos: GastoRaw[]) {

    const total = (gastos ?? []).reduce((sum, g) => sum + Number(g.monto), 0);

    const porCategoria: Record<string, { monto: number; color: string }> = {};

    for (const g of gastos) {

      const cat = g.nombre_categoria;
      const info = this.categoriaUI.obtenerCategoriaInfo(cat);

      if (!porCategoria[cat]) {
        porCategoria[cat] = {
          monto: 0,
          color: info.color,
        };
      }

      porCategoria[cat].monto += Number(g.monto);
    }

    const desglose = Object.entries(porCategoria).map(([categoria, value]) => ({
      categoria,
      monto: value.monto,
      color: value.color,
      porcentaje: total ? (value.monto / total) * 100 : 0
    }));

    const topCategoria = desglose.sort((a, b) => b.monto - a.monto)[0];

    return {
      total,
      desglose,
      topCategoria
    };
  }

  generarDonut(desglose: any[]) {

    let acumulado = 0;
    let gradient = '';

    const total = desglose.reduce((s, d) => s + d.monto, 0);

    desglose.forEach((d) => {

      const porcentaje = total ? (d.monto / total) * 360 : 0;

      gradient += `${d.color} ${acumulado}deg ${acumulado + porcentaje}deg,`;

      acumulado += porcentaje;
    });

    this.donutStyle = `conic-gradient(${gradient.slice(0, -1)})`;
  }

  private async cargarResumen() {

    const fecha = new Date();

    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    const gastos = await this.gastoService.obtenerGastosDelMes(mes, año);

    const resumen = this.generarResumen(gastos);

    this.total = resumen.total;
    this.desglose = resumen.desglose;
    this.topCategoria = resumen.topCategoria;

    this.generarDonut(resumen.desglose);
  }

  async ngOnInit() {
    await this.cargarResumen();
  }

}
