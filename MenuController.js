/*
 *  Nombre: MenuController.js
 *  Sinopsis: Clase controlador que se encargará de manejar lo eventos en los distintos menus.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 30-03-2013
 *  Versión: 0.3
 *  Fecha: 04-01-2013
 *  Versión: 0.2
 *  Fecha: 03-01-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE PUZZLECONTROLLER
 *  */
function MenuController (cam, sce, entrys, mats)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Cámara de la escena necesaria para realizar los cálculos de la interacción
    var camera;
    //Escena en la que se representará el mundo 3D
    var scene;
    
    //Plano para hacer calculos
    var plane;
    //Proyector para realizar operaciones
    var projector;
    //Rayo que realizará las operaciones de intersección
    var ray;
    //Objeto 3D sobre el cual se realizarán operaciones (cambiar el color)
    var INTERSECTED;
        
    //Entradas del menu
    var menuEntrys;
    //Identificador del submenu actual
    var currentMenu;
    //Materiales con los que se creará el puzzle
    var materials;
    
    //Ultimo nivel seleccionado
    var lastLevelSelected;
    //Color que se utilizara para seleccionar el nivel
    var colorLevelSelected = '#7777aa';
    
    //Vector de 2 coordenadas que alamacena la posición actual del ratón
    var mouse = new THREE.Vector2();
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase MenuController.
 * Entradas:
 *      -Camera:cam -> cámara con la que se realizarán los cálculos de la interacción.
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Objects[]:entrys -> array de figuras que contendrá las entradas del menú.
 *      -Materials[]:mats -> array de materiales con los que se creará el puzzle.
 * Salidas:
 * */
    
    //Guardamos los parametros obtenidos
    camera = cam;
    scene = sce;
    materials = mats;
    //Guardamos las entradas del menu
    menuEntrys = entrys;
    //Iniciamos el submenu actual como el principal
    currentMenu = 0;
    
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
    
    //Registramos el evento de click del raton
    document.getElementById('canvas').addEventListener( 'click', onMenuClick, false );
    //Registramos el evento de movimiento del raton
    document.getElementById('canvas').addEventListener( 'mousemove', onMenuMouseMove, false );
    
    //Desactivamos el menu contextual del boton derecho
    document.getElementById('canvas').oncontextmenu=function (){return false};
    
    //Registramos el evento para el boton de atras
    document.getElementById('menuBackButton').addEventListener( 'click', onMenuBack, false );
    
    
/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onMenuClick
 * Sinopsis: Manejador del evento de click.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMenuClick(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Si el menu actual no tiene entradas de menu
    if(currentMenu > 2)
        return;
    
    //Calculamos donde esta el raton con el eje de coordenadas en el centro
    mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;
    //Creamos un vector en la direccion del raton hacia la escena
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    ray.ray.direction = vector.subSelf( camera.position ).normalize();
    
    //Obtenemos los numeros de pagina que son atravesados por el vector
    var intersects = ray.intersectObjects( menuEntrys[currentMenu] );
    //Si hay algun objeto
    if ( intersects.length > 0 )
    {
        //Realizamos la animacion de explosion de la entrada seleccionada
        mv.explode(intersects[0].object, function()
        {
            mv.showMenu(intersects[0].object.menuIndex);
        });
    }
    else
    {
        mv.changeAllEntrysColor();
    }
}


/*
 * Nombre: onMenuMouseMove
 * Sinopsis: Manejador del evento del movimiento del ratón.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMenuMouseMove(event)
{
    //Impedimos que se produzca la accion por defecto
    event.preventDefault();
    
    //Si el menu actual no tiene entradas de menu
    if(currentMenu > 2)
        return;
    
    //Calculamos donde esta el raton con el eje de coordenadas en el centro
    mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;    
    //Creamos un vector en la direccion del raton hacia la escena
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    ray.ray.direction = vector.subSelf( camera.position ).normalize();    
    
    //Obtenemos los numeros de pagina que son atravesados por el vector
    var intersects = ray.intersectObjects( menuEntrys[currentMenu] );
    //Si hay objetos atravesados de los numeros de pagina
    if(intersects.length > 0)
    {
        //Cambiamos al cursor de seleccion
        container.style.cursor = 'pointer';
        //Si no se le ha cambiado ya el color
        if(intersects[ 0 ].object != INTERSECTED)
        {
            //Si hay algun objeto con el color cambiado
            if(INTERSECTED)
            {
                mv.restoreEntryColor(INTERSECTED);
            }
            
            INTERSECTED = intersects[ 0 ].object;
            //Cambiamos el color de la figura
            mv.changeEntryColor(INTERSECTED);
            sound.playMoved();
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
            mv.restoreEntryColor(INTERSECTED);
            INTERSECTED = null;
        }
    }    
}

/*
 * Nombre: onMenuBack
 * Sinopsis: Manejador del evento de pulsacion del boton anterior.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMenuBack(event)
{
    //Si el menu en el que estamos tiene como anterior el menu principal
    if(currentMenu <= menuEntrys[0].length)
        mv.showMenu(0);
    //Si el menu en el que estamos tiene como anterior el primer submenu
    else if (currentMenu <= menuEntrys[0].length+menuEntrys[1].length)
        mv.showMenu(1);
    //Si el menu en el que estamos tiene como anterior el segundo submenu
    else if (currentMenu <= menuEntrys[0].length+menuEntrys[1].length+menuEntrys[2].length)
        mv.showMenu(2);
}

/*
 * Nombre: onMenuLibraryClick
 * Sinopsis: Manejador del evento de pulsacion del boton de biblioteca de imagenes.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMenuLibraryClick(event)
{
    //Obtenemos el tipo de biblioteca que se ha de mostrar
    var libType;
    //Si la cantidad de imagenes depende del numero de cubos, segun el modo de juego
    if(currentMenu == 6 || currentMenu == 8)
    {
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[0].checked)
            libType = 3; //27 cubos => 3 soluciones
        else if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[1].checked)
            libType = 2; //8 cubos => 2 soluciones
    }        
    else
        libType = 1;
    
    //Ocultamos la vista del menu
    mv.hide();
    
    //Si no esta creada la vista de la biblioteca la creamos
    if(lv == undefined)
        lv = new LibraryView(scene, IMAGES, libType);
    //Si esta creada solo la mostramos
    else
        lv.show(libType);
}

/*
 * Nombre: onMenuStartClick
 * Sinopsis: Manejador del evento de pulsacion del boton de empezar.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onMenuStartClick(event)
{
    //Si no se han escogido las imagenes con las que se hara el puzzle
    if(materials.length == 0)
    {
        //Si la cantidad de imagenes depende del numero de cubos, segun el modo de juego
        if(currentMenu == 6 || currentMenu == 8)
        {
            //Si esta elegida la opcion de 27 cubos
            if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[0].checked)
                //Guardamos los primeros 18 materiales de todos los que se tienen
                for(var i=0; i<18; i++)
                    materials.push(IMAGES[i]);
            else if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[1].checked)
                //Guardamos los primeros 12 materiales de todos los que se tienen
                for(var i=0; i<12; i++)
                    materials.push(IMAGES[i]);
        }        
        else
            //Guardamos todos los materiales que se tienen
            for(var i=0; i<IMAGES.length; i++)
                materials.push(IMAGES[i]);
    }
    
    //Si la cantidad de imagenes depende del numero de cubos, segun el modo de juego
    else if(currentMenu == 6 || currentMenu == 8)
    {
        var imgsNeeded;
        //Si esta elegida la opcion de 27 cubos
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[0].checked)
            imgsNeeded = 18;
        else if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[1].checked)
            imgsNeeded = 12;
        //Si no se tienen suficientes imagenes buscamos aquellas que no se hayan elegido ya
        var i=0;
        while(materials.length < imgsNeeded)
        {
            var found = false
            for(var j=0; j<materials.length; j++)
                if(materials[j] == IMAGES[i])
                {
                    found = true;
                    break;
                }
            if(!found)
                materials.push(IMAGES[i]);
            i++;
        }
    }
    
    //Ocultamos los elementos del menu
    mv.hide();
    
    //Si se trata del modo clasico
    if(currentMenu == 6)
    {
        //Comprobamos que numero de cubos esta seleccionado
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[0].checked) //27 cubos
            cmv = new ClassicModeView(scene, 3, materials);
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[1].checked) //8 cubos
            cmv = new ClassicModeView(scene, 2, materials);
    }
    
    //Si se trata del modo niveles
    if(currentMenu == 7)
    {
        lmv = new LevelsModeView(scene, lastLevelSelected, materials);
    }
    
    //Si se trata del modo contrareloj
    if(currentMenu == 8)
    {
        //Obtenemos el numero de cubos que tendra el puzzle
        var cubesNumber;
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[0].checked) //27 cubos
            cubesNumber = 3;
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[1].checked) //8 cubos
            cubesNumber = 2;
        //Obtenemos la dificultad
        var difficulty;
        for(var i=0; i<menuEntrys[currentMenu][0].getElementsByTagName('form')[0].difficulty.length; i++)
            if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].difficulty[i].checked)
                difficulty = i;
        tmv = new TrialModeView(scene, cubesNumber, difficulty, materials);
    }
    
    //Si se trata del modo supervivencia
    if(currentMenu == 9)
    {
        //Obtenemos el numero de cubos que tendra el puzzle
        var cubesNumber;
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[0].checked) //27 cubos
            cubesNumber = 3;
        if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].cubesNumber[1].checked) //8 cubos
            cubesNumber = 2;
        //Obtenemos la dificultad
        var difficulty;
        for(var i=0; i<menuEntrys[currentMenu][0].getElementsByTagName('form')[0].difficulty.length; i++)
            if(menuEntrys[currentMenu][0].getElementsByTagName('form')[0].difficulty[i].checked)
                difficulty = i;
        smv = new SurvivalModeView(scene, cubesNumber, difficulty, materials);
    }
}

/*
 * Nombre: onLevelClick
 * Sinopsis: Manejador del evento de pulsacion de un nivel.
 * Entradas:
 *      -EventObject:event-> caracteristicas del evento lanzado.
 * Salidas:
 * */
function onLevelClick(event)
{
    var i = event.currentTarget.index;
    selectLevel(i);
}

/*
 * Nombre: selectLevel
 * Sinopsis: Método que realizará las acciones necesarias para seleccionar el nivel indicado.
 * Entradas:
 *      -Integer:l-> índice del nivel a seleccionar.
 * Salidas:
 * */
function selectLevel(l)
{
    //Obtenemos el formulario del modo niveles
    form = menuEntrys[currentMenu][0];
    //Si no estamos en el modo niveles o el nivel indicado no existe
    if(currentMenu != 7 || l >= form.levels.length)
        return;
    //Mostramos la descripcion del nivel
    form.getElementsByTagName('form')[0].getElementsByClassName('description')[0].innerHTML = form.levels[l].description;
    //Deseleccionamos el nivel seleccionado hasta ahora
    if(lastLevelSelected != undefined)
        form.levels[lastLevelSelected].style.backgroundColor = form.levels[l].style.backgroundColor;
    //Seleccionamos el indicado
    form.levels[l].style.backgroundColor = colorLevelSelected;
    lastLevelSelected = l;
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
    document.getElementById('canvas').removeEventListener( 'click', onMenuClick, false );
    document.getElementById('canvas').removeEventListener( 'mousemove', onMenuMouseMove, false );
    //Si esta definido un formulario de configuracion de modo borramos los receptores del formulario
    var form = menuEntrys[currentMenu][0];
    if(form != undefined && form.getElementsByTagName != undefined)
    {
        form.getElementsByTagName('form')[0].library.removeEventListener( 'click', onMenuLibraryClick, false );
        form.getElementsByTagName('form')[0].start.removeEventListener( 'click', onMenuStartClick, false );
    }
    //Si se trata del modo niveles borramos los receptores de eventos para la seleccion de nivel
    if(currentMenu == 7)
        for(var i=0; i<form.levels.length; i++)
            form.levels[i].removeEventListener( 'click', onLevelClick, false );
    
    //Usamos el cursor por defecto
    container.style.cursor = 'auto';
        
    //Quitamos el plano del picking de la escena
    scene.remove(plane);
}

/*
 * Nombre: enable
 * Sinopsis: Método que habilita el controlador. Registra los eventos necesarios.
 * Entradas:
 *      -Integer:menu -> submenu para el que se activa el controlador.
 * Salidas:
 * */
this.enable = function(menu)
{    
    //Guardamos el nuevo tipo de vista
    currentMenu = menu;
    //Si el menu seleccionado es de los que tienen entradas de menu
    if(menu < 3)
    {
        //Añadimos receptores de eventos para el raton
        document.getElementById('canvas').addEventListener( 'click', onMenuClick, false );
        document.getElementById('canvas').addEventListener( 'mousemove', onMenuMouseMove, false );
    }
    //Si es el menu de un modo de un jugador
    else if(menu >= 6 && menu <= 9)
    {
        //Obtenemos el formulario del menu actual
        var form = menuEntrys[menu][0];
        //Registramos el evento de la pulsacion del boton de la libreria
        form.getElementsByTagName('form')[0].library.addEventListener( 'click', onMenuLibraryClick, false );
        //Registramos el evento de la pulsacion del boton de empezar
        form.getElementsByTagName('form')[0].start.addEventListener( 'click', onMenuStartClick, false );
        //Si es el menu del modo niveles
        if(menu == 7)
        {
            //Si todavia no se ha seleccionado ningun nivel
            if(lastLevelSelected == undefined)
                selectLevel(0);
            //Registramos los eventos de seleccion de niveles para todos los niveles
            for(var i=0; i<form.levels.length; i++)
                form.levels[i].addEventListener( 'click', onLevelClick, false );
        }
    }
    //Añadimos el plano a la escena
    scene.add(plane);
}

/*
 * Nombre: changeEntryColor
 * Sinopsis: Método para fijar los materiales con los que se creara el puzzle.
 * Entradas:
 *      -Materials[]:mats -> array con los materiales con los que se creará el puzzle.
 * Salidas:
 * */
this.setMaterials = function (mats)
{
    materials = mats;
}

} 