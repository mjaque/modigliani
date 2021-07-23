<?php
/**
	Fichero de la clase controlador Usuario.
	@author Miguel Jaque Barbero (mjaque@migueljaque.com).
	@version 0.1
	@license GPL v3
	@año 2021
**/

namespace modigliani\controladores;

/**
	Controlador de Usuario.
**/
class Usuario{

	/**
		Constructor de la clase.
	**/
//  public function __construct(){}

/** Comprueba los parámetros de usuario y clave y devuelve una respuesta con un JTW válido.
    Nota: El JWT NO es conforme a RFC7519.
    El método espera recibir en el cuerpo de la petición POST un objeto en JSON.
*/
public function login(){
  $respuesta = new \stdClass();

  try{
    //Proceso de datos de entrada
    $body = json_decode(file_get_contents('php://input'));

    $bd = \modigliani\dao\BD::getInstance();
    $bd->login($body->usuario, $body->clave);

    $jwt = new \modigliani\modelos\JWT();
    $payload = new \stdClass();
    $payload->usuario = $body->usuario;
    $jwt->setPayload($payload);

    $respuesta->datos = $jwt->firmar();
    $respuesta->resultado = "OK";
  }
  catch(\Exception $e){
    $respuesta->resultado = 'ERROR';
    $respuesta->mensaje = $e->getMessage();
  }
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
      //TODO: Refactorizar con Cuadro creando clase Controlador
  **/
  private function responder($respuesta){
    header('Content-Type: application/json');
    echo json_encode($respuesta);
  }

}
