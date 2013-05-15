/*
 *  Nombre: SurvivalModeView.js
 *  Sinopsis: Clase de la vista del modo supervivencia.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 31-03-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE SURVIVALMODEVIEW
 *  */
function SurvivalModeView (sce, numC, diff, mats)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Escena en la que se mostrarán la vista
    var scene;
    //Materiales con los que se creará el puzzle actual
    var materials;
    //Todos los materiales que se utilizarán en el modo de juego
    var allMaterials;
    //Índice del ultimo material usado en el puzzle actual
    var lastMaterialUsed;
    
    //Número de cubos que tendrá el puzzle
    var numberOfCubes;
    //Dificultad del puzzle
    var difficulty;
    //Número de puzzles que se han resuelto
    var solvedPuzzles = 0;
    
    //Contenedor con el formulario que contendra todos los elemento de la vista
    var formCont;
    //Cronometro
    var cl;
    //Creamos un array para cada numero de cubos con los tiempos de cada dificultad, la primera la mas fácil, la última la mas díficil
    var difTimes = [[5*60, 3*60, 1*60, 40], //8 cubos
                    [20*60, 10*60, 5*60, 4*60]]; //27 cubos
    //Flag para saber si se ha acabado el modo
    var finished = false;
    
    //Botones de mostrar las soluciones
    var showSolutionsButton;
    var showSolutionButton;
    //Botón para colocar pieza
    var placeCubeButton;
    //Botón para salir al menu inicial
    var menuButton;
    //Botón para reiniciar el juego
    var restartButton;
    //Botón para mostrar las opciones
    var optionsButton;
    //Botón de pausa
    var pauseButton;
    
    //Diálogo de pausa
    var pauseDialog;

    //Controlador del modo supervivencia
    var surC;
    
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase SurvivalModeView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicará mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Integer:diff -> entero que identificará la dificultad: 0->facil, 1->medio, 2->dificil, 3->imposible.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 * Salidas:
 * */
 
    scene = sce;
    
    //Guardamos el numero de cubos que tendra el cubo, comprobamos que sea correcto
    if(numC != 2 && numC != 3) numberOfCubes = 3;
    else numberOfCubes = numC;
    //Guardamos la dificultad del puzzle, comprobamos que sea correcto
    if(diff != 0 && diff != 1 && diff != 2 && diff != 3) difficulty = 1;
    else difficulty = diff;
    
    //Creamos el array de materiales con los materiales suministrados
    allMaterials = materials = mats;
    var i=0;
    lastMaterialUsed = numberOfCubes*6-1;
    //Mientras no tengamos el numero de materiales necesarios
    while(materials.length < numberOfCubes*6)
    {
        materials.push(allMaterials[i]);
        lastMaterialUsed = i;
        i++;
        //Si ya hemos recorrido todos los materiales volvemos a empezar
        if(i == allMaterials.length)
            i=0;
    }
    
    //Creamos la vista del puzzle
    pv = new PuzzleView(scene, numberOfCubes, materials, puzzleFinished);
    
    //Creamos el contenedor que contendra el formulario para las distintas opciones
    formCont = document.createElement('div');
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'survivalGameForm';
    formCont.appendChild(form);
    
    //Creamos los botones
    showSolutionsButton = document.createElement('input');
    showSolutionsButton.type = 'button';
    showSolutionsButton.name = 'showSolutions';
    showSolutionsButton.value = 'mostrar todas las soluciones';
    showSolutionsButton.style.position = 'absolute';
    showSolutionsButton.style.top = (90).toString()+'px';
    showSolutionsButton.style.left = (20).toString()+'px';
    form.appendChild(showSolutionsButton);
    
    showSolutionButton = document.createElement('input');
    showSolutionButton.type = 'button';
    showSolutionButton.name = 'showSolution';
    showSolutionButton.value = 'mostrar la posible solucion';
    showSolutionButton.style.position = 'absolute';
    showSolutionButton.style.top = (130).toString()+'px';
    showSolutionButton.style.left = (20).toString()+'px';
    form.appendChild(showSolutionButton);
    
    placeCubeButton = document.createElement('input');
    placeCubeButton.type = 'button';
    placeCubeButton.name = 'placeCube';
    placeCubeButton.value = 'colocar una pieza en el puzzle';
    placeCubeButton.style.position = 'absolute';
    placeCubeButton.style.top = (170).toString()+'px';
    placeCubeButton.style.left = (20).toString()+'px';
    form.appendChild(placeCubeButton);
    
    menuButton = document.createElement('input');
    menuButton.type = 'button';
    menuButton.name = 'menu';
    menuButton.value = 'menu';
    menuButton.style.position = 'absolute';
    menuButton.style.top = (210).toString()+'px';
    menuButton.style.left = (20).toString()+'px';
    form.appendChild(menuButton);
    
    restartButton = document.createElement('input');
    restartButton.type = 'button';
    restartButton.name = 'restart';
    restartButton.value = 'reiniciar';
    restartButton.style.position = 'absolute';
    restartButton.style.top = (250).toString()+'px';
    restartButton.style.left = (20).toString()+'px';
    form.appendChild(restartButton);
    
    optionsButton = document.createElement('input');
    optionsButton.type = 'button';
    optionsButton.name = 'options';
    optionsButton.value = 'opciones';
    optionsButton.style.position = 'absolute';
    optionsButton.style.top = (290).toString()+'px';
    optionsButton.style.left = (20).toString()+'px';
    form.appendChild(optionsButton);
    
    pauseButton = document.createElement('input');
    pauseButton.type = 'button';
    pauseButton.name = 'pause';
    pauseButton.value = 'pausa';
    pauseButton.style.position = 'absolute';
    pauseButton.style.top = (330).toString()+'px';
    pauseButton.style.left = (20).toString()+'px';
    form.appendChild(pauseButton);

    //Creamos el reloj para cronometrar el tiempo
    cl = new Clock(difTimes[numberOfCubes-2][difficulty], timeFinished);
    form.appendChild(cl.getDomElement());
    cl.start();
    
    document.body.appendChild(formCont);
    
    //Guardamos la opcion de ayuda con sonidos segun corresponda
    if(ov.getOptions().getAudioHelp())
        sound.enableHelpSound();
    else
        sound.disableHelpSound();
    
    surC = new SurvivalModeController(formCont, numberOfCubes, difficulty, allMaterials, materials, cl);
    
    
 /*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: puzzleFinished
 * Sinopsis: Método que se ejecutará la terminar un puzzle.
 * Entradas:
 * Salidas:
 * */
function puzzleFinished()
{ 
    //Incrementamos el numero de puzzles resueltos
    solvedPuzzles++;
    //Obtenemos el tiempo sobrante
    var time = cl.finish();
    //Reproducimos el sonido de puzzle finalizado
    sound.playFinal();
    //Mostramos un mensaje
    var sec = time % 60;
    var min = Math.floor(time/60) % 60;
    var hour = Math.floor(time/3600);
    var cad = "Enhorabuena!!! Puzzle solucionado !!! Te han sobrado ";
    if(hour != 0)
        cad+=hour+" horas, ";
    cad+=min+" minutos y "+sec+" segundos para la siguiente ronda";
    alert(cad);
    //Ocultamos el puzzle
    pv.hide();
    //Deshabilitamos el controlador asociado
    surC.remove();
    
    //Creamos el nuevo array con los nuevos materiales para el nuevo puzzle
    materials = [];
    for(var i=0, j=lastMaterialUsed+1; materials.length < numberOfCubes*6; i++, j++)
    {
        //Si ya hemos recorrido todos los materiales volvemos a empezar
        if(j == allMaterials.length)
            j=0;
        materials.push(allMaterials[j]);
        lastMaterialUsed = j;
    }
        
    //Creamos la vista del puzzle
    pv = new PuzzleView(scene, numberOfCubes, materials, puzzleFinished);    
    //Creamos el reloj para cronometrar el tiempo
    form.removeChild(cl.getDomElement());
    cl = new Clock(difTimes[numberOfCubes-2][difficulty]+time-solvedPuzzles*(5-difficulty), timeFinished);
    form.appendChild(cl.getDomElement());
    cl.start();    
    surC = new SurvivalModeController(formCont, numberOfCubes, difficulty, allMaterials, materials, cl);
}

/*
 * Nombre: timeFinished
 * Sinopsis: Método que se ejecutará cuando se termine el tiempo.
 * Entradas:
 * Salidas:
 * */
function timeFinished()
{
    finished = true;
    sound.playExplosion();
    finish("Se ha terminado el tiempo. ");
    pv.setDone();
    surC.timeIsOver();
}

/*
 * Nombre: finish
 * Sinopsis: Método que se cuando no se acabe la partida, cuando se acabe
 *          el tiempo o cuando se quiera salir o reiniciar.
 * Entradas:
 *      -String:str -> cadena que se mostrara al inicio del mensaje.
 * Salidas:
 * */
function finish(str)
{
    var text = "";
    text += str;
    text += " Has conseguido solucionar "+solvedPuzzles+" puzzles. Enhorabuena!!!";
    //Si no tenemos creada una vista para las puntuaciones la creamos
    if(sv == undefined)
    {
        sv = new ScoresView();
        sv.hide();
    }
    //Mostramos el dialogo para guardar la puntuacion
    var submode = difficulty*2+(3-numberOfCubes);
    sv.saveScoreDialog(text, solvedPuzzles , 3, submode);
}


 /*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: show
 * Sinopsis: Método para mostrar en la interfaz todos los elementos de la vista.
 * Entradas:
 * Salidas:
 * */
this.show = function ()
{
    //Si no se ha acabado el tiempo activamos el reloj
    if(!finished)
        cl.start();
    //Mostramos el puzzle
    pv.show();
    //Mostramos la interfaz del modo supervivencia
    formCont.style.display = 'block';
    //Mostramos la interfaz en el cuerpo del documento HTML
    document.body.appendChild(formCont);
    //Activamos el controlador asociado
    surC.enable();
}

/*
 * Nombre: hide
 * Sinopsis: Método para eliminar de la interfaz todos los elementos de la vista, ocultarlos.
 * Entradas:
 * Salidas:
 * */
this.hide = function ()
{
    //Pausamos el reloj
    cl.pause();
    //Ocultamos el puzzle
    pv.hide();
    //Ocultamos la interfaz del modo supervivencia
    formCont.style.display = 'none';
    //Borramos la interfaz del cuerpo del documento HTML
    document.body.removeChild(formCont);
    //Deshabilitamos el controlador asociado
    surC.remove();
}

/*
 * Nombre: pause
 * Sinopsis: Método para pausar el juego.
 * Entradas:
 * Salidas:
 * */
this.pause = function ()
{
    //Pausamos el reloj
    cl.pause();
    //Desactivamos el controlador del puzzle
    pv.disableController();
    
    //Creamos un dialogo para mostrar mientras el juego este pausado
    if(pauseDialog == undefined)
    {
        //Creamos un contenedor para todos los elementos del dialogo
        pauseDialog = document.createElement('div');
        document.body.appendChild(pauseDialog);
        //Creamos el fondo que contendra el resto de elementos
        var background = document.createElement('div');
        background.style.position = 'absolute';
        background.style.top = '0';
        background.style.zIndex = '3000'; 
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.opacity = '0.5';
        background.style.MozOpacity = '0.5';
        background.style.background = '#000';
        pauseDialog.appendChild(background);
        //Creamos el cuadro de texto
        var textBox = document.createElement('div');
        textBox.style.position = 'absolute';
        textBox.style.top = '40%';
        textBox.style.left = '43%';
        textBox.style.zIndex = '5000'; 
        textBox.style.padding = '20px';
        textBox.style.opacity = '1';
        textBox.style.MozOpacity = '1';
        textBox.style.color = '#ff0000';
        textBox.style.background = '#ffffff';
        textBox.style.borderRadius = '5px';
        textBox.style.fontSize = 'large';
        textBox.style.fontWeigth = 'bolder';
        textBox.innerHTML += '<p>JUEGO PAUSADO</p>';
        pauseDialog.appendChild(textBox);
        //Creamos el boton
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'continuar';
        button.style.marginTop = '20px';
        button.style.marginLeft= '40px';
        button.onclick = function() //Definimos la funcion para cuando se pulse el boton
        {
            //Ocultamos el dialogo de pausa
            pauseDialog.style.display = 'none';
            //Si el modo no se ha acabado
            if(!finished)
                //Activamos el reloj
                cl.start();
            //Activamos el controlador del puzzle
            pv.enableController();
        }
        textBox.appendChild(button);
        
    }
    else
    {
        //Si ya esta creado el dialogo unicamente los mostramos
        pauseDialog.style.display = 'block';
    }
}

/*
 * Nombre: finishMode
 * Sinopsis: Método que se ejecutará cuando se termine el modo (al salir o reiniciar).
 * Entradas:
 *      -String:str -> cadena que se mostrara al inicio del mensaje.
 * Salidas:
 * */
this.finishMode = function (str)
{
    finish(str);
}

}