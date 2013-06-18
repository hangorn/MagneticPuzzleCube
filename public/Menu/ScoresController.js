/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: ScoresController.js
 *  Sinopsis: Clase controlador que se encargará de manejar lo eventos de las puntuaciones.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 12-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE SCORESCONTROLLER
 *  */
function ScoresController (cont, modesCont, submodes)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    
    
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase ScoresController.
 * Entradas:
 *      -HTMLElement:cont -> contenedor con todos los elementos de la vista.
 *      -HTMLElement:modesCont -> contenedor con las pestañas de los modos.
 *      -HTMLElement[][]:submodes ->  array con los submodos.
 * Salidas:
 * */
    
    //Registramos los eventos de seleccion de los modos
    for(var i=0; i<modesCont.getElementsByTagName('div').length; i++)
        modesCont.getElementsByTagName('div')[i].addEventListener( 'click', onModeClick, false );
    
    //Registramos los eventos de seleccion de los submodos
    for(var i=0; i<submodes.length; i++)
        for(var j=0; j<submodes[i].length; j++)
            submodes[i][j].addEventListener( 'click', onSubmodeClick, false );

 
/*****************************************
 *  Métodos Privados
 *****************************************/
    
/*
 * Nombre: onModeClick
 * Sinopsis: Manejador del evento de pulsación en un modo.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onModeClick(event)
{
    //Mostramos el modo seleccionado
    sv.showMode(event.currentTarget.id);
}
    
/*
 * Nombre: onSubmodeClick
 * Sinopsis: Manejador del evento de pulsación en un submodo.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onSubmodeClick(event)
{
    //Mostramos el modo seleccionado
    sv.showSubmode(event.currentTarget.id);
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
    //Registramos los eventos de seleccion de los modos
    for(var i=0; i<modesCont.getElementsByTagName('div').length; i++)
        modesCont.getElementsByTagName('div')[i].removeEventListener( 'click', onModeClick, false );
    
    //Registramos los eventos de seleccion de los submodos
    for(var i=0; i<submodes.length; i++)
        for(var j=0; j<submodes[i].length; j++)
            submodes[i][j].removeEventListener( 'click', onSubmodeClick, false );
}

/*
 * Nombre: enable
 * Sinopsis: Método que habilita el controlador. Registra los eventos necesarios.
 * Entradas:
 * Salidas:
 * */
this.enable = function()
{
    //Registramos los eventos de seleccion de los modos
    for(var i=0; i<modesCont.getElementsByTagName('div').length; i++)
        modesCont.getElementsByTagName('div')[i].addEventListener( 'click', onModeClick, false );
    
    //Registramos los eventos de seleccion de los submodos
    for(var i=0; i<submodes.length; i++)
        for(var j=0; j<submodes[i].length; j++)
            submodes[i][j].addEventListener( 'click', onSubmodeClick, false );
}

}