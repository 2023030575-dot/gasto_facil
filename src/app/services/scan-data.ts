import { Injectable } from '@angular/core';
import { GastoEscaneado } from '../models/gasto-escaneado.model';

@Injectable({
  providedIn: 'root'
})
export class ScanData {

  private KEY = 'scan_gasto';

  setGasto(gasto: GastoEscaneado) {
    sessionStorage.setItem(this.KEY, JSON.stringify(gasto));
  }

  getGasto(): GastoEscaneado | null {
    try {
      const data = sessionStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clear() {
    sessionStorage.removeItem(this.KEY);
  }
}