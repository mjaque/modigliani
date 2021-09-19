'use strict'

import { Vista } from './vista.js'
import { TarjetaCuadro } from './tarjetacuadro.js'
import { Alerta } from './alerta.js'

/** Vista del formulario de alta de cuadro.
**/
export class ListaCuadros extends Vista{

	/** Constructor de la clase
			@param controlador {Object} Controlador de la vista.
			@param dirVistas {String} Directorio de vistas.
	**/
constructor(controlador, dirVistas) {
  super(controlador, dirVistas + '/listacuadros.html')
	this.dirVistas = dirVistas
  this.tarjetas = [] //Array de tarjetas de los cuadros
	this.scrollY = 0	//Posición de scroll de la vista
}

	/**	Carga ...
	**/
	configurar(){
		//Guardamos la referencia para que no se pierda en la promise
		this.div = this.doc.getElementById('listaCuadros')

		//Carga de datos

		//Asociación de Eventos

	}

	/** Carga las tarjetas de los cuadros.
		@param cuadros {Object[]} Array de objetos con los datos de los cuadros a mostrar
		@param rol {Integer} Indica el rol del usuario (0 - Usuario, 1 - Admin)
		@return Devuelve una Promise.
	**/
	cargarCuadros(cuadros, rol){
		this.vaciar()
		if (cuadros.length == 0){
			this.controlador.alertar('No hay ningún cuadro en el sistema.', Alerta.INFO)
			return new Promise(resolve => {resolve(true)})
		}
		const promesas = []	//Creamos un array de promesas
		for (let i = 0; i < cuadros.length; i++){
			let tarjeta = new TarjetaCuadro(this, this.dirVistas, cuadros[i], rol)
			this.tarjetas.push(tarjeta)
			promesas.push(tarjeta.cargar())
		}
		return new Promise(resolve => {
			Promise.all(promesas)
				.then( respuesta => {
					for(let i = 0; i < this.tarjetas.length; i++)
						this.tarjetas[i].transferirA(this.div)	//Aquí no funciona this.doc
				})
			resolve(true)
			})
	}

	/** Elimina las tarjetas.
		Las quita del div y del array de tarjetas.
	**/
	vaciar(){
		//Vaciamos las tarjetas anteriores que hubiera
		while (this.div.lastChild)
			this.div.removeChild(this.div.lastChild)
		for(let i = 0; i < this.tarjetas.length; i++)
			this.tarjetas[i].destruir()
		this.tarjetas = []
	}

	/** Hace visible la vista
	**/
	mostrar(){
		this.div.style.display = 'flex'
		setTimeout(this.recuperarScroll.bind(this), 100)
	}

	/** Oculta la vista
	**/
	ocultar(){
		this.div.style.display = 'none'
	}

	/** Recupera la posición de scroll vertical de la vista.
	**/
	recuperarScroll(){
		window.scrollTo({
			top: this.scrollY,
			left: 0,
			behavior: 'smooth'
		})
	}

	/** Muestra los detalles de un cuadro
			@param Cuadro {Cuadro} Cuadro a consultar.
	**/
	pedirConsultarCuadro(cuadro){
		this.scrollY = window.scrollY		//Recordamos la posición de scroll
		this.controlador.pedirConsultarCuadro(cuadro)
	}

	/** Edita los detalles de un cuadro
			@param Cuadro {Cuadro} Cuadro a editar.
	**/
	pedirEditarCuadro(cuadro){
		this.scrollY = window.scrollY		//Recordamos la posición de scroll
		this.controlador.pedirEditarCuadro(cuadro)
	}

	/** Elimina un cuadro
			@param Cuadro {Cuadro} Cuadro a eliminar.
	**/
	pedirEliminarCuadro(cuadro){
		this.controlador.pedirEliminarCuadro(cuadro)
	}

	/** Muestra en detalle las imágenes de un Cuadro.
      @param cuadro {Cuadro} Cuadro a consultar.
   **/
  verImagen(cuadro) {
    	this.controlador.verImagen(cuadro)
  }

}
