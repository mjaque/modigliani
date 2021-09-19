import {
  Vista
} from './vista.js'
import {
  Lupa
} from './lupa.js'

/** Vista para mostrar las imágenes en detalle.
 **/
export class Modal extends Vista {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de Vistas.
  **/
  constructor(controlador, dirVistas) {
    super(controlador, dirVistas + '/modal.html')
    this.dirVistas = dirVistas
  }

  /**	Inicializa los atributos de la vista.
   **/
  configurar() {
    //Guardamos las referencias del documento necesarias antes de que se transfiera
    this.div = this.doc.getElementById('divModal')
    this.btnCerrar = this.doc.querySelector('#divModal > div > span')
    this.contenedorImgPrincipal = this.doc.querySelector('#divModal > div > div')
    this.imgPrincipal = this.doc.querySelector('#divModal > div > div > img')
    this.divThumbnails = this.doc.querySelectorAll('#divModal > div > div')[1]

    //Asociación de Eventos
    this.btnCerrar.onclick = this.cerrar.bind(this)
    this.imgPrincipal.onclick = this.activarLupa.bind(this)

    //Inicialización de subvistas
    this.lupa = new Lupa(this, this.dirVistas, this.imgPrincipal)
    this.lupa.cargar().then(respuesta => {
      this.contenedorImgPrincipal.appendChild(this.lupa.div)
    })
  }

  /** Cierra el modal
   */
  cerrar() {
    this.ocultar()
    this.limpiar()
    this.controlador.cerrarModal()
  }

  /** Hace visible la vista mostrando un cuadro
    @param cuadro {Cuadro} Cuadro a consultar.
   **/
  mostrar(cuadro) {
    this.limpiar()
    this.div.style.display = 'block'
    this.imgPrincipal.src = 'bd/img/' + cuadro.anexos[0].url
    for (const anexo of cuadro.anexos) {
      let thumb = document.createElement('img')
      this.divThumbnails.appendChild(thumb)
      thumb.src = 'bd/img/' + anexo.url
      thumb.onclick = this.seleccionarThumb.bind(this)
    }
  }

  /** Oculta la vista
   **/
  ocultar() {
    this.div.style.display = 'none'
  }

  /** Borra los datos de la vista
   **/
  limpiar() {
    this.imgPrincipal.src = null
    while (this.divThumbnails.lastChild)
      this.divThumbnails.removeChild(this.divThumbnails.lastChild)
  }

  /** Cambia la imagen mostrada como principal.
    @param evento {MouseEvent} Evento de click de ratón.
  **/
  seleccionarThumb(evento) {
    this.lupa.ocultar()
    this.imgPrincipal.src = evento.target.src
  }

  /** Activa la lupa
    @param evento {MouseEvent} Evento de click de ratón.
   **/
  activarLupa(evento) {
    this.lupa.mostrar(evento)
  }

}
