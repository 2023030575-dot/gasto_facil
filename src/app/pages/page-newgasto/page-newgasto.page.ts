import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { IonContent,IonText, IonHeader, IonTitle, IonToolbar,IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  cashOutline,
  pricetagOutline,
  calendarOutline,
  saveOutline,
  closeOutline,
  scanOutline,
  businessOutline
} from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { Gastofacil } from '../../services/gastofacil';

@Component({
  selector: 'app-page-newgasto',
  templateUrl: './page-newgasto.page.html',
  styleUrls: ['./page-newgasto.page.scss'],
  standalone: true,
  imports: [IonContent,IonText,RouterLink, IonInput,ReactiveFormsModule,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,IonIcon,CommonModule, FormsModule]
})
export class PageNewgastoPage implements OnInit {
  titulo = signal('Nuevo gasto');
  guardando = signal(false);
  error = signal<string | null>(null);
  gastoEditar: any | null = null;
 private readonly router = inject(Router);
 private fb = inject(NonNullableFormBuilder);
 private readonly GastoService = inject(Gastofacil)
 

  form = this.fb.group({
  concepto: ['', [Validators.required, Validators.minLength(3)]],
  establecimiento: ['', [Validators.required]],
  monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
  id_categoria: [null as number | null, [Validators.required]],
  metodo_pago: ['EFECTIVO', [Validators.required]], // <- Sigue tomando 'EFECTIVO' por defecto
  fecha_gasto: ['', [Validators.required]],
  notas: ['']
});

   

  constructor() {
    addIcons({
      documentTextOutline,
      cashOutline,
      pricetagOutline,
      calendarOutline,
      saveOutline,
      closeOutline,
      scanOutline,
      businessOutline
    });
  }

  async ionViewWillEnter(){

    this.titulo.set('Nuevo gasto');
    this.gastoEditar = null;
    this.form.reset();
    // 1. Capturamos el estado enviado a través de la navegación del Router
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state || history.state;

    if (state && state.gasto) {
    this.gastoEditar = state.gasto;

    if (state.titulo) {
      this.titulo.set(state.titulo);
    }

      // 3. Si viene el objeto gasto, entramos en modo EDICIÓN
      if (state.gasto) {
        this.gastoEditar = state.gasto;

        // 4. Inyectamos los datos existentes directamente en el Formulario Reactivo
        this.form.patchValue({
          concepto: this.gastoEditar.concepto || '',
          establecimiento: this.gastoEditar.establecimiento || '',
          monto: this.gastoEditar.monto || null,
          id_categoria: this.gastoEditar.id_categoria || null,
          metodo_pago: this.gastoEditar.metodo_pago || 'EFECTIVO',
          fecha_gasto: this.gastoEditar.fecha_gasto || '',
          notas: this.gastoEditar.notas || this.gastoEditar.notes || ''
        });
      } else {
        // Si es un gasto NUEVO, colocamos por defecto la fecha del día de hoy
        const hoy = new Date().toISOString().split('T')[0];
        this.form.patchValue({ fecha_gasto: hoy });
      }
    }
    history.replaceState(null, '');
  }

  ngOnInit() {}

  // 1. No olvides importar tu servicio arriba en los imports del TS:
// private readonly gastosService = inject(GastosService);

async guardarGasto() {
  // Si el formulario no cumple las reglas, no pasa
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.guardando.set(true);
  this.error.set(null);

  // Extraemos el JSON limpio del formulario
  const datosFormulario = this.form.getRawValue();

  // Preparamos el payload exacto para Supabase mapeando con tu interfaz Gasto
  const payloadGasto: any = {
    establecimiento: datosFormulario.establecimiento,
    concepto: datosFormulario.concepto,
    monto: datosFormulario.monto,
    id_categoria: datosFormulario.id_categoria,
    metodo_pago: datosFormulario.metodo_pago,
    fecha_gasto: datosFormulario.fecha_gasto,
    notas: datosFormulario.notas || null // Mandamos null si está vacío
  };

  // ¡ESTA ES LA CLAVE! Si estamos editando, le pegamos el ID original
  if (this.gastoEditar) {
    payloadGasto.id_gasto = this.gastoEditar.id_gasto;
  }

  try {
    // Enviamos el objeto al servicio inteligente conectado a Supabase
    const resultado = await this.GastoService.guardarUpdateGasto(payloadGasto);
    console.log('¡Operación exitosa en Supabase!', resultado);

    // Limpiamos el formulario y regresamos a la lista de gastos
    this.form.reset();
    await this.router.navigate(['/page-gastos']);

  } catch (err: any) {
    // Si la base de datos rechaza algo, capturamos el error aquí de forma segura gracias a tus Signals
    this.error.set(err.message || 'Error de conexión con el servidor');
  } finally {
    this.guardando.set(false);
  }
}

}
