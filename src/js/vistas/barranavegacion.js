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
    this.btnVerFormularioAlta = this.doc.getElementById('btnVerFormularioAlta')
    this.btnVerFormularioLogin = this.doc.getElementById('btnVerFormularioLogin')
    this.btnLogout = this.doc.getElementById('btnLogout')

    //Carga de datos
    //No hay

    //Asociación de Eventos
    this.btnVerFormularioAlta.onclick = this.controlador.verFormularioAlta.bind(this.controlador)
    this.btnVerFormularioLogin.onclick = this.controlador.verFormularioLogin.bind(this.controlador)
    this.btnLogout.onclick = this.controlador.logout.bind(this.controlador)
    this.cambiarAModoUsuario()
  }

  /** Cambia los iconos de la barra de navegación.
  **/
  cambiarAModoUsuario(){
    this.btnVerFormularioLogin.style.display = 'inline'
    this.btnVerFormularioAlta.style.display = 'none'
    this.btnLogout.style.display = 'none'
  }

  /** Cambia los iconos de la barra de navegación.
  **/
  cambiarAModoAdmin(){
    this.btnVerFormularioLogin.style.display = 'none'
    this.btnVerFormularioAlta.style.display = 'inline'
    this.btnLogout.style.display = 'inline'
  }

}
