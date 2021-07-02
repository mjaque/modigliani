'use strict'

import { Componente } from './componente.js'
import { Cuadro } from '../modelos/cuadro.js'

/** Vista del formulario de alta de cuadro.
**/
export class FormularioAlta extends Componente{
	/** Constructor de la clase
	**/
	constructor(controlador){
		super('js/vistas/formularioalta.html')
		this.controlador  = controlador
		this.imagenes = []
	}

	/**	Carga los datos del cuadro en el componente
	**/
	configurar(){
		//Guardamos las referencias del documento necesarias antes de que se transfiera
		this.form = this.doc.getElementById('formularioAlta')
		this.nodoImagenes = this.doc.getElementById('imagenes')

		//Carga de datos
			//No hay

		//Asociación de Eventos
		this.doc.getElementById('btnCancelar').onclick = this.controlador.cancelarFormularioAlta.bind(this.controlador)
		this.doc.getElementById('btnAceptar').onclick = this.aceptar.bind(this)
		this.doc.querySelector('input[type="file"]').onchange = this.seleccionarImagen.bind(this)
	}

	/** Hace visible el componente
	**/
	mostrar(){
		this.limpiar()
		this.form.style.display = 'block'
		this.form.getElementsByTagName('input')[0].focus()
	}

	/** Borra los campos del formulario
	**/
	limpiar(){
		for( let input of this.form.getElementsByTagName('input'))
			input.value = ''
		for( let textarea of this.form.getElementsByTagName('textarea'))
			textarea.value = ''
		//Quitamos las imágenes
		while (this.nodoImagenes.children.length > 2)
			this.nodoImagenes.removeChild(this.nodoImagenes.firstChild)
			
		this.imagenes = []
	}

	/** Oculta el componente
	**/
	ocultar(){
		this.form.style.display = 'none'
	}

	/** Manejador del evento Aceptar.
		Lee los valores del formulario y los envía al controlador.
		No hay validaciones.
		Nota: No optamos por un input file múltiple porque complica la selección al usuario.
	**/
	aceptar(){
		/*let cuadro = new Cuadro()
		cuadro.setTitulo(document.getElementById('titulo').value)
		cuadro.setAutor(document.getElementById('autor').value)
		cuadro.setMedidaConMarco(document.getElementById('medidaConMarco').value)
		cuadro.setMedidaSinMarco(document.getElementById('medidaSinMarco').value)
		cuadro.setPropietario(document.getElementById('propietario').value)
		cuadro.setMarcas(document.getElementById('marcas').value)
		cuadro.setEstadoConservacion(document.getElementById('estadoConservacion').value)
		cuadro.setMateriales(document.getElementById('materiales').value)
		cuadro.setTecnica(document.getElementById('tecnica').value)
		cuadro.setDescripcionObra(document.getElementById('descripcionObra').value)
		cuadro.setDescripcionAutor(document.getElementById('descripcionAutor').value)

		//Añadimos las imágenes
		let formData = new FormData();
		formData.append('ficheros', JSON.stringify(this.imagenes))
		cuadro.imagenes = formData

		this.controlador.aceptarFormularioAlta(cuadro)*/
		let formData = new FormData(this.form)
		for (let i = 0; i < this.imagenes.length; i++)
			formData.append('imagen_'+i, this.imagenes[i])

		this.controlador.aceptarFormularioAlta(formData)
	}

	/** Muestra la imagen con el icono de eliminación.
		@param evento {Event} Evento asociado.
		Ref: https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
	**/
	seleccionarImagen(evento){
		let imagen = evento.target.files[0]
		if (!imagen.type.startsWith('image/')) return

		//Guardamos la imagen
		this.imagenes.push(imagen)

		//Borramos la selección del input
		evento.target.value = ""

		//Creamos la tarjeta para presentarla
        const div = document.createElement('div')
		this.nodoImagenes.insertBefore(div, this.nodoImagenes.firstChild.nextSibling)
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

    	//Cargamos la imagen
		const reader = new FileReader();
		reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
		reader.readAsDataURL(imagen);
	}

	/** Elimina una imagen del formulario.
		Elimina la imagen de this.imagenes y elimina el div que muestra el thumb.
		@param imagen {File} Referencia al fichero de this.imagenes que hay que borrar
		@param evento {Event} Evento asociado.
	**/
	eliminarImagen(imagen, evento){
		this.imagenes = this.imagenes.filter(item => item !== imagen)

		let div = evento.target.parentNode
		let fieldset = div.parentNode
		fieldset.removeChild(div)
	}
}
