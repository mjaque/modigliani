import { Vista } from './vista.js'

/** Vista para mostrar avisos al usuario.
 **/
export class Alerta extends Vista {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de Vistas.
  **/
  constructor(controlador, dirVistas) {
    super(controlador, dirVistas + '/alerta.html')
  }

  /**	Inicializa los atributos de la vista.
   **/
  configurar() {
    //Guardamos las referencias del documento necesarias antes de que se transfiera
    this.div = this.doc.getElementById('alerta')
    this.span = this.doc.getElementsByTagName('span')[0]

    //Asociación de Eventos
    this.doc.getElementById('btnCerrarAlerta').onclick = this.cerrarAlerta.bind(this)
  }

  /** Muestra la alerta
      @param {String} mensaje Texto del mensaje a mostrar
      @param {Integer} tipo Tipo de mensaje. Debe ser una de las constantes de Alerta.
  */
  alertar(mensaje, tipo){
    this.mostrar()
    this.span.appendChild(document.createTextNode(mensaje))
    this.div.style.backgroundColor = tipo
  }

  /** Cierra la alerta
  */
  cerrarAlerta(){
    this.ocultar()
    this.limpiar()
  }

  /** Hace visible la vista
   **/
  mostrar() {
    this.limpiar()
    this.div.style.display = 'block'
  }

  /** Oculta la vista
   **/
  ocultar() {
    this.div.style.display = 'none'
  }

  /** Borra los datos de la vista
   **/
  limpiar() {
    for (let span of this.div.getElementsByTagName('span'))
      while (span.lastChild)
        span.removeChild(span.lastChild)
    this.div.className = ''
  }

}
//Constantes de la clase
Alerta.ERROR = 'red'
Alerta.AVISO = 'orange'
Alerta.EXITO = 'green'
Alerta.INFO = 'blue'
