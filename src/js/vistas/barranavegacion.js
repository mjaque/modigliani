'use strict'

import { Componente } from './componente.js'

/** Barra de Navegación de la aplicación.
**/
export class BarraNavegacion extends Componente{
	/** Constructor de la clase
	**/
	constructor(controlador){
		super('js/vistas/barranavegacion.html')
		this.controlador = controlador
	}
	
	/**	Asocia los eventos
	**/
	configurar(){
		//Carga de datos
			//No hay

		//Asociación de Eventos
		this.doc.getElementById('btnVerFormularioAlta').onclick = this.controlador.verFormularioAlta.bind(this.controlador)	
	}
}
