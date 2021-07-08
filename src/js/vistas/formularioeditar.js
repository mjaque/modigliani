'use strict'

import { Formulario } from './formulario.js'

/** Vista del formulario de edición de cuadro.
 **/
export class FormularioEditar extends Formulario {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de Vistas.
  @param dirBDImg {String} Directorio de almacenamiento de imágenes.
  **/
  constructor(controlador, dirVistas, dirBDImg) {
    super(controlador, dirVistas)
    this.dirBDImg = dirBDImg
    this.imagenes = []
    this.borrar = []
  }

  /** Carga los datos del cuadro en la vista
      @param cuadro {} Cuadro.
  **/
  cargarCuadro(cuadro){
    let i = 0
    this.form.getElementsByTagName('input')[i++].value = cuadro.titulo
    this.form.getElementsByTagName('input')[i++].value = cuadro.autor
    i++ //Nos saltamos el input[type='file']
    this.form.getElementsByTagName('input')[i++].value = cuadro.medidaConMarco
    this.form.getElementsByTagName('input')[i++].value = cuadro.medidaSinMarco
    this.form.getElementsByTagName('input')[i++].value = cuadro.propietario
    this.form.getElementsByTagName('textarea')[0].value = cuadro.marcas
    this.form.getElementsByTagName('textarea')[1].value = cuadro.estadoConservacion
    this.form.getElementsByTagName('input')[i++].value = cuadro.materiales
    this.form.getElementsByTagName('input')[i++].value = cuadro.tecnica
    this.form.getElementsByTagName('textarea')[2].value = cuadro.descripcionObra
    this.form.getElementsByTagName('textarea')[3].value = cuadro.descripcionAutor
    this.form.getElementsByTagName('input')[i++].value = cuadro.id

    //Creamos la tarjeta para presentar la imagen
    cuadro.anexos.forEach( (imagen) => {
      const div = document.createElement('div')
      this.nodoImagenes.insertBefore(div, this.nodoImagenes.firstChild.nextSibling)
      div.classList.add('contenedor')

      const img = document.createElement('img')
      div.appendChild(img)
      img.classList.add('imagen')
      img.src = `${this.dirBDImg}/${imagen.url}`

      const icono = document.createElement('img')
      div.appendChild(icono)
      icono.onclick = this.eliminarImagen.bind(this, imagen)
      icono.classList.add('activo')
      icono.setAttribute('title', 'Eliminar')
      icono.setAttribute('src', 'img/delete.svg')
    })
  }

  /** Elimina una imagen del formulario.
  	Añade el id de la imagen al array borrar y elimina el div que muestra el thumb.
  	@param imagen {File} Referencia al fichero de this.imagenes que hay que borrar
  	@param evento {Event} Evento asociado.
  **/
  eliminarImagen(imagen, evento) {
    super.eliminarImagen(imagen, evento)
    this.borrar.push(imagen.id)
  }

  /** Manejador del evento Aceptar.
  	Lee los valores del formulario, les añade el array de borrar y los envía al controlador.
  	No hay validaciones.
  **/
  aceptar() {
    let formData = super.aceptar()
    formData.append('borrar', this.borrar)
    this.controlador.pedirModificarCuadro(formData)
  }

}
