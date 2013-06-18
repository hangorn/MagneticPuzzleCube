/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: MultiplayerPuzzle.js
 *  Sinopsis: Clase del modelo que se encargará de la lógica de negocio del puzzle multijugador.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 06-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE MULTIPLAYERPUZZLE
 *  */
function MultiplayerPuzzle (numC, mats)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Tamaño del area del puzzle
    var puzzleAreaSize;
    //Grupo de objetos que contendrá todas las piezas encajadas en el puzzle
    var group;
    //Tamaño del cubo
    var cubeSize;
    
    //Numero de cubos que tendrá el puzzle
    var numberOfCubes;    
    //Array con lo cubos que forman el puzzle
    var cubes = [];
    //Materiales con los que esta creado el puzzle
    var materials;

    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase MultiplayerPuzzle.
 * Entradas:
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicara mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 * Salidas:
 * */

    //Se inicia el área del puzzle a 1000 pixeles
    puzzleAreaSize = 1000;
    //Se inicia el el tamaño del cubo a 200 pixeles
    cubeSize = 200;
    //Creamos un nuevo objeto 3D del framework three.js para contener las piezas encajadas
    group = new THREE.Object3D();
    //Asignamos un ID al grupo
    group.ID = 0;
    
    //Guardamos el numero de cubos que tendra el cubo, comprobamos que sea correcto
    if(numC != 2 && numC != 3) numberOfCubes = 3;
    else numberOfCubes = numC;
    //Guardamos los materiales
    materials = mats;
    
    //Creamos los cubos
    var data;
    if(numberOfCubes == 3)
    {
        if(puzzle3Load) data = puzzle3Data;
        else console.error("puzzle:los datos del puzzle3 no estan cargados");
    }
    if(numberOfCubes == 2)
    {
        if(puzzle2Load) data = puzzle2Data;
        else console.error("puzzle:los datos del puzzle2 no estan cargados");
    }
    //Comprobamos si hay imagenes repetidas
    var repeatedIndex = [];
    var repeated = false;
    for(var i=materials.length-1; i>=0; i--)
        for(var j=0; j<i; j++)
            if(materials[i] == materials[j])
            {
                repeated = true;
                repeatedIndex.push([i,j]);
                break;
            }
    
    for(var i=0; i<data.length; i++)
    {
        //Creamos un array con las secciones
        sections = [];
        for(var j=0; j<6; j++)
                sections.push(new THREE.Vector3(data[i].sectionImgs[j][0],data[i].sectionImgs[j][1],data[i].sectionImgs[j][2]) );
        
        var imgs;
        //Si hay imagenes repetidas
        if(repeated)
        {
            imgs = [];
            var found;
            for(var k=0; k<data[i].imgs.length; k++)
            {
                found = false;
                for(var j=0; j<repeatedIndex.length; j++)
                    if(data[i].imgs[k] == repeatedIndex[j][0])
                    {
                        imgs.push(repeatedIndex[j][1]);
                        found = true;
                        break;
                    }
                    
                if(!found)
                    imgs.push(data[i].imgs[k]);
            }
        }
        else
            imgs = data[i].imgs;
        
        //Creamos el cubo
        var cube = new Cube(materials, cubeSize, imgs, sections, numberOfCubes);
        //Guardamos un ID para cada cubo
        cube.ID = i+1;
        //Lo introducimos en el array de los cubos
        cubes.push(cube);
    }    

/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: positionPuzzle
 * Sinopsis: Método para saber las coordenadas locales al puzzle (group) que están mas cerca de donde se encuentra la figura en el mundo 3D.
 *          Es decir se calcula la posición que la pieza debe tener en el puzzle pero relativa a las coordenadas del puzzle,
 *          no a las coordenadas del mundo 3D. Este método es el que realmente simula el efecto imán.
 * Entradas:
 *      -Object3D:object -> objeto 3D, en este caso un cubo para el cual se calculará la posición en el puzzle.
 * Salidas:
 *      -Vector3 -> posición calculada que debe tener la figura en el puzzle.
 * */
var positionPuzzle = function (object)
{
    //Si no hay ninguna figura en el puzzle, se coloca en el centro
    if(group.children.length == 0)
       return new THREE.Vector3(0,0,0);
    
    //Calculamos las posibles posiciones, adyacentes a las figuras ya colocadas
    //Vamos a crear un array ordenado por 'x' luego 'y' y luego 'z' con todas las posibles posiciones
    //Al ordenarlo sera mas facil hacer una busqueda y evitar las repeticiones
    var possiblePositions = [];
    //Recorremos todas las figuras que ya esten introducidas en el puzzle
    for(var i=0; i<group.children.length; i++)
    {
        //Recorremos la seis posibles posiciones: izquierda, derecha, abajo, arriba, detras, delante
        for(var k=0; k<6; k++)
        {
            //Calculamos las seis posibles posiciones: izquierda, derecha, abajo, arriba, detras, delante
            //Creamos un vector con la posicion de la pieza que estamos recorriendo
            var pos = new THREE.Vector3(group.children[i].position.x, group.children[i].position.y, group.children[i].position.z);
            //Le sumamos la posiciones de una de las seis posibles posiciones
            pos.x += (-cubeSize + Math.floor(k%2)*cubeSize*2)*((k==0||k==1)?1:0);
            pos.y += (-cubeSize + Math.floor(k%2)*cubeSize*2)*((k==2||k==3)?1:0);
            pos.z += (-cubeSize + Math.floor(k%2)*cubeSize*2)*((k==4||k==5)?1:0);
            
            //Recorremos la lista de posibles posiciones para introducirlo en orden si no esta ya
            for(var j=0; j<possiblePositions.length; j++)
            {
                //Comparamos la posicion con la posible posicion que se esta recorriendo
                var comp = compareVector3(pos, possiblePositions[j]);
                //Si la posicion ya esta no seguimos buscando
                if(comp == 0)
                {
                    j=-1; //Utilizamos j como flag ademas de como iterador para indicar que el elemento ya se encuentra 
                    break;
                }
                //Si encontramos un elemento mas grande salimos para insertarlo antes
                if(comp == -1)
                    break;
            }
            //Si no esta repetido lo introducimos en las posibles posiciones
            if(j!=-1)
                possiblePositions.splice(j,0,pos);
        }
    }
    
    //Eliminamos de las posibles posiciones aquellas donde ya se encuentre una figura
    for(var i=0; i<group.children.length; i++)
    {
            //Busqueda binaria de la posicion
            var min=0, max=possiblePositions.length-1;
            var buscar = group.children[i].position;
            
            //Comprobamos que el elemento a buscar esta entre los valores minimo y maximo del vector				
            if(compareVector3(buscar, possiblePositions[min]) == -1 || compareVector3(buscar, possiblePositions[max]) == 1)
                    //El elemento a buscar no esta contenido en el vector, seguimos con la siguiente figura
                    continue;
            
            var j
            while(min <= max)
            {
                    j = Math.floor( (min+max) / 2);
                    
                    var comp = compareVector3(buscar, possiblePositions[j]);
                    //Elemento anterior al indice
                    if(comp == -1)
                            max=j-1;
                    //Elemento posterior al indice
                    if(comp == 1)
                            min=j+1;
                    //Coord X, Y, Z iguales => elemento encontrado 
                    if(comp == 0)
                    {
                            possiblePositions.splice(j,1);
                            break;
                    }
            }
    }
    
    //Buscamos la posicion mas cercana a donde se ha soltado la figura
    var min, j=0;
    for(var i=0; i<possiblePositions.length; i++)
    {
            //Calculamos la posicion en el mundo de la posible posicion en el puzzle
            var posWorld = worldCoordFromPuzzlePosition(possiblePositions[i]);
            //Calculamos la distancia entre la posible posicion y el objeto
            var dist = posWorld.distanceTo(object.position);
            if(i==0)
                    min = dist;
            else if(dist < min)
            {
                    min = dist;
                    j=i; //j = indice de la posicion mas cercana
            }
    }
    
    return possiblePositions[j];
}

/*
 * Nombre: rotationPuzzle
 * Sinopsis: Método para saber la rotación mas cercana a un angulo de 90º local al puzzle (group) de la figura proporcionada.
 * Entradas:
 *      -Object3D:object -> objeto 3D para el cual se calculará la rotación en el puzzle.
 * Salidas:
 *      -Vector3 -> rotación calculada que debe tener la figura en el puzzle.
 * */
var rotationPuzzle = function (object)
{
    //Creamos un vector para almacenar la rotacion
    var rot = new THREE.Vector3();
    //Creamos una matriz temporal para hacer transformaciones
    var temp = new THREE.Matrix4();
    //Creamos una matriz para guardar la inversa del puzzle
    var inv = new THREE.Matrix4();
    
    //Introducimos la rotacion de la figura en el mundo
    temp.setRotationFromEuler(object.rotation);
    //Obtenemos la matriz inversa a la del puzzle
    group.updateMatrix();
    inv.getInverse(group.matrix);
    //La transformamos segun la rotacion del puzzle
    temp.multiply(inv, temp);
    //Extraemos la rotacion de la matriz y la guardamos en el vector
    rot.setEulerFromRotationMatrix(temp);
    
    //Redondeamos
    rot.x = roundAngle(rot.x);
    rot.y = roundAngle(rot.y);
    rot.z = roundAngle(rot.z);
    
    return rot;
}

/*
 * Nombre: worldRotationFromPuzzleRotation
 * Sinopsis: Método para calcular la rotación en el mundo de una rotación que se supone será de un objeto en el puzzle.
 * Entradas:
 *      -Vector3:puzzleRot -> Rotación en el puzzle.
 * Salidas:
 *      -Vector3 -> rotación calculada que debe tener la figura en el puzzle.
 * */
var worldRotationFromPuzzleRotation = function (puzzleRot)
{
    //Creamos un vector para almacenar la rotacion
    var rot = new THREE.Vector3();
    //Creamos una matriz temporal para hacer transformaciones
    var temp = new THREE.Matrix4();
    
    //Introducimos la rotacion de la figura en el puzzle
    temp.setRotationFromEuler(puzzleRot);
    //La transformamos segun la rotacion del puzzle
    group.updateMatrix();
    temp.multiply(group.matrix, temp);
    //Extraemos la rotacion de la matriz y la guardamos en el vector
    rot.setEulerFromRotationMatrix(temp);
    
    return rot;
}

/*
 * Nombre: worldCoordFromPuzzlePosition
 * Sinopsis: Método para calcular las coordenadas en el mundo de una posición que se supone será de un objeto en el puzzle.
 * Entradas:
 *      -Vector3:puzzleCoord -> Rotación en el puzzle.
 * Salidas:
 *      -Vector3 -> rotación calculada que debe tener la figura en el puzzle.
 * */
var worldCoordFromPuzzlePosition = function (puzzleCoord)
{
    //Guardamos una copia para no modificar las originales
    var coords = new THREE.Vector3(puzzleCoord.x, puzzleCoord.y, puzzleCoord.z);
    //Aplicamos la matriz de transformacion del puzzle
    group.updateMatrix();
    group.matrix.multiplyVector3(coords);
    //Devolvemos el valor de las nuevas coordenadas
    return coords;
}

/*
 * Nombre: isNext
 * Sinopsis: Método para saber si una posición es adyacente a otra en una distancia determinada.
 * Entradas:
 *      -Vector3:pos1 -> Primera posición que se comparará.
 *      -Vector3:pos2 -> Segunda  posición que se comparará.
 *      -Float:dist -> Distancia para la que se calculara si son adyacentes.
 * Salidas:
 *      -Boolean -> true si son adyacentes y false si no.
 * */
var isNext = function (pos1, pos2, dist)
{
    //Comprobamos que en los tres ejes la distancia entre los dos
    //puntos es menor o igual que la distancia proporcionada
    if(Math.abs(pos1.x - pos2.x) <= dist && Math.abs(pos1.y - pos2.y) <= dist && Math.abs(pos1.z - pos2.z) <= dist)
            return true;
    else
            return false;
}

/*
 * Nombre: getCenterCube
 * Sinopsis: Método para saber el centro del cubo formado en el puzzle.
 * Entradas:
 * Salidas:
 *      -Object3D -> objeto 3D que representa el cubo que se encuentra en el centro o null si no se encuentra.
 * */
var getCenterCube = function ()
{
    //Distancia entre una figura y la posicion mas alejada en un
    //determinado eje a la que puede estar una pieza y seguir
    //formando un cubo de tres piezas, al ser un cubo la distancia
    //es igual en los tres ejes
    var dist=cubeSize*2; //En realidad seria cubeSize/2 + cubeSize + cubeSize/2
    
    //Comprobamos que estan todas las figuras en el puzzle
    if(group.children.length != 27)
            return null;
            
    //Recorremos todas las figuras del puzzle
    for(var i=0; i<group.children.length; i++)
    {
        //Booleano para saber si la figura es el centro
        var isCenter = true;
        
        //Comparamos cada figura con el resto para saber si estan a
        //demasiada distancia para formar un cubo y para saber si
        //son el centro de dicho cubo
        for(var j=0; j<group.children.length; j++)
        {
            //Si la figura con la que vamos a comparar es ella misma
            //nos la saltamos, no comparamos una figura con si misma
            if(j==i)
            {
                j++;
                //Si saltamos a una posicion que no esta en el array
                if(!(j<group.children.length))
                    //Paramos, hemos llegado al final
                    break;						
            }
            //Comprobamos que la distancia entre las dos figuras no
            //sea mayor que la que hay entre las dos piezas mas
            //distantes: es decir mayor que el tamaño del puzzle
            if(Math.abs(group.children[i].position.x - group.children[j].position.x) > dist || Math.abs(group.children[i].position.y - group.children[j].position.y) > dist || Math.abs(group.children[i].position.z - group.children[j].position.z) > dist)
                    return null;
            //Comprobamos si las figuras son adyacentes
            if(isNext(group.children[i].position, group.children[j].position, cubeSize))
            {
                isCenter = true;
            }
            else
            {
                //Las figuras no pueden ser adyacentes, dejamos de comparar
                isCenter = false;
                break;
            }
        }
        
        //Si despues de comparar con el resto de figuras se obtiene
        //que es el centro
        if(isCenter)
            //Se devueve la figura y se deja de buscar
            return group.children[i];
    }
    
    //Si se llega aqui es que no se ha encontrado nigun cubo que sea
    //el centro, con lo cual no estan formando un cubo
    return null;
}

/*
 * Nombre: getCenter
 * Sinopsis: Método para saber el centro del cubo formado en el puzzle.
 * Entradas:
 * Salidas:
 *      -Vector3 -> vector de 3 dimensione que representa la posicion en la que se encuentra en el centro
 *      o null si no se encuentra.
 * */
var getCenter = function ()
{
    //Distancia entre una figura y la posicion mas alejada en un
    //determinado eje a la que puede estar una pieza y seguir
    //formando un cubo de dos piezas, al ser un cubo la distancia
    //es igual en los tres ejes
    var dist=cubeSize; //En realidad seria cubeSize/2 + cubeSize/2
    
    //Comprobamos que estan todas las figuras en el puzzle
    if(group.children.length != 8)
            return null;
        
    //Recorremos todas las figuras del puzzle
    for(var i=0; i<group.children.length; i++)
    {
        //Recorremos todos los vertices de la figura
        for(var l=-1; l<2; l+=2) //Recorremos en X
        for(var m=-1; m<2; m+=2) //Recorremos en Y
        for(var n=-1; n<2; n+=2) //Recorremos en Z
        {
            //Booleano para saber si la figura es el centro
            var isCenter = true;
            
            var vert = new THREE.Vector3();
            vert.x = group.children[i].position.x + cubeSize/2*l;
            vert.y = group.children[i].position.y + cubeSize/2*m;
            vert.z = group.children[i].position.z + cubeSize/2*n;
            
            //Comparamos cada vertice con el resto de cubos para saber
            //si estan a demasiada distancia para formar un cubo y para
            //saber si son el centro de dicho cubo
            for(var j=0; j<group.children.length; j++)
            {
                //Si la figura con la que vamos a comparar es ella misma
                //nos la saltamos, no comparamos una figura con si misma
                if(j==i)
                {
                    j++;
                    //Si saltamos a una posicion que no esta en el array
                    if(!(j<group.children.length))
                        //Paramos, hemos llegado al final
                        break;						
                }
                
                //Comprobamos que la distancia entre las dos figuras no
                //sea mayor que la que hay entre las dos piezas mas
                //distantes: es decir mayor que el tamaño del puzzle
                if(Math.abs(group.children[i].position.x - group.children[j].position.x) > dist || Math.abs(group.children[i].position.y - group.children[j].position.y) > dist || Math.abs(group.children[i].position.z - group.children[j].position.z) > dist)
                    return null;
                
                //Comprobamos si la figura es adyacente al vertice
                if(isNext(vert, group.children[j].position, cubeSize/2))
                {
                    isCenter = true;
                }
                else
                {
                    //Dejamos de comparar con este vertice (no puede ser el centro)
                    isCenter = false;
                    break;
                }
                
            }
            
            //Si despues de comparar el vertice con el resto de figuras se obtiene
            //que es el centro
            if(isCenter)
                //Se devueve el vertice central y se deja de buscar
                return vert;
        }
    }
    
    //Si se llega aqui es que no se ha encontrado nigun vertice
    //que sea el centro, con lo cual no estan formando un cubo
    return null;
}

/*
 * Nombre: getCube
 * Sinopsis: Método para obtener el objeto del cubo que se encuentra en la posición suministrada.
 * Entradas:
 *      -Vector3:pos -> posición en la que se buscará el cubo.
 * Salidas:
 *      -Object3D -> objeto 3D que representa el cubo buscado o null si no se encuentra.
 * */
var getCube = function (pos)
{
    for(var i=0; i<group.children.length; i++)
    {
        if(group.children[i].position.x == pos.x && group.children[i].position.y == pos.y && group.children[i].position.z == pos.z)
            return group.children[i];
    }
    return null;
}

/*
 * Nombre: getFaceCubes
 * Sinopsis: Método que devuelve los cubos que forman una cara del puzzle cuando este es un cubo.
 * Entradas:
 *      -Integer:face -> entero que identifica la cara: 1=derecha, 2=izquierda, 3=superior, 4=inferior, 5=delantera, 6=trasera.
 *      -Vecto3:center -> vector de 3 elementos que representa el centro a partir del cual se obtendran los cubos.
 * Salidas:
 *      -Object3D[] -> array de objetos 3D con los cubos de la cara solicitada.
 * */
var getFaceCubes = function (face, center)
{
    var cubes = [];
    
    //Si el numero de cubos es 3 (27 en total)
    if(numberOfCubes == 3) switch(face)
    {
        //Cara derecha
        case 1:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=1; i>-2; i--)
                for(var j=1; j>-2; j--)
                    cubes.push(getCube(new THREE.Vector3(cubeSize+center.x,cubeSize*i+center.y,cubeSize*j+center.z)));
            break;
        //Cara izquierda
        case 2:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=1; i>-2; i--)
                for(var j=-1; j<2; j++)
                   cubes.push(getCube(new THREE.Vector3(-cubeSize+center.x,cubeSize*i+center.y,cubeSize*j+center.z)));
            break;
        //Cara superior
        case 3:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=-1; i<2; i++)
                for(var j=-1; j<2; j++)
                    cubes.push(getCube(new THREE.Vector3(cubeSize*j+center.x,cubeSize+center.y,cubeSize*i+center.z)));
            break;
        //Cara inferior
        case 4:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=1; i>-2; i--)
                for(var j=-1; j<2; j++)
                   cubes.push(getCube(new THREE.Vector3(cubeSize*j+center.x,-cubeSize+center.y,cubeSize*i+center.z)));
            break;
        //Cara delantera
        case 5:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=-1; i<2; i++)
                for(var j=1; j>-2; j--)
                    cubes.push(getCube(new THREE.Vector3(cubeSize*j+center.x,cubeSize*i+center.y,cubeSize+center.z)));
            break;
        //Cara trasera
        case 6:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=-1; i<2; i++)
                for(var j=-1; j<2; j++)
                    cubes.push(getCube(new THREE.Vector3(cubeSize*j+center.x,cubeSize*i+center.y,-cubeSize+center.z)));
            break;
        default :
            return null;
    }
    
    //Si el numero de cubos es 2 (8 en total)
    if(numberOfCubes == 2) switch(face)
    {
        //Cara derecha
        case 1:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=1; i>-2; i-=2)
                for(var j=1; j>-2; j-=2)
                    cubes.push(getCube(new THREE.Vector3(cubeSize/2+center.x,cubeSize/2*i+center.y,cubeSize/2*j+center.z)));
            break;
        //Cara izquierda
        case 2:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=1; i>-2; i-=2)
                for(var j=-1; j<2; j+=2)
                    cubes.push(getCube(new THREE.Vector3(-cubeSize/2+center.x,cubeSize/2*i+center.y,cubeSize/2*j+center.z)));
            break;
        //Cara superior
        case 3:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=-1; i<2; i+=2)
                for(var j=-1; j<2; j+=2)
                    cubes.push(getCube(new THREE.Vector3(cubeSize/2*j+center.x,cubeSize/2+center.y,cubeSize/2*i+center.z)));
            break;
        //Cara inferior
        case 4:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=1; i>-2; i-=2)
                for(var j=-1; j<2; j+=2)
                    cubes.push(getCube(new THREE.Vector3(cubeSize/2*j+center.x,-cubeSize/2+center.y,cubeSize/2*i+center.z)));
            break;
        //Cara delantera
        case 5:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=-1; i<2; i+=2)
                for(var j=1; j>-2; j-=2)
                    cubes.push(getCube(new THREE.Vector3(cubeSize/2*j+center.x,cubeSize/2*i+center.y,cubeSize/2+center.z)));
            break;
        //Cara trasera
        case 6:
            //Recorremos con dos bucles las posiciones de las cubos
            //guardandolos en el array
            for(var i=-1; i<2; i+=2)
                for(var j=-1; j<2; j+=2)
                    cubes.push(getCube(new THREE.Vector3(cubeSize/2*j+center.x,cubeSize/2*i+center.y,-cubeSize/2+center.z)));
            break;
        default :
            return null;
    }
    
    return cubes;
}

/*
 * Nombre: getFaceIndex
 * Sinopsis: Método que devuelve el número de la cara de un cubo que se encuentra en una cara del puzzle.
 * Entradas:
 *      -Object3D:cube -> objeto 3D que representa al cubo del que se quiere obtener la cara.
 *      -Integer:puzzleFace -> entero que identifica la cara del puzzle: 1=derecha, 2=izquierda, 3=superior, 4=inferior, 5=delantera, 6=trasera.
 * Salidas:
 *      -Vector2 -> vector de dos componentes donde el primero es el identificador de la cara y el segundo la rotacion de esta.
 * */
var getFaceIndex = function (cube, puzzleFace)
{
    //Si no esta el cubo en el puzzle hay que ponerlo temporalmente con una rotacion como si estuviera en el puzzle
    if(cube.parent != group)
    {
        var rotIni = new THREE.Vector3().copy(cube.rotation);
        var rot = rotationPuzzle(cube);
        cube.rotation.copy(rot);
    }
    //Obtenemos la matriz de rotacion del cubo
    var mat = new THREE.Matrix4();
    cube.updateMatrix();
    mat.extractRotation(cube.matrix);    
    
    //Obtenemos las coordenadas de la cara que estamos buscando y aprovechamos que el cubo ya las tiene creadas para extraerselas
    var faceCoords = [];
    faceCoords.push(cube.geometry.vertices[cube.geometry.faces[puzzleFace-1].a]);
    faceCoords.push(cube.geometry.vertices[cube.geometry.faces[puzzleFace-1].b]);
    faceCoords.push(cube.geometry.vertices[cube.geometry.faces[puzzleFace-1].c]);
    faceCoords.push(cube.geometry.vertices[cube.geometry.faces[puzzleFace-1].d]);
    //Recorremos las caras del cubo
    var indexes = [];
    var rot;
    for(var i=0; i<cube.geometry.faces.length; i++)
    {
        //Guardamos los indices de la cara para poder recorrerlos
        var faceIndex = [cube.geometry.faces[i].a, cube.geometry.faces[i].b, cube.geometry.faces[i].c, cube.geometry.faces[i].d];
        //Recorremos los vertices de la cara	
        for(k=0; k<4; k++)	
        {
            //Guardamos en un vector temporal el vertice
            var temp = new THREE.Vector3(cube.geometry.vertices[faceIndex[k]].x, cube.geometry.vertices[faceIndex[k]].y, cube.geometry.vertices[faceIndex[k]].z);
            //Le aplicamos la matriz de rotacion del cubo
            mat.multiplyVector3(temp);
            //Aproximamos el vertice, ya que al aplicar la matriz se puede producir un pequeño desajuste,
            //del orden de 10^-14 y solo con esto las comparaciones ya no serian posibles
            temp.x = Math.round(temp.x);
            temp.y = Math.round(temp.y);
            temp.z = Math.round(temp.z);
            //Buscamos si el vertice pertenece a la cara buscada
            for(var j=0; j<4; j++)
            {
                //En caso de encontrarlo
                if(temp.x == faceCoords[j].x && temp.y == faceCoords[j].y && temp.z == faceCoords[j].z)
                {
                    //Guardamos el indice
                    indexes.push(faceIndex[k]);
                    //Si es el primer vertice guardamos el desplazamiento que hay en posiciones respecto a la cara buscada
                    //Asi podremos obtener la rotacion que tiene la cara
                    if(k==0)
                            rot=j;
                    break;
                }
            }
        }
        
        //Si se han encontrado los cuatro vertices de la cara
        if(indexes.length == 4)
            //Dejamos de buscar, hemos encontrado la cara
            break;
        else
            //Vaciamos el array de los indices, no es la cara, y seguimos buscando
            indexes = [];
    }
    
    //Si no esta en el puzzle restauramos la rotacion inicial
    if(cube.parent != group)
        cube.rotation.copy(rotIni);
    
    //Obtenemos el angulo de rotacion
    rot*=90;
    
    //Obtenemos el numero de la cara teniendo en cuenta estas equivalencias con los indices:
    //              caras     indices
    //cara derecha -> 	1  :  0 2 3 1
    //cara izquierda -> 2  :  4 6 7 5
    //cara arriba -> 	3  :  4 5 0 1
    //cara abajo -> 	4  :  7 6 3 2
    //cara delante -> 	5  :  5 7 2 0
    //cara detras -> 	6  :  1 3 6 4
    var face;
    if(indexes[0] == 0)
        face = 1;
    else if(indexes[0] == 4)
    {
        if(indexes[1] == 6)
            face = 2;
        else if(indexes[1] == 5)
            face = 3;
        else
            //En teoria a este punto no podria llegar nunca
            return null;
    }
    else if(indexes[0] == 1)
        face = 6;
    else if(indexes[0] == 5)
        face = 5;
    else if(indexes[0] == 7)
        face = 4;
    else
        //En teoria a este punto no podria llegar nunca
        return null;
    
    //Devolvemos un vector de dos componentes donde el primero es la cara y el segundo la rotacion de esta
    return new THREE.Vector2(face, rot);
}

/*
 * Nombre: sectionToPuzzleCoord
 * Sinopsis: Método que calcula las coordenadas de una seccion en el puzzle dependiendo de la rotación de esta y
 * de la cara en la que se encuentre, en unidades de la sección, entre 1 y -1, con el centro del eje de coordenadas
 * en el centro de la imagen que forman las secciones.
 * Entradas:
 *      -Vector2:sect -> vector de dos elementos con las coordenadas de la sección.
 *      -Integer:rot -> ángulo en grados que esta girada la sección.
 *      -Integer:face -> entero que identifica la cara: 0=derecha, 1=izquierda, 2=superior, 3=inferior, 4=delantera,
 *      5=trasera.
 * Salidas:
 *      -Boolean -> booleano que será true si están colocadas correctamente y false si no.
 * */
var sectionToPuzzleCoord = function (sect, rot, face)
{
    var coord = new THREE.Vector3();
    //Segun el eje que corresponda
    if(face == 0 || face == 1) //eje X
    {
        coord.x = undefined;
        if(rot == 0)
        {
            coord.y = - (sect.y*(4-numberOfCubes)-1);
            coord.z = - (1-face*2)*(sect.x*(4-numberOfCubes)-1);
        }
        if(rot == 90)
        {
            coord.y = + (sect.x*(4-numberOfCubes)-1);
            coord.z = - (1-face*2)*(sect.y*(4-numberOfCubes)-1);
        }
        if(rot == 180)
        {
            coord.y = + (sect.y*(4-numberOfCubes)-1);
            coord.z = + (1-face*2)*(sect.x*(4-numberOfCubes)-1);
        }
        if(rot == 270)
        {
            coord.y = - (sect.x*(4-numberOfCubes)-1);
            coord.z = + (1-face*2)*(sect.y*(4-numberOfCubes)-1);
        }
    }
    if(face == 2 || face == 3) //eje Y
    {
        coord.y = undefined;
        if(rot == 0)
        {
            coord.z = + (1-(face-2)*2)*(sect.y*(4-numberOfCubes)-1);
            coord.x = + (sect.x*(4-numberOfCubes)-1);
        }
        if(rot == 90)
        {
            coord.z = - (1-(face-2)*2)*(sect.x*(4-numberOfCubes)-1);
            coord.x = + (sect.y*(4-numberOfCubes)-1);
        }
        if(rot == 180)
        {
            coord.z = - (1-(face-2)*2)*(sect.y*(4-numberOfCubes)-1);
            coord.x = - (sect.x*(4-numberOfCubes)-1);
        }
        if(rot == 270)
        {
            coord.z = + (1-(face-2)*2)*(sect.x*(4-numberOfCubes)-1);
            coord.x = - (sect.y*(4-numberOfCubes)-1);
        }
    }
    if(face == 4 || face == 5) //eje Z
    {
        coord.z = undefined;
        if(rot == 0)
        {
            coord.y = - (sect.y*(4-numberOfCubes)-1);
            coord.x = - ((face-4)*2-1)*(sect.x*(4-numberOfCubes)-1);
        }
        if(rot == 90)
        {
            coord.y = + (sect.x*(4-numberOfCubes)-1);
            coord.x = - ((face-4)*2-1)*(sect.y*(4-numberOfCubes)-1);
        }
        if(rot == 180)
        {
            coord.y = + (sect.y*(4-numberOfCubes)-1);
            coord.x = + ((face-4)*2-1)*(sect.x*(4-numberOfCubes)-1);
        }
        if(rot == 270)
        {
            coord.y = - (sect.x*(4-numberOfCubes)-1);
            coord.x = + ((face-4)*2-1)*(sect.y*(4-numberOfCubes)-1);
        }
    }
    return coord;
}


/*
 * Nombre: isSectionsProperlyPlaced
 * Sinopsis: Método que calcula si una seccion esta correctamente colocada respecto a otra teniendo en cuenta que
 *          ambas están giradas el mismo angulo.
 * Entradas:
 *      -Vector2:sect1 -> vector de dos elementos con las coordenadas de la primera sección.
 *      -Vector2:sect2 -> vector de dos elementos con las coordenadas de la segunda sección.
 *      -Vector2:pos1 -> posición del cubo con la primera sección.
 *      -Vector2:pos2 -> posición del cubo con la segunda sección.
 *      -Integer:rot -> ángulo en grados que esta girada las secciones.
 *      -Integer:face -> entero que identifica la cara: 0=derecha, 1=izquierda, 2=superior, 3=inferior, 4=delantera, 5=trasera.
 * Salidas:
 *      -Boolean -> booleano que será true si están colocadas correctamente y false si no.
 * */
var isSectionsProperlyPlaced = function (sect1, sect2, pos1, pos2, rot, face)
{
    //Obtenemos las coordenadas de las secciones centradas en el centro de su cara y giradas segun el mundo
    var sect1Coords = sectionToPuzzleCoord(sect1, rot, face);
    var sect2Coords = sectionToPuzzleCoord(sect2, rot, face);
    
    //Segun que cara sea
    if(sect1Coords.x == undefined)
    {
        //Comparamos la diferencia de las coordenadas de las secciones con la diferencia de las posiciones
        var secDifY = (sect1Coords.y - sect2Coords.y)*cubeSize*(numberOfCubes-1)/2;
        var secDifZ = (sect1Coords.z - sect2Coords.z)*cubeSize*(numberOfCubes-1)/2;
        var posDifY = pos1.y - pos2.y;
        var posDifZ = pos1.z - pos2.z;
        if(secDifY == posDifY && secDifZ == posDifZ)
            return true;
        else
            return false;
    }
    if(sect1Coords.y == undefined)
    {
        //Comparamos la diferencia de las coordenadas de las secciones con la diferencia de las posiciones
        var secDifX = (sect1Coords.x - sect2Coords.x)*cubeSize*(numberOfCubes-1)/2;
        var secDifZ = (sect1Coords.z - sect2Coords.z)*cubeSize*(numberOfCubes-1)/2;
        var posDifX = pos1.x - pos2.x;
        var posDifZ = pos1.z - pos2.z;
        if(secDifX == posDifX && secDifZ == posDifZ)
            return true;
        else
            return false;
    }
    if(sect1Coords.z == undefined)
    {
        //Comparamos la diferencia de las coordenadas de las secciones con la diferencia de las posiciones
        var secDifX = (sect1Coords.x - sect2Coords.x)*cubeSize*(numberOfCubes-1)/2;
        var secDifY = (sect1Coords.y - sect2Coords.y)*cubeSize*(numberOfCubes-1)/2;
        var posDifX = pos1.x - pos2.x;
        var posDifY = pos1.y - pos2.y;
        if(secDifX == posDifX && secDifY == posDifY)
            return true;
        else
            return false;
    }
}



/*****************************************
 *  Métodos Públicos
 *****************************************/
 
/*
 * Nombre: isSolved
 * Sinopsis: Método que devuelve un booleano en funcion de si el puzzle esta resuelto o no.
 * Entradas:
 * Salidas:
 *      -Boolean -> true si el puzzle está resuelto y false si no.
 * */
this.isSolved = function ()
{
    //Si es un puzzle de 3 cubos
    if(numberOfCubes == 3)
    {
        //Obtenemos el centro del cubo si existe
        var center = getCenterCube();
        //Si no existe devolvemos falso, ya que no esta resuelto, no forma un cubo
        if(!center)
            return false;
        center = center.position;
    }
    //Si es un puzzle de 2 cubos
    if(numberOfCubes == 2)
    {
        //Obtenemos el centro del cubo si existe
        var center = getCenter();
         //Si no existe devolvemos falso, ya que no esta resuelto, no forma un cubo
        if(!center)
            return false;
    }    
            
    //Recorremos cada cara del puzzle
    for(var i=1; i<7; i++)
    {
        //Obtenemos los cubos que forman la cara
        var faceCubes = getFaceCubes(i, center);
        //Si es el puzzle con 3 cubos, comprobamos que el cubo del centro (indice 4)
        //tiene una seccion con coordenadas 1,1, es decir del centro de la imagen
        if(numberOfCubes == 3 && !faceCubes[4].getFace(getFaceIndex(faceCubes[4],i).x).compareSection(1,1))
            //Si no tiene una seccion central no esta solucionado el puzzle
            return false;
            
         //Calculamos el indice de la cara del primer cubo
        var currentFaceIndex = getFaceIndex(faceCubes[0],i);
        
        //Recorremos cada cubo de la cara para comprobar si todas las caras tienen la misma imagen y la misma rotacion
        for(var j=0; j<faceCubes.length-1; j++)
        {
            //Calculamos el indice de la cara siguiente
            var nextFaceIndex = getFaceIndex(faceCubes[j+1],i);
            
            //Comparamos cada imagen de la cara con la imagen del siguiente cubo
            if(faceCubes[j].getFace(currentFaceIndex.x).getImg() != faceCubes[j+1].getFace(nextFaceIndex.x).getImg())
                return false;
            
            //Diferencia de rotacion entre la rotacion actual y la rotacion inicial
            //(almacenada inicialmente) en esta seccion de imagen
            var currentDif = currentFaceIndex.y - faceCubes[j].getFace(currentFaceIndex.x).getRot();
            if(currentDif < 0)
                currentDif+=360;
            //Diferencia en la seccion de imagen del cubo siguiente
            var nextDif = nextFaceIndex.y - faceCubes[j+1].getFace(nextFaceIndex.x).getRot();
            if(nextDif < 0)
                nextDif+=360;
            //Comparamos la diferencia de rotacion entre la actual y la original de cada seccion con la siguiente
            if(currentDif != nextDif)
                return false;
            
            //Igualamos el indice de la siguiente cara con el actual, ya que en la siguiente iteracion sera el actual
            currentFaceIndex = nextFaceIndex;
        }
    }
    
    //Si se llega a este punto es que todas las caras estan bien formadas
    return true;
}

/*
 * Nombre: isPuzzleZone
 * Sinopsis: Método para saber si una posición esta en la zona del puzzle.
 * Entradas:
 *      -Vector2:position -> Posición para la que realizara el cálculo.
 * Salidas:
 *      -Boolean -> true si se encuentra en la zona del puzzle y false si no.
 * */
this.isPuzzleZone = function (position)
{
    if(position.x < -puzzleAreaSize/2 || position.x > puzzleAreaSize/2 || position.y < -puzzleAreaSize/2 || position.y > puzzleAreaSize/2)
        return false;
    else
        return true;			
}

/*
 * Nombre: getPuzzle
 * Sinopsis: Método para obtener el objeto 3D que representa al grupo de piezas encajadas en el puzzle.
 * Entradas:
 * Salidas:
 *      -Object3D -> objeto 3D que representa al grupo de piezas encajadas en el puzzle.
 * */
this.getPuzzle = function ()
{
    return group;
}

/*
 * Nombre: getPuzzleCubes
 * Sinopsis: Método para obtener el array de objetos 3D de piezas del puzzle.
 * Entradas:
 * Salidas:
 *      -Object3D[] -> array de objetos 3D de piezas del puzzle.
 * */
this.getPuzzleCubes = function ()
{
    return cubes;
}

/*
 * Nombre: getCubeSize
 * Sinopsis: Método para obtener el tamaño de los cubos.
 * Entradas:
 * Salidas:
 *      -Integer -> tamaño de los cubos en pixeles.
 * */
this.getCubeSize = function ()
{
    return cubeSize;
}

/*
 * Nombre: getSizeCube
 * Sinopsis: Método para obtener el tamaño del área del puzzle.
 * Entradas:
 * Salidas:
 *      -Integer -> tamaño del área del puzzle.
 * */
this.getPuzzleAreaSize = function ()
{
    return puzzleAreaSize;
}

/*
 * Nombre: getNumberOfCubes
 * Sinopsis: Método para obtener el tamaño del área del puzzle.
 * Entradas:
 * Salidas:
 *      -Integer -> tamaño del área del puzzle.
 * */
this.getNumberOfCubes = function ()
{
    return numberOfCubes*numberOfCubes*numberOfCubes;
}

/*
 * Nombre: putOutCube
 * Sinopsis: Método para sacar del puzzle el cubo indicado, solo cambia la rotación y traslación que tenia en el puzzle por las del mundo 3D.
 * Entradas:
 *      -Cube:c -> cubo que se sacará del puzzle.
 * Salidas:
 * */
this.putOutCube = function (c)
{
    //Calculamos las coordenadas en el mundo de la figura a partir de las que tenia en el puzzle
    c.position.copy(worldCoordFromPuzzlePosition(c.position));
    //Calculamos la rotacion en el mundo de la figura a partir de la que tenia en el puzzle
    c.rotation.copy(worldRotationFromPuzzleRotation(c.rotation));
}

/*
 * Nombre: putInCube
 * Sinopsis: Método para introducir en el puzzle el cubo indicado, solo cambia la rotación y traslación que tenia en el mundo 3D por las del puzzle.
 * Entradas:
 *      -Cube:c -> cubo que se introducirá en el puzzle.
 * Salidas:
 * */
this.putInCube = function (c)
{
    //Calculamos las coordenadas en el puzzle de la figura a partir de las que tenia en el mundo
    c.position.copy(positionPuzzle(c));
    //Calculamos la rotacion en el puzzle de la figura a partir de la que tenia en el mundo
    c.rotation.copy(rotationPuzzle(c));
}
/*
 * Nombre: isLastCubeRigthPlaced
 * Sinopsis: Método para averiguar si el último cubo introducido en el puzzle esta bien colocado,
 *          es decir, si alguna de las caras del cubo esta bien colocada respecto a algun cubo que
 *          ya esté en el puzzle.
 * Entradas:
 * Salidas:
 *      -Boolean -> booleano que será true si alguna cara del último cubo colocado
 *      coincide con alguna del puzzle, false si no.
 * */
this.isLastCubeRigthPlaced = function ()
{
    //Si solo hay un cubo o ninguno
    if(group.children.length < 2)
        return true;
    
    //Obtenemos el ultimo cubo introducido en el puzzle
    var lastCube = group.children[group.children.length-1];
    
    //Recorremos las 6 caras del ultimo cubo
    for(var i=0; i<6; i++)
    {
        //Creamos un array para guardar los cubos con las cuatro posibles caras adyacentes
        var nextFaces = [];
        //Buscamos los cubos
        for(var j=0; j<4; j++)
        {
            var nextPos = new THREE.Vector3().copy(lastCube.position);
            //Calculamos la posicion adyacente
            //Cara en el eje X (izquierda o derecha)
            if(Math.floor(i/2) == 0)
            {
                nextPos.y += Math.floor(j/2)*(j*2-5)*cubeSize;
                nextPos.z += (1-Math.floor(j/2))*(j*2-1)*cubeSize;
            }
            //Cara en el eje Y (superior o inferior)
            if(Math.floor(i/2) == 1)
            {
                nextPos.x += Math.floor(j/2)*(j*2-5)*cubeSize;
                nextPos.z += (1-Math.floor(j/2))*(j*2-1)*cubeSize;
            }
            //Cara en el eje Z (delantera o trasera)
            if(Math.floor(i/2) == 2)
            {
                nextPos.x += Math.floor(j/2)*(j*2-5)*cubeSize;
                nextPos.y += (1-Math.floor(j/2))*(j*2-1)*cubeSize;
            }
            //Obtenemos el cubo de la posicion adyacente
            var cube = getCube(nextPos);
            if(cube != null)
                nextFaces.push(cube);
        }
        
        //Obtenemos la rotacion y la imagen de la cara correspondiente del ultimo cubo colocado
        var index = getFaceIndex(lastCube, i+1);
        var img = lastCube.getFace(index.x).getImg();
        var rot = index.y - lastCube.getFace(index.x).getRot();
        var sect = lastCube.getFace(index.x).getSection();
        //Recorremos las caras adyacentes para comprobar si coincide
        for(var j=0; j<nextFaces.length; j++)
        {
            //Obtenemos la rotacion y la imagen de la cara adyacente
            var index = getFaceIndex(nextFaces[j], i+1);
            var imgNext = nextFaces[j].getFace(index.x).getImg();
            var rotNext = index.y - nextFaces[j].getFace(index.x).getRot();
            
            //Si no tienen la misma imagen y rotacion seguimos con la siguiente seccion
            if(img != imgNext || rot != rotNext)
                continue;
            //Comprobamos que estan bien colocadas una respecto a otra
            var sectNext = nextFaces[j].getFace(index.x).getSection();
            var b = isSectionsProperlyPlaced(sect, sectNext, lastCube.position, nextFaces[j].position, rot, i);
            //Si estan bien colocadas
            if(b)
                //Indicamos que el cubo esta bien encajado respecto a una cara de una pieza por lo menos
                return true;
        }
    }
    return false;
}

}