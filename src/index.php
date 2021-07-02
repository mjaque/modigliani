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
//Deshabilitado por seguridad
//$configuracion = parse_ini_file('config.ini', true);
require('config.php');

//Cargador
spl_autoload_register('modigliani\cargar');

//Middleware
session_start();

//Routing
//Parseamos la URI. Ref: https://serverfault.com/questions/210734/url-rewrite-with-multiple-parameters-using-htaccess
$uri = $_SERVER['REQUEST_URI'];
$uri_array = explode( "/", $uri );
//print_r($uri_array);die();
$metodo = $uri_array[2];	//TODO: Este índice depende del directorio de despliegue en el hosting

$respuesta = new \stdClass();
$db = new \SQLite3($configuracion['base_datos']['url'], SQLITE3_OPEN_READWRITE);
switch($metodo){
	case 'listar':	//Método sin parámetros
		try{
			//Tenemos un one-many en cuadro-anexos. Lo reducimos a dos consultas.
			$sentencia = $db->prepare("SELECT id, titulo, autor FROM Cuadro ORDER BY autor, titulo");
			if (!$sentencia) throw new \Exception($db->lastErrorMsg());
				//$cuadros = $sentencia1->fetchAll(\PDO::FETCH_CLASS, 'modigliani\modelos\Cuadro');
				$resultado = $sentencia->execute();
				$cuadros = [];
				while ($cuadro = $resultado->fetchArray(SQLITE3_ASSOC)){
					$cuadro['anexos'] = [];
					array_push($cuadros, $cuadro);
				}
				$sentencia = $db->prepare("SELECT idCuadro, id, url, descripcion FROM Anexo ORDER BY idCuadro");
				if (!$sentencia) throw new \Exception($db->lastErrorMsg());
				$resultado = $sentencia->execute();
				if (!$resultado) throw new \Exception($db->lastErrorMsg());
				$anexos = [];
				while ($anexo = $resultado->fetchArray(SQLITE3_ASSOC)){
					for($i = 0; $i < count($cuadros); $i++){
						if ($cuadros[$i]['id'] == $anexo['idCuadro']){
							array_push($cuadros[$i]['anexos'], $anexo);
							break;
						}
					}
				}
				//$anexos = $sentencia2->fetchAll(\PDO::FETCH_CLASS, 'modigliani\modelos\Anexo');


			$respuesta->datos = $cuadros;
			$respuesta->resultado = "OK";
		}catch(\Exception $ex){
			$respuesta->resultado = 'ERROR';
			$respuesta->mensaje = $ex->getMessage();
		}
		$db = null;	//Cierre de BD
		header('Content-Type: application/json');
		echo json_encode($respuesta);
		die();

	case 'insertar':	//Parámetros por $_POST y $_FILES
		try{
			//$peticion = json_decode(file_get_contents("php://input"), true);

		$db->exec('BEGIN');	//Iniciamos la transacción
		$sentencia = $db->prepare("INSERT INTO Cuadro (titulo, autor, medidaConMarco, medidaSinMarco, marcas, propietario, estadoConservacion, materiales, tecnica, descripcionObra, descripcionAutor) VALUES (:titulo, :autor, :medidaConMarco, :medidaSinMarco, :marcas, :propietario, :estadoConservacion, :materiales, :tecnica, :descripcionObra, :descripcionAutor)");
		if (!$sentencia) throw new \Exception($db->lastErrorMsg());

		$sentencia->bindParam(":titulo", $_POST['titulo'], SQLITE3_TEXT);
		$sentencia->bindParam(":autor", $_POST['autor'], SQLITE3_TEXT);
		$sentencia->bindParam(":medidaConMarco", $_POST['medidaConMarco'], SQLITE3_TEXT);
		$sentencia->bindParam(":medidaSinMarco", $_POST['medidaSinMarco'], SQLITE3_TEXT);
		$sentencia->bindParam(":marcas", $_POST['marcas'], SQLITE3_TEXT);
		$sentencia->bindParam(":propietario", $_POST['propietario'], SQLITE3_TEXT);
		$sentencia->bindParam(":estadoConservacion", $_POST['estadoConservacion'], SQLITE3_TEXT);
		$sentencia->bindParam(":materiales", $_POST['materiales'], SQLITE3_TEXT);
		$sentencia->bindParam(":tecnica", $_POST['tecnica'], SQLITE3_TEXT);
		$sentencia->bindParam(":descripcionObra", $_POST['descripcionObra'], SQLITE3_TEXT);
		$sentencia->bindParam(":descripcionAutor", $_POST['descripcionAutor'], SQLITE3_TEXT);
		if (!@$sentencia->execute())throw new \Exception($db->lastErrorMsg());

		$id = $db->lastInsertRowID();
		if ($id == 0) throw new \Exception($db->lastErrorMsg());
		
		//Insertamos las imágenes
		$sentencia = $db->prepare("INSERT INTO Anexo (idCuadro, id, url, descripcion, tipo) VALUES (:idCuadro, :id, :url, :descripcion, 1)");
		for($i = 0; $i < count($_FILES); $i++){
			//Comprobamos el tipo MIME
			$finfo = new \finfo(FILEINFO_MIME_TYPE);
			if (false === $ext = array_search($finfo->file($_FILES["imagen_$i"]['tmp_name']), array('jpg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif'), true))
				throw new RuntimeException('Formato inválido.');
			$nombreImagen = $id.'_'.$i.'.'.$ext;
			
			$sentencia->bindParam(':idCuadro', $id, SQLITE3_INTEGER);
			$sentencia->bindParam(':id', $i, SQLITE3_INTEGER);
			$sentencia->bindParam(':url', $nombreImagen, SQLITE3_TEXT);
			$sentencia->bindParam(':descripcion', $_FILES["imagen_$i"]['name'], SQLITE3_TEXT);
			
			if (!move_uploaded_file($_FILES["imagen_$i"]['tmp_name'], 'db/img/'.$nombreImagen))
				throw new RuntimeException('Fallo al mover el fichero.');

			if (!@$sentencia->execute())throw new \Exception($db->lastErrorMsg());
		}
		
		$db->exec('COMMIT');
		$respuesta->id = $id;
		$respuesta->resultado = "OK";
		}catch(\Exception $ex){
			$db->exec('ROLLBACK');
			$respuesta->resultado = 'ERROR';
			$respuesta->mensaje = $ex->getMessage();
		}
		$db = null;	//Cierre de BD
		header('Content-Type: application/json');
		echo json_encode($respuesta);
		die();

	default:
		throw new \Exception("Petición desconocida: $uri");
}

/**
	Cargador de Clases.
	@param clase Nombre de la clase a cargar.
**/
function cargar($clase){
	global $configuracion;
	//$clase = 'modigliani\modelos\Cuadro';
	
	//Reemplazamos "modigliani" por el directorio base (en el hosting)
	$fichero = str_replace('modigliani', $configuracion['general']['dir_base'], $clase);
	// y cambiamos \ por el separador de directorio
	$fichero = str_replace('\\', DIRECTORY_SEPARATOR, $fichero);
	//$fichero = str_replace('\\', DIRECTORY_SEPARATOR, substr($clase, strpos($clase, '\\')));
	//Quitamos el primer separador, pasamos a minúsculas y añadimos la extensión.
	$fichero = strtolower(substr($fichero, 1)).'.php';
	$fichero = $configuracion['general']['dir_php'].DIRECTORY_SEPARATOR.$fichero;
	//echo $fichero.' - ';

	if (file_exists($fichero))
		require_once($fichero);
	else
		throw new \Exception("No pudo cargarse la clase $clase del fichero $fichero.");
		//echo("No pudo cargarse la clase $clase del fichero $fichero.");
}
