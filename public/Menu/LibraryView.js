/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: LibraryView.js
 *  Sinopsis: Clase de la vista de la biblioteca de imágenes.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 30-12-2012
 *  Versión: 0.5
 *  Fecha: 29-12-2012
 *  Versión: 0.4
 *  Fecha: 28-12-2012
 *  Versión: 0.3
 *  Fecha: 27-12-2012
 *  Versión: 0.2
 *  Fecha: 25-12-2012
 *  Versión: 0.1
 *  */


/*
 *  CLASE LIBRARYVIEW
 *  */
function LibraryView (sce, mat, ty)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Escena en la que se mostrarán la vista
    var scene;
    //Array de materiales para cada imagen
    var materials;
    
    //Array de planos para mostrar cada imagen
    var planes = [];
    //Array con los cubos donde se pondran las imágenes
    var cubes = [];
    //Line que delimitará la zona de los cubos
    var line;
    //Array de paginas que contiene un array de los indices de las imagenes
    var pagesIndex = [];
    //Array con todos los textos del numero de página
    var pages = [];
    //Marcador de la página actual
    var pageMark;
    //Pagina seleccionada
    var currentPage = 0;
    
    //Altura de las imágenes en pixeles
    var imagesHeight;
    //Espacion para las imágenes
    var imgSpace;
    //Separación entre cada imagen
    var separation;
    //Márgenes, hasta donde se colocarán imágenes
    var margins;
    //Tamaño del texto    
    var textSize;
    //Tipo de vista que se tendrá,  1 -> imágenes seleccionables, 2 -> formar dos cubos con imágenes, 3 -> formar tres cubos con imágenes
    var type;
    
    //Controlador de la biblioteca
    var libC;
    //Botón de aceptar
    var acceptButton;
    //Botón de anterior
    var backButton;
    //Botón de añadir imagen
    var addImgButton;
    
    
/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase LibraryView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 *      -Material[]:mat -> array con todos los materiales.
 *      -Integer:ty -> tipo de vista, 1 -> imágenes seleccionables, 2 -> formar dos cubos con imagánes, 3 -> formar tres cubos con imágenes.
 * Salidas:
 * */

    //Guardamos la escena y los materiales
    scene = sce;
    materials = mat;
    //Guardamos el tipo de vista, comrpobando que sea correcto
    type = (ty>=1 && ty<=3) ? ty : 1;
    //Iniciamos el tamaño de las imagenes y la separacion entre estas
    imagesHeight = 300;
    separation = 100;
    //Iniciamos el tamaño del texto
    textSize = 100;
    
    //Limpiamos la escena
    clearView();
    
    //Calculamos los margenes
    margins = calculateMargins();
    
    //Creamos un plano para cada material
    for(var i=0; i<materials.length; i++)
    {
        //Creamos la geometria con la altura indicada y con su anchura proporcional
        var geometry = new THREE.PlaneGeometry( imagesHeight*materials[i].map.image.width/materials[i].map.image.height, imagesHeight, 1, 1 );
        //Creamos la figura con la geometria anterior
        var plane = new THREE.Mesh(geometry, materials[i]);
        //Añadimos una propiedad para saber si la figura esta seleccionada, si es la vista de seleccionar imagenes,
        //se marcan todas como seleccionadas, si no no se marca ninguna
        if(type == 1)
            plane.selected = true;
        else
            plane.selected = false;
        //Creamos otro plano para mostrar si la figura esta seleccionada
        var geometry = new THREE.PlaneGeometry( imagesHeight*materials[i].map.image.width/materials[i].map.image.height+40, imagesHeight+40, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x7777aa, overdraw: true } );
        plane.selectedPlane = new THREE.Mesh(geometry, material);
        plane.selectedPlane.position.z = -2;
        planes.push(plane);        
    }
    
    //Espacio que se utilizara para mostrar las imagenes
    imgSpace = {bottom : -margins.y,
                    top : margins.y-200,
                    left : margins.x,
                    rigth : -margins.x};
    //Si es le tipo de vista con cubos
    if(type == 2 || type == 3)
    {
        //Dejamos espacio para los cubos
        imgSpace.rigth -= (imagesHeight + separation*4);
    } 
    //Numero de imagenes por pagina
    var pagImg = 0;
    //Array con los indices de las imagenes de una pagina
    var page = [];
    //Numero de filas que se han introducido
    var row = 0;
    //Posicion horizontal en pixeles de la ultima figura introducida
    var pos = imgSpace.left;
    //Colocamos los planos
    for(var i=0; i<materials.length; i++)
    {
        //Calculamos el tamaño horizontal del plano
        var size = planes[i].geometry.vertices[1].x - planes[i].geometry.vertices[0].x;
        
        //Calculamos la posicion horizontal que deberá tener el plano
        var posx = pos + separation + size/2;
        
        //Si llega al final de la fila, pasamos a la fila siguiente
        if(posx + size/2 >= imgSpace.rigth - separation)
        {
            //Aumentamos el numero de filas
            row++;
            //Colocamos el plano a la izquierda del todo
            posx = imgSpace.left + separation + size/2;
        }
        
        //Calculamos la posicion vertical que deberá tener el plano
        var posy = imgSpace.top - separation - imagesHeight/2 - row*(separation + imagesHeight);
        
        //Si se llega al final de la pagina
        if(posy - imagesHeight/2 <=  imgSpace.bottom + separation)
        {
            //Reiniciamos la cuenta de las imagenes por pagina
            pagImg = 0;
            //Reiniciamos la cuenta de columnas
            row = 0;
            
            //Guardamos los indices de las imagenes de esta paginas en el array
            pagesIndex.push(page);
            //Vaciamos el array de imagenes por pagina
            page = [];
            
            //Calculamos la posicion vertical que deberá tener el plano en la nueva pagina
            posy = imgSpace.top - separation - imagesHeight/2 - row*(separation + imagesHeight);
        }
        
        //Colocamos el plano en la posicion calculada
        planes[i].position.x = planes[i].selectedPlane.position.x = planes[i].iniPosX = posx;
        planes[i].position.y = planes[i].selectedPlane.position.y = planes[i].iniPosY = posy;
        
        //Guardamos el indice del plano en la informacion de la pagina
        page.push(i);
        //Aumentamos el numero de imagenes que tiene la pagina actual
        pagImg++;
        
        //Colocamos la posicion el el lado derecho del plano, no en el centro, para el siguente plano que se coloque
        pos = posx + size/2;
    }
    //Guardamos los indices de la ultima pagina
    pagesIndex.push(page);
    
    
    //Si es una vista con cubos, los creamos
    if(type == 2 || type == 3)
    {
        //Recorremos cada uno de los cubos
        for(var i=0; i<type; i++)
        {
            var mats = [];
            for(var j=0; j<6; j++)
                    mats.push(materials[j+i*6]);
            cubes[i] = new THREE.Mesh( new THREE.CubeGeometry( imagesHeight, imagesHeight, imagesHeight, 1,1,1 ), new THREE.MeshFaceMaterial(mats) );
            cubes[i].position.x = imgSpace.rigth + separation*1.5 + imagesHeight/2;
            cubes[i].position.y = imgSpace.top - separation - imagesHeight/2 - i*(separation + imagesHeight);
            cubes[i].rotation.y = -0.51;
            //Añadimos la figura a la escena
            scene.add(cubes[i]);            
        }
        //Añadimos un rectangulo para mostrar el area de los cubos
        var geometry = new THREE.Geometry();
        var vertice
        vertice = new THREE.Vector3(imgSpace.rigth,imgSpace.bottom+50, 0);
        geometry.vertices.push(vertice);
        vertice = new THREE.Vector3(-margins.x-50, imgSpace.bottom+50, 0);
        geometry.vertices.push(vertice);
        vertice = new THREE.Vector3(-margins.x-50,imgSpace.top-50, 0 );
        geometry.vertices.push(vertice);
        vertice = new THREE.Vector3(imgSpace.rigth,imgSpace.top-50, 0 );
        geometry.vertices.push(vertice);
        vertice = new THREE.Vector3(imgSpace.rigth,imgSpace.bottom+50, 0 );
        geometry.vertices.push(vertice);
        line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
        scene.add(line);
    }
    
     
    //Ahora crearemos los botones para cambiar de pagina
    //Espacio que se utilizara para mostrar los numeros de pagina
    var textSpace = {bottom : -margins.y,
                    top : margins.y,
                    left : margins.x+80, //Dejamos espacio para el icono del sonido
                    rigth : -margins.x};//Tamaño del texto                   
    //Separacion vertical de los numeros de pagina
    var verTextSep = 200;
    //Separacion horizontal de los numeros de pagina
    var horTextSep = 150;
    //Ultima posicion horizontal en la que se ha colocado un numero
    var pos = textSpace.left;
    
    //Creamos el simbolo de ir a la pagina inicial
    var text = createText("<<")    
    //Colocamos la figura en el lugar que le corresponde
    text.position.x = pos + horTextSep;
    text.position.y = textSpace.top - verTextSep;
    //Guardamos una propiedad para saber a que pagina corresponde
    text.textID = -2;
    pos += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
    //Añadimos a la escena
    scene.add(text);
    pages.push(text);
    
    //Creamos el simbolo de ir a la pagina anterior
    var text = createText("<")    
    //Colocamos la figura en el lugar que le corresponde
    text.position.x = pos + horTextSep;
    text.position.y = textSpace.top - verTextSep;
    //Guardamos una propiedad para saber a que pagina corresponde
    text.textID = -1;
    pos += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
    //Añadimos a la escena
    scene.add(text);
    pages.push(text);
    
    //Recorremos cada pagina
    for(var i=0; i< pagesIndex.length; i++)
    {
        var text = createText((i+1).toString());
        
        //Colocamos la figura en el lugar que le corresponde
        text.position.x = pos + horTextSep;
        text.position.y = textSpace.top - verTextSep;
        //Guardamos una propiedad para saber a que pagina corresponde
        text.textID = i;
        pos += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
        
        scene.add(text);
        pages.push(text);
    }
    
    //Creamos el simbolo de ir a la pagina siguiente
    var text = createText(">")    
    //Colocamos la figura en el lugar que le corresponde
    text.position.x = pos + horTextSep;
    text.position.y = textSpace.top - verTextSep;
    //Guardamos una propiedad para saber a que pagina corresponde
    text.textID = i;
    pos += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
    //Añadimos a la escena
    scene.add(text);
    pages.push(text);
    
    //Creamos el simbolo de ir a la ultima pagina
    var text = createText(">>")    
    //Colocamos la figura en el lugar que le corresponde
    text.position.x = pos + horTextSep;
    text.position.y = textSpace.top - verTextSep;
    //Guardamos una propiedad para saber a que pagina corresponde
    text.textID = i+1;
    pos += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
    //Añadimos a la escena
    scene.add(text);
    pages.push(text);
    
    
    //Creamos un canvas para crear un degradado en el marcador de pagina
    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;
    //Creamos un degradado en el canvas
    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0 / 4, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.5, '#'+backgroundColor.toString(16) );
    gradient.addColorStop( 0.7, '#9fabc9' );
    gradient.addColorStop( 1, '#'+backgroundColor.toString(16) );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    //Creamos la textura y el material con el degradado
    var shadowTexture = new THREE.Texture( canvas );
    shadowTexture.needsUpdate = true;
    var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
    
    //Creamos un circulo que marcara la pagina en la que se esta utilizando el degradado
    pageMark = new THREE.Mesh(new THREE.PlaneGeometry(textSize+250, textSize+250, 1,1), shadowMaterial);
    scene.add(pageMark);
    //Lo colocamos en el numero de pagina correspondiente
    pageMark.position.x = pages[2].position.x + (pages[2].geometry.boundingBox.max.x - pages[2].geometry.boundingBox.min.x)/2 - 10;
    pageMark.position.y = pages[2].position.y + (pages[2].geometry.boundingBox.max.y - pages[2].geometry.boundingBox.min.y)/2 + 10;
    pageMark.position.z = -40;
    pageMark.rotation.x = -0.5;
    
    //Mostramos la primera pagina    
    for(var i=0; i< pagesIndex[0].length; i++)
    {
        scene.add( planes[ pagesIndex[0][i] ] );
        if(planes[ pagesIndex[0][i] ].selected)
            scene.add( planes[ pagesIndex[0][i] ].selectedPlane );
    }
    
    
    //Añadimos los botones necesarios
    addAcceptButton();
    addBackButton();
    addAddImgButton();    
    //Creamos el controlador de la biblioteca de imagenes
    libC = new LibraryController(camera, scene, planes, pages, pagesIndex, type, cubes);
    

/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: clearView
 * Sinopsis: Método para limpiar la escena, elimina todos los objetos de la escena menos la cámara.
 * Entradas:
 * Salidas:
 * */
function clearView()
{
    for(var i=0; i<scene.children.length; i++)
    {
        if( !(scene.children[i] instanceof  THREE.Camera) )
        {
            scene.remove(scene.children[i]);
            i--;
        }
    }
}

/*
 * Nombre: calculateMargins
 * Sinopsis: Método para calcular los márgenes entre los que se mostrarán los imágenes.
 * Entradas:
 * Salidas:
 *      -Vector2 -> vector de dos elementos donde la X es el margen izquierdo o derecho, y la Y es el margen superior o inferior
 * */
function calculateMargins()
{
    return new THREE.Vector2(-803.8333*11/5, 803.8333);
}

/*
 * Nombre: createText
 * Sinopsis: Método que crea un objeto 3D con el texto suministrado.
 * Entradas:
 *      -String:str -> cadena de texto con la que se creará la figura.
 * Salidas:
 *      -Mesh -> objeto 3D creado con el texto suministrado.
 * */
function createText(str)
{
    //Creamos un color aletorio
    var rand = randomColor();
        
    //Creamos un material para el texto, con un material para la parte frontal con el
    //color aleatorio, y otro material para los lados con el color aletorio oscurecido
    var material = new THREE.MeshFaceMaterial( [ 
            new THREE.MeshBasicMaterial( { color: new THREE.Color().setHSV( rand, 0.95, 0.85 ).getHex(), overdraw: true } ),//front
            new THREE.MeshBasicMaterial( { color: new THREE.Color().setHSV( rand, 0.95, 0.50 ).getHex(), overdraw: true } ) // side
        ] );
    
    //Creamos la geometria del texto
    var textGeo = new THREE.TextGeometry( str, {
                                    size: textSize,
                                    height: 40,
                                    curveSegments: 4,
                                    font: "droid serif",
                                    style: "normal",
                                    
                                
                                    bevelThickness: 4,
                                    bevelSize: 1.5,
                                    bevelEnabled: true,
                                
                                    material: 0,
                                    extrudeMaterial: 1
                                    }
    );

    //Calculamos el rectangulo que contiene a la geometria
    textGeo.computeBoundingBox();
    
    //Creamos la figura
    text = new THREE.Mesh( textGeo, material );
    
    //Giramos la figura para que se pueda apreciar mejor el efecto 3D
    text.rotation.y = 0;
    text.rotation.x = -0.5;
    
    return text;
}

/*
 * Nombre: addAcceptButton
 * Sinopsis: Método que crea y muestra el boton de aceptar.
 * Entradas:
 * Salidas:
 * */
function addAcceptButton()
{
    //Creamos un boton
    acceptButton = document.createElement('input');
    acceptButton.type = 'button';
    acceptButton.id = 'acceptButton';
    acceptButton.value = 'aceptar';
    //Lo añadimos al contenedor principal
    container.appendChild(acceptButton);
    //Movemos el contenedor, con el boton dentro
    acceptButton.style.position = 'absolute';
    acceptButton.style.bottom = '10px';
    if(type == 1)
        acceptButton.style.left = (window.innerWidth*3/4 - acceptButton.width/2).toString()+'px';
    else
    {
        var width = (-margins.x)*2 - imgSpace.rigth-margins.x;
        acceptButton.style.left = (window.innerWidth*3/4*(-margins.x*2)/width - acceptButton.width/2).toString()+'px';
    }
}

/*
 * Nombre: addBackButton
 * Sinopsis: Método que crea y muestra el boton de anterior.
 * Entradas:
 * Salidas:
 * */
function addBackButton()
{
    //Creamos un boton
    backButton = document.createElement('input');
    backButton.type = 'button';
    backButton.id = 'backButton';
    backButton.value = 'atras';
    //Lo añadimos al contenedor principal
    container.appendChild(backButton);
    //Movemos el contenedor, con el boton dentro
    backButton.style.position = 'absolute';
    backButton.style.bottom = '10px';    
    if(type == 1)
        backButton.style.left = (window.innerWidth/4 - backButton.width/2).toString()+'px';
    else
    {
        var width = (-margins.x)*2 - imgSpace.rigth-margins.x;
        backButton.style.left = (window.innerWidth*1/4*(-margins.x*2)/width - backButton.width/2).toString()+'px';
    }
}

/*
 * Nombre: addAddImgButton
 * Sinopsis: Método que crea y muestra el boton de anterior.
 * Entradas:
 * Salidas:
 * */
function addAddImgButton()
{
    //Creamos un boton
    addImgButton = document.createElement('input');
    addImgButton.type = 'button';
    addImgButton.id = 'addImgButton';
    addImgButton.value = 'añadir imagen';
    //Lo añadimos al contenedor principal
    container.appendChild(addImgButton);
    //Movemos el contenedor, con el boton dentro
    addImgButton.style.position = 'absolute';
    addImgButton.style.bottom = '10px';    
    if(type == 1)
        addImgButton.style.left = (window.innerWidth/2 - addImgButton.width/2).toString()+'px';
    else
    {
        var width = (-margins.x)*2 - imgSpace.rigth-margins.x;
        addImgButton.style.left = (window.innerWidth/2*(-margins.x*2)/width - addImgButton.width/2).toString()+'px';
    }
    
    //Creamos una entrada de archivos
    var inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.id = 'inputFile';
    inputFile.multiple = true;
    inputFile.accept = 'image/*';
    inputFile.style.display = 'none';
    container.appendChild(inputFile);
}


/*****************************************
 *  Métodos Publicos
 *****************************************/

/*
 * Nombre: showPage
 * Sinopsis: Método para mostrar la pagina solicitada.
 * Entradas:
 *      -Integer:index-> indice de la pagina a mostrar.
 * Salidas:
 * */
this.showPage = function (index)
{
    //Si el indice de la pagina no corresponde con un numero de pagina
    if(index < 0 || index >= pages.length)
        //No hacemos nada
        return;
    
    //Colocamos la marca de la pagina actual donde corresponda
    var j = index + 2;
    pageMark.position.x = pages[j].position.x + (pages[j].geometry.boundingBox.max.x - pages[j].geometry.boundingBox.min.x)/2 - 10;
    pageMark.position.y = pages[j].position.y + (pages[j].geometry.boundingBox.max.y - pages[j].geometry.boundingBox.min.y)/2 + 10;
    
    //Eliminamos los planos de la escena
    for(var i=0; i<planes.length; i++)
    {
        scene.remove(planes[i]);
        scene.remove(planes[i].selectedPlane);
    }
    
    //Añadimos a la escena los planos de la pagina indicada
    for(var i=0; i<pagesIndex[index].length; i++)
    {
        scene.add( planes[pagesIndex[index][i]] );
        if(planes[pagesIndex[index][i]].selected)
        {
            scene.add(planes[pagesIndex[index][i]].selectedPlane);
        }
    }
    
    //Guardamos la pagina actual
    currentPage = index;
}

/*
 * Nombre: isCubeZone
 * Sinopsis: Método para saber si una posición esta en la zona de los cubos.
 * Entradas:
 *      -Vector2:position -> Posición para la que realizara el cálculo.
 * Salidas:
 *      -Boolean -> true si se encuentra en la zona de los cubos y false si no.
 * */
this.isCubeZone = function (position)
{
    if(position.x < imgSpace.rigth || position.x > -margins.x-50 || position.y < imgSpace.bottom+50 || position.y > imgSpace.top-50)
        return false;
    else
        return true;
}

/*
 * Nombre: putZBefore
 * Sinopsis: Método para colocar un plano delante de un cubo.
 * Entradas:
 *      -Mesh:object -> figura que se moverá hacia delante.
 * Salidas:
 * */
this.putZBefore = function (object)
{
    object.position.z = imagesHeight/1.5;
}

/*
 * Nombre: putZ1
 * Sinopsis: Método para colocar un plano en Z=1, es decir en su profundidad normal en movimiento.
 * Entradas:
 *      -Mesh:object -> figura que se colocará en su profundidad normal en movimiento.
 * Salidas:
 * */
this.putZ1 = function (object)
{
    object.position.z = 1;
}

/*
 * Nombre: addImg
 * Sinopsis: Método para añadir una imagen a la biblioteca.
 * Entradas:
 *      -Material:material -> material con el que se creará el plano que represente a la figura.
 * Salidas:
 *      -Boolean -> muestra si se tuvo éxito al añadir la imagen.
 * */
this.addImg = function (material)
{
    //Flag para saber si hay que añadir un nuevo numero de pagina
    var createPage = false;
    
    //Creamos la geometria con la altura indicada y con su anchura proporcional
    var geometry = new THREE.PlaneGeometry( imagesHeight*material.map.image.width/material.map.image.height, imagesHeight, 1, 1 );
    //Creamos la figura con la geometria anterior
    var plane = new THREE.Mesh(geometry, material);
    //Añadimos una propiedad para saber si la figura esta seleccionada, si es la vista de seleccionar imagenes,
    //se marcan todas como seleccionadas, si no no se marca ninguna
    if(type == 1)
        plane.selected = true;
    else
        plane.selected = false;
    //Creamos otro plano para mostrar si la figura esta seleccionada
    var geometry = new THREE.PlaneGeometry( imagesHeight*material.map.image.width/material.map.image.height+40, imagesHeight+40, 1, 1 );
    plane.selectedPlane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0x7777aa, overdraw: true } ));
    plane.selectedPlane.position.z = -2;
    //Añadimos el plano al array 
    planes.push(plane);
    
    //Espacio que se utilizara para mostrar las imagenes
    imgSpace = {bottom : -margins.y,
                top : margins.y-200,
                left : margins.x,
                rigth : -margins.x};
    //Si es le tipo de vista con cubos
    if(type == 2 || type == 3)
    {
        //Dejamos espacio para los cubos
        imgSpace.rigth -= (imagesHeight + separation*4);
    }
    //Obtenemos los indices de la ultima pagina y del anterior al ultimo plano de la pagina, ya que ya hemos introducido el nuevo plano
    var lastPage = pagesIndex.length-1;
    var lastPlane = pagesIndex[lastPage][pagesIndex[lastPage].length-1];
    //Calculamos la posicion de la ultima figura
    var lastPosition = new THREE.Vector3().copy(planes[lastPlane].position);
    
    //Calculamos el tamaño horizontal del plano
    var size = plane.geometry.vertices[1].x - plane.geometry.vertices[0].x;
    //Calculamos la posicion horizontal que deberá tener el plano
    var posx = lastPosition.x + (planes[lastPlane].geometry.vertices[1].x - planes[lastPlane].geometry.vertices[0].x)/2 + separation + size/2;
    //Calculamos la posicion vertical que deberá tener el plano
    var posy = lastPosition.y;
    //Si llega al final de la fila, pasamos a la fila siguiente
    if(posx + size/2 >= imgSpace.rigth - separation)
    {
        //Colocamos el plano a la izquierda del todo
        posx = imgSpace.left + separation + size/2;
        //En la siguiente fila
        posy -= separation + imagesHeight;
    }
    //Si se llega al final de la pagina
    if(posy - imagesHeight/2 <=  imgSpace.bottom + separation)
    {
        //Añadimos una nueva pagina vacia
        pagesIndex.push([]);        
        //Calculamos la posicion vertical que deberá tener el plano en la nueva pagina
        posy = imgSpace.top - separation - imagesHeight/2;
        createPage = true;
    }
    
    //Colocamos el plano en la posicion calculada
    plane.position.x = plane.selectedPlane.position.x = plane.iniPosX = posx;
    plane.position.y = plane.selectedPlane.position.y = plane.iniPosY = posy;
    
    //Guardamos el indice en la ultima pagina
    pagesIndex[pagesIndex.length-1].push(planes.length-1);
    
    
    if(createPage)
    {
        //Separacion vertical de los numeros de pagina
        var verTextSep = 200;
        //Separacion horizontal de los numeros de pagina
        var horTextSep = 150;
        
        //Creamos el numero de la pagina
        var text = createText(pagesIndex.length.toString())
        //Comprobamos que no se salga de la pantalla
        if(pages[pages.length-1].position.x + (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep > -margins.x)
        {
            pagesIndex.pop();
            planes.pop();
            return false;
        }
        
        //Obtenemos la posicion del ultimo numero de pagina
        var lastPosition = new THREE.Vector3().copy(pages[pagesIndex.length-2+2].position);
        //Calculamos su posicion 
        text.position.x = (pages[pagesIndex.length-2+2].geometry.boundingBox.max.x-pages[pagesIndex.length-2+2].geometry.boundingBox.min.x) + lastPosition.x + horTextSep;
        text.position.y = lastPosition.y;
        text.textID = pagesIndex.length-1;
        
        //Movemos los dos siguientes simbolos (pag siguiente y ultima pag)
        pages[pages.length-1].position.x += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
        pages[pages.length-2].position.x += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
        //Incrementamos en uno los identificadores, ya que hay una nueva pagina
        pages[pages.length-1].textID++;
        pages[pages.length-2].textID++;
        
        //Añadimos el numero al array de paginas y a la escena
        pages.splice(pages.length-2, 0, text);
        scene.add(text);    
    }
    else if(currentPage == pagesIndex.length-1)
    {
        scene.add(plane);
        if(plane.selected)
            scene.add(plane.selectedPlane);
    }
    return true;
}

/*
 * Nombre: hide
 * Sinopsis: Método para eliminar de la interfaz todos los elementos de la vista, ocultarlos.
 * Entradas:
 * Salidas:
 * */
this.hide = function ()
{
    //Recorremos los planos de la pagina actual
    for(var i=0; i<pagesIndex[currentPage].length; i++)
    {
        //Quitamos el plano de la escena
        scene.remove(planes[pagesIndex[currentPage][i]]);
        //Si el modo de vista es el de imagenes seleccionable y esta seleccionada la imagen
        if(type== 1 && planes[pagesIndex[currentPage][i]].selected)
        {
            //Quitamos la marca de seleccion de la escena
            scene.remove(planes[pagesIndex[currentPage][i]].selectedPlane);
        }
    }
    //Recorremos los numeros de pagina
    for(var i=0; i<pages.length; i++)
    {
        //Quitamos el numero de pagina de la escena
        scene.remove(pages[i]);        
    }
    //Quitamos la marca de la pagina actual
    scene.remove(pageMark);
    
    //Si el tipo de vista es uno de los que tienen cubos
    if(type != 1)
    {
        for(var i=0; i<cubes.length; i++)
        {
            //Quitamos el cubo de la escena
            scene.remove(cubes[i]);
        }
        //Quitamos la linea que marca el area de los cubos
        scene.remove(line);
    }
    
    //Se esconden los botones
    acceptButton.style.display = 'none';
    //Botón de anterior
    backButton.style.display = 'none';
    //Botón de añadir imagen
    addImgButton.style.display = 'none';
    
    //Paramos el controlador asociado
    libC.remove();
}

/*
 * Nombre: show
 * Sinopsis: Método para mostrar la vista del tipo indicado.
 * Entradas:
 *      -Integer:t -> tipo de vista que se mostrará.
 * Salidas:
 * */
this.show = function (t)
{
    //Si el tipo suministrado no es correcto
    if(t < 1 || t > 3)
        //No hacemos nada
        return;
    
    //Si no es el tipo que se tiene actualmente, hay que remodelar la vista
    if(t != type)
    {
        //Si el tipo de vista anterior o el actual son el de imagenes seleccionables recolocamos los planos
        if(t == 1 || type == 1)
        {
            //Redefinimos el espacio para mostrar las figuras en funcion del tipo
            if(t == 1)
                imgSpace.rigth = -margins.x;
            if(t == 2 || t == 3)
                //Dejamos espacio para los cubos
                imgSpace.rigth = -margins.x - (imagesHeight + separation*4);
                
            //Vaciamos el array de indices de pagina para crearlos de nuevo
            while(pagesIndex.length != 0)
                pagesIndex.pop();
            
            
            //Numero de imagenes por pagina
            var pagImg = 0;
            //Array con los indices de las imagenes de una pagina
            var page = [];
            //Numero de filas que se han introducido
            var row = 0;
            //Posicion horizontal en pixeles de la ultima figura introducida
            var pos = imgSpace.left;
            //Colocamos los planos
            for(var i=0; i<planes.length; i++)
            {
                //Calculamos el tamaño horizontal del plano
                var size = planes[i].geometry.vertices[1].x - planes[i].geometry.vertices[0].x;
                
                //Calculamos la posicion horizontal que deberá tener el plano
                var posx = pos + separation + size/2;
                
                //Si llega al final de la fila, pasamos a la fila siguiente
                if(posx + size/2 >= imgSpace.rigth - separation)
                {
                    //Aumentamos el numero de filas
                    row++;
                    //Colocamos el plano a la izquierda del todo
                    posx = imgSpace.left + separation + size/2;
                }
                
                //Calculamos la posicion vertical que deberá tener el plano
                var posy = imgSpace.top - separation - imagesHeight/2 - row*(separation + imagesHeight);
                
                //Si se llega al final de la pagina
                if(posy - imagesHeight/2 <=  imgSpace.bottom + separation)
                {
                    //Reiniciamos la cuenta de las imagenes por pagina
                    pagImg = 0;
                    //Reiniciamos la cuenta de columnas
                    row = 0;
                    
                    //Guardamos los indices de las imagenes de esta paginas en el array
                    pagesIndex.push(page);
                    //Vaciamos el array de imagenes por pagina
                    page = [];
                    
                    //Calculamos la posicion vertical que deberá tener el plano en la nueva pagina
                    posy = imgSpace.top - separation - imagesHeight/2 - row*(separation + imagesHeight);
                }
                
                //Colocamos el plano en la posicion calculada
                planes[i].position.x = planes[i].selectedPlane.position.x = planes[i].iniPosX = posx;
                planes[i].position.y = planes[i].selectedPlane.position.y = planes[i].iniPosY = posy;
                
                //Guardamos el indice del plano en la informacion de la pagina
                page.push(i);
                //Aumentamos el numero de imagenes que tiene la pagina actual
                pagImg++;
                
                //Colocamos la posicion el el lado derecho del plano, no en el centro, para el siguente plano que se coloque
                pos = posx + size/2;
            }
            //Guardamos los indices de la ultima pagina
            pagesIndex.push(page);
            
            
            //Si hay un numero diferente de paginas            
            if(pages.length-4 > pagesIndex.length) //Si habia mas 
            {
                //Movemos los dos ultimos simbolos (pag siguiente y ultima pag)
                pages[pages.length-1].position.x -=( (pages[pages.length-3].geometry.boundingBox.max.x-pages[pages.length-3].geometry.boundingBox.min.x) + 150);
                pages[pages.length-2].position.x -=( (pages[pages.length-3].geometry.boundingBox.max.x-pages[pages.length-3].geometry.boundingBox.min.x) + 150);
                //Decrementamos en uno los identificadores, ya que hay una pagina menos
                pages[pages.length-1].textID--;
                pages[pages.length-2].textID--;
                //Eliminamos el ultimo numero de pagina
                pages.splice(pages.length-3, 1);
            }
            if(pages.length-4 < pagesIndex.length) //Si habia menos
            {
                //Separacion vertical de los numeros de pagina
                var verTextSep = 200;
                //Separacion horizontal de los numeros de pagina
                var horTextSep = 150;
                
                
                
                //Creamos el numero de la pagina
                var text = createText((pagesIndex.length).toString())
                
                //Obtenemos la posicion del ultimo numero de pagina
                var lastPosition = new THREE.Vector3().copy(pages[pagesIndex.length-2+2].position);
                //Calculamos su posicion 
                text.position.x = (pages[pagesIndex.length-2+2].geometry.boundingBox.max.x-pages[pagesIndex.length-2+2].geometry.boundingBox.min.x) + lastPosition.x + horTextSep;
                text.position.y = lastPosition.y;
                text.textID = pagesIndex.length-1;
                
                //Movemos los dos siguientes simbolos (pag siguiente y ultima pag)
                pages[pages.length-1].position.x += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
                pages[pages.length-2].position.x += (text.geometry.boundingBox.max.x-text.geometry.boundingBox.min.x) + horTextSep;
                //Incrementamos en uno los identificadores, ya que hay una nueva pagina
                pages[pages.length-1].textID++;
                pages[pages.length-2].textID++;
                
                //Añadimos el numero al array de paginas y a la escena
                pages.splice(pages.length-2, 0, text);
            }
            
            //Si el tipo de vista es el de imagenes seleccionables
            if(t == 1)
                //Seleccionamos todas las imagenes
                for(var i=0; i<planes.length; i++)
                    planes[i].selected = true;
            //Si el tipo de vista no es el de imagenes seleccionables
            else
                //Deseleccionamos todas las imagenes
                for(var i=0; i<planes.length; i++)
                    planes[i].selected = false;
        }        
        
        //Si es una vista con cubos, los creamos si es necesario
        if(t == 2 || t == 3)
        {
            //Recorremos cada uno de los cubos
            for(var i=0; i<t; i++)
            {
                //Si el cubo no esta creado
                if(cubes[i] == undefined)
                {
                    var mats = [];
                    for(var j=0; j<6; j++)
                            mats.push(materials[j+i*6]);
                    cubes[i] = new THREE.Mesh( new THREE.CubeGeometry( imagesHeight, imagesHeight, imagesHeight, 1,1,1 ), new THREE.MeshFaceMaterial(mats) );
                    cubes[i].position.x = imgSpace.rigth + separation*1.5 + imagesHeight/2;
                    cubes[i].position.y = imgSpace.top - separation - imagesHeight/2 - i*(separation + imagesHeight);
                    cubes[i].rotation.y = -0.51;
                    //Añadimos la figura a la escena
                    scene.add(cubes[i]);
                }                    
            }
            
            //Si el rectangulo para delimitar el area de los cubos no esta creado lo creamos
            if(line === undefined)
            {
                var geometry = new THREE.Geometry();
                var vertice
                vertice = new THREE.Vector3(imgSpace.rigth,imgSpace.bottom+50, 0);
                geometry.vertices.push(vertice);
                vertice = new THREE.Vector3(-margins.x-50, imgSpace.bottom+50, 0);
                geometry.vertices.push(vertice);
                vertice = new THREE.Vector3(-margins.x-50,imgSpace.top-50, 0 );
                geometry.vertices.push(vertice);
                vertice = new THREE.Vector3(imgSpace.rigth,imgSpace.top-50, 0 );
                geometry.vertices.push(vertice);
                vertice = new THREE.Vector3(imgSpace.rigth,imgSpace.bottom+50, 0 );
                geometry.vertices.push(vertice);
                line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
            }
        }
    }
    
    //Mostramos todos los elementos
    
    //Mostramos los planos de la primera pagina    
    for(var i=0; i< pagesIndex[0].length; i++)
    {
        scene.add( planes[ pagesIndex[0][i] ] );
        if(planes[ pagesIndex[0][i] ].selected)
            scene.add( planes[ pagesIndex[0][i] ].selectedPlane );
    }
    //Mostramos los numeros de paginas
    for(var i=0; i<pages.length; i++)
        scene.add(pages[i]);
    //Mostramos la marca de pagina
    currentPage = 0;
    //Colocamos la marca de la pagina actual donde corresponda
    var j = currentPage + 2;
    pageMark.position.x = pages[j].position.x + (pages[j].geometry.boundingBox.max.x - pages[j].geometry.boundingBox.min.x)/2 - 10;
    pageMark.position.y = pages[j].position.y + (pages[j].geometry.boundingBox.max.y - pages[j].geometry.boundingBox.min.y)/2 + 10;
    scene.add(pageMark);
    
    //Mostramos los cubos si corresponde
    if(t == 2 || t == 3)
    {
        //Recorremos cada uno de los cubos y lo añadimos a la escena
        for(var i=0; i<t; i++)
            scene.add(cubes[i]);
        //Añadimos la linea delimitadora a la escena
        scene.add(line);
    }            
        
    type = t;
    
    
    //Mostramos los botones
    
    //Boton de aceptar
    if(type == 1)
        acceptButton.style.left = (window.innerWidth*3/4 - acceptButton.width/2).toString()+'px';
    else
    {
        var width = (-margins.x)*2 - imgSpace.rigth-margins.x;
        acceptButton.style.left = (window.innerWidth*3/4*(-margins.x*2)/width - acceptButton.width/2).toString()+'px';
    }
    acceptButton.style.display = 'block';
    
    
    //Botón de anterior
    if(type == 1)
        backButton.style.left = (window.innerWidth/4 - backButton.width/2).toString()+'px';
    else
    {
        var width = (-margins.x)*2 - imgSpace.rigth-margins.x;
        backButton.style.left = (window.innerWidth*1/4*(-margins.x*2)/width - backButton.width/2).toString()+'px';
    }
    backButton.style.display = 'block';
    
    //Botón de añadir imagen
    if(type == 1)
        addImgButton.style.left = (window.innerWidth/2 - addImgButton.width/2).toString()+'px';
    else
    {
        var width = (-margins.x)*2 - imgSpace.rigth-margins.x;
        addImgButton.style.left = (window.innerWidth/2*(-margins.x*2)/width - addImgButton.width/2).toString()+'px';
    }
    addImgButton.style.display = 'block';
    
    //Habilitamos el controlador con el tipo correspondiente
    libC.enable(t);
}

}