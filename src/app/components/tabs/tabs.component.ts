import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonTabButton, IonTabBar, IonLabel, IonTabs } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import {
  homeOutline,
  walletOutline,
  scanOutline,
  barChartOutline,
  personOutline,
  notificationsOutline
} from 'ionicons/icons';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonIcon, IonTabButton, IonTabBar, IonLabel, IonTabs],
})
export class TabsComponent  implements OnInit {
  
  private readonly router = inject(Router)
  rutaActual = '';
  
  irGastos() {
  this.router.navigate(['page-gastos'])};

  irHome() {
  this.router.navigate(['home'])};

  irScan() {
  this.router.navigate(['page-scan'])};

  irResume() {
  this.router.navigate(['page-resume'])};


  constructor() { 

    addIcons({
    homeOutline,
    walletOutline,
    scanOutline,
    barChartOutline,
    personOutline,
    notificationsOutline

    
  });
  }

  


  ngOnInit() {
      this.router.events
  .pipe(
    filter(event => event instanceof NavigationEnd)
  )
  .subscribe(() => {

    this.rutaActual = this.router.url;

  });
  }

}
