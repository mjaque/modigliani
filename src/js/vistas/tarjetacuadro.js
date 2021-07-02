'use strict'

import { Componente } from './componente.js'

/** Componente para mostrar un cuadro en modo "tarjeta".
**/
export class TarjetaCuadro extends Componente{
	/** Constructor de la clase
		@param cuadro {Cuadro} Model de cuadro con los datos.
	**/
	constructor(cuadro, vista){
		super('js/vistas/tarjetacuadro.html')
		this.cuadro = cuadro
		this.vista = vista
	}

	/** 	Carga la plantilla.
		Evitamos cargar de nuevo la plantilla si ya está cargada
		@return Devuelve una Promise
	**/
	cargar2(){
	/*	return new Promise(resolve => {
			if (this.doc == null){
				super.cargar().then( resolve => {
					//Hacemos una copia estática de la plantilla
					TarjetaCuadro.plantilla = this.doc.cloneNode()
				})
			}
			else{
				this.doc = TarjetaCuadro.plantilla.cloneNode()
				this.configurar()
			}
		})
*/
	}
	
	/**	Carga los datos del cuadro en el componente
	**/
	configurar(){
		//Carga de datos - Como puede haber varias tarjetas, tomamos los elementos por posición
		this.doc.getElementsByTagName('p')[0].appendChild(document.createTextNode(this.cuadro.titulo))
		this.doc.getElementsByTagName('p')[1].appendChild(document.createTextNode(this.cuadro.autor))
		if (this.cuadro.anexos.length > 0)
			this.doc.getElementsByTagName('img')[0].setAttribute('src', 'db/img/' + this.cuadro.anexos[0].url)
		else
			this.doc.getElementsByTagName('img')[0].setAttribute('src', 'img/no_image.png')

		//Asociación de Eventos
		//TODO
	}
	
	/** Destruye el objeto con seguridad.
	**/
	destruir(){
		this.cuadro = null
		this.vista = null
	}
}
