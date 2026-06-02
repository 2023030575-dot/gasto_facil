import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gastofacil } from '../../services/gastofacil';
import { Gasto,Categoria, GastoConCategoria } from '../../models/gasto.models';
import { IonContent,IonLabel, IonTitle, IonToolbar, IonFab, IonFabButton,IonIcon,IonItem,IonList, IonItemSliding,IonItemOption,IonItemOptions,AlertController } from '@ionic/angular/standalone';
import { addOutline, calendarOutline, createOutline, receiptOutline, scanOutline, searchOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { categoriaService } from '../../services/categoria';

@Component({
  selector: 'app-page-gastos',
  templateUrl: './page-gastos.page.html',
  styleUrls: ['./page-gastos.page.scss'],
  standalone: true,
  imports: [IonContent, IonLabel, IonIcon,IonItem,IonList, IonItemSliding, CommonModule,IonItemOption,IonItemOptions, FormsModule, IonFab, IonFabButton]
})
export class PageGastosPage implements OnInit {

    private readonly router = inject(Router)
    private readonly GastoService = inject(Gastofacil)
    private readonly alertController = inject(AlertController);

    readonly categoriaUI =inject(categoriaService)
    gasto = signal<GastoConCategoria[]> ([]);


 


     NewGasto(){
     this.router.navigate(['page-newgasto'], {
      state: { titulo: 'Nuevo gasto', gasto: null }
      });
      }

  editarGasto(gasto: any) {
     this.router.navigate(['page-newgasto'], {
    state: { titulo: 'Editar gasto', 
      gasto: gasto }
  });
  }

    async ionViewWillEnter(){
    this.cargarGastos();
  }

  async cargarGastos(){
    try {
      const gastos = await this.GastoService.obtenerGastos();
      this.gasto.set(gastos);
       this.aplicarFiltros(); 
    } catch {
      console.log('No se pudieron cargar los juegos')
    }
  }

  filtroActivo: string = 'Todos';
  textoBusqueda: string = '';

  filtros: string[] = [
    'Fecha',
    'Todos',
    'Comida',
    'Transporte',
    'Salud',
    'Servicios',
    'Entretenimiento',
    'Educación'
  ];


gastosFiltrados = signal<GastoConCategoria[]>([]);

filtrarGastos(filtro:string){

  this.filtroActivo = filtro;

  this.aplicarFiltros();

}

buscarGasto(event:any){

  this.textoBusqueda =
    event.target.value.toLowerCase();

  this.aplicarFiltros();

}

aplicarFiltros(){

  let resultado =
    [...this.gasto()];

  if(
    this.filtroActivo === 'Fecha'
  ){

   resultado.sort((a, b) => {
      const fechaA = new Date(a.fecha_gasto).getTime();
      const fechaB = new Date(b.fecha_gasto).getTime();
      return fechaB - fechaA; // Orden descendente (más nuevo arriba)
    });

  }

  else if(
    this.filtroActivo !== 'Todos'
  ){

    resultado =
      resultado.filter(

        gasto =>

        gasto.categorias
        .nombre_categoria

        ===

        this.filtroActivo

      );

  }

  if(
    this.textoBusqueda.trim()
    !== ''
  ){

    resultado =
      resultado.filter(

        gasto =>

        gasto.concepto
          .toLowerCase()
          .includes(
            this.textoBusqueda
          )

        ||

        gasto.categorias
          .nombre_categoria
          .toLowerCase()
          .includes(
            this.textoBusqueda
          )

      );

  }

  this.gastosFiltrados
    .set(resultado);

}


   async presentAlert(gasto: any) {
    const alert = await this.alertController.create({
      header: '¿Esta seguro de eliminar este elemento?',
      message: 'El elemento se borrara permanentemente',
      mode: 'ios',
      buttons: [
      {
        text: 'No',
        role: 'cancel',
      },
      {
        text: 'Si',
        handler: async () => {
    if (!gasto.id_gasto) {
      console.error('No se puede eliminar: El objeto no cuenta con id_gasto');
      return;
    }

    try {
      // 1. Llamamos al servicio para borrarlo de Supabase
      await this.GastoService.borrarGasto(gasto.id_gasto);
      console.log('¡Gasto eliminado con éxito de la base de datos!');

      // 2. Actualizamos el Signal base removiendo el elemento eliminado
      this.gasto.update(listaActual => 
        listaActual.filter(item => item.id_gasto !== gasto.id_gasto)
      );

      // 3. Volvemos a correr los filtros para que la vista se refresque inmediatamente
      this.aplicarFiltros();

    } catch (error) {
      console.error('Hubo un problema al intentar eliminar el registro:', error);
      // Aquí podrías setear un signal de error o lanzar un alert para avisarle al usuario
    }
   } // Cierre del handler (Sí)
      } // Cierre del objeto del botón (Sí)
    ] // Cierre del arreglo de buttons
  }); // Cierre del método create()
  await alert.present();
}


  constructor() { 

            addIcons({
              searchOutline,
              trashOutline,
              createOutline,
              receiptOutline,
              calendarOutline,
              addOutline
              
         
            
            
          });
  }

  


  ngOnInit() {
  }

}
