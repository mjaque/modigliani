'use strict'

import { Componente } from './componente.js'
import { TarjetaCuadro } from './tarjetacuadro.js'

/** Vista del formulario de alta de cuadro.
**/
export class ListaCuadros extends Componente{
	/** Constructor de la clase
	**/
	constructor(){
		super('js/vistas/listacuadros.html')
		this.tarjetas = []	//Array de tarjetas de los cuadros
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
		@return Devuelve una Promise.
	**/
	cargarCuadros(cuadros){
		this.vaciar()
		const promesas = []	//Creamos un array de promesas
		for (let i = 0; i < cuadros.length; i++){
			let tarjeta = new TarjetaCuadro(cuadros[i], this)
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

	/** Hace visible el componente
	**/
	mostrar(){
		this.div.style.display = 'flex'
	}
	
	/** Oculta el componente
	**/
	ocultar(){
		this.div.style.display = 'none'
	}
}
