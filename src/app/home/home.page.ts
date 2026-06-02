import { Component, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonIcon, IonList, IonLabel, IonItem, IonFab, IonFabButton, IonChip, IonAvatar, IonGrid, IonCol, IonCard, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/header/header.component";
import { TabsComponent } from "../components/tabs/tabs.component";
import {
  add,
  calendarOutline,
  chevronForwardOutline,
  pieChartOutline,
  receiptOutline,
  scanOutline,
  trendingUpOutline,
  walletOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router,RouterLink } from '@angular/router';
import { Gastofacil } from '../services/gastofacil';
import { GastoConCategoria,Gasto,Categoria } from '../models/gasto.models';
import { categoriaService } from '../services/categoria';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, IonContent, IonRow, NgClass,IonGrid, IonList, IonLabel, IonItem, IonIcon, IonFab, IonFabButton, IonAvatar, CommonModule, IonGrid, IonCol, IonCard, IonCardSubtitle, IonCardTitle],
})
export class HomePage {
  private readonly router = inject(Router);
  readonly categoriaUI =inject(categoriaService);
  private readonly gastoService =inject(Gastofacil);
  public totalSemana: number = 0;
  public totalDia: number = 0;
  public cantidadGastosDia: number = 0;
  public topCategorias: any[] = [];

gastosRecientes =signal<GastoConCategoria[]>([]);


  async ionViewWillEnter(){
    await this.obtener5mejores();
    await this.cargarEstadisticas();

}

  async obtener5mejores(){
  try {
      const gastos = await this.gastoService.obtenerGastos();
       this.gastosRecientes.set( gastos.slice(0,5));
    } catch {
      console.log('No se pudieron cargar los gastos')
    }
  }

  async cargarEstadisticas() {
    try {
      // Una sola petición a la red celular
      const data = await this.gastoService.obtenerDashboardAbsoluto();

      if (data) {
        this.totalSemana = data.total_semana;
        this.totalDia = data.total_hoy;
        this.cantidadGastosDia = data.cantidad_gastos_hoy;
        this.topCategorias = data.top_categorias;
      }
    } catch (error) {
      console.error('Error en el dispositivo móvil:', error);
    } 
  }

  constructor() {


        addIcons({
          add,
          trendingUpOutline,
          calendarOutline,
          scanOutline,
          chevronForwardOutline,
          walletOutline,
          receiptOutline,
          pieChartOutline

        
        
      });
  }
}
