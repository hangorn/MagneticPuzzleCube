/*
 *  Nombre: MultiplayerModeView.js
 *  Sinopsis: Clase de la vista del modo multijugador.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 06-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE MULTIPLAYERMODEVIEW
 *  */
function MultiplayerModeView (sce, ty, mats, iniPos, iniRot)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Escena en la que se mostrarán la vista
    var scene;
    
    //Tipo de puzzle multijugador
    var type;
    //Numero de cubos que tendrá el puzzle
    var numberOfCubes;
    
    //Contenedor con el formulario que contendra todos los elemento de la vista
    var formCont;
    //Cronometro
    var cl;
    //Flag para saber si se ha acabado el modo
    var finished = false;
    
    //Botón para salir al menu inicial
    var menuButton;
    //Botón para mostrar las opciones
    var optionsButton;
    
    //Controlador del modo clasico
    var mulC;
    
    //Render y escena donde se mostraran los movimientos del otro jugador
    var otherPlayerRenderCont;
    var otherPlayerRender;
    var otherPlayerScene;
    //Puzzle del otro jugador
    var otherPlayerPuzzle;

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase MultiplayerModeView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Integer:type -> tipo de puzzle multijugador.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 *      -Vector3[]:iniPos -> posiciones iniciales de los cubos, si no estan definidas nos
 *      encargaremos nosotros de crearlas.
 *      -Vector3[]:iniRot -> rotaciones iniciales de los cubos, si no estan definidas nos
 *      encargaremos nosotros de crearlas.
 * Salidas:
 * */
 
    scene = sce;
    type = ty;
    //Guardamos el numero de cubos que tendra el cubo
    numberOfCubes = (type % 2)+2;
    
    //Creamos la vista del puzzle
    pv = new MultiplayerPuzzleView(scene, numberOfCubes, type, mats, finish, iniPos, iniRot);
    
    //Creamos el contenedor que contendra el formulario para las distintas opciones
    formCont = document.createElement('div');
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'multiplayerGameForm';
    formCont.appendChild(form);
    
    //Creamos los botones
    menuButton = document.createElement('input');
    menuButton.type = 'button';
    menuButton.name = 'menu';
    menuButton.value = 'menu';
    menuButton.style.position = 'absolute';
    menuButton.style.top = (90).toString()+'px';
    menuButton.style.left = (20).toString()+'px';
    form.appendChild(menuButton);
    
    optionsButton = document.createElement('input');
    optionsButton.type = 'button';
    optionsButton.name = 'options';
    optionsButton.value = 'opciones';
    optionsButton.style.position = 'absolute';
    optionsButton.style.top = (130).toString()+'px';
    optionsButton.style.left = (20).toString()+'px';
    form.appendChild(optionsButton);

    //Creamos el reloj para cronometrar el tiempo
    cl = new Clock(0);
    form.appendChild(cl.getDomElement());
    
    document.body.appendChild(formCont);
    
    //Guardamos la opcion de ayuda con sonidos segun corresponda
    if(ov.getOptions().getAudioHelp())
        sound.enableHelpSound();
    else
        sound.disableHelpSound();
    
    mulC = new MultiplayerModeController(formCont, numberOfCubes, mats, cl, type);
    
    //Ocultamos toda la vista, ya que se iniciara oculta y para mostrarla habra que indicarselo
    //Ocultamos el puzzle
    pv.hide();
    //Ocultamos la interfaz del modo clasico
    formCont.style.display = 'none';
    //Borramos la interfaz del cuerpo del documento HTML
    document.body.removeChild(formCont);
    //Deshabilitamos el controlador asociado
    mulC.remove();
    
    //Si es el modo contrareloj
    if(type == 2 || type == 3)
    {
        //Iniciamos tanto el render como otro puzzle para
        //mostrar lo que hace el otro jugador
        initOtherPlayerRender();        
        initOtherPlayerPuzzle();        
    }
    
 /*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: finish
 * Sinopsis: Método que se ejecutará al terminar el puzzle.
 * Entradas:
 * Salidas:
 * */
function finish()
{ 
    socket.solvedGame();
}

/*
 * Nombre: finishAction
 * Sinopsis: Método que se ejecutará cuando el servidor diga
 *          que se ha terminado el puzzle.
 * Entradas:
 *      -Integer:time -> tiempo en segundos invertido en resolver el puzzle.
 *      -Boolean:winner -> booleano para indicar si el cliente es el ganador
 *      o no, si no se trata del modo contrareloj se ignorará.
 * Salidas:
 * */
function finishAction(time, winner)
{
    var clockTime = cl.finish();
    //Si nuestro tiempo es distinto del del servidor
    if(clockTime != time)
    {
        //Actualizamos nuestro tiempo
        var d = time - clockTime;
        cl.addTime(d);
        cl.start();
        cl.finish();
    }
    finished = true;
    var sec = time % 60;
    var min = Math.floor(time/60) % 60;
    var hour = Math.floor(time/3600);
    //Si se trata del modo cooperativo
    if(type == 0 || type == 1)
    {
        sound.playFinal();
        var cad = "Enhorabuena!!! Habeis solucionado el puzzle! en ";
        if(hour != 0)
            cad+=hour+" horas, ";
        cad+=min+" minutos y "+sec+" segundos";
    }
    //Si se trata del modo contrareloj
    if(type == 2 || type == 3)
    {
        //Si se ha ganado la partida
        if(winner)
        {
            sound.playFinal();
            var cad = "Enhorabuena!!! Has conseguido solucionar el puzzle antes que el otro jugagador! en ";
            if(hour != 0)
                cad+=hour+" horas, ";
            cad+=min+" minutos y "+sec+" segundos";
        }
        //Si no se ha ganado la partida
        else
        {
            sound.playExplosion();
            var cad = "Lo sentimos. El otro jugador ha solucionado el puzzle antes en ";
            if(hour != 0)
                cad+=hour+" horas, ";
            cad+=min+" minutos y "+sec+" segundos";
        }        
    }
    alert(cad);
}

/*
 * Nombre: initOtherPlayerRender
 * Sinopsis: Método para iniciar el render y la escena en la que se mostrarán
 *          los movimientos del otro jugador.
 * Entradas:
 * Salidas:
 * */
function initOtherPlayerRender()
{
    //Creamos una escena
    otherPlayerScene = new THREE.Scene();
    //Creamos una camara, la movemos hacia atras
    var camera = new THREE.PerspectiveCamera(30, 11/5, 1, 5000);
    camera.position.z = 3000;
    
    otherPlayerRenderCont = document.createElement('div');
    otherPlayerRenderCont.style.width = '33%';
    otherPlayerRenderCont.style.height = '40%';
    otherPlayerRenderCont.style.position = 'absolute';
    otherPlayerRenderCont.style.top = '0';
    otherPlayerRenderCont.style.right = '0';
    otherPlayerRenderCont.style.borderLeft = '3px double black';
    otherPlayerRenderCont.style.borderBottom = '3px double black';
    otherPlayerRenderCont.style.borderBottomLeftRadius = "10px";
    otherPlayerRenderCont.style.zIndex = '-5000';
    
    //Creamos el render y fijamos su tamaño
    otherPlayerRender = new THREE.WebGLRenderer();
    otherPlayerRender.setSize(windowWidth/3, windowHeight*0.4);				
    //Introduciomos el render en el contenedor
    otherPlayerRender.domElement.id = "otherPlayerRender";
    otherPlayerRender.domElement.style.width = '100%';
    otherPlayerRender.domElement.style.height = '100%';
    otherPlayerRenderCont.appendChild(otherPlayerRender.domElement);				
    //Cuando se redimensiona la pantalla
    otherPlayerRenderCont.onresize = function()
    {					
        //Guardamos el nuevo tamaño de ventana
        windowHeight = window.innerHeight;
        windowWidth = window.innerWidth;
        //Cambiamos el tamaño del render
        otherPlayerRender.setSize(windowWidth/3, windowHeight*0.4);
    }
    function anim()
    {
        //Hacemos una peticion para animacion
        requestAnimationFrame(anim);
        //Renderizamos la escena
        otherPlayerRender.render(otherPlayerScene, camera);
    }
    anim();
}

/*
 * Nombre: initOtherPlayerPuzzle
 * Sinopsis: Método para iniciar puzzle que se mostrará del otro jugador.
 * Entradas:
 * Salidas:
 * */
function initOtherPlayerPuzzle()
{
    //Creamos el puzzle
    var materials = [];
    for(var i=0; i<mats.length; i++)
    {
        var texture = new THREE.Texture(mats[i].map.image);
        texture.needsUpdate = true;
        materials.push( new THREE.MeshBasicMaterial( { map: texture} ) );
    }
    otherPlayerPuzzle= new MultiplayerPuzzle(numberOfCubes, materials);
    //Obtenemos las posiciones y rotaciones iniciales
    var initialPositions = pv.getInitialPositions();
    var initialRotations = pv.getInitialRotations();
    //Colocamos las figuras en sus posiciones y rotaciones iniciales
    for(var i=0; i<otherPlayerPuzzle.getPuzzleCubes().length; i++)
    {
        otherPlayerPuzzle.getPuzzleCubes()[i].position.copy(initialPositions[i]);
        otherPlayerPuzzle.getPuzzleCubes()[i].rotation.copy(initialRotations[i]);
    }
    
    //Creamos un cuadrado para delimitar el area del puzzle
    var geometry = new THREE.Geometry();
    var vertice;
    vertice = new THREE.Vector3(-otherPlayerPuzzle.getPuzzleAreaSize()/2,-otherPlayerPuzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(otherPlayerPuzzle.getPuzzleAreaSize()/2,-otherPlayerPuzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(otherPlayerPuzzle.getPuzzleAreaSize()/2,otherPlayerPuzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(-otherPlayerPuzzle.getPuzzleAreaSize()/2,otherPlayerPuzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(-otherPlayerPuzzle.getPuzzleAreaSize()/2,-otherPlayerPuzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    var puzzleArea = new THREE.Line( geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }) );
    
    //Añadimos todos los objetos a la escena
    //Añadimos los cubos a la escena    
    for(var i=0; i<otherPlayerPuzzle.getPuzzleCubes().length; i++)
    {
        //Si no estan encajados en el puzzle
        if(otherPlayerPuzzle.getPuzzleCubes()[i].parent != otherPlayerPuzzle.getPuzzle())
            otherPlayerScene.add(otherPlayerPuzzle.getPuzzleCubes()[i]);
    }
    //Añadimos el puzzle
    otherPlayerScene.add(otherPlayerPuzzle.getPuzzle());    
    //Añadimos el indicador del area del puzzle
    otherPlayerScene.add(puzzleArea);
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
    //Si se trata de una partida contrareloj
    if(type == 2 || type == 3)
        document.body.appendChild(otherPlayerRenderCont);
    //Mostramos la interfaz del modo clasico
    formCont.style.display = 'block';
    //Mostramos la interfaz en el cuerpo del documento HTML
    document.body.appendChild(formCont);
    //Activamos el controlador asociado
    mulC.enable();
}

/*
 * Nombre: hide
 * Sinopsis: Método para eliminar de la interfaz todos los elementos de la vista, ocultarlos.
 * Entradas:
 * Salidas:
 * */
this.hide = function ()
{
    //Ocultamos el puzzle
    pv.hide();
    //Si se trata de una partida contrareloj
    if(type == 2 || type == 3)
        document.body.removeChild(otherPlayerRenderCont);
    //Ocultamos la interfaz del modo clasico
    formCont.style.display = 'none';
    //Borramos la interfaz del cuerpo del documento HTML
    document.body.removeChild(formCont);
    //Deshabilitamos el controlador asociado
    mulC.remove();
}

/*
 * Nombre: getInitialPositions
 * Sinopsis: Método para obtener las posiciones iniciales de las piezas del puzzle.
 * Entradas:
 * Salidas:
 * */
this.getInitialPositions = function ()
{
    return pv.getInitialPositions();
}

/*
 * Nombre: getInitialRotations
 * Sinopsis: Método para obtener las rotaciones iniciales de las piezas del puzzle.
 * Entradas:
 * Salidas:
 * */
this.getInitialRotations = function ()
{
    return pv.getInitialRotations();
}

/*
 * Nombre: otherMovePiece
 * Sinopsis: Método que se ejecutará cuando el otro jugador mueva una pieza.
 * Entradas:
 *      -Integer:ID -> ID de la pieza a mover.
 *      -Vector3:pos -> vector de 3 elementos con la nueva posición de la pieza.
 * Salidas:
 * */
this.otherMovePiece = function(ID, pos)
{
    //Si el tipo de partida es cooperativa
    if(type == 0 || type == 1)
        pv.movePiece(ID, pos);
    //Si se trata de una partida contrareloj
    if(type == 2 || type == 3)
        otherPlayerPuzzle.getPuzzleCubes()[ID-1].position.copy(pos);
}

/*
 * Nombre: otherRotatePiece
 * Sinopsis: Método que se ejecutará cuando el otro jugador gire una pieza.
 * Entradas:
 *      -Integer:ID -> ID de la pieza a girar.
 *      -Vector3:rot -> vector de 3 elementos con la nueva rotación de la pieza.
 * Salidas:
 * */
this.otherRotatePiece = function(ID, rot)
{
    //Si el tipo de partida es cooperativa
    if(type == 0 || type == 1)
        pv.rotatePiece(ID, rot);
    //Si se trata de una partida contrareloj
    if(type == 2 || type == 3)
    {
        if(ID == 0)
            otherPlayerPuzzle.getPuzzle().rotation.copy(rot)
        else
            otherPlayerPuzzle.getPuzzleCubes()[ID-1].rotation.copy(rot);
    }
}

/*
 * Nombre: otherPlacedPiece
 * Sinopsis: Método que se ejecutará cuando el otro jugador introduzca una pieza en el puzzle.
 * Entradas:
 *      -Integer:ID -> ID de la pieza a girar.
 *      -Boolean:isPlaced -> booleano para indicar si el cubo es
 *      colocado o sacado del puzzle.
 *      -Vector3:pos -> vector de 3 elementos con la nueva posición de la pieza.
 *      -Vector3:rot -> vector de 3 elementos con la nueva rotación de la pieza.
 * Salidas:
 * */
this.otherPlacedPiece = function(ID, isPlaced, pos, rot)
{
    //Si el tipo de partida es cooperativa
    if(type == 0 || type == 1)
    {
        //Si la pieza ha sido introducida en el puzzle
        if(isPlaced)
            //Introducimos la pieza en el puzzle
            pv.putInPiece(ID, pos, rot);
        //Si la pieza ha sido sacada del puzzle
        else
            //Sacamos la pieza del puzzle
            pv.putOutPiece(ID, pos, rot);
    }
    //Si se trata de una partida contrareloj
    if(type == 2 || type == 3)
    {
        //Si la pieza ha sido introducida en el puzzle
        if(isPlaced)
        {
            //Introducimos la pieza en el puzzle
            var cube = otherPlayerPuzzle.getPuzzleCubes()[ID-1];
            //Colocamos el cubo en la posicion y rotacion indicadas
            cube.position.copy(pos);
            cube.rotation.copy(rot);
            //Introducimos la figura en el puzzle
            otherPlayerPuzzle.getPuzzle().add(cube);
        }
        //Si la pieza ha sido sacada del puzzle
        else
        {
            var cube = otherPlayerPuzzle.getPuzzleCubes()[ID-1];
            //Colocamos el cubo en la posicion y rotacion indicadas
            cube.position.copy(pos);
            cube.rotation.copy(rot);
            //Introducimos la figura en la escena, con lo cual se eliminara del puzzle
            otherPlayerScene.add(cube);
        }
    }
}

/*
 * Nombre: otherSelectedPiece
 * Sinopsis: Método que se ejecutará cuando el otro jugador seleccione una pieza del puzzle.
 * Entradas:
 *      -Integer:ID -> ID de la pieza a seleccionar.
 *      -Boolean:isSelected -> booleano para indicar si el cubo es
 *      seleccionado o deseleccionado.
 * Salidas:
 * */
this.otherSelectedPiece = function(ID, isSelected)
{
    //Si el tipo de partida es cooperativa
    if(type == 0 || type == 1)
    {
        if(isSelected)
            pv.markShape(ID);
        else
            pv.unmarkShape(ID);
    }        
}

/*
 * Nombre: releasePiece
 * Sinopsis: Método para soltar una pieza que el jugador haya seleccionado.
 * Entradas:
 *      -Integer:ID -> ID de la pieza a girar.
 * Salidas:
 * */
this.releasePiece = function(ID)
{
    pv.releasePiece(ID);
}

/*
 * Nombre: solvedPuzzle
 * Sinopsis: Método que se ejecutará cuando el servidor indique que se ha
 *          resuelto el puzzle.
 * Entradas:
 *      -Integer:time -> tiempo en segundos invertido en resolver el puzzle.
 *      -Boolean:winner -> booleano para indicar si el cliente es el ganador
 *      o no, si no se trata del modo contrareloj se ignorará.
 * Salidas:
 * */
this.solvedPuzzle = function(time, winner)
{
    //Indicamos al puzzle que esta resuelto
    pv.setDone();
    //Realizamos la accion para cuando se termine el puzzle
    finishAction(time, winner);
}

/*
 * Nombre: isDone
 * Sinopsis: Método para saber si el puzzle está resuelto.
 * Entradas:
 * Salidas:
 *      -Boolean -> booleano que indicará si el puzzle está resuelto
 * */
this.isDone = function ()
{
    return finished;
}
    
    

}