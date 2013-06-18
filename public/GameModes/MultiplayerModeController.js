/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: MultiplayerModeController.js
 *  Sinopsis: Clase del controlador del modo clásico.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 06-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE MULTIPLAYERMODECONTROLLER
 *  */
function MultiplayerModeController (cont, numC, mats, cl, ty)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Numero de piezas que tendra el puzzle
    var numberOfCubes;
    //Materiales con los que esta hecho el puzzle
    var materials;
    //Tipo de partida multijugador
    var type;
    
    //Reloj
    var clock;
 

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase MultiplayerModeController.
 * Entradas:
 *      -HTMLElement:cont-> contendor con todos los elementos de la vista.
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicará mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 *      -Clock:cl -> objeto de la clase Clock con la que se cronometrará el tiempo.
 * Salidas:
 * */

    numberOfCubes = numC;
    materials = mats;
    clock = cl;
    type = ty;
    
    //Registramos el evento de la pulsación del boton de ir al menu
    cont.getElementsByTagName('form')[0].menu.addEventListener( 'click', onMenuClick, false );
    //Registramos el evento de la pulsación del boton de pausar
    cont.getElementsByTagName('form')[0].options.addEventListener( 'click', onOptionsClick, false );
    
 
/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onMenuClick
 * Sinopsis: Manejador del evento de pulsación del botón de ir al menu principal.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMenuClick(event)
{
    //Confirmamos que se desea salir
    if(confirm('Esta seguro que desea salir?'))
    {
        mmv.hide();
        mv.showMenu(0);
        //Si el puzzle esta resuelto
        if(!mmv.isDone())
            socket.finishedGame();
    }
}

/*
 * Nombre: onOptionsClick
 * Sinopsis: Manejador del evento de pulsación del botón de opciones.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onOptionsClick(event)
{
    //Eliminamos de la vista el actual modo de juego
    mmv.hide();
    //Mostramos el dialogo de opciones
    ov.show(function()
    {
        //Mostramos la vista del modo clasico
        mmv.show()
        //Actualizamos la opcion de ayuda con sonidos segun corresponda
        if(ov.getOptions().getAudioHelp())
            sound.enableHelpSound();
        else
            sound.disableHelpSound();
    });
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
    cont.getElementsByTagName('form')[0].menu.removeEventListener( 'click', onMenuClick, false );
    cont.getElementsByTagName('form')[0].options.removeEventListener( 'click', onOptionsClick, false );
}

/*
 * Nombre: enable
 * Sinopsis: Método que habilita el controlador. Registra los eventos necesarios.
 * Entradas:
 * Salidas:
 * */
this.enable = function()
{
    //Registramos los receptores de eventos de los botones
    cont.getElementsByTagName('form')[0].menu.addEventListener( 'click', onMenuClick, false );
    cont.getElementsByTagName('form')[0].options.addEventListener( 'click', onOptionsClick, false );
}
 
}