'use strict'

/** Clase abstracta que define una Vista.
	Una Vista es un "trozo" de HTML.
**/
export class Vista {
  /** Constructor del Vista
  	@param controlador {Object} Controlador de la vista.
  	@param plantilla {String} URL de la plantilla HTML de la vista.
  **/
  constructor(controlador, plantilla = null) {
    this.controlador = controlador
    this.plantilla = plantilla
    this.doc = null
    this.nodoPadre = null
  }

  /** Carga la plantilla HTML de la Vista
  	@param plantilla {string} URL de la plantilla a cargar.
  	@return {Promise}
  **/
  cargar(plantilla = this.plantilla) {
    return new Promise(resolve => {
      fetch(plantilla)
        .then(respuesta => {
          respuesta.text().then(texto => {
            const parser = new DOMParser()
            this.doc = parser.parseFromString(texto, "text/html")
            this.configurar()
            resolve(true)
          })
        })
        .catch(error => {
          throw new Exception(error)
        })
    })
  }

  /** Método para insertar datos y asociar los eventos a los elementos del documento.
  	Debe ser sobreescrito por la clase derivada de Vista.
  **/
  configurar() {}


  /** 	Añade los nodos del interfaz a un nodoPadre.
  	Al cargar los nodos en otro documento, desaparecen de this.doc. Por eso deja la referencia en this.nodoPadre
  	@param nodoPadre {HTMLNode} Nodo al que se añadirá la vista.
  	@param primero {boolean} Indica si la vista debe añadirse antes que otros hijos que ya tuviera el nodo padre.
  **/
  transferirA(nodoPadre, primero = false) {
    if (primero)
      this.doc.body.childNodes.forEach((nodo, i) => {
        nodoPadre.insertBefore(nodo, nodoPadre.firstChild)
      })
    else
      this.doc.body.childNodes.forEach((nodo, i) => {
        nodoPadre.append(nodo)
      })
    this.nodoPadre = nodoPadre
    this.doc = null
  }

  /** Destruye el objeto con garantías.
   **/
  destruir() {
    this.plantilla = null
    this.doc = null
    this.nodoPadre = null
  }

}
