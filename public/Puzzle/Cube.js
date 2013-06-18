/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: Cube.js
 *  Sinopsis: Clase del modelo que se encargará de la lógica de negocio de cada pieza que formará el puzzle.
 *  El orden de las caras para todas las operaciones (incluidos los arrays) será el siguiente:
 *  1 -> derecha
 *  2 -> izquierda
 *  3 -> arriba
 *  4 -> abajo
 *  5 -> delante
 *  6 -> detras
 *
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 31-12-2012
 *  Versión: 0.3
 *  Fecha: 22-12-2012
 *  Versión: 0.2
 *  Fecha: 18-12-2012
 *  Versión: 0.1
 *  */


/*
 *  CLASE CUBE
 *  */
function Cube(mats, cubeSize, imgs, sectionImgs, numberOfSections)
{
    
    
/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Array de objetos Face, que contendrá los 6 objetos que representan las 6 caras del cubo, donde se guardará información de cada cara
    var faces = [];


/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase Cube.
 * Entradas:
 *      -Material:mats -> array con todas las imágenes (materiales) que formarán el puzzle, de las cuales se seleccionarán 6.
 *      -Float:cubeSize -> tamaño del cubo en píxeles.
 *      -Integer[]:imgs -> array con los indices de los 6 materiales de cada cara del cubo, siguiendo el orden descrito arriba.
 *      -Vector3[]:sectionImgs -> Array con 6 vectores de 3 elementos. En X e Y		                0,0  1,0  2,0
 *                                guardaremos la sección (0,0 para la sección arriba a la		0,1  1,1  2,1
 *                                izquierda, 2,2 para la sección de abajo a la derecha) y 		0,2  1,2  2,2
 *                                en Z la rotación de la imagen en grados.
 *      -Vector3:pos -> vector de 3 elementos con la posición inicial del puzzle.
 *      -Integer:numberOfSections -> número de secciones en los que se dibidirá cada imagen de una cara.
 * Salidas:
 * */
    var unTercio = 1/numberOfSections;
    //Primero creamos un array con los materiales a usar, los cuales ya han sido creados
    var materials = []
    for(var i=0; i<6; i++)
        materials.push( mats[imgs[i]] );
        
    //Creamos la geometria del cubo
    var geometry;
    geometry = 	new THREE.CubeGeometry(cubeSize,cubeSize,cubeSize, 1,1,1);
    //Recorremos cada cara para seleccionar la seccion proporcionada
    for(var i=0; i<6; i++)
    {
        var faceUV = geometry.faceVertexUvs[0][i];
	//Obtenemos las secciones correspondiente a la la imagen inversa (ya que en la ultima version de THREE.JS se invierten las imagenes)
	var secImg = [];
	
	//Calculamos las coordenadas de los cuatro vertices de la textura de la seccion, teniendo en
        //cuenta que 0,0 es la esquina superior izquierda de la imagen y 1,1 la esquina inferior derecha
        var coords = [];
	//Trasformamos la seccion a la configuracion de la nueva version de THREE.JS
	//1
	coords.push(new THREE.Vector2(unTercio*(sectionImgs[i].x), unTercio*((numberOfSections-1)-sectionImgs[i].y)+unTercio));
        //0
	coords.push(new THREE.Vector2(unTercio*(sectionImgs[i].x), unTercio*((numberOfSections-1)-sectionImgs[i].y)));
        //3
	coords.push(new THREE.Vector2(unTercio*(sectionImgs[i].x)+unTercio, unTercio*((numberOfSections-1)-sectionImgs[i].y)));
	//2
	coords.push(new THREE.Vector2(unTercio*(sectionImgs[i].x)+unTercio, unTercio*((numberOfSections-1)-sectionImgs[i].y)+unTercio));
        
        //Obtenemos el angulo que esta girada la seccion, si es mayor que 360º obtenemos su equivalente
        var angle = sectionImgs[i].z - 360*Math.floor(sectionImgs[i].z / 360);
        //Obtenemos el numero de veces que hay que girar 90º hacia la izquierda (antihorario) la seccion
        var angle = Math.round(angle/90);
        if(angle == 4) angle = 0;
        //Calculamos las coordenadas de los vertices de la textura teniendo en cuenta el giro, el cual hara
        //que se muevan una posicion hacia atras por cada 90 º las coordenadas anteriormente calculadas
        for(var j=0; j<4; j++)
        {
            //Calculamos el desplazamiento de las coordenadas en los vertices debido al angulo
            var ind = j - angle;
            //Si el indice es negativo se reinicia la cuanta al final
            if(ind < 0)
                ind = j - angle + 4;
            //Guardamos las coordenadas del vertice correspondiente
            faceUV[j] = coords[ind];
        }
    }

    //Llamamos al constructor de THREE.Mesh para heredar todos sus metodos y atributos
    THREE.Mesh.call(this, geometry, new THREE.MeshFaceMaterial(materials) );
    
    //Guardamos la informacion de cada cara: imagen, seccion de la imagen y angulo de rotacion en un nuevo objeto de la clase Face
    for(var i=0; i<6; i++)
    {
        faces[i] = new Face(i, imgs[i], sectionImgs[i].x, sectionImgs[i].y, sectionImgs[i].z - 360*Math.floor(sectionImgs[i].z / 360));
    }    


/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: getFace
 * Sinopsis: Método que devuelve el objeto Face con el indice indicado.
 * Entradas:
 *      -Integer:index -> entero que identifica la cara: 1=derecha, 2=izquierda, 3=superior, 4=inferior, 5=delantera, 6=trasera.
 * Salidas:
 *      -Face -> objeto Face con el indice indicado si este es correcto o null si es incorrecto.
 * */
this.getFace = function (index)
{
    if(index >= 1 && index <= 6)
	return faces[index-1];
    else
	return null;    
}
    
}
//Heredamos de la clase THREE.Mesh
Cube.prototype = new THREE.Mesh;