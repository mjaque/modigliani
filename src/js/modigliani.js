'use strict'

import { configuracion } from './configuracion.js'
import { Ajax } from './ajax.js'
import { BarraNavegacion } from './vistas/barranavegacion.js'
import { ListaCuadros } from './vistas/listacuadros.js'
import { FormularioAlta } from './vistas/formularioalta.js'
import { Consulta } from './vistas/consulta.js'
import { FormularioEditar } from './vistas/formularioeditar.js'

//Importación de librerías

/** Controlador Principal de la aplicación.
 **/
class Modigliani {
  /** Constructor de la clase
  	Asocia el método cargar al evento window.onload.
  **/
  constructor() {
    this.vistas = new Map() //Mapa de vistas de la aplicación.
    window.onload = this.cargar.bind(this)
  }

  /** Carga las vistas de la aplicación. Después activa la aplicación.
   **/
  cargar() {
    //Carga de Vistas
    const promesas = [] //Creamos un array de promesas
    //this.vistas.set('formularioLogin', new FormularioLogin(this, configuracion.dirVistas))
    //promesas.push(this.vistas.get('formularioLogin').cargar())
    this.vistas.set('barraNavegacion', new BarraNavegacion(this, configuracion.dirVistas))
    promesas.push(this.vistas.get('barraNavegacion').cargar())
    this.vistas.set('listaCuadros', new ListaCuadros(this, configuracion.dirVistas))
    promesas.push(this.vistas.get('listaCuadros').cargar())
    this.vistas.set('formularioAlta', new FormularioAlta(this, configuracion.dirVistas))
    promesas.push(this.vistas.get('formularioAlta').cargar())
    this.vistas.set('consulta', new Consulta(this, configuracion.dirVistas, configuracion.dirBDImg))
    promesas.push(this.vistas.get('consulta').cargar())
    this.vistas.set('formularioEditar', new FormularioEditar(this, configuracion.dirVistas, configuracion.dirBDImg))
    promesas.push(this.vistas.get('formularioEditar').cargar())

    Promise.all(promesas).then(this.activar.bind(this))
  }

  /** Activa los botones y elementos activos de la aplicación. Después, pide la lista de cuadros.
   **/
  activar() {

    //Registro de nodos de referencia
    this.nav = document.getElementsByTagName('nav')[0]
    this.main = document.getElementsByTagName('main')[0]

    //this.vistas.get('formularioLogin').transferirA(this.main)
    this.vistas.get('listaCuadros').div.style.display = 'none'
    this.vistas.get('listaCuadros').transferirA(this.main)
    this.vistas.get('formularioAlta').form.style.display = 'none'
    this.vistas.get('formularioAlta').transferirA(this.main)
    this.vistas.get('consulta').div.style.display = 'none'
    this.vistas.get('consulta').transferirA(this.main)
    this.vistas.get('formularioEditar').form.style.display = 'none'
    this.vistas.get('formularioEditar').transferirA(this.main)

    //Asociación de eventos

    //Mostrar vistas
    this.vistas.get('barraNavegacion').transferirA(this.nav)

    //Iniciar la carga de la lista de cuadros
    this.pedirListaCuadros()
  }

  /** Identifica al usuario de la aplicación.
      Realiza la petición Ajax para recibir el token (JWT)
      @param usuario {String} Nombre de usuario.
      @param clave {String} Clave del usuario.
  **/
  login(usuario, clave){
    Ajax.pedir(configuracion.fachada + '/cuadro', 'ver')
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK'){
            console.log(respuesta)
            //TODO: destruir? el formulario de login.
            this.pedirListaCuadros()
        }
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.login: ${ex}`
      })
  }

  /** Pide por Ajax la lista de cuadros.
      Solicita cuadro.ver sin parámetros para obtener la lista de todos los cuadros.
   **/
  pedirListaCuadros() {
    Ajax.pedir(configuracion.fachada + '/cuadro', 'ver')
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK')
          this.vistas.get('listaCuadros').cargarCuadros(respuesta.datos)
          .then(resp => {
            this.verListaCuadros()
          })
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.pedirListaCuadros: ${ex}`
      })
  }

  /** Muestra la lista de cuadros
   **/
  verListaCuadros() {
    this.mostrar('listaCuadros')
  }

  /** Pide por Ajax los detalles de un cuadros y los muestra en la vista de consulta.
      Solicita cuadro.ver pasando $_GET['id'].
      @param cuadro {Cuadro} Cuadro a consultar.
   **/
  pedirConsultarCuadro(cuadro) {
    Ajax.pedir(configuracion.fachada + '/cuadro', 'ver', {'id': cuadro.id})
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK'){
          this.mostrar('consulta')
          this.vistas.get('consulta').cargarCuadro(respuesta.datos)
        }
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.pedirConsultarCuadros: ${ex}`
      })
  }

  /** Pide por Ajax los detalles de un cuadros y los muestra en la vista de edición.
      Solicita cuadro.ver pasando $_GET['id'].
      @param cuadro {Cuadro} Cuadro a consultar.
   **/
  pedirEditarCuadro(cuadro) {
    Ajax.pedir(configuracion.fachada + '/cuadro', 'ver', {'id': cuadro.id})
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK'){
          this.mostrar('formularioEditar')
          this.vistas.get('formularioEditar').cargarCuadro(respuesta.datos)
        }
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.pedirEditarCuadros: ${ex}`
      })
  }

  /** Abre el interfaz para dar de alta un nuevo cuadro.
   **/
  verFormularioAlta() {
    this.mostrar('formularioAlta')
  }

  /** Muestra la vista indicada y oculta las demás
  	@param vista {String} Nombre de la vista a mostrar
  **/
  mostrar(vista) {
    for (let [clave, valor] of this.vistas.entries()) {
      if (clave == 'barraNavegacion') continue
      if (clave == vista)
        valor.mostrar()
      else
        valor.ocultar()
    }
  }

  /** Método de atención a la cancelación de un formulario.
   **/
  cancelar() {
    this.verListaCuadros()
  }

  /** Método de atención a la aceptación del formulario de alta.
  	@param formData {FormData} Datos del formulario de alta, incluyendo las imágenes.
  **/
  pedirAltaCuadro(formData) {
    Ajax.pedir(configuracion.fachada + '/cuadro', 'insertar', formData, 'POST', false)
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK')
          this.pedirListaCuadros()
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.insertar: ${ex}`
      })
  }

  /** Método de atención a la aceptación del formulario de edición.
    @param formData {FormData} Datos del formulario de edición, incluyendo las imágenes.
  **/
  pedirModificarCuadro(formData) {
    Ajax.pedir(configuracion.fachada + '/cuadro', 'modificar', formData, 'POST', false)
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK')
          this.pedirListaCuadros()
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.modificar: ${ex}`
      })
  }

  /** Elimina un cuadro
  		@param cuadro {Cuadro} Cuadro a eliminar
   */
  pedirEliminarCuadro(cuadro) {
    Ajax.pedir(configuracion.fachada + '/cuadro', 'borrar', {'id': cuadro.id}, 'GET')
      .then(respuesta =>
        respuesta.json())
      .then(respuesta => {
        if (respuesta.resultado == 'OK')
          this.pedirListaCuadros()
          //this.vistas.get('listaCuadros').cargarCuadros(respuesta.datos)
        else
          throw (respuesta.mensaje)
      })
      .catch(ex => {
        throw `ERROR en Modigliani.pedirEliminarCuadros: ${ex}`
      })
  }

  /** Elimina los elementos hijos de un nodo.
  	@param nodoPadre {Node} Nodo del que se eliminarán los hijos.
  **/
  vaciar(nodoPadre) {
    while (nodoPadre.lastElementChild)
      nodoPadre.removeChild(nodoPadre.lastElementChild)
  }

}

var app = new Modigliani()
