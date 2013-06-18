/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: LibraryController.js
 *  Sinopsis: Clase controlador que se encargará de manejar lo eventos en la biblioteca de imágenes.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 05-03-2013
 *  Versión: 0.5
 *  Fecha: 17-01-2013
 *  Versión: 0.4
 *  Fecha: 30-12-2012
 *  Versión: 0.3
 *  Fecha: 29-12-2012
 *  Versión: 0.2
 *  Fecha: 28-12-2012
 *  Versión: 0.1
 *  */


/*
 *  CLASE LIBRARYCONTROLLER
 *  */
function LibraryController (cam, sce, pla, pag, pagIn, type, cub)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Cámara de la escena necesaria para realizar los cálculos de la interacción
    var camera;
    //Escena en la que se representará el mundo 3D
    var scene;
    //Objeto 3D sobre el que se realizarán las operaciones (rotación o traslación)
    var SELECTED;
    //Objeto 3D sobre el cual se realizarán operaciones (cambiar el color)
    var INTERSECTED;
    //Plano para hacer calculos
    var plane;
    //Proyector para realizar operaciones
    var projector;
    //Rayo que realizará las operaciones de intersección
    var ray;
    
    //Array con los planos que mostrarán las imágenes
    var planes;
    //Array con los números de página
    var pages;
    //Array de array con los indices de las imágenes de cada página
    var pagesIndex;
    //Array con todos los planos de una determinada página
    var pagePlanes = [];
    //Pagina actual
    var currentPage;
    //Tipo de vista con la que ha sido creado el controlador
    var typeView;
    //Array con los cubos donde se insertarán las imágenes si corresponde
    var cubes;
    
    //Flag para saber si el botón derecho está pulsado
    var rightDown;
    //Flag para saber si el botón izquierdo está pulsado
    var leftDown;
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
 * Sinopsis: Constructor de la clase LibraryController.
 * Entradas:
 *      -Camera:cam -> cámara con la que se realizarán los cálculos de la interacción.
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Mesh[]:pla -> array de figuras que contendrá los planos de la imágenes.
 *      -Mesh[]:pag -> array de figuras que contendrá los números de página.
 *      -Integer[[]] -> array de arrays de enteros que contendrá los índices de las imágenes de cada página.
 * Salidas:
 * */
    
    //Guardamos los parametros obtenidos
    camera = cam;
    scene = sce;    
    planes = pla;
    pages = pag;
    pagesIndex = pagIn;
    typeView = type;
    cubes = cub;
    
    //Sensibilidad por defecto
    sensitivity = ov.getOptions().getSensitivity()/100;
    
    //Guardamos los planos de la primera pagina
    currentPage = 0;
    for(var i=0; i<pagesIndex[0].length; i++)
        pagePlanes.push(planes[ pagesIndex[0][i] ]);
    
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
    //Si el tipo de vista necesita arrastra el raton registramos los eventos correspondientes
    if(typeView != 1)
    {
        document.getElementById('canvas').addEventListener( 'mousedown', onLibraryMouseDown, false );
        document.addEventListener( 'mouseup', onLibraryMouseUp, false );
    }
    document.addEventListener( 'mousemove', onLibraryMouseMove, false );
    document.getElementById('canvas').addEventListener( 'click', onLibraryClick, false );
    document.getElementById('canvas').addEventListener( 'dblclick', onLibraryDblClick, false );
    
    //Desactivamos el menu contextual del boton derecho
    document.getElementById('canvas').oncontextmenu=function (){return false};
    
    //Añadimos los eventos de los botones
    document.getElementById('addImgButton').addEventListener( 'click', onLibraryAddImage, false );
    document.getElementById('inputFile').addEventListener( 'change', onLibraryFile, false );
    
    document.getElementById('acceptButton').addEventListener( 'click', onLibraryAccept, false);
    document.getElementById('backButton').addEventListener( 'click', onLibraryBack, false);
    
    



/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onLibraryMouseDown
 * Sinopsis: Manejador del evento de botón del ratón pulsado.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryMouseDown(event)
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

    //Si ya hay un objeto seleccionado seguimos operando con el
    if(SELECTED)
        return;
    
    //Obtenemos los planos de las imagenes de la pagina actual que son atravesados por el vector
    var intersects = ray.intersectObjects( pagePlanes );
    //Si hay algun objeto
    if ( intersects.length > 0 )
    {
        //Obtenemos el primer objeto atravesado, que sera el seleccionado, el que esta delante
        SELECTED = intersects[ 0 ].object;
        
        //Cambiamos al cursor de movimiento
        container.style.cursor = 'move';
    }
    
    //Obtenemos los cubos que son atravesados por el vector
    var intersects = ray.intersectObjects( cubes );
    //Si hay algun objeto
    if ( intersects.length > 0 )
    {
        //Obtenemos el primer objeto atravesado, que sera el seleccionado, el que esta delante
        SELECTED = intersects[ 0 ].object;
        
        //Obtenemos la posicion del raton
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        //Cambiamos al cursor de movimiento
        container.style.cursor = 'move';
    }    
}

/*
 * Nombre: onLibraryMouseMove
 * Sinopsis: Manejador del evento del movimiento del ratón.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryMouseMove(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Si hay algun objeto seleccionado
    if(SELECTED)
    {        
        //Si la figura seleccionada no es uno de los cubos
        if(cubes.indexOf(SELECTED) == -1)
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
            //Si el raton se encuentra en la zona de movimiento
            if(event.clientX >= 0 && event.clientX <= windowWidth && event.clientY >= 0 && event.clientY <= windowHeight)
            {
                //Movemos la figura seleccionada
                SELECTED.position.copy(intersects[0].point);
                //Si esta en la zona de los cubos adelantamos la figura para que se sobreponga a los cubos
                if(lv.isCubeZone(intersects[0].point))
                    lv.putZBefore(SELECTED);
                else
                    //Ponemos la figura que se esta moviendo delante para que se superponga al resto de planos
                    lv.putZ1(SELECTED);                    
            }
            
            //Y salimos del evento
            return;
        }
        
        //si la figura es uno de los cubos
        else
        {
            //Obtenemos la posicion del raton
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            
            //Giramos la figura
            //Creamos una matriz temporal para hacer transformaciones
            var temp = new THREE.Matrix4();
            //Introducimos la nueva rotacion
            temp.setRotationFromEuler(new THREE.Vector3(sensitivity * (mouseY - lastMouseY), sensitivity * (mouseX - lastMouseX), 0));
            //La transformamos segun la rotacion de la figura
            SELECTED.updateMatrix();
            temp.multiply(temp, SELECTED.matrix);
            //Extraemos la rotacion de la matriz y la guardamos en el vector
            SELECTED.rotation.setEulerFromRotationMatrix(temp);
                                
            //Guardamos la posicion para la siguiente llamada
            lastMouseX = mouseX;
            lastMouseY = mouseY;
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
    
    //Obtenemos los planos de la pagina que son atravesados por el vector
    var intersects = ray.intersectObjects( pagePlanes );
    //Si hay objetos atravesados de los planos
    if(intersects.length > 0)
    {
        //Cambiamos al cursor de seleccion
        container.style.cursor = 'pointer';
        return;
    }
    else
    {
        if(typeView != 1)
        {
            //Obtenemos los planos de la pagina que son atravesados por el vector
            var intersects = ray.intersectObjects( cubes );
            //Si hay objetos atravesados de los planos
            if(intersects.length > 0)
            {
                //Cambiamos al cursor de seleccion
                container.style.cursor = 'pointer';
                return;
            }
        }
    
        //Obtenemos los numeros de pagina que son atravesados por el vector
        var intersects = ray.intersectObjects( pages );
        //Si hay objetos atravesados de los numeros de pagina
        if(intersects.length > 0)
        {
            //Cambiamos al cursor de seleccion
            container.style.cursor = 'pointer';
            //Si no se le ha cambiado ya el color
            if(intersects[ 0 ].object != INTERSECTED)
            {
                INTERSECTED = intersects[ 0 ].object;
                //Cambiamos el color de la figura
                var rand = randomColor();
                INTERSECTED.material.materials[0].color.setHSV( rand, 0.95, 0.85 );
                INTERSECTED.material.materials[1].color.setHSV( rand, 0.95, 0.50 );
            }
        }
        //Si no hay objetos atravesados
        else
        {
            //Usamos el cursor por defecto
            container.style.cursor = 'auto';
            //Si hay algun objeto con el color cambiado
            if(INTERSECTED)
            {
                var rand = randomColor();
                INTERSECTED.material.materials[0].color.setHSV( rand, 0.95, 0.85 );
                INTERSECTED.material.materials[1].color.setHSV( rand, 0.95, 0.50 );
                INTERSECTED = null;
            }
        }
    }
}

/*
 * Nombre: onLibraryMouseUp
 * Sinopsis: Manejador del evento de botón del ratón levantado.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryMouseUp(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Si hay algun objeto seleccionado
    if(SELECTED)
    {
        //Si la figura seleccionada no es uno de los cubos
        if(cubes.indexOf(SELECTED) == -1)
        {
            //Si se suelta en la zona de los cubos
            if(lv.isCubeZone(SELECTED.position))
            {
                //Buscamos el cubo mas cercano a la posicion en la que se ha soltado el plano
                var min=0, dist;
                //Recorremos los cubos
                for(var i=0; i<cubes.length; i++)
                {
                    //Calculamos la distancia
                    var d = SELECTED.position.distanceTo(cubes[i].position);
                    //Si la distancia minima no esta definida la iniciamos
                    if(dist === undefined)
                        dist = d;
                    //Si se ha encontrado un nuevo minimo
                    else if(d < dist)
                    {
                        //Lo guardamos
                        dist = d;
                        min = i;
                    }
                }
                
                //Ahora obtenemos la cara del cubo que esta hacia la camara
                //Primero creamos un vector hacia el cubo
                var vector = new THREE.Vector3().copy(cubes[min].position);
                ray.ray.direction = vector.subSelf( camera.position ).normalize();
                //Obtenemos la interseccion con el cubo
                var intersects = ray.intersectObject( cubes[min] );
                
                //Guardamos el material en la cara con la que intersecciona el vector
                cubes[min].material.materials[intersects[0].faceIndex] = SELECTED.material;
            }
            
            //Se devuelve a la posicion inicial
            SELECTED.position.copy( new THREE.Vector3(SELECTED.iniPosX, SELECTED.iniPosY, 0) );
        }
        
        //Deseleccionamos el objeto seleccionado
        SELECTED = null;
        //Usamos el cursor por defecto
        container.style.cursor = 'auto';
    }
}

/*
 * Nombre: onLibraryClick
 * Sinopsis: Manejador del evento de click.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryClick(event)
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

    //Obtenemos los numeros de pagina que son atravesados por el vector
    var intersects = ray.intersectObjects( pages );
    //Si hay algun objeto
    if ( intersects.length > 0 )
    {
        //Obtenemos el identificador del texto para saber que tenemos que hacer
        var ID = intersects[0].object.textID;
        
        //Comprobamos que accion hay que realizar
        if(ID == -2) //Ir a la primera pagina
            lv.showPage(currentPage = 0);
        else if(ID == -1) //Ir a la pagina anterior
        {
            lv.showPage(currentPage = (currentPage==0 ? 0 : currentPage-1));
        }
        else if(ID == pagesIndex.length) //Ir a la pagina siguiente
            lv.showPage(currentPage = (currentPage==pagesIndex.length-1 ? pagesIndex.length-1 : currentPage+1));
        else if(ID == pagesIndex.length+1) //Ir a la ultima pagina
            lv.showPage(currentPage = (pagesIndex.length-1));
        else if(ID >= 0 && ID <= pagesIndex.length-1) //Ir a la pagina seleccionada
            lv.showPage(currentPage = ID);
        else //A este punto no deberia llegar nunca
            console.error("ID de pagina de la biblioteca de imagenes desconocido");
        
        //Guardamos los planos de la pagina seleccionada
        pagePlanes = [];
        for(var i=0; i<pagesIndex[currentPage].length; i++)
            pagePlanes.push(planes[ pagesIndex[currentPage][i] ]);
    }
    
    //Si el modo de vista es el imagenes seleccionables
    if(typeView == 1)
    {
        //Obtenemos los planos de imagenes que son atravesados por el vector
        var intersects = ray.intersectObjects( pagePlanes );            
        //Si hay algun objeto
        if ( intersects.length > 0 )
        {
            //Si la imagen esta seleccionada
            if(intersects[0].object.selected)
            {
                //La deseleccionamos
                intersects[0].object.selected = !intersects[0].object.selected;
                scene.remove(intersects[0].object.selectedPlane);
            }
            //Si la imagen no esta seleccionada
            else
            {
                //La seleccionamos
                intersects[0].object.selected = !intersects[0].object.selected;
                scene.add(intersects[0].object.selectedPlane);
            }
            //Se devuelve a la posicion inicial
            intersects[0].object.position.x = intersects[0].object.iniPosX;
            intersects[0].object.position.y = intersects[0].object.iniPosY
            intersects[0].object.position.z = 0;
        }
    }
}

/*
 * Nombre: onLibraryDblClick
 * Sinopsis: Manejador del evento de doble click.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryDblClick(event)
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

    //Si es el boton derecho
    if(event.button == 2)
    {
        //Activamos el flag del boton derecho
        rightDown = true;
    }
    
    //Si es el boton central
    if(event.button == 1)
    {
        
    }
    
    //Si es el boton izquierdo
    if(event.button == 0)
    {
        //Activamos el flag del boton izquierdo
        leftDown = true;
        //Usamos el cursor por defecto
        container.style.cursor = 'auto';
        
        //Obtenemos los objetos que son atravesados por el vector
        var intersects = ray.intersectObjects( pagePlanes );
            
        //Si hay algun objeto
        if ( intersects.length > 0 )
        {    
            //Cambiamos la posicion del objeto, lo ponemos delante            
            intersects[ 0 ].object.position.x = 0;
            intersects[ 0 ].object.position.y = 0;
            intersects[ 0 ].object.position.z = 2450;
        }
    }    
}

/*
 * Nombre: onLibraryAddImage
 * Sinopsis: Método que realiza la acción necesaria cuando se pulsa el botón de añadir imagen.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryAddImage(event)
{
    //Obtenemos la entrada de archivos y ejecutamos su evento click
    document.getElementById("inputFile").click();
}

/*
 * Nombre: onLibraryFile
 * Sinopsis: Método que realiza la acción necesaria para obtener un archivo del tipo imagen
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryFile(event)
{
    //Guardamos los archivos seleccionados por el usuario
    var files = this.files;
    
    //Contador para saber cuando se han cargado todas las figuras
    var counter = 0;
    //Array donde se introduciran las texturas
    var texture = [];
    //Recorremos todos los archivos seleccionados
    for(var i=0; i< files.length; i++)
    {
        //Obtenemos la URL de la imagen
        var url = window.URL.createObjectURL(files[i]);
        //Creamos una textura con la imagen y la guardamos en el array de texturas
        texture.push(loadTexture(url, function()
            {
                counter+=1;
                
                //Si se han cargado todas las imagenes
                if (counter === files.length)
                { 
                    //Recorremos todas las texturas
                    for(k=0; k<texture.length; k++)
                    {
                        //Creamos un material con la textura
                        var material = new THREE.MeshBasicMaterial( { map: texture[k]} );
                        //Si se ha podido añadir el material a la biblioteca
                        if(lv.addImg(material))
                            //Añadimos el material a la lista de materiales
                            IMAGES.push( material );                                                            
                        else
                            alert("No caben mas imágenes en la biblioteca.");
                        
                        //Guardamos los planos de la pagina seleccionada
                        pagePlanes = [];
                        for(var j=0; j<pagesIndex[currentPage].length; j++)
                            pagePlanes.push(planes[ pagesIndex[currentPage][j] ]);
                    }
                }
            }
        ));        
    }
}

/*
 * Nombre: onLibraryAccept
 * Sinopsis: Método que realiza la acción necesaria cuando se pulsa el botón de aceptar.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryAccept(event)
{
    //Obtenemos los materiales de la biblioteca
    var mats = finish();
    //Ocultamos la vista de la biblioteca
    lv.hide();
    //Le pasamos los materiales al menu y lo mostramos
    mv.setMaterials(mats);
    mv.showMenu();
}

/*
 * Nombre: onLibraryBack
 * Sinopsis: Método que realiza la acción necesaria cuando se pulsa el botón de aceptar.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLibraryBack(event)
{
    //Ocultamos la vista de la biblioteca
    lv.hide();
    //Mostramos el menu
    mv.showMenu();
}
 
/*
 * Nombre: finish
 * Sinopsis: Método que obtendrá los materiales seleccionados cuando se termine de escoger.
 * Entradas:
 * Salidas:
 *      -Material[] -> array de materiales que contendrá todos los materiales seleccionados.
 * */
function finish()
{
    var mats = [];
    
    //Si la vista es la de imagenes seleccionables
    if(typeView == 1)
    {
        //Recorremos todas la imagenes
        for(var i=0; i<planes.length; i++)
        {
            //Y si estan seleccionadas
            if(planes[i].selected)
                //Guardamos sus materiales
                mats.push(planes[i].material);
        }
        return mats;
    }
    
    //Si no es la vista recorremos todos los cubos
    for(var i=0; i<typeView; i++)
        //Recorremos las caras de cada cubo
        for(var j=0; j<6; j++)
            //Guardamos el material de cada cara
            mats.push(cubes[i].material.materials[j]);
    return mats;
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
    document.getElementById('canvas').removeEventListener( 'mousedown', onLibraryMouseDown, false );
    document.removeEventListener( 'mouseup', onLibraryMouseUp, false );
    document.removeEventListener( 'mousemove', onLibraryMouseMove, false );    
    document.getElementById('canvas').removeEventListener( 'click', onLibraryClick, false );
    document.getElementById('canvas').removeEventListener( 'dblclick', onLibraryDblClick, false );
    
    //Borramos los eventos de los botones
    document.getElementById('addImgButton').removeEventListener( 'click', onLibraryAddImage, false );
    document.getElementById('inputFile').removeEventListener( 'change', onLibraryFile, false );
    
    //Quitamos el plano del picking de la escena
    scene.remove(plane);
}
 
/*
 * Nombre: enable
 * Sinopsis: Método que habilita el controlador. Registra los eventos necesarios.
 * Entradas:
 *      -Integer:type -> tipo de la vista con la que se activa el controlador.
 * Salidas:
 * */
this.enable = function(type)
{
    //Añadimos receptores de eventos para el raton
    //Si el tipo de vista necesita arrastra el raton registramos los eventos correspondientes
    if(type != 1)
    {
        document.getElementById('canvas').addEventListener( 'mousedown', onLibraryMouseDown, false );
        document.addEventListener( 'mouseup', onLibraryMouseUp, false );
    }
    document.addEventListener( 'mousemove', onLibraryMouseMove, false );    
    document.getElementById('canvas').addEventListener( 'click', onLibraryClick, false );
    document.getElementById('canvas').addEventListener( 'dblclick', onLibraryDblClick, false );
    
    //Añadimos los eventos de los botones
    document.getElementById('addImgButton').addEventListener( 'click', onLibraryAddImage, false );
    document.getElementById('inputFile').addEventListener( 'change', onLibraryFile, false );

    //Añadimos el plano a la escena
    scene.add(plane);
    
    //Guardamos el nuevo tipo de vista
    typeView = type;
    
    //Guardamos la sensibilidad actual
    sensitivity = ov.getOptions().getSensitivity()/100;
    
    //Colocamos como pagina actual la primera
    currentPage = 0;
    pagePlanes = [];
    for(var i=0; i<pagesIndex[0].length; i++)
        pagePlanes.push(planes[ pagesIndex[0][i] ]);
}

}