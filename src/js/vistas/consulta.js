'use strict'

import { Vista } from './vista.js'
//import { Cuadro } from '../modelos/cuadro.js'

/** Vista de consulta de los detalles de un cuadro.
 **/
export class Consulta extends Vista {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de Vistas.
  @param dirBDImg {String} Directorio de almacenamiento de imágenes.
  **/
  constructor(controlador, dirVistas, dirBDImg) {
    super(controlador, dirVistas + '/consulta.html')
    this.dirBDImg = dirBDImg
    this.imagenes = []
  }

  /**	Carga los datos del cuadro en la vista
   **/
  configurar() {
    //Guardamos las referencias del documento necesarias antes de que se transfiera
    this.div = this.doc.getElementById('consulta')
    this.nodoImagenes = this.doc.getElementById('imagenes')

    //Carga de datos
    //No hay

    //Asociación de Eventos
    this.doc.getElementById('btnVolver').onclick = this.controlador.cancelar.bind(this.controlador)
  }

  /** Carga los datos del cuadro en la vista
      @param cuadro {} Cuadro.
  **/
  cargarCuadro(cuadro){
    this.div.getElementsByTagName('span')[0].appendChild(document.createTextNode(cuadro.titulo))
    this.div.getElementsByTagName('span')[1].appendChild(document.createTextNode(cuadro.autor))
    this.div.getElementsByTagName('span')[2].appendChild(document.createTextNode(cuadro.medidaConMarco))
    this.div.getElementsByTagName('span')[3].appendChild(document.createTextNode(cuadro.medidaSinMarco))
    this.div.getElementsByTagName('span')[4].appendChild(document.createTextNode(cuadro.propietario))
    this.div.getElementsByTagName('span')[5].appendChild(document.createTextNode(cuadro.marcas))
    this.div.getElementsByTagName('span')[6].appendChild(document.createTextNode(cuadro.estadoConservacion))
    this.div.getElementsByTagName('span')[7].appendChild(document.createTextNode(cuadro.materiales))
    this.div.getElementsByTagName('span')[8].appendChild(document.createTextNode(cuadro.tecnica))
    this.div.getElementsByTagName('span')[9].appendChild(document.createTextNode(cuadro.descripcionObra))
    this.div.getElementsByTagName('span')[10].appendChild(document.createTextNode(cuadro.descripcionAutor))

    //Creamos la tarjeta para presentar la imagen
    cuadro.anexos.forEach( (imagen) => {
      const div = document.createElement('div')
      this.nodoImagenes.insertBefore(div, this.nodoImagenes.firstChild.nextSibling)
      div.classList.add('contenedor')

      const img = document.createElement('img')
      div.appendChild(img)
      img.classList.add('imagen')
      img.src = `${this.dirBDImg}/${imagen.url}`
    })
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
    for (let span of this.div.getElementsByTagName('span')){
      while (span.lastChild)
        span.removeChild(span.lastChild)
      }
    //Quitamos las imágenes
    while (this.nodoImagenes.children.length > 1)
      this.nodoImagenes.removeChild(this.nodoImagenes.firstChild)
  }

}
