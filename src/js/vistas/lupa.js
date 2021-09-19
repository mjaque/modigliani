/* Hace falta un contenedor para la imagen
Poner position: relative a su contenedor.
Insertar el div de lupa como primer hijo del contenedor
*/
import { Vista } from './vista.js'

/** Vista para ampliar una imagen con un efecto de lupa.
    Ref: https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp
 **/
export class Lupa extends Vista {
  /** Constructor de la clase
  @param controlador {Object} Controlador de la vista.
  @param dirVistas {String} Directorio de Vistas.
  @param imagen {HTMLImg} Imagen a ampliar.
  **/
  constructor(controlador, dirVistas, imagen) {
    super(controlador, dirVistas + '/lupa.html')
    this.zoom = 2
    this.imagen = imagen
  }

  /**	Inicializa los atributos de la vista.
   **/
  configurar() {
    //Guardamos las referencias del documento necesarias antes de que se transfiera
    this.div = this.doc.getElementById('divLupa')


    this.imagen.onmousemove = this.moverLupa.bind(this)
    this.imagen.parentNode.onmousemove = this.moverLupa.bind(this)
    //Para pantallas táctiles ¿?
    this.imagen.touchmove = this.moverLupa.bind(this)
    this.imagen.parentNode.touchmove = this.moverLupa.bind(this)

    this.div.onclick = this.cerrar.bind(this)
  }

  /** Cierra la Lupa
  */
  cerrar(){
    this.ocultar()
  }

  /** Hace visible la vista
    @param evento {MouseEvent} Evento de click de ratón.
   **/
  mostrar(evento) {
    this.div.style.backgroundImage = "url('" + this.imagen.src + "')";
    this.div.style.backgroundRepeat = "no-repeat";
    this.div.style.backgroundSize = (this.imagen.width * this.zoom) + "px " + (this.imagen.height * this.zoom) + "px";
    this.div.style.display = 'block'

    this.radio = this.div.offsetWidth / 2
    this.moverLupa(evento)
  }

  /** Oculta la vista
   **/
  ocultar() {
    this.div.style.display = 'none'
  }

  /** Mover la lupa.
    @param e {Event} Evento de movimiento.
  **/
  moverLupa(e) {
    let pos, x, y;
    let bw = 3
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = this.getCursorPos(e);
    x = pos.x;
    y = pos.y;
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > this.imagen.width - (this.radio / this.zoom))
      x = this.imagen.width - (this.radio / this.zoom)
    if (x < this.radio / this.zoom)
      x = this.radio / this.zoom
    if (y > this.imagen.height - (this.radio / this.zoom))
      y = this.imagen.height - (this.radio / this.zoom)
    if (y < this.radio / this.zoom)
      y = this.radio / this.zoom
    /* Set the position of the magnifier glass: */
    this.div.style.left = this.imagen.offsetLeft + (x - this.radio) + "px";
    this.div.style.top = this.imagen.offsetTop + (y - this.radio) + "px";
    /* Display what the magnifier glass "sees": */
    this.div.style.backgroundPosition = "-" + ((x * this.zoom) - this.radio + bw) + "px -" + ((y * this.zoom) - this.radio + bw) + "px";
  }

  getCursorPos(e) {
   var a, x = 0, y = 0;
   e = e || window.event;
   /* Get the x and y positions of the image: */
   a = this.imagen.getBoundingClientRect();
   /* Calculate the cursor's x and y coordinates, relative to the image: */
   x = e.pageX - a.left;
   y = e.pageY - a.top;
   /* Consider any page scrolling: */
   x = x - window.pageXOffset;
   y = y - window.pageYOffset;
   return {x : x, y : y};
 }

}
