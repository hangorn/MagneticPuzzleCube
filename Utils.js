/*
 *  Nombre: Utils.js
 *  Sinopsis: Fichero con funciones auxiliares.
 *
 *  Autor: Vaquero Marcos, Javier
 *  Autor: Stephane Roucheray
 *  Fecha: 23-12-2012
 *  Versión: 0.1
 *  */
	
        
/*****************************************
 *  Funciones Varias
 *****************************************/

/*
 * Nombre: compareVector3
 * Sinopsis: Función que compara vectores de tres componenetes X, Y, Z. Primero compara X, si son iguales compara Y, y si también son iguales compara Z.
 * Entradas:
 *      -Vector3:a -> primer vector de tres elementos a comparar.
 *      -Vector3:b -> segundo vector de tres elementos a comparar.
 * Salidas:
 *      -Integer -> -1=menor que, 1=mayor que, 0=igual.
 * */
function compareVector3(a, b)
{
    if(a.x < b.x) //X menor que				
        return -1;					
    else if(a.x > b.x) //X mayor que
        return 1;
    else if(a.y < b.y) //X igual Y menor que
        return -1;
    else if(a.y > b.y) //X igual Y mayor que
        return 1;
    else if(a.z < b.z) //X Y igual Z menor que
        return -1;
    else if(a.z > b.z) //X Y igual Z mayor que
        return 1;
    else //X Y Z iguales
        return 0;
}

/*
 * Nombre: round2Power
 * Sinopsis: Función que aproxima a la potencia de dos más cercana.
 * Entradas:
 *      -Float:number -> entero que se aproximará a la potencia de dos más cercana.
 * Salidas:
 *      -Integer -> entero aproximado a la potencia de dos mas cercana.
 * */
function round2Power(number)
{
    var logarithm, rounded, power;
    logarithm = Math.log(number) / Math.log(2);
    power = Math.round(logarithm);
    rounded = Math.pow(2, power);
    return rounded;
}

/*
 * Nombre: roundAngle
 * Sinopsis: Función que aproxima al angulo multiplo de 90 grados / Pi/2 radianes mas cercano.
 * Entradas:
 *      -Float:angle -> ángulo en radianes que se aproximará al multiplo de 90 grados / Pi/2 radianes mas cercano.
 * Salidas:
 *      -Float -> ángulo aproximado al multiplo de 90 grados / Pi/2 radianes mas cercano.
 * */
function roundAngle(angle)
{
    var div, rounded;
    div = angle/(Math.PI/2);
    rounded = (Math.PI/2)*Math.round(div);
    return rounded;
}

/*
 * Nombre: deg2Rad
 * Sinopsis: Función que convierte grados en radianes.
 * Entradas:
 *      -Float:degrees -> ángulo que se convertirá en radianes.
 * Salidas:
 *      -Float -> ángulo pasado a radianes.
 * */
function deg2Rad(degrees)
{
    return degrees * Math.PI / 180;
}
/*
 * Nombre: rad2Deg
 * Sinopsis: Función que convierte radianes en grados.
 * Entradas:
 *      -Float:rad -> ángulo que se convertirá en grados.
 * Salidas:
 *      -Float -> ángulo pasado a grados.
 * */
function rad2Deg(rad)
{
    return rad / Math.PI * 180;
}

/*
 * Nombre: loadTexture
 * Sinopsis: Función para cargar texturas. Basada en la función THREE.ImageUtils.loadTexture.
 * Entradas:
 *      -String:path -> ruta en la que se encuentra la imagen a cargar en la textura.
 *      -Callback:f -> funcion que se lanzará cuando se cargue la imagen
 * Salidas:
 *      -Texture -> textura de la imagen suministrada.
 * */
function loadTexture(path, f)
{
    var image = new Image(), texture = new THREE.Texture(image);
    image.onload = function (){
        texture.needsUpdate = true;
        if(f) f();
    };
    image.crossOrigin = 'anonymous';
    image.src = path;
    
    return texture;
}

/*
 * Nombre: shuffle
 * Autor: Stephane Roucheray
 * Fuente : http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
 * Sinopsis: Función para ordenar el array suministrado de forma aleatoria.
 * Entradas:
 *      -Array:array -> array a ordenar de forma aleatoria.
 * Salidas:
 * */
function shuffle(array){
    var i = array.length, j, temp;
    if ( i == 0 ) return;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/*
 * Nombre: randomColor
 * Sinopsis: Función que calcula un numéro aleatorio entre 0 y 1 ambos exclusive, sin repetir con el anterior.
 *           Se utilizará para crear colores aleatorios.
 * Entradas:
 * Salidas:
 *      -Float -> decimal entre 0 y 1, ambos exclusive, que se utilizará para crear un color.
 * */
function randomColor()
{
    var rand = Math.random();
    //Comprobamos que el color no sea igual que el anterior o similar
    if(Math.abs(randomColor.r - rand) < 0.2)
    {
        var sum;
        if(randomColor.r > rand)
            sum = -0.2;
        else
            sum = 0.2;
            
        if( (rand + sum) >= 1 && randomColor.r < rand)
            rand = randomColor.r = rand - 1 + sum;
        else if( (rand + sum) <= 0 && randomColor.r > rand)
            rand = randomColor.r = rand + 1 + sum;
        else
            rand = randomColor.r = rand + sum;
    }
    else
        randomColor.r = rand; //Guardamos el color en una variable estatica para la siguiente llamada al metodo
    
    return rand;
}