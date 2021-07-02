'use strict'

/** Clase que representa un Cuadro.
**/
export class Cuadro{
	constructor(id){
		this.id = id
		this.imagenes = []
	}

	/** Crea un cuadro a partir del objeto de datos proviniente de la base de datos.
		@param cuadroDB {Object} Objeto de datos de la base de datos. Son campos numerados 
	static crear(cuadroDB){
	}**/

	setTitulo(titulo){
		this.titulo = titulo
	}

	setAutor(autor){
		this.autor = autor
	}

	setMedidaConMarco(medidaConMarco){
		this.medidaConMarco = medidaConMarco
	}

	setMedidaSinMarco(medidaSinMarco){
		this.medidaSinMarco = medidaSinMarco
	}

	setMarcas(marcas){
		this.marcas = marcas
	}

	setPropietario(propietario){
		this.propietario = propietario
	}
	setEstadoConservacion(estadoConservacion){
		this.estadoConservacion = estadoConservacion
	}

	setMateriales(materiales){
		this.materiales = materiales
	}

	setTecnica(tecnica){
		this.tecnica = tecnica
	}

	setDescripcionObra(descripcionObra){
		this.descripcionObra = descripcionObra
	}

	setDescripcionAutor(descripcionAutor){
		this.descripcionAutor = descripcionAutor
	}
}
