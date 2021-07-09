<?php
/**
	Fichero de la clase controlador Cuadro.
	@author Miguel Jaque Barbero (mjaque@migueljaque.com).
	@version 0.1
	@license GPL v3
	@año 2021
**/

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

/** Devuelve información de cuadros según los parámetros recibidos.
    Si no hay ningún parámetro, se devuelve una lista con todos los cuadros con algunos atributos.
    Si se reciben el parámetro $_GET['id'] se devuelve la información detallada del cuadro.
*/
public function ver(){
  $respuesta = new \stdClass();
  try{
    $bd = \modigliani\dao\BD::getInstance();
    //var_dump($_GET);
    if (count($_GET) == 0){  //Listar todos los cuadros
      $respuesta->datos = $bd->listarCuadros();
      $respuesta->resultado = "OK";
    }
    else {
      $id = $_GET['id'];
      if ((filter_var($id, FILTER_VALIDATE_INT) === 0 || filter_var($id, FILTER_VALIDATE_INT)) ){
        $respuesta->datos = $bd->verCuadro($_GET['id']);
        $respuesta->resultado = "OK";
      }
      else throw new \Exception('Parámetros inválidos.');
    }
  }
  catch(\Exception $e){
    $respuesta->resultado = 'ERROR';
    $respuesta->mensaje = $e->getMessage();
  }
  $bd = null;	//Cierre de BD
  $this->responder($respuesta);
}

/** Inserta un nuevo cuadro en la base de datos.
    Recibe los datos por POST en formato formData, incluyendo las imágenes.
**/
public function insertar(){
  $respuesta = new \stdClass();
  try{
    $bd = \modigliani\dao\BD::getInstance();
    $respuesta->datos = $bd->insertarCuadro($_POST, $_FILES);
    $respuesta->resultado = "OK";
  }
  catch(\Exception $e){
    $respuesta->resultado = 'ERROR';
    $respuesta->mensaje = $e->getMessage();
  }
  $bd = null;	//Cierre de BD
  $this->responder($respuesta);
}

/** Método para modificar un cuadro.
    Recibe los datos por POST en formato formData, incluyendo las imágenes.
 */
public function modificar(){
  $respuesta = new \stdClass();
  try{
    $bd = \modigliani\dao\BD::getInstance();
    $respuesta->datos = $bd->modificarCuadro($_POST, $_FILES);
    $respuesta->resultado = "OK";
  }
  catch(\Exception $e){
    $respuesta->resultado = 'ERROR';
    $respuesta->mensaje = $e->getMessage();
  }
  $bd = null;	//Cierre de BD
  $this->responder($respuesta);
}

  /** Elimina un cuadro de la base de datos.
    Recibe por $_GET['id'] el identificador del cuadro a borrar.
  */
  public function borrar(){
    $respuesta = new \stdClass();
    try{
      $id = $_GET['id'];
      if ((filter_var($id, FILTER_VALIDATE_INT) === 0 || filter_var($id, FILTER_VALIDATE_INT)) ){
        $bd = \modigliani\dao\BD::getInstance();
        $bd->eliminarCuadro($id);
        //Borrar las imágenes
        foreach( glob(Cuadro::$dirImg.DIRECTORY_SEPARATOR.$id.'_*') as $imagen)
          unlink($imagen);
          $respuesta->resultado = "OK";
        }
    }
    catch(\Exception $e){
      $respuesta->resultado = 'ERROR';
      $respuesta->mensaje = $e->getMessage();
    }
    $bd = null;	//Cierre de BD
    $this->responder($respuesta);
  }

  /** Establece la cabeceras de la respuesta y la envía al emisor.
      @param respuesta {stdClass} Objeto con la respuesta.
  **/
  private function responder($respuesta){
    header('Content-Type: application/json');
    echo json_encode($respuesta);
  }

}
