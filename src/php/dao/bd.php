<?php

namespace modigliani\dao;

/** Clase de Persistencia (acceso a base de datos)
		Es un Singleton.
**/
class BD extends \SQLite3 {
	private static $instance = null;

	private function __construct(){
		global $configuracion;
		$this->open($configuracion['base_datos']['url'], SQLITE3_OPEN_READWRITE);
  }

	public static function getInstance(){
    if (self::$instance == null)
      self::$instance = new BD();

    return self::$instance;
  }

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

				if (!move_uploaded_file($imagenes["imagen_$i"]['tmp_name'], 'db/img/'.$nombreImagen))
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

	public function eliminarCuadro($idCuadro){
		$sentencia = $this->prepare("DELETE FROM Cuadro WHERE id = :idCuadro");
		if (!$sentencia) throw new \Exception($this->lastErrorMsg());

		$sentencia->bindParam(":idCuadro", $idCuadro, SQLITE3_INTEGER);
		if (!@$sentencia->execute())throw new \Exception($this->lastErrorMsg());
	}

}