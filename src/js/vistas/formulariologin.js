'use strict'

import { Vista } from './vista.js'

/** Vista del formulario de login.
 **/
export class FormularioLogin extends Vista {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de vistas.
  **/
  constructor(controlador, dirVistas) {
    super(controlador, dirVistas + '/formulariologin.html')
  }

  /**	Configura el formulario de login.
   **/
  configurar() {
    //Guardamos las referencias del documento necesarias antes de que se transfiera
    this.form = this.doc.getElementById('formularioLogin')
    this.inputClave = this.doc.getElementById('clave')
    this.btnVerClave = this.doc.getElementById('btnVerClave')

    //Asociación de Eventos
    this.doc.getElementById('btnAcceder').onclick = this.acceder.bind(this)
    this.btnVerClave.onclick = this.verClave.bind(this)
  }

  /** Hace visible la vista
   **/
  mostrar() {
    this.limpiar()
    this.form.style.display = 'block'
    this.form.getElementsByTagName('input')[0].focus()
  }

  /** Borra los campos del formulario
   **/
  limpiar() {
    for (let input of this.form.getElementsByTagName('input'))
      input.value = ''
  }

  /** Oculta la vista
   **/
  ocultar() {
    this.form.style.display = 'none'
  }

  /** Muestra la clave.
  **/
  verClave(){
    this.inputClave.setAttribute('type', 'text');
    this.btnVerClave.setAttribute('title', 'Ocultar Clave')
    this.btnVerClave.setAttribute('src', 'img/visibility_off.svg')
    this.btnVerClave.onclick = this.ocultarClave.bind(this)
  }

  /** Oculta la clave.
  **/
  ocultarClave(){
    this.inputClave.setAttribute('type', 'password');
    this.btnVerClave.setAttribute('title', 'Ver Clave')
    this.btnVerClave.setAttribute('src', 'img/visibility.svg')
    this.btnVerClave.onclick = this.verClave.bind(this)
  }

  /** Manejador del evento Acceder.
      Validación de cliente de datos de entrada.
      Lee los valores del formulario y los envía al controlador.
  	  Llama al método login del controlador
  **/
  acceder() {
    //Validaciones
    let usuario = this.form.getElementsByTagName('input')[0].value
    let clave = this.form.getElementsByTagName('input')[1].value
    if (usuario.length < 3)
      throw ('Usuario inválido.')
    if (clave.length < 3)
      throw ('Clave inválida.')

    this.controlador.login(usuario, clave)
  }

}
