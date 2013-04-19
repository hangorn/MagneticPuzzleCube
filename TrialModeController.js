/*
 *  Nombre: TrialModeController.js
 *  Sinopsis: Clase del controlador del modo contrareloj.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 03-04-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE TRIALMODECONTROLLER
 *  */
function TrialModeController (cont, numC, diff, mats, cl)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Numero de piezas que tendra el puzzle
    var numberOfCubes;
    //Dificultad del puzzle
    var difficulty;
    //Materiales con los que esta hecho el puzzle
    var materials;
    
    //Reloj
    var clock;
    
    //Flag para saber si se ha acabado el tiempo
    var overTime = false;
    
    //Referencia a la ventana abierta
    var solWin;
    //Flag para saber si se esta mostrando la solucion parcial
    var showingSolution = false;
 

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase TrialModeController.
 * Entradas:
 *      -HTMLElement:cont-> contendor con todos los elementos de la vista.
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicará mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Integer:diff -> entero que identificará la dificultad: 0->facil, 1->medio, 2->dificil, 3->imposible.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 *      -Clock:cl -> objeto de la clase Clock con la que se cronometrará el tiempo.
 * Salidas:
 * */

    numberOfCubes = numC;
    difficulty = diff;
    materials = mats;
    clock = cl;
    
    //Registramos el evento de la pulsación del boton de mostrar todas las soluciones
    cont.getElementsByTagName('form')[0].showSolutions.addEventListener( 'click', onShowSolutionsClick, false );
    //Registramos el evento de la pulsación del boton de mostrar la posible solución
    cont.getElementsByTagName('form')[0].showSolution.addEventListener( 'click', onShowSolutionClick, false );
    //Registramos el evento de la pulsación del boton de colocar una pieza en el puzzle
    cont.getElementsByTagName('form')[0].placeCube.addEventListener( 'click', onPlaceCubeClick, false );
    //Registramos el evento de la pulsación del boton de ir al menu
    cont.getElementsByTagName('form')[0].menu.addEventListener( 'click', onMenuClick, false );
    //Registramos el evento de la pulsación del boton de reiniciar
    cont.getElementsByTagName('form')[0].restart.addEventListener( 'click', onRestartClick, false );
    //Registramos el evento de la pulsación del boton de pausar
    cont.getElementsByTagName('form')[0].options.addEventListener( 'click', onOptionsClick, false );
    //Registramos el evento de la pulsación del boton de pausar
    cont.getElementsByTagName('form')[0].pause.addEventListener( 'click', onPauseClick, false );
    
 
/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onShowSolutionsClick
 * Sinopsis: Manejador del evento de pulsación del botón de mostrar todas las soluciones.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onShowSolutionsClick(event)
{
    window.mats = materials;
    window.numC = numberOfCubes;
    window.sensitivity = ov.getOptions().getSensitivity();
    solWin = window.open("solutionsWindow.html", "solutionsWindow", "width=300,height="+window.screen.availHeight+",left="+(window.screen.availWidth-300));    
}

/*
 * Nombre: onShowSolutionClick
 * Sinopsis: Manejador del evento de pulsación del botón de mostrar la posible solución.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onShowSolutionClick(event)
{
    if(showingSolution)
    {
        pv.hideSolution();
        cont.getElementsByTagName('form')[0].showSolution.value = 'mostrar una posible solucion';
        showingSolution = false;
    }
    else
    {
        pv.showSolution();
        cont.getElementsByTagName('form')[0].showSolution.value = 'ocultar la posible solucion';
        showingSolution = true;
        if(!overTime) clock.addTime(20);
    }
}

/*
 * Nombre: onPlaceCubeClick
 * Sinopsis: Manejador del evento de pulsación del botón de colocar una pieza en el puzzle.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onPlaceCubeClick(event)
{
    if(!overTime)
    {
        pv.placeCube();
        clock.addTime(40);
    }
}

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
        tmv.hide();
        mv.showMenu(0);
    }
}

/*
 * Nombre: onMenuClick
 * Sinopsis: Manejador del evento de pulsación del botón de reiniciar el juego.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onRestartClick(event)
{
    //Confirmamos que se desea reiniciar
    if(confirm('Esta seguro que desea reiniciar?'))
    {
        //Eliminamos de la vista el actual modo de juego
        tmv.hide();
        //Creamos otro igual
        tmv = new TrialModeView(scene, numberOfCubes, difficulty, materials);
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
    tmv.hide();
    //Mostramos el dialogo de opciones, indicandole la accion que tendra
    //que hacer cuando se oculten las opciones
    ov.show(function()
    {
        //Mostramos la vista del modo supervivencia
        tmv.show()
        //Actualizamos la opcion de ayuda con sonidos segun corresponda
        if(ov.getOptions().getAudioHelp())
            sound.enableHelpSound();
        else
            sound.disableHelpSound();
    });
}

/*
 * Nombre: onPauseClick
 * Sinopsis: Manejador del evento de pulsación del botón de pausa.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onPauseClick(event)
{
    tmv.pause();
}


 /*****************************************
 *  Métodos Públicos
 *****************************************/
/*
 * Nombre: remove
 * Sinopsis: Método que elimina el controlador. Lo único que hace es eliminar
 *          los manejadores de eventos que tiene registrados.
 * Entradas:
 * Salidas:
 * */
this.remove = function()
{
    //Eliminamos los receptores de eventos de los botones
    cont.getElementsByTagName('form')[0].showSolutions.removeEventListener( 'click', onShowSolutionsClick, false );
    cont.getElementsByTagName('form')[0].showSolution.removeEventListener( 'click', onShowSolutionClick, false );
    cont.getElementsByTagName('form')[0].placeCube.removeEventListener( 'click', onPlaceCubeClick, false );
    cont.getElementsByTagName('form')[0].menu.removeEventListener( 'click', onMenuClick, false );
    cont.getElementsByTagName('form')[0].restart.removeEventListener( 'click', onRestartClick, false );
    cont.getElementsByTagName('form')[0].options.removeEventListener( 'click', onOptionsClick, false );
    cont.getElementsByTagName('form')[0].pause.removeEventListener( 'click', onPauseClick, false );
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
    cont.getElementsByTagName('form')[0].showSolutions.addEventListener( 'click', onShowSolutionsClick, false );
    cont.getElementsByTagName('form')[0].showSolution.addEventListener( 'click', onShowSolutionClick, false );
    cont.getElementsByTagName('form')[0].placeCube.addEventListener( 'click', onPlaceCubeClick, false );
    cont.getElementsByTagName('form')[0].menu.addEventListener( 'click', onMenuClick, false );
    cont.getElementsByTagName('form')[0].restart.addEventListener( 'click', onRestartClick, false );
    cont.getElementsByTagName('form')[0].options.addEventListener( 'click', onOptionsClick, false );
    cont.getElementsByTagName('form')[0].pause.addEventListener( 'click', onPauseClick, false );
}

/*
 * Nombre: timeIsOver
 * Sinopsis: Método para indicar al controlador que el tiempo se ha acabado.
 * Entradas:
 * Salidas:
 * */
this.timeIsOver = function()
{
    overTime = true;
}
 
}