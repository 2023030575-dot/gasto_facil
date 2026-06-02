import { Injectable } from '@angular/core';

import { addIcons } from 'ionicons';

import {

  restaurantOutline,
  carOutline,
  medkitOutline,
  wifiOutline,
  filmOutline,
  schoolOutline,
  walletOutline

} from 'ionicons/icons';

@Injectable({
  providedIn:'root'
})

export class categoriaService{

  constructor(){

    addIcons({

      restaurantOutline,
      carOutline,
      medkitOutline,
      wifiOutline,
      filmOutline,
      schoolOutline,
      walletOutline

    });

  }

  obtenerCategoriaInfo(
    categoria:string
  ){

    switch(categoria){

      case 'Comida':
        return {
          color:'orange',
          icono:'restaurant-outline'
        };

      case 'Transporte':
        return {
          color:'blue',
          icono:'car-outline'
        };

      case 'Salud':
        return {
          color:'green',
          icono:'medkit-outline'
        };

      case 'Servicios':
        return {
          color:'red',
          icono:'wifi-outline'
        };

      case 'Entretenimiento':
        return {
          color:'purple',
          icono:'film-outline'
        };

      case 'Educación':
        return {
          color:'yellow',
          icono:'school-outline'
        };

      default:
        return {
          color:'gray',
          icono:'wallet-outline'
        };

    }

  }

}