<?php
/**
	Fichero de la clase DAO BD.
	@author Miguel Jaque Barbero (mjaque@migueljaque.com).
	@version 0.1
	@license GPL v3
	@año 2021
**/

namespace modigliani\dao;

/** Clase de Persistencia (acceso a base de datos)
		Es un Singleton.
**/
class BD extends \SQLite3 {
	private static $instance = null;
	private static $url;
	private static $dirImg;

	/** Establece el valor de la URL de la Base de Datos.
			Es un método estático para la inyección de dependencias.
	 */
	public static function setUrl($url){
		self::$url = $url;
	}

	/** Establece el valor del path del directorio de imágenes.
      Es un método estático para la inyección de dependencias.
   */
  public static function setDirImg($url){
    self::$dirImg = $url;
  }

	/** Constructor de la clase.
			Debería ser privado, pero la versión de PHP del servidor no lo permite
	*/
	public function __construct(){
		$this->open(BD::$url, SQLITE3_OPEN_READWRITE);
		$this->exec('PRAGMA foreign_keys = ON');	//Activamos el uso de claves externas.
  }

	/** Método de implementación del Singleton. Devuelve una referencia a la instancia de BD
			@return {BD} Referencia al objeto de base de datos.
	*/
	public static function getInstance(){
    if (self::$instance == null)
      self::$instance = new BD();

    return self::$instance;
  }

/** Devuelve la lista de cuadros.
		@return {Cuadro[]} Array de cuadro
*/
	public function listarCuadros(){
		//Tenemos un one-many en cuadro-anexos. Lo reducimos a dos consultas.
		$sentencia = $this->prepare("SELECT id, titulo, autor FROM Cuadro ORDER BY autor, titulo");
		if (!$sentencia) throw new \Exception($this->lastErrorMsg());
		$resultado = $sentencia->execute();
		$cuadros = [];
		while ($cuadro = $resultado->fetchArray(SQLITE3_ASSOC)){
			$cuadro['anexos'] = [];
			array_push($cuadros, $cuadro);
		}
		$sentencia = $this->prepare("SELECT idCuadro, id, url, descripcion FROM Anexo ORDER BY idCuadro");
		if (!$sentencia) throw new \Exception($this->lastErrorMsg());
		$resultado = $sentencia->execute();
		if (!$resultado) throw new \Exception($this->lastErrorMsg());
		$anexos = [];
		while ($anexo = $resultado->fetchArray(SQLITE3_ASSOC)){
			for($i = 0; $i < count($cuadros); $i++){
				if ($cuadros[$i]['id'] == $anexo['idCuadro']){
					array_push($cuadros[$i]['anexos'], $anexo);
					break;
				}
			}
		}
		return $cuadros;
	}

	/** Devuelve los datos de un cuadro de la base de datos.
			@param id {Integer} Identificador del cuadro.
			@return {Cuadro}
	**/
	public function verCuadro($id){
		$sentencia = $this->prepare("SELECT id, titulo, autor, medidaConMarco, medidaSinMarco, marcas, propietario, estadoConservacion, materiales, tecnica, descripcionObra, descripcionAutor FROM Cuadro WHERE id = :id");
		if (!$sentencia) throw new \Exception($this->lastErrorMsg());
		$sentencia->bindParam(":id", $id, SQLITE3_INTEGER);
		$resultado = $sentencia->execute();
		$cuadro = $resultado->fetchArray(SQLITE3_ASSOC);
		$cuadro['anexos'] = [];

		$sentencia = $this->prepare("SELECT idCuadro, id, url, descripcion FROM Anexo WHERE idCuadro = :id");
		$sentencia->bindParam(":id", $id, SQLITE3_INTEGER);
		if (!$sentencia) throw new \Exception($this->lastErrorMsg());
		$resultado = $sentencia->execute();
		if (!$resultado) throw new \Exception($this->lastErrorMsg());
		$anexos = [];
		while ($anexo = $resultado->fetchArray(SQLITE3_ASSOC))
			array_push($cuadro['anexos'], $anexo);

		return $cuadro;
	}

	/** Inserta un cuadro en la base de datos.
			@param $cuadro {$_POST} Datos del cuadro.
			@param $imagenes {$_FILES} Imágenes asociadas al cuadro.
	*/
	public function insertarCuadro($cuadro, $imagenes){
		try{
			$this->exec('BEGIN');	//Iniciamos la transacción
			$sentencia = $this->prepare("INSERT INTO Cuadro (titulo, autor, medidaConMarco, medidaSinMarco, marcas, propietario, estadoConservacion, materiales, tecnica, descripcionObra, descripcionAutor) VALUES (:titulo, :autor, :medidaConMarco, :medidaSinMarco, :marcas, :propietario, :estadoConservacion, :materiales, :tecnica, :descripcionObra, :descripcionAutor)");
			if (!$sentencia) throw new \Exception($this->lastErrorMsg());

			$sentencia->bindParam(":titulo", $cuadro['titulo'], SQLITE3_TEXT);
			$sentencia->bindParam(":autor", $cuadro['autor'], SQLITE3_TEXT);
			$sentencia->bindParam(":medidaConMarco", $cuadro['medidaConMarco'], SQLITE3_TEXT);
			$sentencia->bindParam(":medidaSinMarco", $cuadro['medidaSinMarco'], SQLITE3_TEXT);
			$sentencia->bindParam(":marcas", $cuadro['marcas'], SQLITE3_TEXT);
			$sentencia->bindParam(":propietario", $cuadro['propietario'], SQLITE3_TEXT);
			$sentencia->bindParam(":estadoConservacion", $cuadro['estadoConservacion'], SQLITE3_TEXT);
			$sentencia->bindParam(":materiales", $cuadro['materiales'], SQLITE3_TEXT);
			$sentencia->bindParam(":tecnica", $cuadro['tecnica'], SQLITE3_TEXT);
			$sentencia->bindParam(":descripcionObra", $cuadro['descripcionObra'], SQLITE3_TEXT);
			$sentencia->bindParam(":descripcionAutor", $cuadro['descripcionAutor'], SQLITE3_TEXT);
			if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());

			$id = $this->lastInsertRowID();
			if ($id == 0) throw new \Exception($this->lastErrorMsg());

			//Insertamos las imágenes
			$sentencia = $this->prepare("INSERT INTO Anexo (idCuadro, id, url, descripcion, tipo) VALUES (:idCuadro, :id, :url, :descripcion, 1)");
			for($i = 0; $i < count($imagenes); $i++){
				//Comprobamos el tipo MIME
				$finfo = new \finfo(FILEINFO_MIME_TYPE);
				if (false === $ext = array_search($finfo->file($imagenes["imagen_$i"]['tmp_name']), array('jpg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif'), true))
					throw new \Exception('Formato inválido.');
				$nombreImagen = $id.'_'.$i.'.'.$ext;

				$sentencia->bindParam(':idCuadro', $id, SQLITE3_INTEGER);
				$sentencia->bindParam(':id', $i, SQLITE3_INTEGER);
				$sentencia->bindParam(':url', $nombreImagen, SQLITE3_TEXT);
				$sentencia->bindParam(':descripcion', $imagenes["imagen_$i"]['name'], SQLITE3_TEXT);

				if (!move_uploaded_file($imagenes["imagen_$i"]['tmp_name'], BD::$dirImg.DIRECTORY_SEPARATOR.$nombreImagen))
					throw new \Exception('Fallo al mover el fichero.');

				if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());
			}

			$this->exec('COMMIT');
			return $id;
		}catch(\Exception $ex){
			$this->exec('ROLLBACK');
			throw $ex;
		}
	}

	/** Actualiza la información de un cuadro.
			@param $cuadro {stdClass} Datos del cuadro ($_POST).
			@param $imagenes {stdClass} Datos de las imágenes ($_FILES)
	**/
	public function modificarCuadro($cuadro, $imagenes){
		try{
			$this->exec('BEGIN');	//Iniciamos la transacción
			$sentencia = $this->prepare("UPDATE Cuadro SET titulo = :titulo, autor = :autor, medidaConMarco = :medidaConMarco, medidaSinMarco = :medidaSinMarco, marcas = :marcas, propietario = :propietario, estadoConservacion = :estadoConservacion, materiales = :materiales, tecnica = :tecnica, descripcionObra = :descripcionObra, descripcionAutor = :descripcionAutor WHERE id = :id");
			if (!$sentencia) throw new \Exception($this->lastErrorMsg());

			$sentencia->bindParam(":titulo", $cuadro['titulo'], SQLITE3_TEXT);
			$sentencia->bindParam(":autor", $cuadro['autor'], SQLITE3_TEXT);
			$sentencia->bindParam(":medidaConMarco", $cuadro['medidaConMarco'], SQLITE3_TEXT);
			$sentencia->bindParam(":medidaSinMarco", $cuadro['medidaSinMarco'], SQLITE3_TEXT);
			$sentencia->bindParam(":marcas", $cuadro['marcas'], SQLITE3_TEXT);
			$sentencia->bindParam(":propietario", $cuadro['propietario'], SQLITE3_TEXT);
			$sentencia->bindParam(":estadoConservacion", $cuadro['estadoConservacion'], SQLITE3_TEXT);
			$sentencia->bindParam(":materiales", $cuadro['materiales'], SQLITE3_TEXT);
			$sentencia->bindParam(":tecnica", $cuadro['tecnica'], SQLITE3_TEXT);
			$sentencia->bindParam(":descripcionObra", $cuadro['descripcionObra'], SQLITE3_TEXT);
			$sentencia->bindParam(":descripcionAutor", $cuadro['descripcionAutor'], SQLITE3_TEXT);
			$sentencia->bindParam(":id", $cuadro['id'], SQLITE3_INTEGER);
			if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());

			//Borrar las imágenes. Requiere filtrar los datos.
			if (strlen($cuadro['borrar']) > 0){
				$ids = filter_var($cuadro['borrar'], FILTER_SANITIZE_STRING);
				$sentencia = $this->prepare("DELETE FROM Anexo WHERE idCuadro = :idCuadro AND id IN (:ids)");
				$sentencia->bindParam(":id", $cuadro['id'], SQLITE3_INTEGER);
				$sentencia->bindParam(":ids", $ids, SQLITE3_TEXT);
				if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());
			}

			//Insertamos las imágenes nuevas
			$sentencia = $this->prepare("SELECT MAX(id) + 1 AS nextId FROM Anexo WHERE idCuadro = :idCuadro");
			$sentencia->bindParam(":idCuadro", $cuadro['id'], SQLITE3_INTEGER);
			if (!$sentencia) throw new \Exception($this->lastErrorMsg());
			$resultado = $sentencia->execute();
			if (!$resultado) throw new \Exception($this->lastErrorMsg());
			$nextId = $resultado->fetchArray(SQLITE3_ASSOC);
			$nextId = $nextId['nextId'];

			$sentencia = $this->prepare("INSERT INTO Anexo (idCuadro, id, url, descripcion, tipo) VALUES (:idCuadro, :id, :url, :descripcion, 1)");
			for($i = 0; $i < count($imagenes); $i++){
				//Comprobamos el tipo MIME
				$finfo = new \finfo(FILEINFO_MIME_TYPE);
				if (false === $ext = array_search($finfo->file($imagenes["imagen_$i"]['tmp_name']), array('jpg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif'), true))
					throw new \Exception('Formato inválido.');
				$nombreImagen = $cuadro['id'].'_'.$nextId.'.'.$ext;

				$sentencia->bindParam(':idCuadro', $cuadro['id'], SQLITE3_INTEGER);
				$sentencia->bindParam(':id', $nextId, SQLITE3_INTEGER);
				$sentencia->bindParam(':url', $nombreImagen, SQLITE3_TEXT);
				$sentencia->bindParam(':descripcion', $imagenes["imagen_$i"]['name'], SQLITE3_TEXT);

				if (!move_uploaded_file($imagenes["imagen_$i"]['tmp_name'], BD::$dirImg.DIRECTORY_SEPARATOR.$nombreImagen))
					throw new \Exception('Fallo al mover el fichero.');

				if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());
				$nextId++;
			}
			$this->exec('COMMIT');
		}catch(\Exception $ex){
			$this->exec('ROLLBACK');
			throw $ex;
		}
	}

	/** Elimina un cuadro de la base de datos.
			@param $idCuadro {Integer} Identificador del cuadro a eliminar.
	*/
	public function eliminarCuadro($idCuadro){
		$this->exec('BEGIN');
		$sentencia = $this->prepare("DELETE FROM Cuadro WHERE id = :idCuadro");
		if (!$sentencia) throw new \Exception($this->lastErrorMsg());

		$sentencia->bindParam(":idCuadro", $idCuadro, SQLITE3_INTEGER);
		if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());
		$this->exec('COMMIT');
	}

}
