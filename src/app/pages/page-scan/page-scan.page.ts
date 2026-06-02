import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera,CameraResultType, CameraSource} from '@capacitor/camera';
import { Categoria } from '../../models/categoria.model';
import { Gastofacil } from '../../services/gastofacil';
import { Gemini } from '../../services/gemini';
import { ScanData } from 'src/app/services/scan-data';
import { AlertController } from '@ionic/angular';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';
import {
  cameraOutline,
  imageOutline,
  receiptOutline,
  trashOutline,
  sparklesOutline
} from 'ionicons/icons';
import { GastoEscaneado } from 'src/app/models/gasto-escaneado.model';

@Component({
  selector: 'app-page-scan',
  templateUrl: './page-scan.page.html',
  styleUrls: ['./page-scan.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonButton
]
})
export class PageScanPage implements OnInit {
  private readonly router = inject(Router)
  categorias: Categoria[] = [];

  imagenActual: string | undefined;

  nombreImagen: string | null = null;

  base64Image: string | null = null;

  isAnalyzing = false;
  

  constructor(
    private geminiService: Gemini,
    private gastoFacil: Gastofacil,
    private scanData: ScanData,
    private alertController: AlertController
    ) {
    addIcons({
      cameraOutline,
      imageOutline,
      receiptOutline,
      trashOutline,
      sparklesOutline
    });
  }

  async tomarFoto() {

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    if (!image.base64String) return;

    this.base64Image = image.base64String;

    this.imagenActual = `data:image/jpeg;base64,${image.base64String}`;

    this.nombreImagen = `captura-${Date.now()}.jpg`;

    this.scanData.setGasto({
      establecimiento: '',
      monto: 0,
      fecha_gasto: '',
      metodo_pago: 'EFECTIVO',
      concepto: '',
      categoria: '',
      notas: '',
      imagen: this.imagenActual
    });
  }

  async abrirGaleria() {

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (!image.base64String) {
      return;
    }

    this.base64Image = image.base64String;

    this.imagenActual =
      `data:image/jpeg;base64,${image.base64String}`;

    this.nombreImagen =
      image.path?.split('/').pop()
      ?? `imagen-${Date.now()}.jpg`;

    this.scanData.setGasto({
      establecimiento: '',
      monto: 0,
      fecha_gasto: '',
      metodo_pago: 'EFECTIVO',
      concepto: '',
      categoria: '',
      notas: '',
      imagen: this.imagenActual
    });

  }

  eliminarCaptura() {

    this.imagenActual = undefined;
    this.nombreImagen = null;
    this.base64Image = null;
    this.scanData.clear();

  }

  async analizarTicket() {

    if (!this.base64Image || this.isAnalyzing) {
      return;
    }

    this.isAnalyzing = true;

    try {

      const resultado =
        await this.geminiService.analizarTicket(
          this.base64Image,
          this.categorias
        );

      if (!resultado) {
        console.error('Gemini no devolvió respuesta');
        return;
      }

      const data = JSON.parse(resultado);

      if (data.error) {
        await this.mostrarError(data.mensaje);
        return;
      }

      const gasto: GastoEscaneado = {
        ...data,
        imagen: this.imagenActual
      };

      this.scanData.setGasto(gasto);

      this.router.navigate(['/confirmar-gasto']);

    } catch (error) {
      console.error('Error en análisis:', error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  async mostrarError(mensaje: string) {

    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();

  }

  async ngOnInit() {

    this.categorias = await this.gastoFacil.obtenerCategorias();

    const gasto = this.scanData.getGasto();

    if (gasto?.imagen) {
      this.imagenActual = gasto.imagen;
      this.base64Image = gasto.imagen.replace('data:image/jpeg;base64,', '');
      this.nombreImagen = 'captura-restaurada.jpg';
    }
  }

}
