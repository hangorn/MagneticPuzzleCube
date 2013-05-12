/*
 *  Nombre: TooManyPiecesPuzzleView.js
 *  Sinopsis: Clase de la vista del puzzle con demasiadas piezas.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 18-04-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE TOOMANYPIECESPUZZLEVIEW
 *  */
function TooManyPiecesPuzzleView (sce, numC, mats, finAct)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Escena en la que se mostrarán la vista
    var scene;
    
    //Objeto de la clase puzzle con el cual se realizara la logica de negocio
    var puzzle;
    //Numero de cubos que tendrá el puzzle
    var numberOfCubes;
    //Posiciones iniciales
    var iniPos = [];
    
    //Solucion que se mostrara si el usuario lo indica
    var solution = undefined;
    
    //Linea para delimitar el area del puzzle
    var puzzleArea;
    
    //Función de rellamada que se ejecutará al solucionar el puzzle.
    var finishedAction;
    //Booleano para saber si el puzzle está resuelto
    var isDone = false;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase TooManyPiecesPuzzleView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicara mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 *      -Callback:finAct -> función de rellamada que se ejecutará al solucionar el puzzle.
 * Salidas:
 * */

    scene = sce;
    finishedAction = finAct;
    
    //Guardamos el numero de cubos que tendra el cubo, comprobamos que sea correcto
    if(numC != 2 && numC != 3) numberOfCubes = 3;
    else numberOfCubes = numC;
    
    //Creamos el puzzle
    puzzle = new TooManyPiecesPuzzle(numberOfCubes, mats);
    
    //Creamos las posiciones iniciales dependiendo del numero de cubos
    var separation = 50;
    if(numberOfCubes == 3)
    {
        //Posiciones laterales
        for(var i=0; i<30; i++)
        {
            var v = new THREE.Vector3();
            v.x = (puzzle.getCubeSize()+separation)*(Math.floor(i/6)) + (((Math.floor(i/6)) < 2) ? -(puzzle.getPuzzleAreaSize()/2 + (puzzle.getCubeSize()*1.5+separation*3)) : (puzzle.getPuzzleAreaSize()/2 - puzzle.getCubeSize()*1.5));
            v.y = (puzzle.getCubeSize()+separation)*(i%6) - (separation+puzzle.getCubeSize())*5/2;
            iniPos.push(v);
        }
        //Posiciones inferiores
        for(var i=-1; i<2; i++)
        {
            var v = new THREE.Vector3();
            v.x = (puzzle.getCubeSize()+separation*2)*i;
            v.y = -(separation+puzzle.getCubeSize())*5/2;
            iniPos.push(v);
        }
    }
    else
    {
        for(var i=0; i<12; i++)
        {
            var v = new THREE.Vector3();
            v.x = (puzzle.getCubeSize()+separation)*(Math.floor(i/4)) + (((Math.floor(i/4)) < 1) ? -(puzzle.getPuzzleAreaSize()/2 + (puzzle.getCubeSize()+separation)) : (puzzle.getPuzzleAreaSize()/2));
            v.y = (puzzle.getCubeSize()+separation)*(i%4)  - (separation+puzzle.getCubeSize())*3/2;
            iniPos.push(v);
        }
    }
    //Desordenamos el array
    shuffle(iniPos);
    
    //Colocamos las figuras en sus posiciones iniciales
    for(var i=0; i<puzzle.getPuzzleCubes().length; i++)
    {
        puzzle.getPuzzleCubes()[i].position.copy(iniPos[i]);
        puzzle.getPuzzleCubes()[i].rotation.x = roundAngle(Math.random()*Math.PI*2);
        puzzle.getPuzzleCubes()[i].rotation.y = roundAngle(Math.random()*Math.PI*2);
        //Guardamos su colocacion inicial
        puzzle.getPuzzleCubes()[i].iniPos = iniPos[i];
        puzzle.getPuzzleCubes()[i].iniRot = new THREE.Vector3().copy(puzzle.getPuzzleCubes()[i].rotation);
    }
    
    //Creamos un cuadrado para delimitar el area del puzzle
    var geometry = new THREE.Geometry();
    var vertice;
    vertice = new THREE.Vector3(-puzzle.getPuzzleAreaSize()/2,-puzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(puzzle.getPuzzleAreaSize()/2,-puzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(puzzle.getPuzzleAreaSize()/2,puzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(-puzzle.getPuzzleAreaSize()/2,puzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    vertice = new THREE.Vector3(-puzzle.getPuzzleAreaSize()/2,-puzzle.getPuzzleAreaSize()/2, 0 );
    geometry.vertices.push(vertice);
    var puzzleArea = new THREE.Line( geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }) );
    
    //Añadimos todos los objetos a la escena
    //Añadimos los cubos a la escena    
    for(var i=0; i<puzzle.getPuzzleCubes().length; i++)
    {
        //Si no estan encajados en el puzzle
        if(puzzle.getPuzzleCubes()[i].parent != puzzle.getPuzzle())
            scene.add(puzzle.getPuzzleCubes()[i]);
    }    
    //Añadimos el puzzle
    scene.add(puzzle.getPuzzle());    
    //Añadimos el indicador del area del puzzle
    scene.add(puzzleArea);
    
    //Creamos el controlador
    var puzC = new PuzzleController(camera, scene, puzzle.getPuzzleCubes(), puzzle);
    
    
    
/*****************************************
 *  Métodos Publicos
 *****************************************/  

/*
 * Nombre: rotateShape
 * Sinopsis: Método para girar la figura suministrada los angulos indicados en X e Y.
 * Entradas:
 *      -Object3D:shape -> figura a rotar.
 *      -Float:rotX -> angulo en radianes a rotar la figura en el eje X
 *      -Float:rotY -> angulo en radianes a rotar la figura en el eje Y
 * Salidas:
 * */
this.rotateShape = function (shape, rotX, rotY)
{
    //Creamos una variable para guardar la figura que se va a girar
    var toRotate;
    
    //Comprobamos que la figura no esta en el puzzle
    if(shape.parent == puzzle.getPuzzle())
        toRotate = puzzle.getPuzzle();
    else
        toRotate = shape;
    
    //Giramos la figura
    //Creamos una matriz temporal para hacer transformaciones
    var temp = new THREE.Matrix4();
    //Introducimos la nueva rotacion
    temp.setRotationFromEuler(new THREE.Vector3(rotX, rotY, 0));
    //La transformamos segun la rotacion de la figura
    toRotate.updateMatrix();
    temp.multiply(temp, toRotate.matrix);
    //Extraemos la rotacion de la matriz y la guardamos en el vector
    toRotate.rotation.setEulerFromRotationMatrix(temp);
    
    //Comprobamos si se esta mostrando la solucion y si se esta girando el puzzle
    if(solution && toRotate == puzzle.getPuzzle())
    {
        //Girarmos la solucion igual que el puzzle
        temp.setRotationFromEuler(new THREE.Vector3(rotX, rotY, 0));
        solution.updateMatrix();
        temp.multiply(temp, solution.matrix);
        solution.rotation.setEulerFromRotationMatrix(temp);
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
    //Quitamos los cubos a la escena
    for(var i=0; i<puzzle.getPuzzleCubes().length; i++)
    {
        //Si no estan encajados en el puzzle
        if(puzzle.getPuzzleCubes()[i].parent != puzzle.getPuzzle())
            scene.remove(puzzle.getPuzzleCubes()[i]);
    }
    
    //Quitamos el puzzle
    scene.remove(puzzle.getPuzzle());
    
    //Si se esta mostrando la solucion la ocultamos
    if(solution != undefined)
        scene.remove(solution);
    
    //Quitamos el indicador del area del puzzle
    scene.remove(puzzleArea);
    //Desactivamos el controlador asociado
    puzC.remove();
}

/*
 * Nombre: show
 * Sinopsis: Método para mostrar la vista del puzzle.
 * Entradas:
 * Salidas:
 * */
this.show = function ()
{
    //Añadimos los cubos a la escena
    for(var i=0; i<puzzle.getPuzzleCubes().length; i++)
    {
        //Si no estan encajados en el puzzle
        if(puzzle.getPuzzleCubes()[i].parent != puzzle.getPuzzle())
            scene.add(puzzle.getPuzzleCubes()[i]);
    }
    
    //Añadimos el puzzle
    scene.add(puzzle.getPuzzle());
    
    //Si se esta mostrando la solucion la ocultamos
    if(solution != undefined)
        scene.add(solution);
    
    //Añadimos el indicador del area del puzzle
    scene.add(puzzleArea);
    
    //Activamos el controlador asociado
    puzC.enable();
}
 
/*
 * Nombre: showSolution
 * Sinopsis: Método para mostrar la solución al puzzle como se encuentre el momento de llamar a este método.
 * Entradas:
 * Salidas:
 * */
this.showSolution = function ()
{
    solution = puzzle.getSolution();
    scene.add(solution);
}

/*
 * Nombre: hideSolution
 * Sinopsis: Método para ocultar la solución al puzzle.
 * Entradas:
 * Salidas:
 * */
this.hideSolution = function ()
{
    scene.remove(solution);
    solution = undefined;
}

/*
 * Nombre: cubeInserted
 * Sinopsis: Método que será llamado cada vez que se inserte/encaje un cubo en el puzzle.
 * Entradas:
 * Salidas:
 *      -Boolean -> booleano que indicará si el puzzle ha sido resuelto al encajar la pieza
 * */
this.cubeInserted = function ()
{
    isDone = false;
    //Si se han introducido todas las piezas en el puzzle y no se habia resuelto
    if(puzzle.getPuzzle().children.length == puzzle.getNumberOfCubes())
    {
        if(puzzle.isSolved())
        {
            isDone = true;
            finishedAction();
        }
    }
    if(!isDone)
    {
        if(puzzle.isLastCubeRigthPlaced())
            sound.playRigthPlaced();
        else
            sound.playWrongPlaced();
    }
    return isDone;
}

/*
 * Nombre: placeCube
 * Sinopsis: Método para colocar automáticamente un cubo en el puzzle de manera correcta.
 * Entradas:
 * Salidas:
 * */
this.placeCube = function ()
{
    if(puzzle.placeCube())
        if(this.cubeInserted())
            puzC.setIsDone();
}

/*
 * Nombre: enableController
 * Sinopsis: Método para activar el controlador asociado a la vista.
 * Entradas:
 * Salidas:
 * */
this.enableController = function ()
{
    puzC.enable();
}

/*
 * Nombre: disableController
 * Sinopsis: Método para desactivar el controlador asociado a la vista.
 * Entradas:
 * Salidas:
 * */
this.disableController = function ()
{
    puzC.remove();
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
    return isDone;
}

/*
 * Nombre: setDone
 * Sinopsis: Método para indicar que el puzzle no se seguira resolviendo.
 * Entradas:
 * Salidas:
 * */
this.setDone = function ()
{
    isDone = true;
    puzC.setIsDone();
}

}