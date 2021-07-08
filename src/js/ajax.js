'use strict'

/** Clase para realizar peticiones Ajax.
 **/
export class Ajax {
  /** Realiza una petición Ajax vía POST pasando los parámetros como un JSON en el body.
  	@param url {string} URL del servidor.
  	@param parametros {Objeto} Parámetros que se pasarán al servidor
  	@return {Promise} Devuelve una Promise.

  	Ref: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
  **/

  /** Realiza una petición Ajax vía POST pasando los parámetros como un JSON en el body.
  	@param url {String} URL del servidor.
  	@param metodo {String} Nombre del método HTTP solicitado (GET, POST, PUT, DELETE, etc.).
  	@param parametros {Objeto} Parámetros que se pasarán al servidor
  	@return {Promise} Devuelve una Promise.

  	Ref: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
  **/
  static async pedir2(url, metodo, parametros, json = true) {
    let opciones = {
      method: metodo, // GET, POST, PUT, DELETE, etc. Personalizado...
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }
    switch(metodo){
      case 'GET':
        let primero = true
        for (const atributo in parametros){
          if (primero)
            url += '?'
          url += `${atributo}=${encodeURIComponent(parametros[atributo])}`
        }
        break
      case 'POST':
      case 'PUT':
      case 'DELETE':
        if (json){
          opciones.headers = {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded',
            'charset': 'utf-8'
          }
          opciones.body = JSON.stringify(parametros) // body data type must match "Content-Type" header
        }
        else
          opciones.body = parametros // body data type must match "Content-Type" header
        break;
    }

    return fetch(url, opciones) //Devuelve una Promise
  }

  /** Realiza una petición Ajax vía POST pasando los parámetros como un JSON en el body.
    @param url {String} URL del servidor, incluye el nombre del controlador.
    @param metodoControlador {String} Nombre del método del controlador solicitado.
    @param parametros {Objeto} Parámetros que se pasarán al servidor.
    @param metodoHTTP {String} Nombre del método HTTP utilizado (GET, POST, PUT, DELETE...)
    @param json {Boolean} Solo para metodoHTTP POST indica si los datos se codificarán como JSON o formData.
    @return {Promise} Devuelve una Promise.

    Ref: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
  **/
  static async pedir(url, metodoControlador, parametros, metodoHTTP = 'GET', json = true) {
    let opciones = {
      method: metodoHTTP,
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      headers: {
        metodo: metodoControlador
      }
    }
    switch(metodoHTTP){
      case 'GET':
        let primero = true
        for (const atributo in parametros){
          if (primero)
            url += '?'
          url += `${atributo}=${parametros[atributo]}`
        }
        break
      case 'POST':
        if (json){
          opciones.headers = {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded',
            'charset': 'utf-8'
          }
          opciones.body = JSON.stringify(parametros) // body data type must match "Content-Type" header
        }
        else  //formData
          opciones.body = parametros // body data type must match "Content-Type" header
        break;
    }

    return fetch(url, opciones) //Devuelve una Promise
  }

}
