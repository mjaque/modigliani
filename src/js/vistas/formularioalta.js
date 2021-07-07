'use strict'

import { Formulario } from './formulario.js'

/** Vista del formulario de alta de cuadro.
 **/
export class FormularioAlta extends Formulario {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de vistas.
  **/
  constructor(controlador, dirVistas) {
    super(controlador, dirVistas)
    this.imagenes = []
  }

  /** Manejador del evento Aceptar.
  	Lee los valores del formulario y los envía al controlador.
  	No hay validaciones.
  	Nota: No optamos por un input file múltiple porque complica la selección al usuario.
  **/
  aceptar() {
    let formData = super.aceptar()
    this.controlador.pedirAltaCuadro(formData)
  }
}
