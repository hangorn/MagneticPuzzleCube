/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: OptionsController.js
 *  Sinopsis: Clase controlador que se encargará de manejar lo eventos de las opciones.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 03-03-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE OPTIONSCONTROLLER
 *  */
function OptionsController (cont, opt, endAct)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Contenedor con el formulario para las opciones
    var formCont;
    //Accción que se ejecutará al finalizar la selección de opciones, tanto
    //con cancelar como con aceptar
    var endAction;

    //Valor de la sensibilidad antes de cambiarla
    var previousSensivility;
    
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase OptionsController.
 * Entradas:
 *      -HTMLElement:cont -> contenedor con todos los elementos de la vista.
 *      -Optiones:opt -> objeto de la clase options donde se guardarán las opciones.
 *      -Callback:endAct -> función de rellamada que se ejecutará al
 *      terminar con las opciones tanto aceptar como cancelar, de
 *      esta forma se mostrará el estado anterior, sea cual sea.
 * Salidas:
 * */
    
    //Guardamos la accion que se ejecutará al finalizar
    endAction = endAct;
    
    //Registramos el evento de modificacion del slide de la sensibilidad
    cont.getElementsByTagName('form')[0].sensitivitySlide.addEventListener( 'change', onSensitivitySlideChange, false );
    //Registramos el evento de modificacion del texto de la sensibilidad
    cont.getElementsByTagName('form')[0].sensitivityText.addEventListener( 'change', onSensitivityTextChange, false );
    //Registramos el evento de modificacion de la seleccion del boton de movimiento
    cont.getElementsByTagName('form')[0].movOpt[0].addEventListener( 'change', onMovOptChange, false );
    cont.getElementsByTagName('form')[0].movOpt[1].addEventListener( 'change', onMovOptChange, false );
    //Registramos el evento de modificacion de la seleccion del boton de movimiento
    cont.getElementsByTagName('form')[0].rotOpt[0].addEventListener( 'change', onRotOptChange, false );
    cont.getElementsByTagName('form')[0].rotOpt[1].addEventListener( 'change', onRotOptChange, false );
    //Registramos el evento de la pulsación del boton de cancelar
    cont.getElementsByTagName('form')[0].cancel.addEventListener( 'click', onCancelClick, false );
    //Registramos el evento de la pulsación del boton de aceptar
    cont.getElementsByTagName('form')[0].accept.addEventListener( 'click', onAcceptClick, false );
    
    //Iniciamos los elementos con los valores por defecto de las opciones
    cont.getElementsByTagName('form')[0].sensitivitySlide.value = opt.getSensitivity();
    cont.getElementsByTagName('form')[0].sensitivityText.value = opt.getSensitivity();
    previousSensivility = opt.getSensitivity();
    cont.getElementsByTagName('form')[0].audioHelpCheck.checked = opt.getAudioHelp();
    if(opt.getMovOpt() == 0)
        cont.getElementsByTagName('form')[0].movOpt[0].checked = true;
    else
        cont.getElementsByTagName('form')[0].movOpt[1].checked = true;
    if(opt.getRotOpt() == 0)
        cont.getElementsByTagName('form')[0].rotOpt[0].checked = true;
    else
        cont.getElementsByTagName('form')[0].rotOpt[1].checked = true;
 
/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onSensitivitySlideChange
 * Sinopsis: Manejador del evento de cambio en el slide de la sensibilidad.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onSensitivitySlideChange(event)
{
    //Actualizamos el texto y guardamos la sensibilidad
    previousSensivility = cont.getElementsByTagName('form')[0].sensitivityText.value = event.target.value;
}
    
/*
 * Nombre: onSensitivityTextChange
 * Sinopsis: Manejador del evento de cambio en el texto de la sensibilidad.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onSensitivityTextChange(event)
{
    //Comprobamos que el texto introducido sea un valor valido
    if(parseFloat(event.target.value) != NaN &&
       parseFloat(event.target.value) <= cont.getElementsByTagName('form')[0].sensitivityText.max
    && parseFloat(event.target.value) >= cont.getElementsByTagName('form')[0].sensitivityText.min)
    {
        previousSensivility = cont.getElementsByTagName('form')[0].sensitivitySlide.value = event.target.value;
    }
    else
    {
        event.target.value = cont.getElementsByTagName('form')[0].sensitivitySlide.value = previousSensivility;
    }
}

/*
 * Nombre: onMovOptChange
 * Sinopsis: Manejador del evento de cambio en la seleccion del botón de giro.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMovOptChange(event)
{
    //Comprobamos si el elemento seleccionado es el boton izquierdo
    if(event.target == cont.getElementsByTagName('form')[0].movOpt[0])
        //Seleccionamos el boton derecho para el giro
        cont.getElementsByTagName('form')[0].rotOpt[1].checked = true;
    //Si no es el izquierdo, entonces es el derecho
    else
        //Seleccionamos el boton derecho para el giro
        cont.getElementsByTagName('form')[0].rotOpt[0].checked = true;
}

/*
 * Nombre: onRotOptChange
 * Sinopsis: Manejador del evento de cambio en la seleccion del botón de movimiento.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onRotOptChange(event)
{
    //Comprobamos si el elemento seleccionado es el boton izquierdo
    if(event.target == cont.getElementsByTagName('form')[0].rotOpt[0])
        //Seleccionamos el boton derecho para el giro
        cont.getElementsByTagName('form')[0].movOpt[1].checked = true;
    //Si no es el izquierdo, entonces es el derecho
    else
        //Seleccionamos el boton derecho para el giro
        cont.getElementsByTagName('form')[0].movOpt[0].checked = true;
}

    
/*
 * Nombre: onCancelClick
 * Sinopsis: Manejador del evento de pulsación del botón de cancelar.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onCancelClick(event)
{
    //Ocultamos la vista
    ov.hide();
    //Ejecutamos la acción suministrada
    endAction();
}
    
/*
 * Nombre: onAcceptClick
 * Sinopsis: Manejador del evento de pulsación del botón de aceptar.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onAcceptClick(event)
{
    //Ocultamos la vista
    ov.hide();
    //Guardamos las opciones
    saveOptions();
    //Ejecutamos la acción suministrada
    endAction();
}

/*
 * Nombre: saveOptions
 * Sinopsis: Método para guardar las opciones en el objeto Options.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function saveOptions()
{
    //Guardamos la sensibilidad
    opt.setSensitivity(cont.getElementsByTagName('form')[0].sensitivitySlide.value);
    //Guardamos si estará activada la ayudo con sonidos
    opt.setAudioHelp(cont.getElementsByTagName('form')[0].audioHelpCheck.checked);
    //Guardamos las opciones de los botones del raton
    //Si esta seleccionado el boton izquierdo como control de movimiento, y por tanto
    //el boton derecho como control de giro
    if(cont.getElementsByTagName('form')[0].movOpt[0].checked)
    {
        //Guardamos el boton de movimiento
        opt.setMovOpt(0);
        //Guardamos el boton de giro
        opt.setRotOpt(2);
    }
    else
    {
        //Guardamos el boton de movimiento
        opt.setMovOpt(2);
        //Guardamos el boton de giro
        opt.setRotOpt(0);
    }    
}


/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: remove
 * Sinopsis: Método que elimina el controlador. Lo único que hace es eliminar los manejadores de eventos que tiene registrados.
 * Entradas:
 * Salidas:
 * */
this.remove = function()
{
    //Eliminamos los receptores de eventos de los botones
    cont.getElementsByTagName('form')[0].sensitivitySlide.removeEventListener( 'change', onSensitivitySlideChange, false );
    cont.getElementsByTagName('form')[0].sensitivityText.removeEventListener( 'change', onSensitivityTextChange, false );
    cont.getElementsByTagName('form')[0].cancel.removeEventListener( 'click', onCancelClick, false );
    cont.getElementsByTagName('form')[0].accept.removeEventListener( 'click', onAcceptClick, false );
}

/*
 * Nombre: enable
 * Sinopsis: Método que habilita el controlador. Registra los eventos necesarios.
 * Entradas:
 *      -Callback:endAct -> función de rellamada que se ejecutará al
 *      terminar con las opciones tanto aceptar como cancelar, de
 *      esta forma se mostrará el estado anterior, sea cual sea.
 * Salidas:
 * */
this.enable = function(endAct)
{
    //Guardamos la accion que se ejecutará al finalizar
    endAction = endAct;
    
    //Registramos los receptores de eventos de los botones
    cont.getElementsByTagName('form')[0].sensitivitySlide.addEventListener( 'change', onSensitivitySlideChange, false );
    cont.getElementsByTagName('form')[0].sensitivityText.addEventListener( 'change', onSensitivityTextChange, false );
    cont.getElementsByTagName('form')[0].cancel.addEventListener( 'click', onCancelClick, false );
    cont.getElementsByTagName('form')[0].accept.addEventListener( 'click', onAcceptClick, false );
    
    //Iniciamos los elementos con los valores que ya tenian las opciones
    cont.getElementsByTagName('form')[0].sensitivitySlide.value = opt.getSensitivity();
    cont.getElementsByTagName('form')[0].sensitivityText.value = opt.getSensitivity();
    previousSensivility = opt.getSensitivity();
    cont.getElementsByTagName('form')[0].audioHelpCheck.checked = opt.getAudioHelp();
}

}