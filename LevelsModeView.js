/*
 *  Nombre: LevelsModeView.js
 *  Sinopsis: Clase de la vista del modo niveles.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 14-04-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE LEVELSMODEVIEW
 *  */
function LevelsModeView (sce, l, mats)
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
    var lastMaterialUsed = -1;
    
    //Nivel actual
    var level;
    //Número de niveles disponibles
    var numberOfLevels = 16;
    
    //Contenedor con el formulario que contendra todos los elemento de la vista
    var formCont;
    //Cronometro
    var cl;
    //Flag para saber si se ha acabado el modo
    var finished = false;
    
    //Botón de mostrar las soluciones
    var showSolutionsButton;
    //Botones para pasar al nivel siguiente y anterior
    var nextButton;
    var previousButton;
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
    //Diálogo de puzzle resuelto
    var finishedDialog;

    //Controlador del modo supervivencia
    var levC;
    
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase LevelModeView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Integer:l -> entero que identificará el nivel con el que se comenzará.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 * Salidas:
 * */
 
    scene = sce;
    level = l;
    allMaterials = mats;
    
    //Iniciamos el nivel correspondiente
    startLevel(level);
    
    //Creamos el contenedor que contendra el formulario para las distintas opciones
    formCont = document.createElement('div');
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'levelsGameForm';
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
    
    nextButton = document.createElement('input');
    nextButton.type = 'button';
    nextButton.name = 'next';
    nextButton.value = 'nivel siguiente';
    nextButton.style.position = 'absolute';
    nextButton.style.top = (130).toString()+'px';
    nextButton.style.left = (20).toString()+'px';
    form.appendChild(nextButton);
    
    previousButton = document.createElement('input');
    previousButton.type = 'button';
    previousButton.name = 'previous';
    previousButton.value = 'nivel anterior';
    previousButton.style.position = 'absolute';
    previousButton.style.top = (170).toString()+'px';
    previousButton.style.left = (20).toString()+'px';
    form.appendChild(previousButton);
    
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
    cl = new Clock(0);
    form.appendChild(cl.getDomElement());
    cl.start();
    
    document.body.appendChild(formCont);
    
    //Guardamos la opcion de ayuda con sonidos segun corresponda
    if(ov.getOptions().getAudioHelp())
        sound.enableHelpSound();
    else
        sound.disableHelpSound();
    
    levC = new LevelsModeController(formCont, allMaterials, materials, cl);
    
    
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
    //Obtenemos el tiempo sobrante
    var time = cl.finish();
    //Indicamos que se ha terminado el puzzle
    var finished = true;
    //Reproducimos el sonido de puzzle finalizado
    sound.playFinal();
    //Mostramos un mensaje
    var sec = time % 60;
    var min = Math.floor(time/60) % 60;
    var hour = Math.floor(time/3600);
    var timeString = "";
    if(hour != 0)
        timeString += hour+" horas, ";
    timeString += min+" minutos y "+sec+" segundos !!!";
    
    //Creamos un dialogo para mostrar al terminar y mostrar las distintas opciones
    if(finishedDialog == undefined)
    {
        //Creamos un contenedor para todos los elementos del dialogo
        finishedDialog = document.createElement('div');
        document.body.appendChild(finishedDialog);
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
        finishedDialog.appendChild(background);
        //Creamos el cuadro de texto
        var textBox = document.createElement('div');
        textBox.style.position = 'absolute';
        textBox.style.top = '35%';
        textBox.style.left = '30%';
        textBox.style.zIndex = '5000'; 
        textBox.style.padding = '20px';
        textBox.style.opacity = '1';
        textBox.style.MozOpacity = '1';
        textBox.style.color = '#ff0000';
        textBox.style.background = '#ffffff';
        textBox.style.borderRadius = '5px';
        textBox.style.fontSize = 'large';
        textBox.style.fontWeigth = 'bolder';
        textBox.style.textAlign = 'center';
        textBox.innerHTML += '<p>NIVEL SOLUCIONADO<br> en '+timeString+'</p>';
        finishedDialog.appendChild(textBox);
        //Creamos el boton de mostrar el puzzle solucionado
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'ver puzzle solucionado';
        button.style.marginTop = '20px';
        button.style.marginLeft= '40px';
        button.style.cssFloat= 'left';
        button.onclick = function() //Definimos la funcion para cuando se pulse el boton
        {
            finishedDialog.style.display = 'none'; //Ocultamos el dialogo de pausa
        }
        textBox.appendChild(button);
        //Creamos el boton de reiniciar el puzzle solucionado
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'reiniciar nivel';
        button.style.marginTop = '20px';
        button.style.marginLeft= '40px';
        button.style.cssFloat= 'left';
        button.onclick = function() //Definimos la funcion para cuando se pulse el boton
        {
            //Ocultamos el puzzle y el reloj
            pv.hide();
            form.removeChild(cl.getDomElement());
            //Creamos el nivel correspondiente
            startLevel(level, true);
            //Creamos el reloj para cronometrar el tiempo
            cl = new Clock(0);
            form.appendChild(cl.getDomElement());
            cl.start();
        }
        textBox.appendChild(button);
        //Creamos el boton pasar al siguiente nivel
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'siguiente nivel';
        button.style.marginTop = '20px';
        button.style.marginLeft= '40px';
        button.style.cssFloat= 'left';
        button.onclick = function() //Definimos la funcion para cuando se pulse el boton
        {
            finishedDialog.style.display = 'none';
            //Si estamos en el ultimo nivel
            if(level == numberOfLevels-1)
            {
                alert("Has solucionado el ultimo nivel.");
                return;
            }    
            //Ocultamos el puzzle y el reloj
            pv.hide();
            form.removeChild(cl.getDomElement());
            //Creamos el nivel correspondiente
            startLevel(++level);
            //Reiniciamos el controlador asociado
            levC.remove();
            levC = new LevelsModeController(formCont, level, materials, cl);
            //Creamos el reloj para cronometrar el tiempo
            cl = new Clock(0);
            form.appendChild(cl.getDomElement());
            cl.start();
        }
        textBox.appendChild(button);
        
    }
    else
    {
        //Si ya esta creado el dialogo unicamente los mostramos
        finishedDialog.style.display = 'block';
    }
}

/*
 * Nombre: startLevel
 * Sinopsis: Método para iniciar el nivel indicado.
 * Entradas:
 *      -Integer:l -> entero que indicará el nivel a iniciar.
 *      -Boolean:restart -> flag para saber si hay que reiniciar el nivel o no.
 *      Si se reinicia el nivel se utilizan las mismas imagenes,
 *      si no se utilizan las siguientes.
 * Salidas:
 * */
function startLevel(l, restart)
{
    switch(l)
    {
        case 0: //Nivel 1: 8 cubos (2 soluciones) con 12 imagenes
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 2, materials, puzzleFinished);
            break;
        case 1: //Nivel 2: 27 cubos (3 soluciones) con 18 imagenes
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 3, materials, puzzleFinished);
            break;
        case 2: //Nivel 3: 8 cubos (2 soluciones) con imagenes repetidas 2 veces (6 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
                //Ordenamos el array de forma aleatoria para que cada solucion tenga
                //colocadas las imagenes de manera aleatoria
                var mats = [[],[],[]];
                for(var i=0; i<2; i++)
                    for(var j=0; j<6; j++)
                        mats[i].push(materials[i*6+j]);
                for(var i=0; i<2; i++)
                    shuffle(mats[i]);
                materials = mats[0].concat(mats[1]);
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 2, materials, puzzleFinished);
            break;
        case 3: //Nivel 4: 27 cubos (3 soluciones) con imagenes repetidas 2 veces (9 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
                //Ordenamos el array de forma aleatoria para que cada solucion tenga
                //colocadas las imagenes de manera aleatoria
                var mats = [[],[],[]];
                for(var i=0; i<3; i++)
                    for(var j=0; j<6; j++)
                        mats[i].push(materials[i*6+j]);
                for(var i=0; i<3; i++)
                    shuffle(mats[i]);
                materials = mats[0].concat(mats[1],mats[2]);
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 3, materials, puzzleFinished);
            break;
        case 4: //Nivel 5: 8 cubos (2 soluciones) con colores
            //Creamos la vista del puzzle
            pv = new ColoredPuzzleView(scene, 2, puzzleFinished);
            materials = pv.getMaterials();
            break;
        case 5: //Nivel 6: 27 cubos (3 soluciones) con colores
            //Creamos la vista del puzzle
            pv = new ColoredPuzzleView(scene, 3, puzzleFinished);
            materials = pv.getMaterials();
            break;
        case 6: //Nivel 7: 8 cubos (2 soluciones) con imagenes repetidas 3 veces (4 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    materials.push(allMaterials[i]);
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
                //Ordenamos el array de forma aleatoria para que cada solucion tenga
                //colocadas las imagenes de manera aleatoria
                var mats = [[],[],[]];
                for(var i=0; i<2; i++)
                    for(var j=0; j<6; j++)
                        mats[i].push(materials[i*6+j]);
                for(var i=0; i<2; i++)
                    shuffle(mats[i]);
                materials = mats[0].concat(mats[1]);
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 2, materials, puzzleFinished);
            break;
        case 7: //Nivel 8: 27 cubos (3 soluciones) con imagenes repetidas 3 veces (6 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    materials.push(allMaterials[i]);
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
                //Ordenamos el array de forma aleatoria para que cada solucion tenga
                //colocadas las imagenes de manera aleatoria
                var mats = [[],[],[]];
                for(var i=0; i<3; i++)
                    for(var j=0; j<6; j++)
                        mats[i].push(materials[i*6+j]);
                for(var i=0; i<3; i++)
                    shuffle(mats[i]);
                materials = mats[0].concat(mats[1],mats[2]);
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 3, materials, puzzleFinished);
            break;
        case 8: //Nivel 9: 8 cubos (2 soluciones) mas 4 cubos con secciones aleatorias
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new TooManyPiecesPuzzleView(scene, 2, materials, puzzleFinished)
            break;
        case 9: //Nivel 10: 27 cubos (3 soluciones) mas 6 cubos con secciones aleatorias
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new TooManyPiecesPuzzleView(scene, 3, materials, puzzleFinished);
            break;
        case 10: //Nivel 11: 8 cubos (2 soluciones) con imagenes repetidas 6 veces (2 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    for(var j=0; j<6; j++)
                        materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 2, materials, puzzleFinished);
            break;
        case 11: //Nivel 12: 27 cubos (3 soluciones) con imagenes repetidas 6 veces (3 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    for(var j=0; j<6; j++)
                        materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 3, materials, puzzleFinished);
            break;
        case 12: //Nivel 13: 8 cubos (2 soluciones) en movimiento
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new MovingPuzzleView(scene, 2, materials, puzzleFinished)
            break;
        case 13: //Nivel 14: 27 cubos (3 soluciones) en movimiento
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                {
                    materials.push(allMaterials[i]);
                    lastMaterialUsed = i;
                    i++;
                    //Si ya hemos recorrido todos los materiales volvemos a empezar
                    if(i == allMaterials.length)
                        i=0;
                }
            }
            //Creamos la vista del puzzle
            pv = new MovingPuzzleView(scene, 3, materials, puzzleFinished);
            break;
        case 14: //Nivel 15: 8 cubos (2 soluciones) con imagenes repetidas 12 veces (1 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 2*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                    materials.push(allMaterials[i]);
                lastMaterialUsed = i;
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 2, materials, puzzleFinished);
            break;
        case 15: //Nivel 8: 27 cubos (3 soluciones) con imagenes repetidas 18 veces (1 imagenes distintas)
            if(!restart)
            {
                //Creamos el array de materiales con los materiales suministrados
                //Obtenemos el indice del primer material a usar
                var i=lastMaterialUsed+1;
                if(i == allMaterials.length)
                    i=0;
                //Calculamos el numero de imagenes necesarias
                var imgsNeeded = 3*6;
                materials = [];
                //Mientras no tengamos el numero de materiales necesarios
                while(materials.length < imgsNeeded)
                    materials.push(allMaterials[i]);
                lastMaterialUsed = i;
            }
            //Creamos la vista del puzzle
            pv = new PuzzleView(scene, 3, materials, puzzleFinished);
            break;
        default :
            alert("nivel no disponible");
            break;
    }
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
    //Si no se ha acabado el puzzle activamos el reloj
    if(!finished)
        cl.start();
    //Mostramos el puzzle
    pv.show();
    //Mostramos la interfaz del modo niveles
    formCont.style.display = 'block';
    //Mostramos la interfaz en el cuerpo del documento HTML
    document.body.appendChild(formCont);
    //Activamos el controlador asociado
    levC.enable();
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
    //Ocultamos la interfaz del modo niveles
    formCont.style.display = 'none';
    //Borramos la interfaz del cuerpo del documento HTML
    document.body.removeChild(formCont);
    //Deshabilitamos el controlador asociado
    levC.remove();
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
 * Nombre: restartLevel
 * Sinopsis: Método para reiniciar el nivel actual.
 * Entradas:
 * Salidas:
 * */
this.restartLevel = function ()
{
    //Ocultamos el puzzle y el reloj
    pv.hide();
    form.removeChild(cl.getDomElement());
    //Creamos el nivel correspondiente
    startLevel(level, true);
    //Creamos el reloj para cronometrar el tiempo
    cl = new Clock(0);
    form.appendChild(cl.getDomElement());
    cl.start();
}

/*
 * Nombre: nextLevel
 * Sinopsis: Método para iniciar el siguiente nivel.
 * Entradas:
 * Salidas:
 * */
this.nextLevel = function ()
{
    //Si estamos en el ultimo nivel
    if(level == numberOfLevels-1)
    {
        alert("No hay mas niveles.");
        return;
    }    
    //Ocultamos el puzzle y el reloj
    pv.hide();
    form.removeChild(cl.getDomElement());
    //Creamos el nivel correspondiente
    startLevel(++level);
    //Reiniciamos el controlador asociado
    levC.remove();
    levC = new LevelsModeController(formCont, level, materials, cl);
    //Creamos el reloj para cronometrar el tiempo
    cl = new Clock(0);
    form.appendChild(cl.getDomElement());
    cl.start();
}

/*
 * Nombre: previousLevel
 * Sinopsis: Método para iniciar el nivel anterior.
 * Entradas:
 * Salidas:
 * */
this.previousLevel = function ()
{
    //Si estamos en el primer nivel
    if(level == 0)
    {
        alert("Este es el primer nivel.");
        return;
    }    
    //Ocultamos el puzzle y el reloj
    pv.hide();
    form.removeChild(cl.getDomElement());
    //Creamos el nivel correspondiente
    startLevel(--level);
    //Reiniciamos el controlador asociado
    levC.remove();
    levC = new LevelsModeController(formCont, level, materials, cl);
    //Creamos el reloj para cronometrar el tiempo
    cl = new Clock(0);
    form.appendChild(cl.getDomElement());
    cl.start();
}

}