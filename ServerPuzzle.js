/*
 *  Nombre: ServerPuzzle.js
 *  Sinopsis: Clase del lado del servidor que se encargará de la lógica del puzzle.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 06-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE COOPERATIVEPUZZLE
 *  */
function ServerPuzzle()
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Grupo de objetos que contendrá todas las piezas encajadas en el puzzle
    var group = [];    
    //Numero de cubos que tendrá el puzzle
    var numberOfCubes;    
    //Array con lo cubos que forman el puzzle
    var cubes = [];

    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase Puzzle.
 * Entradas:
 * Salidas:
 * */
    
    
/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: createPuzzle
 * Sinopsis: Método para crear un puzzle.
 * Entradas:
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se
 *      indicara mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 * Salidas:
 * */
this.createPuzzle = function (numC)
{
    //Objeto con los datos de un cubo
    function Cube()
    {
        this.position = {x:0, y:0, z:0};
        this.rotation = {x:0, y:0, z:0};
    }

    //Guardamos el numero de cubos que tendra el cubo, comprobamos que sea correcto
    if(numC != 2 && numC != 3) numberOfCubes = 3;
    else numberOfCubes = numC;
    
    //Creamos los cubos
    for(var i=0; i<numberOfCubes*numberOfCubes*numberOfCubes; i++)
    {
        //Creamos el cubo
        var cube = new Cube();
        //Guardamos un ID del cubo
        cube.ID = i+1;
        cube.used = false;
        //Lo introducimos en el array de los cubos
        cubes.push(cube);
    }
    
    //Iniciamos los datos del grupo de objetos que contendra las piezas
    group.position = {x:0, y:0, z:0};
    group.rotation = {x:0, y:0, z:0};
    group.used = false;
    group.ID = 0;
}

/*
 * Nombre: setUsedCube
 * Sinopsis: Método para marcar un cubo como usado o no usado.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo que se quiere marcar como usado o no usado.
 *      -Boolean:isUsed -> booleano que indicará si el cubo esta o no usado.
 * Salidas:
 * */
this.setUsedCube = function (ID, isUsed)
{
    if(ID == 0)
        group.used = isUsed;
    else
        cubes[ID-1].used = isUsed;
}

/*
 * Nombre: isUsedCube
 * Sinopsis: Método para saber si un cubo esta usado o no.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo que se quiere marcar como usado o no usado.
 * Salidas:
 * */
this.isUsedCube = function (ID)
{
    if(ID == 0)
        return group.used;
    else
        return cubes[ID-1].used;
}

/*
 * Nombre: addCube
 * Sinopsis: Método para añadir un cubo al puzzle.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo que se quiere añadir al puzzle.
 * Salidas:
 * */
this.addCube = function (ID)
{
    group.push(cubes[ID-1]);
}

/*
 * Nombre: removeCube
 * Sinopsis: Método para quitar un cubo del puzzle.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo que se quiere quitar del puzzle.
 * Salidas:
 * */
this.removeCube = function (ID)
{
    for(var i=0; i<group.length; i++)
        if(group[i].ID == ID)
        {
            group.splice(i,1);
            break;
        }
}

/*
 * Nombre: setPosition
 * Sinopsis: Método para guardar la posición de un cubo.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo.
 * Salidas:
 * */
this.setPosition = function (ID, posx, posy, posz)
{
    cubes[ID-1].position.x = posx;
    cubes[ID-1].position.y = posy;
    cubes[ID-1].position.z = posz;
}


/*
 * Nombre: getPosition
 * Sinopsis: Método para obtener la posición de un cubo.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo.
 * Salidas:
 * */
this.getPosition = function (ID)
{
    return cubes[ID-1].position;
}

/*
 * Nombre: setRotation
 * Sinopsis: Método para guardar la rotación de un cubo.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo.
 * Salidas:
 * */
this.setRotation = function (ID, rotx, roty, rotz)
{
    if(ID == 0)
    {
        group.rotation.x = rotx;
        group.rotation.y = roty;
        group.rotation.z = rotz;
    }
    else
    {
        cubes[ID-1].rotation.x = rotx;
        cubes[ID-1].rotation.y = roty;
        cubes[ID-1].rotation.z = rotz;
    }
}

/*
 * Nombre: getRotation
 * Sinopsis: Método para guardar la rotación de un cubo.
 * Entradas:
 *      -Integer:ID -> entero que identifica al cubo.
 * Salidas:
 * */
this.getRotation = function (ID)
{
    if(ID == 0)
        return group.rotation;
    else
        return cubes[ID-1].rotation;
}

/*
 * Nombre: isSolved
 * Sinopsis: Método para saber si un puzzle puede estar resuelto.
 * Entradas:
 * Salidas:
 *      -Boolean -> booleano para indicar si un puzzle puede estar resuelto.
 * */
this.isSolved = function ()
{
    //Si el puzzle no contiene todos los cubos
    if(group.length < numberOfCubes)
        return false;
    else
        return true;
}

}

module.exports = new ServerPuzzle();