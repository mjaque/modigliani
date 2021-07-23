<?php
/**
	Fichero de la clase modelo JWT (Java Web Token).
	@author Miguel Jaque Barbero (mjaque@migueljaque.com).
	@version 0.1
	@license GPL v3
	@año 2021
**/

namespace modigliani\modelos;

/**	Clase modelo que representa un JWT
		NO es conforme a RFC.
**/
class JWT{
	private static $algo;		//Nombre del algoritmo de encriptación.
	private static $clave;	//Clave de encriptación.
	private static $iv;			//Vector de inicialización.

	public $header;
	public $payload;
	public $signature;
	public $token;

	/** Establece el valor del algoritmo de encriptación. Debe ser alguno de los devueltos por openssl_get_cipher_methods.
			Es un método estático para la inyección de dependencias.
			@param string $algo	Nombre del algoritmo de encriptación.
	 */
	public static function setAlgoritmo($algo){
		self::$algo = $algo;
	}

	/** Establece el valor de la clave de encriptación.
			Es un método estático para la inyección de dependencias.
			@param string $clave	Valor de la clave de encriptación.
	 */
	public static function setClave($clave){
		self::$clave = $clave;
	}

	/** Establece el valor del vector de inicialización.
			Es un método estático para la inyección de dependencias.
			@param string $iv	Valor del vector de inicialización de 16 bytes.
	 */
	public static function setIV($iv){
		self::$iv = $iv;
	}

	/** Valida el token recibido por HTTP y devuelve el Payload.
			Si el token es inválido, lanza una excepción.
			@return {stdClass} Objeto del payload.
	 */
	public static function getPayload(){
		$clave = 'Authorization';
		$head = 'Bearer ';
		$headers = apache_request_headers();
		//Comprobamos que venga el token en el header 'Authorization'
		if (!array_key_exists($clave, $headers))
			throw new \Exception("Token Inválido.");
		//Comprobamos que empieze con "Bearer "
		if (substr($headers[$clave], 0, strlen($head)) != $head)
			throw new \Exception("Token Inválido.");
		$token = substr($headers[$clave], strlen($head), strlen($headers[$clave]));
		//Comprobamos que tenga tres partes separadas por .
		$tokens = explode('.', $token);
		if (count($tokens) != 3)
			throw new \Exception("Token Inválido.");
		//Comprobamos la firma
		if (openssl_encrypt($tokens[0].'.'.$tokens[1], self::$algo, self::$clave, 0, self::$iv) != $tokens[2])
			throw new \Exception("Token Inválido.");

		return json_decode(self::base64url_decode($tokens[1]));
	}

	/** Constructor de la clase.
			Inicializa los valores por defecto.
	**/
	public function __construct(){
		$this->header = new \stdClass();
		$this->header->typ = 'JWT';
	}

	/** Establece la carga (payload) del Jwt
			@param payload {stdClass} Objeto con la carga del Jwt.
	**/
	public function setPayload($payload){
		$this->payload = $payload;
	}

	/** Calcula la firma del JWT. Devuelve el token firmado.
			@return string $token
	**/
	public function firmar(){
		$json_header = self::base64url_encode(json_encode($this->header));
		$json_payload = self::base64url_encode(json_encode($this->payload));
		$firma = $json_header.'.'.$json_payload;
		$this->signature = openssl_encrypt($firma, self::$algo, self::$clave, 0, self::$iv);
		$this->token = $json_header.'.'.$json_payload.'.'.$this->signature;
		return $this->token;
	}

 	/**
 	* Encode data to Base64URL.
 	 Ref: https://base64.guru/developers/php/examples/base64url
 	* @param string $data
 	* @return boolean|string
 	*/
	public static function base64url_encode($data){
  	// First of all you should encode $data to Base64 string
  	$b64 = base64_encode($data);

  	// Make sure you get a valid result, otherwise, return FALSE, as the base64_encode() function do
  	if ($b64 === false) return false;

  	// Convert Base64 to Base64URL by replacing “+” with “-” and “/” with “_”
  	$url = strtr($b64, '+/', '-_');

  	// Remove padding character from the end of line and return the Base64URL result
  	return rtrim($url, '=');
	}

	/**
 	* Decode data from Base64URL
   Ref: https://base64.guru/developers/php/examples/base64url
 	* @param string $data
 	* @param boolean $strict
 	* @return boolean|string
 	*/
	public static function base64url_decode($data, $strict = false){
  	// Convert Base64URL to Base64 by replacing “-” with “+” and “_” with “/”
  	$b64 = strtr($data, '-_', '+/');

  	// Decode Base64 string and return the original data
  	return base64_decode($b64, $strict);
	}

}
