<?php 
/**
	Fichero de la clase modelo Cuadro.
	@author Miguel Jaque Barbero (mjaque@migueljaque.com).
	@version 0.1
	@license GPL v3
	@año 2021
**/

namespace modigliani\modelos;

/**	Clase modelo que representa un cuadro
**/
class Cuadro{
	public $id;
	public $titulo;
	public $autor;
	public $medidaConMarco;
	public $medidaSinMarco;
	public $marcas;
	public $propietario;
	public $estadoConservacion;
	public $materiales;
	public $tecnica;
	public $descripcionObra;
	public $descripcionAutor;
	public $anexos = array();
}
