<?php
/**
	Fichero principal (fachada) de Modigliani.
	@author Miguel Jaque Barbero (mjaque@migueljaque.com).
	@version 0.1
	@license GPL v3
	@año 2021
**/

namespace modigliani;

//Nivel de informe de errores
error_reporting(E_ALL);
ini_set('display_errors', '1');

//Configuración
require('config.php');

//Cargador
spl_autoload_register('modigliani\cargar');

//Inyección de Dependencias (no se hace en objetos porque el cargador de clases es automático)
controladores\Cuadro::setDirImg($configuracion['general']['dir_img']);
dao\BD::setUrl($configuracion['base_datos']['url']);
dao\BD::setDirImg($configuracion['general']['dir_img']);
modelos\JWT::setAlgoritmo($configuracion['encriptacion']['algoritmo']);
modelos\JWT::setClave($configuracion['encriptacion']['clave']);
modelos\JWT::setIV($configuracion['encriptacion']['vector_inicializacion']);

//Routing
//Parseamos la URI. Ref: https://serverfault.com/questions/210734/url-rewrite-with-multiple-parameters-using-htaccess
//$uri = $_SERVER['REQUEST_URI'];
$uri =  $_SERVER['PHP_SELF'];
$uri_array = explode( "/", $uri );
$nombre_controlador = end($uri_array);
if (strpos($nombre_controlador, '?'))
	$nombre_controlador = substr($nombre_controlador, 0, strpos($nombre_controlador, '?'));

//Comprobamos que sea un controlador
//$clase = 'modigliani\\controladores\\'.ucfirst($uri_array[2]);
$clase = 'modigliani\\controladores\\'.ucfirst($nombre_controlador);
$controlador = new $clase();
//$metodo = strtolower($_SERVER['REQUEST_METHOD']);
//Leemos el método de la cabecera personalizada
$metodo = strtolower($_SERVER['HTTP_METODO']);
//Comprobamos que exista el método
if (!method_exists($controlador, $metodo))
	throw new \Exception("Método desconocido.");

//Control de Acceso - Se realiza en cada controlador
/*  $payload = modelos\JWT::getPayload();
  $usuario = $payload->usuario;
  if ($usuario != 'Anacleto')
    throw new \Exception("Acceso no autorizado.");
*/

//Llamamos al método del controlador
$controlador->{$metodo}();
die();

/**
	Cargador de Clases.
	@param clase Nombre de la clase a cargar.
**/
function cargar($clase){
	global $configuracion;

	//Quitamos modigliani
	$fichero = str_replace('modigliani', '', $clase);
	// y cambiamos \ por el separador de directorio
	$fichero = str_replace('\\', DIRECTORY_SEPARATOR, $fichero);
	//Quitamos el primer separador, pasamos a minúsculas y añadimos la extensión.
	$fichero = strtolower(substr($fichero, 1)).'.php';
	$fichero = $configuracion['general']['dir_php'].DIRECTORY_SEPARATOR.$fichero;

	if (file_exists($fichero))
		require_once($fichero);
	else
		throw new \Exception("No pudo cargarse la clase $clase del fichero $fichero.");
		//echo("No pudo cargarse la clase $clase del fichero $fichero.");
		//echo "Cargada la clase $clase del fichero $fichero.";
}
