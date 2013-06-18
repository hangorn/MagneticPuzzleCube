/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: ColoredPuzzleView.js
 *  Sinopsis: Clase de la vista del puzzle de colores.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 17-04-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE COLOREDPUZZLEVIEW
 *  */
function ColoredPuzzleView (sce, numC, finAct)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

//Array con los materiales de colores
var coloredMaterials;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase PuzzleView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Integer:numC -> numero de cubos que tendra el puzzle, para simplicar se indicara mediante el número de cubos en una dimensión, 27 (3x3x3) => 3.
 *      -Callback:finAct -> función de rellamada que se ejecutará al solucionar el puzzle.
 * Salidas:
 * */

    scene = sce;
    finishedAction = finAct;    
    //Guardamos el numero de cubos que tendra el cubo, comprobamos que sea correcto
    if(numC != 2 && numC != 3) numberOfCubes = 3;
    else numberOfCubes = numC;
    
    //Creamos los materiales de colores
    colors = [0xff0000, 0xffff00, 0x00c000, 0x0080ff, 0xff00ff, 0x804000,
              0xff8000, 0xffc000, 0x005000, 0x00ffff, 0x8000ff, 0x000000,
              0x800000, 0x808000, 0x80ff00, 0x0000ff, 0xff8080, 0x808080];
    materials = [];
    for(var i=0; i<numberOfCubes*6; i++)
        materials.push( new THREE.MeshBasicMaterial({ color:  colors[i]})); 

    //Llamamos al constructor de PuzzleView para heredar todos sus metodos y atributos
    PuzzleView.call(this, scene, numberOfCubes, materials, finAct, true);
    
    coloredMaterials = materials;
    
/*****************************************
 *  Métodos Públicos
 *****************************************/
 
/*
 * Nombre: getMaterials
 * Sinopsis: Método que devuelve un array con los materiales de colores que formarán el puzzle.
 * Entradas:
 * Salidas:
 *      -Material[] -> array con los materiales de colores que formarán el puzzle.
 * */
this.getMaterials = function ()
{
    return coloredMaterials;
}

}