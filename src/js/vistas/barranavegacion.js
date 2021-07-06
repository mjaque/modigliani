'use strict'

import { Vista } from './vista.js'

/** Barra de Navegación de la aplicación.
 **/
export class BarraNavegacion extends Vista {
  /** Constructor de la clase
      @param controlador {Object} Controlador de la vista.
      @param dirVistas {String} Directorio de vistas.
   **/
  constructor(controlador, dirVistas) {
    super(controlador, dirVistas + '/barranavegacion.html')
  }

  /**	Asocia los eventos
   **/
  configurar() {
    //Carga de datos
    //No hay

    //Asociación de Eventos
    this.doc.getElementById('btnVerFormularioAlta').onclick = this.controlador.verFormularioAlta.bind(this.controlador)
  }
}
