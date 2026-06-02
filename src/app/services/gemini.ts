import { Injectable } from '@angular/core';
import {GoogleGenAI} from '@google/genai';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria.model';


@Injectable({
  providedIn: 'root',
})
export class Gemini {
  private ai = new GoogleGenAI({
    apiKey: environment.geminiApiKey
  });

  constructor() { }

  async analizarTicket(base64Image: string, categorias: Categoria[]){

    const listaCategorias = categorias
      .map(c => `- ${c.nombre_categoria}`)
      .join('\n');
    const prompt = `
          Analiza este ticket de compra.

          Extrae:

          - Nombre del establecimiento
          - Fecha
          - Total pagado
          - Método de pago si aparece
          - Concepto principal

          Clasifica obligatoriamente en UNA de las siguientes categorías.

          No inventes categorías nuevas.
          Debes devolver exactamente uno de los nombres mostrados abajo.

          ${listaCategorias}

          Devuelve EXCLUSIVAMENTE un objeto JSON válido.

          No uses markdown.
          No uses bloques json.
          No agregues explicaciones antes o después.
          La fecha debe devolverse obligatoriamente en formato YYYY-MM-DD.
          metodo_pago debe ser exactamente uno de estos valores:

          EFECTIVO
          TARJETA DEBITO
          TARJETA CREDITO

          Si la imagen NO corresponde a un ticket, recibo de compra, factura, comprobante de pago o documento similar, NO intentes extraer datos.

          En ese caso devuelve EXCLUSIVAMENTE este JSON:

          {
            "error": true,
            "mensaje": "La imagen no parece ser un ticket válido"
          }

          Si la imagen sí es un ticket, devuelve EXCLUSIVAMENTE este JSON:

          {
            "establecimiento":"",
            "monto":0,
            "fecha_gasto":"",
            "metodo_pago":"",
            "concepto":"",
            "categoria":"",
            "notas":""
          }
          `
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: prompt
        }
      ]
    });
    return response.text;
  }
}
