/*
 *  Nombre: PuzzleController.js
 *  Sinopsis: Clase controlador que se encargará de manejar lo eventos en el puzzle.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 19-02-2013
 *  Versión: 0.5
 *  Fecha: 14-01-2013
 *  Versión: 0.4
 *  Fecha: 10-01-2013
 *  Versión: 0.3
 *  Fecha: 25-12-2012
 *  Versión: 0.2
 *  Fecha: 23-12-2012
 *  Versión: 0.1
 *  */


/*
 *  CLASE PUZZLECONTROLLER
 *  */
function PuzzleController (cam, sce, cub, puz)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Cámara de la escena necesaria para realizar los cálculos de la interacción
    var camera;
    //Escena en la que se representará el mundo 3D
    var scene;
    //Objeto 3D sobre el que se realizarán las operaciones (rotación y traslación)
    var SELECTED;
    //Plano para hacer calculos
    var plane;
    //Proyector para realizar operaciones
    var projector;
    //Rayo que realizará las operaciones de intersección
    var ray;
    
    //Array con los elementos del puzzle (los cubos y el grupo de piezas que forma el cubo)
    var objects = [];
    //Objeto de la clase puzzle
    var puzzle;
    //Booleano para indicar si el puzzle ha sido resuelto
    var isDone = false;
    
    //Flag para saber si el botón de rotación está pulsado
    var rotDown;
    //Flag para saber si el botón de movimiento está pulsado
    var movDown;
    //Coordenadas del ratón en la última vez que se proceso el evento, necesarias para calcular cuanto ha de girar una figura
    var lastMouseX;
    var lastMouseY;
    //Vector de 2 coordenadas que alamacena la posición actual del ratón
    var mouse = new THREE.Vector2();
    
    //Sensibilidad de giro, relación entre el movimiento del ratón y la cantidad de giro de una figura
    var sensitivity;


/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase PuzzleController.
 * Entradas:
 *      -Camera:cam -> cámara con la que se realizarán los cálculos de la interacción.
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Object3D[]:cub -> array con las piezas del puzzle.
 *      -Puzzle:puz -> objeto de la clase Puzzle.
 * Salidas:
 * */
    camera = cam;
    scene = sce;
    
    puzzle = puz;
    //Guardamos los elementos que sufriran la interaccion
    objects = cub.concat(puzzle.getPuzzle());
    
    //Sensibilidad por defecto
    sensitivity = ov.getOptions().getSensitivity()/100;
    
    //Creamos un plano para el picking
    plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
    //Hacemos que no sea visible, es para funcionamiento interno, no para mostrarlo
    plane.visible = false;
    //Añadimos el plano a la escena
    scene.add(plane);				
    
    //Creamos un proyector para realizar el picking
    projector = new THREE.Projector();
    //Creamos un rayo con origen en la posicion de la camara
    ray = new THREE.Raycaster(camera.position);
    
    //Añadimos receptores de eventos para el raton
    document.getElementById('canvas').addEventListener( 'mousedown', onPuzzleMouseDown, false );
    document.addEventListener( 'mousemove', onPuzzleMouseMove, false );
    document.addEventListener( 'mouseup', onPuzzleMouseUp, false );
    //Desactivamos el menu contextual del boton derecho
    document.getElementById('canvas').oncontextmenu=function (){return false};
 

/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onPuzzleMouseDown
 * Sinopsis: Manejador del evento de botón del ratón pulsado.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onPuzzleMouseDown(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Calculamos donde esta el raton con el eje de coordenadas en el centro
    mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;
    //Creamos un vector en la direccion del raton hacia la escena
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    ray.ray.direction = vector.subSelf( camera.position ).normalize();

    //Si es el boton de giro
    if(event.button == ov.getOptions().getRotOpt())
    {
        //Activamos el flag del boton de rotacion
        rotDown = true;
        
        //Obtenemos la posicion del raton
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        plane.position.z=0;
        //Obtenemos la interseccion entre el vector y el plano
        var intersects = ray.intersectObject( plane );
        //Si el raton esta en la zona del puzzle
        if(puzzle.isPuzzleZone(intersects[0].point))
        {
            //Seleccionamos el grupo para girar este en vez de una figura individual
            SELECTED = puzzle.getPuzzle();
            //Cambiamos al cursor de movimiento
            container.style.cursor = 'crosshair';
            return;
        }
        
        //Obtenemos los objetos que son atravesados por el vector
        var intersects = ray.intersectObjects( objects );
        //Si hay algun objeto
        if ( intersects.length > 0 )
        {
            //Obtenemos el primer objeto atravesado, que sera el seleccionado, el que esta delante
            SELECTED = intersects[ 0 ].object;
    
            //Cambiamos al cursor de movimiento
            container.style.cursor = 'move';
        }
    }
    
    //Si es el boton de movimiento y no esta resuelto el puzzle
    if(event.button == ov.getOptions().getMovOpt() && !isDone)
    {
        //Activamos el flag del boton de movimiento
        movDown = true;
        
        //Obtenemos los objetos que son atravesados por el vector
        var intersects = ray.intersectObjects( objects );
        //Si hay algun objeto
        if ( intersects.length > 0 )
        {
            //Obtenemos el primer objeto atravesado, que sera el seleccionado, el que esta delante
            SELECTED = intersects[ 0 ].object;            
            //Si esta en el puzzle
            if(SELECTED.parent == puzzle.getPuzzle())
            {
                //Sacamos la figura del puzzle
                puzzle.putOutCube(SELECTED);
                //Añadimos la figura a la escena, con lo cual se borrara tambien del grupo del puzzle
                scene.add(SELECTED);
            }
    
            //Cambiamos al cursor de movimiento
            container.style.cursor = 'move';
        }
    }	
    
    
}

/*
 * Nombre: onPuzzleMouseMove
 * Sinopsis: Manejador del evento del movimiento del ratón.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onPuzzleMouseMove(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Si hay algun objeto seleccionado
    if(SELECTED)
    {        
        //Si esta pulsado el boton de rotacion
        if(rotDown)
        {
            //Obtenemos la posicion del raton
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            
            //Giramos la figura segun la sensibilidad
            pv.rotateShape(SELECTED, sensitivity * (mouseY - lastMouseY), sensitivity * (mouseX - lastMouseX));
            
            //Guardamos la posicion para la siguiente llamada
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            //Y salimos del evento
            return;
        }
    
        //Si esta pulsado el boton de movimiento
        if(movDown)
        {
            //Calculamos donde esta el raton con el eje de coordenadas en el centro
            mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;
            
            //Creamos un vector en la direccion del raton hacia la escena
            var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
            projector.unprojectVector( vector, camera );
            ray.ray.direction = vector.subSelf( camera.position ).normalize();
            //Calculamos la interseccion con el plano
            var intersects = ray.intersectObject( plane );        
        
            //Si el objeto seleccionado no es el puzzle ni esta solucionado el puzzle, entonces movemos el objeto
            if(SELECTED != puzzle.getPuzzle() && !isDone)
            {                
                //Si el raton se encuentra en la zona de movimiento
                if(event.clientX >= 0 && event.clientX <= windowWidth && event.clientY >= 0 && event.clientY <= windowHeight)
                    //Movemos la figura seleccionada
                    SELECTED.position.copy(intersects[0].point);
            
                //Comprobamos si esta en la zona del puzzle, para mover el cubo hacia
                //delante en caso de tener uno detras, para que no se solapen
                if(puzzle.isPuzzleZone(SELECTED.position))
                {
                    //Obtenemos el objeto que es atravesado por el vector sin contar la figura seleccionada
                    var intersects = ray.intersectObjects( objects );
                    var intersector = null;
                    for(var i=0; i < intersects.length; i++ )
                        if ( intersects[i].object != SELECTED )
                        {
                            intersector=intersects[i];
                            break;
                        }
                    
                    //Si hay un objeto
                    if(intersector)
                        //Movemos tanto el plano de desplazamiento como la figura hacia delante
                        //tanto como este la figura anterior mas la mitad del tamaño de la seleccionada
                        plane.position.z = SELECTED.position.z = intersector.point.z + 200;
                    //Si no hay objetos atravesados sin contar el seleccionado y la figura no esta en Z=0
                    else if(SELECTED.position.z != 0)
                        //Movemos tanto la figura como el plano de desplazamiento a Z=0
                        SELECTED.position.z = plane.position.z = 0;
                }
                //Si no esta en la zona del puzzle pero no esta en Z=0
                else if(SELECTED.position.z != 0)
                    //Movemos tanto la figura como el plano de desplazamiento a Z=0
                    SELECTED.position.z = plane.position.z = 0;                        
            }
            
            //Y salimos del evento
            return;
        }
    }
    
    //Si llegamos hasta aqui es que no esta seleccionado ningun objeto
    //Calculamos donde esta el raton con el eje de coordenadas en el centro
    mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;    
    //Creamos un vector en la direccion del raton hacia la escena
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    ray.ray.direction = vector.subSelf( camera.position ).normalize();
    //Obtenemos los objetos que son atravesados por el vector
    var intersects = ray.intersectObjects( objects );
    
    //Si hay objetos atravesados
    if(intersects.length > 0)
        //Cambiamos al cursor de seleccion
        container.style.cursor = 'pointer';
    
    //Si no hay objetos atravesados
    else
        //Usamos el cursor por defecto
        container.style.cursor = 'auto';
}

/*
 * Nombre: onPuzzleMouseUp
 * Sinopsis: Manejador del evento de botón del ratón levantado.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onPuzzleMouseUp(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Si es el boton de giro
    if(event.button == ov.getOptions().getRotOpt())
    {
        //Desactivamos el flag de boton de rotacion pulsado
        rotDown = false;
        //Si no esta pulsado el boton de movimiento
        if(!movDown)
        {
            //Deseleccionamos el objeto seleccionado
            SELECTED = null;
            //Usamos el cursor por defecto
            container.style.cursor = 'auto';
        }
    }
    
    //Si es el boton de movimiento
    if(event.button == ov.getOptions().getMovOpt())
    {
        //Desactivamos el flag de boton de movimiento pulsado
        movDown = false;
        //Si hay algun objeto seleccionado
        if(SELECTED)
        {
            //Si se suelta en la zona del puzzle y no esta resuelto
            if(SELECTED != puzzle.getPuzzle() && puzzle.isPuzzleZone(SELECTED.position) && !isDone)
            {
                //Cambiamos la rotacion y traslacion de la figura a la que tendra en el puzzle
                puzzle.putInCube(SELECTED);
                //Y añadimos la figura al puzzle
                puzzle.getPuzzle().add(SELECTED);
                
                //Indicamos a la vista que hemos introducido una pieza en el puzzle
                isDone = pv.cubeInserted();
            }
            //Si no esta pulsado el boton de rotacion
            if(!rotDown)
            {
                //Deseleccionamos el objeto seleccionado
                SELECTED = null;
                //Usamos el cursor por defecto
                container.style.cursor = 'auto';
            }
        }
    }
}

/*****************************************
 *  Métodos Públicos
 *****************************************/
 
/*
 * Nombre: remove
 * Sinopsis: Método que elimina el controlador. Lo único que hace es eliminar los manejadores de eventos que tiene registrados.
 * Entradas:
 * Salidas:
 * */
this.remove = function()
{
    //Borramos receptores de eventos para el raton
    document.getElementById('canvas').removeEventListener( 'mousedown', onPuzzleMouseDown, false );
    document.removeEventListener( 'mousemove', onPuzzleMouseMove, false );
    document.removeEventListener( 'mouseup', onPuzzleMouseUp, false );
    
    //Usamos el cursor por defecto
    container.style.cursor = 'auto';
}

/*
 * Nombre: enable
 * Sinopsis: Método que habilita el controlador. Registra los eventos necesarios.
 * Entradas:
 * Salidas:
 * */
this.enable = function()
{
    //Registramos de nuevo los receptores de eventos para el raton
    document.getElementById('canvas').addEventListener( 'mousedown', onPuzzleMouseDown, false );
    document.addEventListener( 'mousemove', onPuzzleMouseMove, false );
    document.addEventListener( 'mouseup', onPuzzleMouseUp, false );
    
    //Obtenemos la sensibilidad con la que se debe girar
    sensitivity = ov.getOptions().getSensitivity()/100;
}

/*
 * Nombre: setIsDone
 * Sinopsis: Método para indicar al controlador que el puzzle ha sido resuelto.
 * Entradas:
 * Salidas:
 * */
this.setIsDone = function()
{
    isDone = true;
}

}