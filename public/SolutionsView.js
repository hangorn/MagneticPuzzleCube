/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: SolutionsView.js
 *  Sinopsis: Clase de la vista de la biblioteca de imágenes.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 17-01-2013
 *  Versión: 0.2
 *  Fecha: 10-01-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE SOLUTIONSVIEW
 *  */
function SolutionsView (camera, sce, numC, mats, sens)
{
/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/
    
    //Escena en la que se mostrarán la vista
    var scene;
    
    //Array con los cubos de las soluciones
    var cubes = [];

    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase SolutionsView.
 * Entradas:
 *      -Camera:cam -> cámara con la que se realizarán los cálculos de la interacción.
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicara mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Material[]:mats -> array con los materiales a usar para crear el puzzle.
 *      -Float:sens -> sensibilidad proporcionada para realizar los giros.
 * Salidas:
 * */

    scene = sce;    
    
    //Creamos los cubos de las soluciones
    for(var i=0; i<numC; i++)
    {
        //Obtenemos los 6 materiales del cubo
        var materials = [];
        for(var j=0; j<6; j++)
                materials.push(mats[j+i*6]);
        //Creamos el cubo
        var cube = new THREE.Mesh( new THREE.CubeGeometry( 400, 400, 400, 1,1,1 ), new THREE.MeshFaceMaterial(materials) );
        cube.position.x = 0;
        cube.position.y = -i*500 + 500;
        cube.rotation.x = 0.5;
        cube.rotation.y = 0.5;
        //Añadimos la figura a la escena
        scene.add(cube);
        //Lo introducimos en el array de objetos de la escena
        cubes.push(cube);
    }
    
    var solC = new SolutionsController(camera, scene, cubes, sens);
   
    
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
    var toRotate = shape;
    
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
}

}
