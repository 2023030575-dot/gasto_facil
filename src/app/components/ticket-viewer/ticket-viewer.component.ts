import { Component, Input, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ticket-viewer',
  standalone: true,
  templateUrl: './ticket-viewer.component.html',
  styleUrls: ['./ticket-viewer.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent
  ],
})
export class TicketViewerComponent {

  @Input() imagen!: string;

  private modalCtrl = inject(ModalController);

  cerrar() {
    this.modalCtrl.dismiss();
  }
}