'use strict'

import { Vista } from './vista.js'

/** Vista para mostrar un cuadro en modo "tarjeta".
 **/
export class TarjetaCuadro extends Vista {
  /** Constructor de la clase
  	@param controlador {Object} Controlador de la vista.
  	@param dirVistas {String} Directorio de vistas.
    @param cuadro {Cuadro} Model de cuadro con los datos.
**/
  constructor(controlador, dirVistas, cuadro) {
    super(controlador, dirVistas + '/tarjetacuadro.html')
    this.cuadro = cuadro
  }

  /** 	Carga la plantilla.
  	Evitamos cargar de nuevo la plantilla si ya está cargada
  	@return Devuelve una Promise
  **/
  cargar2() {
    if (TarjetaCuadro.plantilla == null)
      return super.cargar()
    else {
      this.doc = TarjetaCuadro.plantilla.cloneNode(true)
      return new Promise(resolve => {
        this.configurar()
        resolve(true)
      })
    }
  }

  /**	Carga los datos del cuadro en la vista
   **/
  configurar() {
    //if (TarjetaCuadro.plantilla == null)	//Si es la primera vez que se carga
    //	TarjetaCuadro.plantilla = this.doc.cloneNode(true)

    //Carga de datos - Como puede haber varias tarjetas, tomamos los elementos por posición
    this.div = this.doc.getElementsByTagName('div')[0]
    this.doc.getElementsByTagName('p')[0].appendChild(document.createTextNode(this.cuadro.titulo))
    this.doc.getElementsByTagName('p')[1].appendChild(document.createTextNode(this.cuadro.autor))
    if (this.cuadro.anexos.length > 0)
      this.doc.getElementsByTagName('img')[0].setAttribute('src', 'bd/img/' + this.cuadro.anexos[0].url)
    else
      this.doc.getElementsByTagName('img')[0].setAttribute('src', 'img/no_image.png')

    //Asociación de Eventos
    this.doc.getElementsByTagName('img')[1].onclick = this.consultar.bind(this)
    this.doc.getElementsByTagName('img')[3].onclick = this.eliminar.bind(this)
  }

  /** Muestra los detalles del Cuadro.
   **/
  consultar() {
    //Resaltamos cuadro seleccionado
    this.controlador.pedirConsultarCuadro(this.cuadro)
  }

  /** Elimina el Cuadro.
  		Confirma la operación de eliminación con el usuario y llama al controlador para que proceda.
      @param evento {Event} Evento asociado.
  **/
  eliminar(evento) {
    //Resaltamos cuadro seleccionado
    this.div.style.backgroundColor = 'red'
    if (confirm("¿Realmente quiere eliminar este cuadro?\n(la operación no puede deshacerse)"))
      this.controlador.pedirEliminarCuadro(this.cuadro)
    else
      this.div.style.backgroundColor = 'white'
  }

  /** Destruye el objeto con seguridad.
   **/
  destruir() {
    this.cuadro = null
    this.controlador = null
  }
}
TarjetaCuadro.plantilla = null; //Referencia estática al documento
