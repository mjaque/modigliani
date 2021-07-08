'use strict'

import { Vista } from './vista.js'
import { Cuadro } from '../modelos/cuadro.js'

/** Vista del formulario de alta de cuadro.
 **/
export class Formulario extends Vista {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de vistas.
  **/
  constructor(controlador, dirVistas) {
    super(controlador, dirVistas + '/formulario.html')
    this.imagenes = []
  }

  /**	Carga los datos del cuadro en la vista
   **/
  configurar() {
    //Guardamos las referencias del documento necesarias antes de que se transfiera
    this.form = this.doc.getElementById('formulario')
    this.nodoImagenes = this.doc.getElementById('imagenes')

    //Asociación de Eventos
    this.doc.getElementById('btnCancelar').onclick = this.cancelar.bind(this)
    this.doc.getElementById('btnAceptar').onclick = this.aceptar.bind(this)
    this.doc.querySelector('input[type="file"]').onchange = this.seleccionarImagen.bind(this)
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
    for (let textarea of this.form.getElementsByTagName('textarea'))
      textarea.value = ''

    //Quitamos las imágenes, los nodos que no sean legend o input
    //children es una lista "viva" de elementos, no es fácil eliminar en iteración
    let nodos = Array.from(this.nodoImagenes.children)  //Hacemos una copia estática de referencias
    nodos.forEach( nodo => {
      if ((nodo.nodeName != 'LEGEND') && (nodo.nodeName != 'INPUT'))
          this.nodoImagenes.removeChild(nodo)
    })

    this.imagenes = []
  }

  /** Oculta la vista
   **/
  ocultar() {
    this.form.style.display = 'none'
  }

  /** Manejador del evento Aceptar.
  	Lee los valores del formulario y los envía al controlador.
  	No hay validaciones.
  	Nota: No optamos por un input file múltiple porque complica la selección al usuario.
    @return {FormData} Los datos del formulario y las imágenes añadidas en atributos imagen_1, imagen_2...
  **/
  aceptar() {
    let formData = new FormData(this.form)
    for (let i = 0; i < this.imagenes.length; i++)
      formData.append('imagen_' + i, this.imagenes[i])

    return formData
  }

  /** Manejador del evento Cancelar.
  **/
  cancelar() {
    this.controlador.cancelar()
  }

  /** Muestra la imagen con el icono de eliminación.
  	@param evento {Event} Evento asociado.
  	Ref: https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
  **/
  seleccionarImagen(evento) {
    let imagen = evento.target.files[0]
    if (!imagen.type.startsWith('image/')) return

    //Guardamos la imagen
    console.log(imagen)
    this.imagenes.push(imagen)

    //Borramos la selección del input
    evento.target.value = ""

    //Creamos la tarjeta para presentarla. La insertamos después del legend.
    const div = document.createElement('div')
    const legend = this.nodoImagenes.getElementsByTagName('legend')[0]
    this.nodoImagenes.insertBefore(div, legend.nextSibling)
    div.classList.add('contenedor')

    const img = document.createElement('img')
    div.appendChild(img)
    img.classList.add('imagen')
    img.file = imagen;

    const icono = document.createElement('img')
    div.appendChild(icono)
    icono.onclick = this.eliminarImagen.bind(this, imagen)
    icono.classList.add('activo')
    icono.setAttribute('title', 'Eliminar')
    icono.setAttribute('src', 'img/delete.svg')

    //Cargamos la imagen local
    const reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(imagen);
  }

  /** Elimina una imagen del formulario.
  	Elimina la imagen de this.imagenes y elimina el div que muestra el thumb.
  	@param imagen {File} Referencia al fichero de this.imagenes que hay que borrar
  	@param evento {Event} Evento asociado.
  **/
  eliminarImagen(imagen, evento) {
    this.imagenes = this.imagenes.filter(item => item !== imagen)

    let div = evento.target.parentNode
    let fieldset = div.parentNode
    fieldset.removeChild(div)
  }
}
