import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { storefrontOutline, bagHandleOutline, calendarOutline, restaurantOutline, cardOutline, documentTextOutline, sparkles, closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ScanData } from 'src/app/services/scan-data';
import { Gastofacil } from 'src/app/services/gastofacil';
import { Categoria } from '../../models/categoria.model';
import { GastoEscaneado } from 'src/app/models/gasto-escaneado.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { ViewChild } from '@angular/core';
import { categoriaService } from 'src/app/services/categoria';

@Component({
  selector: 'app-confirmar-gasto',
  templateUrl: './confirmar-gasto.page.html',
  styleUrls: ['./confirmar-gasto.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, IonButton, ReactiveFormsModule]
})
export class ConfirmarGastoPage implements OnInit {

  form!: FormGroup;

  modoEdicion = false;

  categorias: Categoria[] = [];

  imagen: string | null = null;

  @ViewChild(IonContent)
  content!: IonContent;

  ionViewWillLeave() {
    this.modoEdicion = false;
    this.form?.reset();
    this.form?.disable({ emitEvent: false });
  }

  ionViewWillEnter() {
    this.modoEdicion = false;
  }

  private mapGastoEscaneadoToDB(
    gasto: GastoEscaneado,
    categorias: Categoria[]
  ) {

    const categoriaEncontrada = categorias.find(
      c => c.nombre_categoria === gasto.categoria
    );

    if (!categoriaEncontrada) {
      throw new Error('Categoría no encontrada');
    }

    return {
      monto: gasto.monto,
      establecimiento: gasto.establecimiento,
      concepto: gasto.concepto,
      fecha_gasto: gasto.fecha_gasto,
      id_categoria: categoriaEncontrada.id_categoria,
      metodo_pago: gasto.metodo_pago,
      notas: gasto.notas
    };
  }

  constructor(
    private fb: FormBuilder,
    private scanData: ScanData,
    private gastoService: Gastofacil,
    private router: Router,
    private toastCtrl: ToastController,
    public categoriaUI: categoriaService
  ) {
    addIcons({ storefrontOutline, bagHandleOutline, calendarOutline,closeOutline, restaurantOutline, cardOutline, documentTextOutline, sparkles });   
  }

  async habilitarEdicion() {
    this.modoEdicion = true;
    this.form.enable({ emitEvent: false });
    await this.content.scrollToTop(500);
  }

  async guardarGasto() {

    if (this.form.invalid) {
      this.mostrarError('Completa todos los campos obligatorios');
      return;
    }

    const gastoForm = this.form.getRawValue();

    const categoriaEncontrada = this.categorias.find(
      c => c.nombre_categoria === gastoForm.categoria
    );

    if (!categoriaEncontrada) {
      this.mostrarError('Categoría no válida');
      return;
    }

    const gastoDB = {
      monto: gastoForm.monto,
      establecimiento: gastoForm.establecimiento,
      concepto: gastoForm.concepto,
      fecha_gasto: gastoForm.fecha_gasto,
      id_categoria: categoriaEncontrada.id_categoria,
      metodo_pago: gastoForm.metodo_pago,
      notas: gastoForm.notas
    };

    try {
      await this.gastoService.guardarGasto(gastoDB);

      this.scanData.clear();
      this.router.navigate(['/page-scan']);

    } catch (error: any) {
      console.error(error);
      this.mostrarError(this.parseError(error));
    }
  }

  get categoriaSeleccionada() {
    const nombre = this.form?.get('categoria')?.value;

    if (!nombre) {
      return {
        color: 'gray',
        icono: 'wallet-outline'
      };
    }

    return this.categoriaUI.obtenerCategoriaInfo(nombre);
  }

  async cancelar(){
    this.router.navigate(['/page-scan']);
  }

  async ngOnInit() {

    this.categorias = await this.gastoService.obtenerCategorias();

    const gasto = this.scanData.getGasto();

    if (gasto) {
      console.log('Gasto recuperado:', gasto);
    } else {
      this.scanData.clear();
      this.router.navigate(['/page-scan']);
      return;
    }

    this.form = this.fb.group({

      monto: [gasto.monto],

      establecimiento: [gasto.establecimiento],

      concepto: [gasto.concepto],

      fecha_gasto: [gasto.fecha_gasto],

      categoria: [gasto.categoria],

      metodo_pago: [gasto.metodo_pago],

      notas: [gasto.notas]

    });

    this.imagen = gasto.imagen ?? null;

    this.modoEdicion = false;
    this.form.disable({ emitEvent: false });
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: 'danger',
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }

  parseError(error: any): string {

    const msg = error?.message || '';

    if (msg.includes('violates not-null')) {
      return 'Faltan campos obligatorios';
    }

    if (msg.includes('monto')) {
      return 'El monto es obligatorio';
    }

    return 'Error al guardar el gasto';
  }

  mostrarTicket = false;

  abrirTicket() {
    if (!this.imagen) return;
    this.mostrarTicket = true;
  }

  cerrarTicket() {
    this.mostrarTicket = false;
  }

}
