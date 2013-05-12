/*
 *  Nombre: Options.js
 *  Sinopsis: Clase del modelo que se encargará de la lógica de negocio para las opciones.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 14-03-2013
 *  Versión: 0.2
 *  Fecha: 03-03-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE OPTIONS
 *  */
function Options (cont)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Opción de sensibilidad del ratón en el giro
    var sensitivity;
    //Opción de ayuda con sonidos
    var audioHelp;
    //Botón izquierdo = 0
    //Botón central   = 1
    //Botón derecho   = 2
    //Opción para indicar el boton del ratón que se utilizará para mover
    var movButton;
    //Opción para indicar el boton del ratón que se utilizará para girar
    var rotButton;
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase OptionsView.
 * Entradas:
 * Salidas:
 * */
    
    //Iniciamos las opciones a los valores por defecto
    sensitivity = 5;
    audioHelp = false;
    movButton = 0;
    rotButton = 2;
    
 
/*****************************************
 *  Métodos Privados
 *****************************************/

 
/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: setSensitivity
 * Sinopsis: Método para cambiar el valor de la sensibilidad por el proporcionado.
 * Entradas:
 *      -Float:sens -> nueva sensivilidad que se guardará.
 * Salidas:
 * */
this.setSensitivity = function(sens)
{
    sensitivity = sens;
}

/*
 * Nombre: getSensitivity
 * Sinopsis: Método para obtener la opción de sensibilidad.
 * Entradas:
 * Salidas:
 *      -Float -> sensibilidad actual.
 * */
this.getSensitivity = function()
{
    return sensitivity;    
}

/*
 * Nombre: setAudioHelp
 * Sinopsis: Método para cambiar el estado de la opción de ayuda con sonidos.
 * Entradas:
 *      -Boolean:help -> booleano que indica si se activará o no la ayuda con sonidos.
 * Salidas:
 * */
this.setAudioHelp = function(help)
{
    audioHelp = help;    
}

/*
 * Nombre: getAudioHelp
 * Sinopsis: Método para obtener el estado de la opción de ayuda con sonidos.
 * Entradas:
 * Salidas:
 *      -Boolean -> booleano que indica si esta activada o no la ayuda con sonidos.
 * */
this.getAudioHelp = function()
{
    return audioHelp;    
}

/*
 * Nombre: setMovOpt
 * Sinopsis: Método para cambiar el estado de la opción del botón de movimiento.
 * Entradas:
 *      -Integer:button -> índice que indicará el botón del ratón con el que se
 *      moverán las piezas. Botón izquierdo=0, Botón central=1, Botón derecho=2.
 * Salidas:
 * */
this.setMovOpt = function(button)
{
    movButton = button;    
}

/*
 * Nombre: getMovOpt
 * Sinopsis: Método para obtener el estado de la opción del botón de movimiento.
 * Entradas:
 * Salidas:
 *      -Integer -> índice que indicará el botón del ratón con el que se
 *      moverán las piezas. Botón izquierdo=0, Botón central=1, Botón derecho=2.
 * */
this.getMovOpt = function()
{
    return movButton;    
}

/*
 * Nombre: setRotOpt
 * Sinopsis: Método para cambiar el estado de la opción del botón de rotación.
 * Entradas:
 *      -Integer:button -> índice que indicará el botón del ratón con el que se
 *      girarán las piezas. Botón izquierdo=0, Botón central=1, Botón derecho=2.
 * Salidas:
 * */
this.setRotOpt = function(button)
{
    rotButton = button;    
}

/*
 * Nombre: getRotOpt
 * Sinopsis: Método para obtener el estado de la opción del botón de rotación.
 * Entradas:
 * Salidas:
 *      -Integer -> índice que indicará el botón del ratón con el que se
 *      girarán las piezas. Botón izquierdo=0, Botón central=1, Botón derecho=2.
 * */
this.getRotOpt = function()
{
    return rotButton;    
}
    
}