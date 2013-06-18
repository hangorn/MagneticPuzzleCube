/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: OptionsView.js
 *  Sinopsis: Clase de la vista de las opciones del juego.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 02-03-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE OPTIONSVIEW
 *  */
function OptionsView ()
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Contenedor con el formulario para las opciones
    var formCont;

    //Controlador asociado
    var optC;
    //Objeto con las opciones
    var op;


/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase OptionsView.
 * Entradas:
 * Salidas:
 * */
 
    //Creamos el contenedor que contendra el formulario con las opciones
    formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '76%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    formCont.style.display = 'none';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'optionsForm';
    form.style.height = '100%'; //Colocamos la altura al 100% para que los hijos puedan calcular su altura con porcentajes
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Opciones';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos un contendor para la tabla de las opciones
    var tableCont = document.createElement('div');
    form.appendChild(tableCont);
    tableCont.style.width = '60%';
    tableCont.style.height = '70%';
    tableCont.style.margin = '0 20%';
    tableCont.style.overflow = 'auto';
    tableCont.style.backgroundColor = '#ffffff';
    //Creamos una tabla para ordenar las opciones
    var tablePadding = '10px 30px';
    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.height = '100%';
    table.border = "1";
    table.style.margin = '0 auto';
    tableCont.appendChild(table);
    
    //Creamos una opcion para la sensibilidad
    //Creamos una fila para la opcion
    var row = document.createElement('tr');
    table.appendChild(row);
    //Creamos una celda para el nombre de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    var sensitivityInf = document.createElement('span');
    sensitivityInf.innerHTML = 'sensibilidad de giro: ';
    cell.appendChild(sensitivityInf);
    //Creamos una celda para el control de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    var sensitivitySlide = document.createElement('input');
    sensitivitySlide.type = 'range';
    sensitivitySlide.name = 'sensitivitySlide';
    sensitivitySlide.min = '1';
    sensitivitySlide.max = '10';
    sensitivitySlide.step = '0.5';
    sensitivitySlide.style.margin = '20px';
    cell.appendChild(sensitivitySlide);
    var sensitivityText = document.createElement('input');
    sensitivityText.type = 'number';
    sensitivityText.name = 'sensitivityText';
    sensitivityText.size = '3';
    sensitivityText.min = '1';
    sensitivityText.max = '10';
    sensitivityText.maxlength = '2';
    cell.appendChild(sensitivityText);
    
    //Creamos una opcion para las pistas/ayuda con sonido
    //Creamos una fila para la opcion
    var row = document.createElement('tr');
    table.appendChild(row);
    //Creamos una celda para el nombre de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    var audioHelpLabel = document.createElement('label');
    audioHelpLabel.innerHTML = 'activar ayuda con sonidos: ';
    audioHelpLabel.htmlFor = 'audioHelpCheckID';
    cell.appendChild(audioHelpLabel);
    //Creamos una celda para el control de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    var audioHelpCheck = document.createElement('input');
    audioHelpCheck.type = 'checkbox';
    audioHelpCheck.name = 'audioHelpCheck';
    audioHelpCheck.id = 'audioHelpCheckID';
    cell.appendChild(audioHelpCheck);
    
    //Creamos una opcion para la funcion de movimiento/traslacion
    //Creamos una fila para la opcion
    var row = document.createElement('tr');
    table.appendChild(row);
    //Creamos una celda para el nombre de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    var text = document.createElement('span');
    text.innerHTML = 'mover (traslacion): ';
    cell.appendChild(text);
    //Creamos una celda para el control de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    //Boton izquierdo
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'movOptLeftClick';
    radio.name = 'movOpt';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'boton izquierdo';
    radioLabel.htmlFor = 'movOptLeftClick';
    cell.appendChild(radio);
    cell.appendChild(radioLabel);
    cell.innerHTML +="<br>";
    //Boton derecho
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'movOptRigthClick';
    radio.name = 'movOpt';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'boton derecho';
    radioLabel.htmlFor = 'movOptRigthClick';
    cell.appendChild(radio);
    cell.appendChild(radioLabel);
    
    //Creamos una opcion para la funcion de giro/rotacion
    //Creamos una fila para la opcion
    var row = document.createElement('tr');
    table.appendChild(row);
    //Creamos una celda para el nombre de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    var text = document.createElement('span');
    text.innerHTML = 'girar (rotacion): ';
    cell.appendChild(text);
    //Creamos una celda para el control de la opcion
    var cell = document.createElement('td');
    cell.style.padding = tablePadding;
    row.appendChild(cell);
    //Boton izquierdo
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'rotOptLeftClick';
    radio.name = 'rotOpt';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'boton izquierdo';
    radioLabel.htmlFor = 'rotOptLeftClick';
    cell.appendChild(radio);
    cell.appendChild(radioLabel);
    cell.innerHTML +="<br>";
    //Boton derecho
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'rotOptRigthClick';
    radio.name = 'rotOpt';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'boton derecho';
    radioLabel.htmlFor = 'rotOptRigthClick';
    cell.appendChild(radio);
    cell.appendChild(radioLabel);
    
    //Añadimos los botones
    var acceptButton = document.createElement('input');
    acceptButton.type = 'button';
    acceptButton.name = 'accept';
    acceptButton.value = 'aceptar';
    acceptButton.style.position = 'absolute';
    acceptButton.style.bottom = '-13%';
    acceptButton.style.left = '60%';
    form.appendChild(acceptButton);
    
    var cancelButton = document.createElement('input');
    cancelButton.type = 'button';
    cancelButton.name = 'cancel';
    cancelButton.value = 'cancelar';
    cancelButton.style.position = 'absolute';
    cancelButton.style.bottom = '-13%';
    cancelButton.style.right = '60%';
    form.appendChild(cancelButton);
    
    //Creamos el objeto de opciones
    op = new Options();
 
 
 /*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: show
 * Sinopsis: Método para mostrar en la interfaz todos los elementos de la vista.
 * Entradas:
 *      -Callback:endAction -> función de rellamada que se ejecutará al
 *      terminar con las opciones tanto aceptar como cancelar, de
 *      esta forma se mostrará el estado anterior, sea cual sea.
 * Salidas:
 * */
this.show = function (endAction)
{
    //Mostramos la interfaz
    formCont.style.display = 'block';
    //Si no tenemos un controlador asociado
    if(optC == undefined)
    {
        //Creamos el controlador asociado
        optC = new OptionsController(formCont, op, endAction);
    }
    else
    {
        //Si ya lo tenemos, activamos el controlador asociado
        optC.enable(endAction);
    }
    
}

/*
 * Nombre: hide
 * Sinopsis: Método para eliminar de la interfaz todos los elementos de la vista, ocultarlos.
 * Entradas:
 * Salidas:
 * */
this.hide = function ()
{
    //Ocultamos la interfaz
    formCont.style.display = 'none';
    //Deshabilitamos el controlador asociado
    optC.remove();
}

/*
 * Nombre: getOptions
 * Sinopsis: Método para obtener el objeto con las opciones actuales del juego.
 * Entradas:
 * Salidas:
 *      -Options -> objeto de la clase Options que contiene las opciones actuales del juego.
 * */
this.getOptions = function ()
{
    return op;
}

}