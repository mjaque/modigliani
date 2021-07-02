'use strict'

/** Clase para realizar peticiones Ajax.
**/
export class Ajax{
	/** Realiza una petición Ajax vía POST pasando los parámetros como un JSON en el body.
		@param url {string} URL del servidor.
		@param parametros {Objeto} Parámetros que se pasarán al servidor
		@return {Promise} Devuelve una Promise.

		Ref: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
	**/
	static async enviarJSON(url, parametros){
		const body = {
			'parametros' : parametros
		}
		const respuesta = fetch( url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=UTF-8'
			}),
			body: JSON.stringify(body)
		})
		return respuesta	//Devuelve una Promise
	}

	/** Realiza una petición Ajax vía POST pasando los parámetros directamente en el body.
		@param url {string} URL del servidor.
		@param parametros {FormData} Parámetros que se pasarán al servidor
		@return {Promise} Devuelve una Promise.

		Ref: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
	**/	
	static async enviar(url, formData){
		//for(var pair of formData.entries())
	 	//	console.log(pair[0]+ ': '+ pair[1]);

		const respuesta = fetch( url, {
			method: 'POST',
			body: formData
		})
		return respuesta	//Devuelve una Promise
	}
}
