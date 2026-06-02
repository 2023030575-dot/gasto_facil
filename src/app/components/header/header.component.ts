import { Component, OnInit } from '@angular/core';
import { IonHeader, IonButton,IonIcon,IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonButton,IonIcon,IonToolbar],
})
export class HeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
