<?php

namespace modigliani\controladores;

/**
	Controlador de Cuadro.
**/
class Cuadro{
  private static $dirImg;

  /** Establece el valor del path del directorio de imágenes.
      Es un método estático para la inyección de dependencias.
   */
  public static function setDirImg($url){
    self::$dirImg = $url;
  }

	/**
		Constructor de la clase.
	**/
//  public function __construct(){}

public function get(){
  $bd = \modigliani\dao\BD::getInstance();
  $respuesta = new \stdClass();
  //var_dump($_GET);
  if (count($_GET) == 0){  //Listar todos los cuadros
    $respuesta->datos = $bd->listarCuadros();
    $respuesta->resultado = "OK";
  }
  else {
    $respuesta->datos = $bd->verCuadro($_GET['id']);
    $respuesta->resultado = "OK";
  }
  $bd = null;	//Cierre de BD
  $this->responder($respuesta);
}

public function post(){
  $respuesta = new \stdClass();
  try{
    $bd = \modigliani\dao\BD::getInstance();
    $respuesta->datos = $bd->insertarCuadro($_POST, $_FILES);
    $respuesta->resultado = "OK";
    $bd = null;	//Cierre de BD
  }
  catch(\Exception $e){
    $respuesta->resultado='ERROR';
    $respuesta->mensaje=$e;
  }
  $this->responder($respuesta);
}

/** Método para modificar un cuadro.
 */
public function put(){
  $respuesta = new \stdClass();
  try{
    $bd = \modigliani\dao\BD::getInstance();
    $respuesta->datos = $bd->modificarCuadro($_POST, $_FILES);
    $respuesta->resultado = "OK";
    $bd = null;	//Cierre de BD
  }
  catch(\Exception $e){
    $respuesta->resultado='ERROR';
    $respuesta->mensaje=$e;
  }
  $this->responder($respuesta);
}

public function delete(){
  $body = json_decode(file_get_contents("php://input"), true);
  $idCuadro = $body['id'];
  $bd = \modigliani\dao\BD::getInstance();
  $bd->eliminarCuadro($idCuadro);

  //Borrar las imágenes
  foreach( glob(Cuadro::$dirImg.DIRECTORY_SEPARATOR.$idCuadro.'_*') as $imagen)
    unlink($imagen);

  $respuesta = new \stdClass();
  $respuesta->resultado = "OK";
  $bd = null;	//Cierre de BD
  $this->responder($respuesta);
}

  private function responder($respuesta){
    header('Content-Type: application/json');
    echo json_encode($respuesta);
  }

}
