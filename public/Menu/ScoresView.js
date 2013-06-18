/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: ScoresView.js
 *  Sinopsis: Clase de la vista de las puntuaciones del juego.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 12-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE SCORESVIEW
 *  */
function ScoresView ()
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Contenedor con el formulario para las puntuaciones
    var formCont;

    //Controlador asociado
    var scoC;
    
    //Contenedor para la selecciona de modos
    var modesCont;
    //Contenedor con los modos de juego
    var submodesCont;
    //Array que contendra todos los submodos de juego,
    //un elemento para cada modo de juego que contendra
    //todos los submodos de un modo
    var submodes = [];
    //Contenedor para las puntuaciones
    var scoresTable;
    
    //Color de pestaña seleccionada
    var selectedTabColor = '#808080';
    //Ultima pestaña seleccionada de los modos
    var lastModeSelected;
    //Ultima pestaña seleccionada de los submodos
    var lastSubmodeSelected;
    
    //Contenedor para el diálogo de guardar puntuación
    var saveScoreCont;
    //Imagen para indicar que se estan cargando las puntuaciones
    var loadingImg;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase ScoresView.
 * Entradas:
 * Salidas:
 * */
 
    //Creamos el contenedor que contendra el formulario con las puntuaciones
    formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '85%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'scoresForm';
    form.style.height = '100%'; //Colocamos la altura al 100% para que los hijos puedan calcular su altura con porcentajes
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Puntuaciones';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos un contendor para los modos de juego
    modesCont = document.createElement('div');
    form.appendChild(modesCont);
    modesCont.style.width = '80%';
    modesCont.style.margin = '0 10%';
    modesCont.style.display = 'inline-block';
    modesCont.style.borderBottom = '1px solid black';
    //Creamos un contendor para los submodos de juego
    submodesCont = document.createElement('div');
    form.appendChild(submodesCont);
    submodesCont.style.width = '80%';
    submodesCont.style.margin = '0 10%';
    submodesCont.style.display = 'inline-block';
    submodesCont.style.borderBottom = '1px solid black';
    //Creamos las pestañas con los distintos modos de juego
    createModes();
    
    //Creamos un contendor para mostrar las puntuaciones
    var scoresCont = document.createElement('div');
    form.appendChild(scoresCont);
    scoresCont.style.width = '80%';
    scoresCont.style.height = '55%';
    scoresCont.style.margin = '0 10%';
    scoresCont.style.overflow = 'auto';
    scoresCont.style.backgroundColor = '#ffffff';
    //Creamos una tabla donde meteremos las puntuaciones
    scoresTable = document.createElement('table');
    scoresTable.border = "1";
    scoresTable.style.width = '100%';
    scoresTable.style.margin = '0';
    scoresCont.appendChild(scoresTable);
    //Creamos la cabecera para indicar el significado de cada campo de informacion de la partida
    var row = document.createElement('tr');
    row.style.backgroundColor = '#dddddd';
    row.head = true;
    scoresTable.appendChild(row);
    var header = document.createElement('th');
    header.innerHTML = "Nombre";
    row.appendChild(header);
    var header = document.createElement('th');
    header.innerHTML = "Puntuacion";
    row.appendChild(header);
    var header = document.createElement('th');
    header.innerHTML = "Fecha";
    row.appendChild(header);
    
    //Creamos una imagenes para indicar que se están cargando las puntuaciones
    loadingImg = document.createElement('img');
    loadingImg.src = "img/loading.gif";
    loadingImg.style.width = '10%';
    loadingImg.style.margin = '0 45%';
    
    scoC = new ScoresController(formCont, modesCont, submodes);


/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: createModeTab
 * Sinopsis: Método para crear una pestaña con el nombre de un modo.
 * Entradas:
 *      -String:name -> nombre del modo con el que se creará la pestaña.
 * Salidas:
 * */
function createModeTab(name)
{
    var tab = document.createElement('div');
    tab.style.border = '3px outset black';
    tab.style.borderTopLeftRadius = '7px';
    tab.style.borderTopRightRadius = '7px';
    tab.style.margin = '0';
    tab.style.padding = '0 5px';
    tab.style.cssFloat = 'left';
    tab.className = 'clickable';
    tab.innerHTML = name;
    return tab;
}

/*
 * Nombre: createModes
 * Sinopsis: Método para crear las pestañas para mostrar
 *          las puntuaciones de todos los modos.
 * Entradas:
 * Salidas:
 * */
function createModes()
{
    //Creamos los modo principales
    modesCont.appendChild(createModeTab("Clasico"));
    modesCont.appendChild(createModeTab("Niveles"));
    modesCont.appendChild(createModeTab("Contrareloj"));
    modesCont.appendChild(createModeTab("Supervivencia"));
    modesCont.appendChild(createModeTab("Multijugador"));
    //Guardamos los ids de los modos
    for(var i=0; i<modesCont.childNodes.length; i++)
        modesCont.childNodes[i].id = i;
        
    //Creamos los submodos
    //Del modo clasico
    var sub = [];
    sub.push(createModeTab("27 Cubos"));
    sub.push(createModeTab("8 Cubos"));
    submodes.push(sub);
    //Del modo niveles
    var sub = [];
    for(var i=1; i<=16; i++)
        sub.push(createModeTab("Nivel "+i));
    submodes.push(sub);
    //Del modo contrareloj
    var sub = [];
    sub.push(createModeTab("Facil 27 Cubos"));
    sub.push(createModeTab("Facil 8 Cubos"));
    sub.push(createModeTab("Medio 27 Cubos"));
    sub.push(createModeTab("Medio 8 Cubos"));
    sub.push(createModeTab("Dificil 27 Cubos"));
    sub.push(createModeTab("Dificil 8 Cubos"));
    sub.push(createModeTab("Imposible 27 Cubos"));
    sub.push(createModeTab("Imposible 8 Cubos"));
    submodes.push(sub);
    //Del modo supervivencia
    var sub = [];
    sub.push(createModeTab("Facil 27 Cubos"));
    sub.push(createModeTab("Facil 8 Cubos"));
    sub.push(createModeTab("Medio 27 Cubos"));
    sub.push(createModeTab("Medio 8 Cubos"));
    sub.push(createModeTab("Dificil 27 Cubos"));
    sub.push(createModeTab("Dificil 8 Cubos"));
    sub.push(createModeTab("Imposible 27 Cubos"));
    sub.push(createModeTab("Imposible 8 Cubos"));
    submodes.push(sub);
    //Del modo multijugador
    var sub = [];
    sub.push(createModeTab("Cooperativo 8 Cubos"));
    sub.push(createModeTab("Cooperativo 27 Cubos"));
    sub.push(createModeTab("Contrareloj 8 Cubos"));
    sub.push(createModeTab("Contrareloj 27 Cubos"));
    submodes.push(sub);    
    //Guardamos los ids de los submodos
    for(var i=0; i<submodes.length; i++)
        for(var j=0; j<submodes[i].length; j++)
            submodes[i][j].id = j;
}

/*
 * Nombre: addScore
 * Sinopsis: Método para añadir una puntuacion al contenedor de puntuaciones.
 * Entradas:
 *      -Score:score-> objeto que contiene la información de la puntuación.
 * Salidas:
 * */
function addScore(score)
{
    //Creamos una fila para la puntuacion
    var row = document.createElement('tr');
    
    //Creamos una funcion para crear un dato de la puntuacion
    var makeData = function (data)
    {
        var cell = document.createElement('td');
        cell.innerHTML = data;
        return cell;
    }
    //Si no es un modo multijugador
    if(score.mode != 4)
        //Añadimos el nombre
        row.appendChild(makeData(score.name));
    else
    {
        var n;
        var names = score.name.split("#");
        //Si es el modo cooperativo
        if(score.submode == 0 || score.submode == 1)
        {
            n = names[0]+' & '+names[1];
        }
        //Si es el modo multijugador cooperativo
        else if(score.submode == 2 || score.submode == 3)
        {
            n = '<span style="color:#00aa00">'+names[0]+'</span> vs <span style="color:#ff0000">'+names[1]+'</span>';
        }
        //Añadimos el nombre
        row.appendChild(makeData(n));
    }
    //Si es el modo supervivencia
    if(score.mode == 3)
        //Mostramos los puzzles solucionados
        row.appendChild(makeData(""+score.score+(score.score==1 ? " puzzle" : " puzzles")));
    else
    {
        //Calculamos la puntuacion
        var sc = "";
        var sec = score.score % 60;
        if(sec < 10)
            sec = '0'+sec;
        var min = Math.floor(score.score/60) % 60;
        if(min < 10)
            min = '0'+min;
        var hour = Math.floor(score.score/3600);
        if(hour != 0)
            sc+=hour+":";
        sc+=min+":"+sec;
        //Añadimos la puntuacion
        row.appendChild(makeData(sc));
    }
    //Añadimos la fecha
    row.appendChild(makeData(spanishDate(new Date(Date.parse(score.date)))));
    //Añadimos la partida al contenedor de partidas del formulario de buscar partida
    scoresTable.appendChild(row);
    
    return row;
}

/*
 * Nombre: showScores
 * Sinopsis: Método para mostrar las puntuaciones suministradas.
 * Entradas:
 *      -Score[]:scores-> array con objetos que contienen la información
 *      de las puntuaciones.
 * Salidas:
 * */
function showScores(scores)
{
    //Borramos las puntuaciones que habia antes
    clearScores();
    for(var i=0; i<scores.length; i++)
        addScore(scores[i]);
}

/*
 * Nombre: clearScores
 * Sinopsis: Método para borrar todos las puntuaciones que se estan mostrando.
 * Entradas:
 * Salidas:
 * */
function clearScores()
{
    while(scoresTable.getElementsByTagName('tr').length != 1)
    {
        if(scoresTable.getElementsByTagName('tr')[0].head)
            scoresTable.removeChild(scoresTable.getElementsByTagName('tr')[1]);
        else
            scoresTable.removeChild(scoresTable.getElementsByTagName('tr')[0]);
    }
    while(scoresTable.getElementsByTagName('img').length != 0)
    {
        scoresTable.removeChild(scoresTable.getElementsByTagName('img')[0]);
    }
}



/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: showSubmode
 * Sinopsis: Método para seleccionar el submodo indicado y sus puntuaciones.
 * Entradas:
 *      -Integer:submode-> indice con el submodo a mostrar.
 * Salidas:
 * */
this.showSubmode = function (submode)
{
    //Comprobamos que sea un modo correcto o que no este ya seleccionado
    if(submode < 0 || submode >= submodes[lastModeSelected].length)
        return
    
    //Marcamos el modo seleccionado
    submodes[lastModeSelected][submode].style.backgroundColor = selectedTabColor;
    submodes[lastModeSelected][submode].style.borderStyle = 'inset';
    submodes[lastModeSelected][submode].style.position = 'relative';
    submodes[lastModeSelected][submode].style.bottom = '5px';
    submodes[lastModeSelected][submode].style.color = 'white';
    //Si habia otro seleccionado lo deseleccionamos y si no es el mismo y si existe
    if(lastSubmodeSelected != undefined && lastSubmodeSelected != submode && lastSubmodeSelected < submodes[lastModeSelected].length)
    {
        submodes[lastModeSelected][lastSubmodeSelected].style.backgroundColor = 'inherit';
        submodes[lastModeSelected][lastSubmodeSelected].style.borderStyle = 'outset';
        submodes[lastModeSelected][lastSubmodeSelected].style.position = 'relative';
        submodes[lastModeSelected][lastSubmodeSelected].style.bottom = '0';
        submodes[lastModeSelected][lastSubmodeSelected].style.color = 'black';
    }
    //Guardamos el nuevo submodo
    lastSubmodeSelected = submode;
    
    //Si no tenemos conexion con el servidor la creamos
    if(socket == undefined)
        socket = new Socket();
    //Le decimos al servidor que nos proporcione las puntuaciones
    //cuando se consigan se mostraran
    socket.getScores(lastModeSelected, lastSubmodeSelected, function(scores) {showScores(scores);});
    
    //Ocultamos las puntuaciones que habia
    clearScores();
    //Y mostramos una imagen de cargando
    scoresTable.appendChild(loadingImg);
}

/*
 * Nombre: showMode
 * Sinopsis: Método para mostrar los submodos del modo indicado, tambien
 *          se mostraran las puntuaciones del primer submodo.
 * Entradas:
 *      -Integer:mode-> indice con el modo a mostrar.
 * Salidas:
 * */
this.showMode = function (mode)
{
    //Comprobamos que sea un modo correcto o que no este ya seleccionado
    if(mode < 0 || mode >= modesCont.getElementsByTagName('div').length || (lastModeSelected != undefined && mode == lastModeSelected))
        return
    
    //Marcamos el modo seleccionado
    modesCont.getElementsByTagName('div')[mode].style.backgroundColor = selectedTabColor;
    modesCont.getElementsByTagName('div')[mode].style.borderStyle = 'inset';
    modesCont.getElementsByTagName('div')[mode].style.position = 'relative';
    modesCont.getElementsByTagName('div')[mode].style.bottom = '4px';
    modesCont.getElementsByTagName('div')[mode].style.color = 'white';
    
    //Si habia otro seleccionado lo deseleccionamos
    if(lastModeSelected != undefined)
    {
        modesCont.getElementsByTagName('div')[lastModeSelected].style.backgroundColor = 'inherit';
        modesCont.getElementsByTagName('div')[lastModeSelected].style.borderStyle = 'outset';
        modesCont.getElementsByTagName('div')[lastModeSelected].style.position = 'relative';
        modesCont.getElementsByTagName('div')[lastModeSelected].style.bottom = '0';
        modesCont.getElementsByTagName('div')[lastModeSelected].style.color = 'black';
        //Y deseleccionamos su submodo seleccionado
        submodes[lastModeSelected][lastSubmodeSelected].style.backgroundColor = 'inherit';
        submodes[lastModeSelected][lastSubmodeSelected].style.borderStyle = 'outset';
        submodes[lastModeSelected][lastSubmodeSelected].style.position = 'relative';
        submodes[lastModeSelected][lastSubmodeSelected].style.bottom = '0';
        submodes[lastModeSelected][lastSubmodeSelected].style.color = 'black';
    }
    
    //Eliminamos las pestañas de los submodos
    while (submodesCont.firstChild)
        submodesCont.removeChild(submodesCont.firstChild);
    //Añadimos las pestañas del submodo
    for(var i=0; i<submodes[mode].length; i++)
        submodesCont.appendChild(submodes[mode][i]);
    //Guardamos el nuevo modo
    lastModeSelected = mode;
    //Mostramos el primer submodo
    this.showSubmode(0);
}

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
    //Mostramos el primer modo
    this.showMode(0);
    //Si no tenemos un controlador asociado
    if(scoC == undefined)
    {
        //Creamos el controlador asociado
        scoC = new OptionsController(formCont, op, endAction);
    }
    else
    {
        //Si ya lo tenemos, activamos el controlador asociado
        scoC.enable(endAction);
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
    scoC.remove();
}

/*
 * Nombre: saveScoreDialog
 * Sinopsis: Método para mostrar el diálogo para guardar una puntuación.
 * Entradas:
 *      -String:text-> texto que se mostrará en el diálogo.
 *      -Integer:score -> puntuación obtenida.
 *      -Integer:mode -> modo en el que se ha conseguido la puntuación.
 *      -Integer:submode -> submodo en el que se ha conseguido la puntuación.
 * Salidas:
 * */
this.saveScoreDialog = function (text, score, mode, submode)
{
    //Si el cuadro de dialogo no esta creado lo creamos
    if(saveScoreCont == undefined)
    {
        //Creamos un contenedor para todos los elementos del dialogo
        saveScoreCont = document.createElement('div');
        saveScoreCont.style.position = 'absolute';
        saveScoreCont.style.top = '0';
        saveScoreCont.style.width = '100%';
        saveScoreCont.style.height = '100%';
        saveScoreCont.style.textAlign = 'center';
        document.body.appendChild(saveScoreCont);
        //Creamos el fondo que contendra el resto de elementos
        var background = document.createElement('div');
        background.style.position = 'absolute';
        background.style.top = '0';
        background.style.zIndex = '7000'; 
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.opacity = '0.5';
        background.style.MozOpacity = '0.5';
        background.style.background = '#000';
        saveScoreCont.appendChild(background);
        //Creamos el cuadro de texto
        var textBox = document.createElement('div');
        textBox.style.position = 'absolute';
        textBox.style.top = '40%';
        textBox.style.left = '35%';
        textBox.style.width = '30%';
        textBox.style.zIndex = '9000'; 
        textBox.style.padding = '20px';
        textBox.style.opacity = '1';
        textBox.style.MozOpacity = '1';
        textBox.style.color = '#ff0000';
        textBox.style.background = '#ffffff';
        textBox.style.borderRadius = '5px';
        textBox.style.fontSize = 'large';
        textBox.style.fontWeigth = 'bolder';
        textBox.innerHTML += '<p>'+text+'</p>';
        saveScoreCont.appendChild(textBox);
        //Añadimos un texto para indicar que se introduzca el nombre
        textBox.innerHTML += '<p style="margin-bottom:0">Introduzca su nombre :</p>';
        //Añadimos una entrada de texto
        var textInput = document.createElement('input');
        textInput.style.display = 'block';
        textInput.style.width = '60%';
        textInput.style.margin = '0 20%';
        textBox.appendChild(textInput);
        
        //Creamos el boton de cancelar
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'Cancelar';
        button.style.marginTop = '5%';
        button.style.marginLeft= '5%';
        button.style.marginRight= '5%';
        button.onclick = function() //Definimos la funcion para cuando se pulse el boton
        {
            //Ocultamos el dialogo
            saveScoreCont.style.display = 'none';            
        }
        textBox.appendChild(button);
        
        //Creamos el boton de guardar puntuacion
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'Guardar Puntuacion';
        button.style.marginTop = '5%';
        button.style.marginLeft= '5%';
        button.style.marginRight= '5%';
        button.onclick = function() //Definimos la funcion para cuando se pulse el boton
        {
            //Obtenemos el nombre
            var name = textInput.value || "Anonimo";
            //Si no tenemos conexion con el servidor la creamos
            if(socket == undefined)
                socket = new Socket();
            //Le decimos al servidor que guarde la puntuacion
            socket.saveScore(name, score, mode, submode);
            
            //Ocultamos el dialogo
            saveScoreCont.style.display = 'none';            
        }
        textBox.appendChild(button);
    }
    //Si ya esta creado solo lo mostramos
    else
    {
        //Mostramos el mensaje
        saveScoreCont.getElementsByTagName('p')[0].innerHTML = text;
        //Redefinimos la funcion para cuando se pulse el boton de guarda puntuacion
        //para que lo haga con los nuevos datos y no con los antiguos
        saveScoreCont.getElementsByTagName('input')[2].onclick = function()
        {
            //Obtenemos el nombre
            var name = saveScoreCont.getElementsByTagName('input')[0].value || "Anonimo";
            //Si no tenemos conexion con el servidor la creamos
            if(socket == undefined)
                socket = new Socket();
            //Le decimos al servidor que guarde la puntuacion
            socket.saveScore(name, score, mode, submode);
            
            //Ocultamos el dialogo
            saveScoreCont.style.display = 'none';            
        }
        //Mostramos el dialogo
        saveScoreCont.style.display = 'block';
    }
}

}