/*
 *  Nombre: Face.js
 *  Sinopsis: Clase del modelo que se encargará de la lógica de negocio de cada cara de una pieza.
 *  El orden de las caras para todas las operaciones (incluidos los arrays) será el siguiente:
 *  1 -> derecha
 *  2 -> izquierda
 *  3 -> arriba
 *  4 -> abajo
 *  5 -> delante
 *  6 -> detras
 *
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 22-12-2012
 *  Versión: 0.2
 *  Fecha: 20-12-2012
 *  Versión: 0.1
 *  */


/*
 *  CLASE FACE
 *  */
function Face(pos, indexImg, indexSectionX, indexSectionY, rot)
{
    
    
/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Posición en el cubo de la cara de acuerdo con los establecido arriba
    var position;
    //Índice de la imagen que contiene la cara
    var img;
    //Vector de dos elementos que contiene la sección de la imagen
    var section;
    //Rotación en grados de la sección
    var rotation;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase Face.
 * Entradas:
 *      -Integer:pos -> posicion en el cubo de la cara: 1=derecha, 2=izquierda, 3=superior, 4=inferior, 5=delantera, 6=trasera.
 *      -Integer:indexImg -> índice de la imagen que contiene la cara.
 *      -Integer:indexSectionX -> elementos x del vector que contiene la sección de la imagen.
 *      -Integer:indexSectionY -> elementos y del vector que contiene la sección de la imagen.
 *      -Integer:rot -> rotación en grados de la sección
 * Salidas:
 * */
    position = pos;
    img = indexImg;
    section = new THREE.Vector2(indexSectionX, indexSectionY);
    rotation = rot;
    
    
/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: getImg
 * Sinopsis: Método que devuelve índice de la imagen que contiene la cara.
 * Entradas:
 * Salidas:
 *      -Integer -> índice de la imagen que contiene la cara.
 * */
this.getImg = function ()
{
    return img;
}

/*
 * Nombre: getSection
 * Sinopsis: Método que devuelve el vector de dos elementos que contiene la sección de la imagen.
 * Entradas:
 * Salidas:
 *      -Vector2 -> vector de dos elementos que contiene la sección de la imagen.
 * */
this.getSection = function ()
{
    return section;
}

/*
 * Nombre: compareSection
 * Sinopsis: Método que obtiene si las coordenadas suministradas son iguales que la sección de la cara.
 * Entradas:
 *      -Integer:x -> Coordenada x que se comparará.
 *      -Integer:y -> Coordenada y que se comparará.
 * Salidas:
 *      -Boolean -> true si las coordenadas suministradas son iguales que la sección de la cara, false si no.
 * */
this.compareSection = function (x, y)
{
    if(x == section.x && y == section.y)
        return true;
    else
        return false;
}

/*
 * Nombre: isNextSection
 * Sinopsis: Método que determina si dos secciones son contiguas, es decir van una al lado de la otra en la imagen.
 * Entradas:
 *      -Vector2:sect -> Sección que se comparará.
 * Salidas:
 *      -Boolean -> true si las secciones son contiguas y false si no.
 * */
this.isNextSection = function (sect)
{
    //Calculamos las diferencias entre las coordenadas de las secciones
    var difX = Math.abs(section.x - sect.x);
    var difY = Math.abs(section.y - sect.y);
    //Si estan muy alejadas
    if(difX > 1 || difY > 1)
    {
        return false;
    }
    //Si esl a diagonal
    if(difX == 1 && difY == 1)
        return false;
    
    return true;
}

/*
 * Nombre: getRot
 * Sinopsis: Método que devuelve la rotación en grados de la sección.
 * Entradas:
 * Salidas:
 *      -Float -> rotación en grados de la sección.
 * */
this.getRot = function ()
{
    return rotation;
}
 
}