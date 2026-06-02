import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from "src/app/components/header/header.component";
import { TabsComponent } from "src/app/components/tabs/tabs.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule, HeaderComponent, IonRouterOutlet, TabsComponent]
})
export class LayoutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
