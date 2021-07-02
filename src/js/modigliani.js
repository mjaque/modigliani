'use strict'

import { Ajax } from './ajax.js'
import { BarraNavegacion } from './vistas/barranavegacion.js'
import { ListaCuadros } from './vistas/listacuadros.js'
import { FormularioAlta } from './vistas/formularioalta.js'

//Importación de librerías

/** Controlador Principal de la aplicación.
**/
class Modigliani{
	/** Constructor de la clase
		Asocia el método cargar al evento window.onload.
	**/
	constructor() {
		this.vistas = new Map()	//Mapa de vistas de la aplicación.
		window.onload = this.cargar.bind(this)
	}

	/** Carga las vistas y componentes de la aplicación. Después activa la aplicación.
	**/
	cargar(){
		//Carga de Componentes
		const promesas = []	//Creamos un array de promesas
		this.vistas.set('barraNavegacion', new BarraNavegacion(this))
		promesas.push(this.vistas.get('barraNavegacion').cargar())
		this.vistas.set('listaCuadros', new ListaCuadros(this))
		promesas.push(this.vistas.get('listaCuadros').cargar())
		this.vistas.set('formularioAlta', new FormularioAlta(this))
		promesas.push(this.vistas.get('formularioAlta').cargar())

		Promise.all(promesas).then(this.activar.bind(this))

	}

	/** Activa los botones y elementos activos de la aplicación. Después, pide la lista de cuadros.
	**/
	activar(){

		//Registro de nodos de referencia
		this.nav = document.getElementsByTagName('nav')[0]
		this.main = document.getElementsByTagName('main')[0]

		this.vistas.get('listaCuadros').div.style.display = 'none'
		this.vistas.get('listaCuadros').transferirA(this.main)
		this.vistas.get('formularioAlta').form.style.display = 'none'
		this.vistas.get('formularioAlta').transferirA(this.main)
		//Asociación de eventos

		//Mostra componentes
		this.vistas.get('barraNavegacion').transferirA(this.nav)

		//Iniciar la carga de la lista de cuadros
		this.pedirCuadros()
	}

	/** Pide por Ajax la lista de cuadros.
	**/
	pedirCuadros(){
		Ajax.enviarJSON('index.php/listar')
			.then(respuesta =>
				respuesta.json())
				.then(respuesta => {
					if (respuesta.resultado == 'OK')
						this.vistas.get('listaCuadros').cargarCuadros(respuesta.datos)
							.then( resp => {
								this.verListaCuadros()})
					else
						throw (respuesta.mensaje)
				})
					.catch( ex => {throw `ERROR en Modigliani.pedirCuadros: ${ex}`} )
	}

	/** Muestra la lista de cuadros
	**/
	verListaCuadros(){
		this.mostrar('listaCuadros')
	}

	/** Abre el interfaz para dar de alta un nuevo cuadro.
	**/
	verFormularioAlta(){
		this.mostrar('formularioAlta')
	}

	/** Muestra la vista indicada y oculta las demás
		@param vista {String} Nombre de la vista a mostrar
	**/
	mostrar(vista){
		for (let [ clave, valor ] of this.vistas.entries()){
			if (clave == 'barraNavegacion') continue
			if (clave == vista)
				valor.mostrar()
			else
				valor.ocultar()
		}
	}

	/** Método de atención a la cancelación del formulario de alta.
	**/
	cancelarFormularioAlta(){
		this.verListaCuadros()
	}

	/** Método de atención a la aceptación del formulario de alta.
		@param formData {FormData} Datos del formulario de alta, incluyendo las imágenes.
	**/
	aceptarFormularioAlta(formData){
		Ajax.enviar('index.php/insertar', formData)
			.then(respuesta =>
				respuesta.json())
				.then(respuesta => {
					if (respuesta.resultado == 'OK')
						this.pedirCuadros()
					else
						throw (respuesta.mensaje)
				})
					.catch( ex => {throw `ERROR en Modigliani.insertar: ${ex}`} )
	}

	/** Elimina los elementos hijos de un nodo.
		@param nodoPadre {Node} Nodo del que se eliminarán los hijos.
	**/
	vaciar(nodoPadre){
		while (nodoPadre.lastElementChild)
			nodoPadre.removeChild(nodoPadre.lastElementChild)
	}

}

var app = new Modigliani()
