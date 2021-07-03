<?php

namespace modigliani\controladores;

/**
	Controlador de Cuadro.
**/
class Cuadro{

	/**
		Constructor de la clase.
	**/
//  public function __construct(){}

public function get(){
  $bd = \modigliani\dao\BD::getInstance();
  $body = json_decode(file_get_contents("php://input"), true);
  $respuesta = new \stdClass();
  if (is_null($body)){  //Listar todos los cuadros
    $respuesta->datos = $bd->listarCuadros();
    $respuesta->resultado = "OK";
  }
  $db = null;	//Cierre de BD
  $this->responder($respuesta);
}

public function post(){
  $respuesta = new \stdClass();
  try{
    $bd = \modigliani\dao\BD::getInstance();
    $respuesta->datos = $bd->insertarCuadro($_POST, $_FILES);
    $respuesta->resultado = "OK";
    $db = null;	//Cierre de BD
  }
  catch(\Exception $e){
    $respuesta->resultado='ERROR';
    $respuesta->mensaje=$e;
  }
  $this->responder($respuesta);
}

public function delete(){
  global $configuracion;
  $body = json_decode(file_get_contents("php://input"), true);
  $idCuadro = $body['id'];
  $bd = \modigliani\dao\BD::getInstance();
  $bd->eliminarCuadro($idCuadro);

  //Borrar las imágenes
  foreach( glob($configuracion['general']['dir_img'].DIRECTORY_SEPARATOR.$idCuadro.'_*') as $imagen)
    unlink($imagen);

  $respuesta = new \stdClass();
  $respuesta->resultado = "OK";
  $db = null;	//Cierre de BD
  $this->responder($respuesta);
}

	/**
		Envía un json con la lista de cuadros.
	**/
	public function _listarCuadros(){
		global $configuracion;

		$respuesta = new \stdClass;
		$lista = array();
		try{
			$directorio = $configuracion['general']['dir_data'];
			$contenido = array_diff(scandir($directorio), array('..', '.', 'img'));
			foreach ($contenido as $clave => $nombre_fichero){
				$json = file_get_contents($directorio.DIRECTORY_SEPARATOR.$nombre_fichero);
				$cuadro = json_decode($json);
				$cuadro->id = substr($nombre_fichero, 0, strrpos($nombre_fichero, "."));
				array_push($lista, $cuadro);
			}
			$respuesta->json = json_encode($lista);
			$respuesta->resultado='OK';
		}
    catch(\Exception $e){
      $respuesta->resultado='ERROR';
      $respuesta->mensaje=$e;
    }
    $this->responder($respuesta);
	}

  private function responder($respuesta){
    header('Content-Type: application/json');
    echo json_encode($respuesta);
  }

}
