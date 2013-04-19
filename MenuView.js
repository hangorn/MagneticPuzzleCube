/*
 *  Nombre: MenuView.js
 *  Sinopsis: Clase de la vista de la biblioteca de imágenes.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 30-03-2013
 *  Versión: 0.4
 *  Fecha: 04-01-2013
 *  Versión: 0.3
 *  Fecha: 03-01-2013
 *  Versión: 0.2
 *  Fecha: 02-01-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE MENUVIEW
 *  */
function MenuView (sce)
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Tamaño de los cubos que formarán las letras
    var cubesSize;
    
    //Materiales con los que se creará el puzzle
    var materials = [];
    
    //Entradas del menu
    var currentMenu;
    var entrys;
    //Menu principal
    //Entrada de un jugador
    var onePlayerEntry;
    //Entrada de varios jugadores
    var multiPlayerEntry;
    //Entrada de opciones
    var optionsEntry;
    //Entrada de puntuaciones
    var ratingEntry;
    //Entrada de ayuda
    var helpEntry;
    
    //Un jugador
    //Entrada de modo clasico
    var classicModeEntry;
    //Entrada de modo por niveles
    var levelsEntry;
    //Entrada de modo contrareloj
    var trialModeEntry;
    //Entrada de modo supervivencia
    var survivalModeEntry;
    
    //Varios jugadores
    //Entrada de crear partida
    var createGameEntry;
    //Entrada de buscar partida
    var searchGameEntry;
    
    //Botón de anterior
    var backButton;
    //Formulario del modo clasico
    var classicForm;
    //Formulario del modo niveles
    var levelsForm;
    //Formulario del modo contrareloj
    var trialForm;
    //Formulario del modo supervivencia
    var survivalForm;
    
    //Controlador de la biblioteca
    var menC;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase MenuView.
 * Entradas:
 *      -Scene:sce -> escena en la que se representará el mundo 3D.
 * Salidas:
 * */

    //Iniciamos los cubos al tamaño por defecto
    var cubesSize = 40;
    
    //Menu Principal
    onePlayerEntry = createMenuEntry("un jugador", new THREE.Vector3(0,540,0));
    multiPlayerEntry = createMenuEntry("varios jugadores", new THREE.Vector3(0,280,0));
    optionsEntry = createMenuEntry("opciones", new THREE.Vector3(0,10,0));
    ratingEntry = createMenuEntry("puntuaciones", new THREE.Vector3(0,-280,0));
    helpEntry = createMenuEntry("ayuda", new THREE.Vector3(0,-590,0));
    
    //Menu un jugador
    classicModeEntry = createMenuEntry("modo clasico", new THREE.Vector3(0,510,0));
    levelsEntry = createMenuEntry("niveles", new THREE.Vector3(0,250,0));
    trialModeEntry = createMenuEntry("contrareloj", new THREE.Vector3(0,-20,0));
    survivalModeEntry = createMenuEntry("supervivencia", new THREE.Vector3(0,-310,0));
    //Menu varios jugadores
    createGameEntry = createMenuEntry("crear partida", new THREE.Vector3(0,250,0));
    searchGameEntry = createMenuEntry("buscar partida", new THREE.Vector3(0,-20,0));
    
    //Creamos los formularios de los distintos modos
    classicForm = createClassicModeForm();
    levelsForm = createLevelsModeForm();
    trialForm  = createTrialModeForm();
    survivalForm = createSurvivalModeForm();
    
    //Guardamos las entradas de todos los menus
    entrys = [ [onePlayerEntry, multiPlayerEntry, optionsEntry, ratingEntry, helpEntry], //Menu inicial
               [classicModeEntry, levelsEntry, trialModeEntry, survivalModeEntry], //Un jugador
               [createGameEntry, searchGameEntry], //Varios jugadores
               [], //Opciones
               [], //Puntuaciones
               [], //Ayuda
               [classicForm], //Modo clasico
               [levelsForm], //Modo niveles
               [trialForm], //Modo contrareloj
               [survivalForm], //Modo supervivencia
               [], //Crear partida
               [] //Buscar partida
               ]; 
    
    //Iniciamos los indices de los menus
    var ind = 0;
    for(var i=0; i<entrys.length; i++)
        for(var j=0; j<entrys[i].length; j++)
            entrys[i][j].menuIndex = ++ind;
   
    //Inicamos el menu actual
    currentMenu = 0;    
    for(var i=0; i<entrys[currentMenu].length; i++)
        scene.add(entrys[currentMenu][i]);
    
    addBackButton();
    
    menC = new MenuController(camera, sce, entrys, materials);
    

/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: createLetter
 * Sinopsis: Método que crea un objeto 3D formado por cubos representando la letra suministrada.
 * Entradas:
 *      -String:letter -> cadena de texto con la letra que se creará.
 *      -Vector3:pos -> posicion inicial en la que se colocará la letra, esquina inferior izquierda.
 *      -Material:frontMat -> material con el cual se creará la cara del frente de la letra.
 *      -Material:backMat-> material con el cual se creará la cara de atrás de la letra.
 * Salidas:
 *      -Mesh -> objeto 3D creado con la letra o null si no es una letra conocida (un espacio, ...).
 * */
function createLetter(letter, pos, frontMat, backMat)
{
    //Creamos una variable estatica al metodo para el material de los lados y si no esta definido la iniciamos, asi no creamos un material para cada letra (ahorramos recursos)
    if(createLetter.sidesMaterial === undefined) createLetter.sidesMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: true , wireframe: true, wireframeLinewidth : 1 } );
    var faceMat = new THREE.MeshFaceMaterial([
        createLetter.sidesMaterial, createLetter.sidesMaterial,
        createLetter.sidesMaterial, createLetter.sidesMaterial,
        frontMat, backMat
    ]);
    
    //Creamos una variable estatica al metodo para la geometria de los cubos y si no esta definido la iniciamos, asi no creamos una geometria para cada cubo de cada letra (ahorramos recursos)
    if(createLetter.geom === undefined) createLetter.geom = new THREE.CubeGeometry( cubesSize, cubesSize, cubesSize, 1,1,1 );
    
    //Obtenemos los datos de las letras si estan cargados
    if(lettersLoad)
        var data = lettersData[letter];
    else
        console.error("los datos de las letras no se han cargado");
        
    //Obtenmos los datos de la letra correspondiente
    if(data == undefined)
        return null;
    
    //Creamos un objeto 3D para juntar los cubos de la letra
    var letterMesh = new THREE.Object3D();
    //Recorremos cada dato de la letra
    for(var i=0; i<data.length; i++)
    {
        var cub = new THREE.Mesh(createLetter.geom , faceMat);
        cub.iniPosX = cub.position.x = data[i][0]*cubesSize;
        cub.iniPosY = cub.position.y = data[i][1]*cubesSize;
        letterMesh.add(cub);
    }
    
    //Ponemos la letra en su posicion inicial
    letterMesh.position.copy(pos);
    //Calculamos la anchura de la letra    
    letterMesh.width = letterMesh.children[letterMesh.children.length-1].position.x + cubesSize;
    
    return letterMesh;
}

/*
 * Nombre: createMenuEntry
 * Sinopsis: Método que crea un objeto 3D para una entrada en el menú.
 * Entradas:
 *      -String:sentence -> cadena de texto con la frase que contendrá la entrada del menú.
 *      -Vector3:pos -> posicion inicial en la que se colocará el boton, esquina inferior izquierda.
 * Salidas:
 *      -Mesh -> objeto 3D creado con la frase.
 * */
function createMenuEntry(sentence, pos)
{
    //Creamos un array para guardar todas la letras de la frase
    var letters = [];
    var sentenceWidth = cubesSize;
    
    //Pasamos las letras a minusculas, ya que es lo que reconoce la funcion de crear letras
    var sent = sentence.toLowerCase();
    
    var rand = Math.random();
    var frontMat = new THREE.MeshBasicMaterial( { color: rand*0xffffff, overdraw: true, side : THREE.DoubleSide } );
    var backMat = new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff, overdraw: true, side : THREE.DoubleSide } );
    
    
    //Recorremos las letras de la frase
    for(var i=0; i<sent.length; i++)
    {
        //Creamos la letra
        var l = createLetter(sent[i], new THREE.Vector3(sentenceWidth, -cubesSize*2, cubesSize/2+1), frontMat, backMat );
        
        //Si se ha podido crear la letra
        if(l != null)
        {
            //Actualizamos la anchura de la frase
            sentenceWidth += l.width + cubesSize*2;
            letters.push(l);
        }
        else
            //Añadimos un espacio
            sentenceWidth += cubesSize*3;

    }
    //Añadimos el espacio final
    sentenceWidth += cubesSize;
    
    //Recolocamos las letra para que queden centradas
    for(var i=0; i<letters.length; i++)
        letters[i].position.x -= sentenceWidth/2 - cubesSize;
    
    //Creamos un plano como fondo de la entrada de menu y como contenedor de todas las letras
    var geometry = new THREE.PlaneGeometry( sentenceWidth, cubesSize*7, 1, 1 );
    var mat = new THREE.MeshBasicMaterial( { color: (1-rand)*0xffffff, overdraw: true } );
    //Comprobamos que el color no sea demasiado claro
    if(mat.color.r > 0.87 && mat.color.g > 0.87 && mat.color.b > 0.87)
        mat.color.setHex(Math.random()*mat.color.getHex());
    var plane = new THREE.Mesh(geometry, mat);
    //Añadimos todas las letras al plano
    for(var i=0; i<letters.length; i++)
        plane.add(letters[i]);
    
    //Colocamos la frase y guardamos su anchura
    plane.position.copy(pos);
    plane.rotation.x = -0.5;
    plane.rotation.y = -0.2;
    plane.width = sentenceWidth;
    //Guardamos los colores
    plane.frontColor = frontMat.color.getHex();
    plane.backColor = backMat.color.getHex();
    plane.backgroundColor = mat.color.getHex();
    
    return plane;
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
    backButton.id = 'menuBackButton';
    backButton.value = 'atras';
    //Lo añadimos al contenedor principal
    container.appendChild(backButton);
    //Movemos el contenedor, con el boton dentro
    backButton.style.position = 'absolute';
    backButton.style.bottom = '10px';
    backButton.style.left = '10px';
    //Lo escondemos ya que en el menu principal no hara falta
    backButton.style.display = 'none';
}

/*
 * Nombre: createClassicModeForm
 * Sinopsis: Método que crea el formulario de configuracion del modo clasico.
 * Entradas:
 * Salidas:
 *      -HtmlObject -> objeto html con el formulario del modo clasico.
 * */
function createClassicModeForm()
{
    //Creamos el contenedor que contendra el formulario
    var formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '76%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    formCont.style.display = 'none';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'classicForm';
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Modo Clásico';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos una descripcion del modo de juego
    var descrip = document.createElement('p');
    //Añadimos el contenido    
    descrip.innerHTML = 'Se debera resolver el puzzle, cronometrandose cuanto tiempo se emplea en ello. Se pueden elegir las imagenes del puzzle haciendo click en \'personalizar imagenes\'.';
    //Añadimos la descripcion al contenedor
    form.appendChild(descrip);
    
    //Creamos un contenedor para la opcion numero de cubos
    var contNumC = document.createElement('div');
    form.appendChild(contNumC);    
    //Mostramos un texto de la opcion correspondiente
    contNumC.innerHTML += 'Elige el número de piezas del puzzle:'+'<br>';
    
    //Creamos un delimitador para la opcion de numero de cubos
    var fieldSet = document.createElement('fieldset');
    //Aplicamos su estilo
    fieldSet.style.borderRadius = '10px';
    fieldSet.style.margin = '10px 0';
    fieldSet.style.padding = '10px';
    fieldSet.style.display = 'inline';
    contNumC.appendChild(fieldSet);
    
    //Creamos los radio-buttons para elegir el numero de cubos
    //27 cubos
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'cubes27classic';
    radio.name = 'cubesNumber';
    radio.checked = 'checked';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = '27 cubos';
    radioLabel.htmlFor = 'cubes27classic';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //8 cubos
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'cubes8classic';
    radio.name = 'cubesNumber';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = '8 cubos';
    radioLabel.htmlFor = 'cubes8classic';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    
    //Añadimos los botones
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'start';
    button.value = 'empezar';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.left = '60%';
    form.appendChild(button);
    
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'library';
    button.value = 'personalizar imagenes';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.right = '60%';
    form.appendChild(button);
    
    return formCont;
}

/*
 * Nombre: createLevelsModeForm
 * Sinopsis: Método que crea el formulario de configuracion del modo niveles.
 * Entradas:
 * Salidas:
 *      -HtmlObject -> objeto html con el formulario del modo niveles.
 * */
function createLevelsModeForm()
{
    //Creamos el contenedor que contendra el formulario
    var formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '76%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    formCont.style.display = 'none';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'levelsForm';
    form.style.height = '100%'; //Colocamos la altura al 100% para que los hijos puedan calcular su altura con porcentajes
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Niveles';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos una descripcion del modo de juego
    var descrip = document.createElement('p');
    //Añadimos el contenido    
    descrip.innerHTML = 'Selecciona un nivel:';
    descrip.style.marginBottom = '2px';
    //Añadimos la descripcion al contenedor
    form.appendChild(descrip);
    
    //Creamos un contendor para los niveles
    var levelsCont = document.createElement('div');
    form.appendChild(levelsCont);
    levelsCont.style.width = '70%';
    levelsCont.style.height = '64%';
    levelsCont.style.padding = '5px';
    levelsCont.style.margin = '0 2%';
    levelsCont.style.overflow = 'auto';
    levelsCont.style.backgroundColor = '#ffffff';
    levelsCont.style.cssFloat = 'left';
    
    //Creamos una descripcion del modo de juego
    var descrip = document.createElement('p');
    descrip.className = 'description';
    descrip.style.width = '20%';
    descrip.style.cssFloat = 'right';
    descrip.style.padding = '10px';
    descrip.style.marginRight = '2%';
    descrip.style.textAlign = 'right';
    //Añadimos la descripcion al contenedor
    form.appendChild(descrip);
    
    //Comprobamos que se ha cargado la informacion de los niveles
    if(levelsLoad)
    {
        //Creamos los niveles y los guardamos en un array
        var levels = [];
        for(var i=0; i<levelsData.length; i++)
        {
            var l = createLevelEntry(levelsData[i].name, levelsData[i].img, levelsData[i].description);
            levelsCont.appendChild(l);
            l.index = i;
            levels.push(l);
        }
        formCont.levels = levels;    
    }
    else
        console.error("menu:los datos de la informacion de los niveles no estan cargados");    
    
    //Añadimos los botones
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'start';
    button.value = 'empezar';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.left = '60%';
    form.appendChild(button);
    
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'library';
    button.value = 'personalizar imagenes';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.right = '60%';
    form.appendChild(button);
    
    return formCont;
}

/*
 * Nombre: createTrialModeForm
 * Sinopsis: Método que crea el formulario de configuracion del modo contrareloj.
 * Entradas:
 * Salidas:
 *      -HtmlObject -> objeto html con el formulario del modo contrareloj.
 * */
function createTrialModeForm()
{
    //Creamos el contenedor que contendra el formulario
    var formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '76%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    formCont.style.display = 'none';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'trialForm';
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Modo Contrareloj';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos una descripcion del modo de juego
    var descrip = document.createElement('p');
    //Añadimos el contenido    
    descrip.innerHTML = 'Se debera resolver el puzzle antes de que se agote el tiempo, determinado en funcion de la dificultad seleccionada. Se pueden elegir las imagenes del puzzle haciendo click en \'personalizar imagenes\'.';
    //Añadimos la descripcion al contenedor
    form.appendChild(descrip);
    
    //Creamos un contenedor para la opcion numero de cubos
    var contNumC = document.createElement('div');
    form.appendChild(contNumC);    
    //Mostramos un texto de la opcion correspondiente
    contNumC.innerHTML += 'Elige el número de piezas del puzzle:'+'<br>';
    
    //Creamos un delimitador para la opcion de numero de cubos
    var fieldSet = document.createElement('fieldset');
    //Aplicamos su estilo
    fieldSet.style.borderRadius = '10px';
    fieldSet.style.margin = '10px 0';
    fieldSet.style.padding = '10px';
    fieldSet.style.display = 'inline';
    contNumC.appendChild(fieldSet);
    
    //Creamos los radio-buttons para elegir el numero de cubos
    //27 cubos
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'cubes27trial';
    radio.name = 'cubesNumber';
    radio.checked = 'checked';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = '27 cubos';
    radioLabel.htmlFor = 'cubes27trial';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //8 cubos
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'cubes8trial';
    radio.name = 'cubesNumber';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = '8 cubos';
    radioLabel.htmlFor = 'cubes8trial';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    
    //Creamos un contenedor para la opcion de la dificultad
    var contDiff = document.createElement('div');
    form.appendChild(contDiff);    
    //Mostramos un texto de la opcion correspondiente
    contDiff.innerHTML += 'Elige la dificultad del puzzle:'+'<br>';
    
    //Creamos un delimitador para la opcion de la dificultad
    var fieldSet = document.createElement('fieldset');
    //Aplicamos su estilo
    fieldSet.style.borderRadius = '10px';
    fieldSet.style.margin = '10px 0';
    fieldSet.style.padding = '10px';
    fieldSet.style.display = 'inline';
    contDiff.appendChild(fieldSet);
    
    //Creamos los radio-buttons para elegir la dificultad
    //Facil
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'easyTrial';
    radio.name = 'difficulty';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'facil';
    radioLabel.htmlFor = 'easyTrial';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //Medio
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'mediumTrial';
    radio.name = 'difficulty';
    radio.checked = 'checked';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'medio';
    radioLabel.htmlFor = 'mediumTrial';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //Dificil
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'hardTrial';
    radio.name = 'difficulty';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'dificil';
    radioLabel.htmlFor = 'hardTrial';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //Imposible
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'hopelessTrial';
    radio.name = 'difficulty';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'imposible';
    radioLabel.htmlFor = 'hopelessTrial';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);    
    
    //Añadimos los botones
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'start';
    button.value = 'empezar';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.left = '60%';
    form.appendChild(button);
    
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'library';
    button.value = 'personalizar imagenes';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.right = '60%';
    form.appendChild(button);
    
    return formCont;
}

/*
 * Nombre: createSurvivalModeForm
 * Sinopsis: Método que crea el formulario de configuracion del modo supervivencia.
 * Entradas:
 * Salidas:
 *      -HtmlObject -> objeto html con el formulario del modo supervivencia.
 * */
function createSurvivalModeForm()
{
    //Creamos el contenedor que contendra el formulario
    var formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '76%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    formCont.style.display = 'none';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'survivalForm';
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Modo Supervivencia';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos una descripcion del modo de juego
    var descrip = document.createElement('p');
    //Añadimos el contenido    
    descrip.innerHTML = 'Se debera resolver el mayor numero de puzzles posibles. Se dispone de un determinado tiempo en funcion de la dificultad para resolver cada puzzle. Cada vez que se resuelva un puzzle se añadira una cantidad de tiempo. Se pueden elegir las imagenes del puzzle haciendo click en \'personalizar imagenes\', se recomiendo elegir al menos 12 imagenes con 8 cubos y 18  con 27 cubos, para que no haya ninguna imagen repetida, si hay mas de estas se mostraran en los siguientes puzzles.';
    //Añadimos la descripcion al contenedor
    form.appendChild(descrip);
    
    //Creamos un contenedor para la opcion numero de cubos
    var contNumC = document.createElement('div');
    form.appendChild(contNumC);    
    //Mostramos un texto de la opcion correspondiente
    contNumC.innerHTML += 'Elige el número de piezas del puzzle:'+'<br>';
    
    //Creamos un delimitador para la opcion de numero de cubos
    var fieldSet = document.createElement('fieldset');
    //Aplicamos su estilo
    fieldSet.style.borderRadius = '10px';
    fieldSet.style.margin = '10px 0';
    fieldSet.style.padding = '10px';
    fieldSet.style.display = 'inline';
    contNumC.appendChild(fieldSet);
    
    //Creamos los radio-buttons para elegir el numero de cubos
    //27 cubos
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'cubes27survival';
    radio.name = 'cubesNumber';
    radio.checked = 'checked';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = '27 cubos';
    radioLabel.htmlFor = 'cubes27survival';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //8 cubos
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'cubes8survival';
    radio.name = 'cubesNumber';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = '8 cubos';
    radioLabel.htmlFor = 'cubes8survival';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    
    //Creamos un contenedor para la opcion de la dificultad
    var contDiff = document.createElement('div');
    form.appendChild(contDiff);    
    //Mostramos un texto de la opcion correspondiente
    contDiff.innerHTML += 'Elige la dificultad del puzzle:'+'<br>';
    
    //Creamos un delimitador para la opcion de la dificultad
    var fieldSet = document.createElement('fieldset');
    //Aplicamos su estilo
    fieldSet.style.borderRadius = '10px';
    fieldSet.style.margin = '10px 0';
    fieldSet.style.padding = '10px';
    fieldSet.style.display = 'inline';
    contDiff.appendChild(fieldSet);
    
    //Creamos los radio-buttons para elegir la dificultad
    //Facil
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'easySurvival';
    radio.name = 'difficulty';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'facil';
    radioLabel.htmlFor = 'easySurvival';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //Medio
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'mediumSurvival';
    radio.name = 'difficulty';
    radio.checked = 'checked';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'medio';
    radioLabel.htmlFor = 'mediumSurvival';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //Dificil
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'hardSurvival';
    radio.name = 'difficulty';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'dificil';
    radioLabel.htmlFor = 'hardSurvival';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);
    //Imposible
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = 'hopelessSurvival';
    radio.name = 'difficulty';
    var radioLabel = document.createElement('label');
    radioLabel.innerHTML = 'imposible';
    radioLabel.htmlFor = 'hopelessSurvival';
    radioLabel.style.padding = '5px 10px 5px 0';
    fieldSet.appendChild(radio);
    fieldSet.appendChild(radioLabel);    
    
    //Añadimos los botones
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'start';
    button.value = 'empezar';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.left = '60%';
    form.appendChild(button);
    
    var button = document.createElement('input');
    button.type = 'button';
    button.name = 'library';
    button.value = 'personalizar imagenes';
    button.style.position = 'absolute';
    button.style.bottom = '-13%';
    button.style.right = '60%';
    form.appendChild(button);
    
    return formCont;
}

/*
 * Nombre: createLevelEntry
 * Sinopsis: Método para añadir al diálogo de configuración del modo niveles una entrada para un nivel.
 * Entradas:
 *      -String:name -> nombre del nivel a crear.
 *      -String:img -> ruta con la imagen del nivel.
 *      -String:description -> descripcion del nivel.
 * Salidas:
 *      -DOMobject -> contenedor con la imagen del nivel y su titulo, y con las caracteristicas correspondientes.
 *      Ademas tiene un atributo .description en el que se almacena la descripcion del nivel.
 * */
function createLevelEntry(name, img, description)
{
    //Creamos un contenedor para el nivel
    var cont = document.createElement('div');
    cont.style.textAlign = 'center';
    cont.style.width = '150px';
    cont.style.height = '150px';
    cont.style.borderStyle = 'solid';
    cont.style.borderColor = '#ff0000';
    cont.style.cssFloat = 'left';
    cont.style.margin = '5px';
    //Creamos una imagen para describir el nivel
    var i = document.createElement('img');
    i.src = img;
    i.style.height = '100px';
    cont.appendChild(i);
    //Añadimos el titulo/nombre del nivel
    var t = document.createElement('p');
    t.style.margin = '0';
    t.innerHTML = name;
    cont.appendChild(t);
    //Guardamos la descripcion
    cont.description = description;    
    
    return cont;
}

/*
 * Nombre: explode
 * Sinopsis: Método recursivo que realiza la animación de explosión de una entrada del menú.
 * Entradas:
 *      -Object3D:entry -> objeto 3D que sufrirá la animación.
 * Salidas:
 * */
function explode(entry, callback)
{
    //Comprobamos si no se ha iniciado la animacion
    if(explode.frameCount == undefined)
    {
        //Iniciamos la cuenta de frames
        explode.frameCount = 1;
        //Reproducimos el sonido de la explosion
        sound.playExplosion();
    }
    
    //Si no se ha llegado al final de la animacion
    if(explode.frameCount < 10)
    {
        //Recorremos todas las letras de la entrada del menu
        for(var i=0; i<entry.children.length; i++)
        {
            //Recorremos todos los cubos de cada letra
            for(var j=0; j<entry.children[i].children.length; j++)
            {
                //Movemos el cubo en la direccion de su vector aleatorio correspondiente
                entry.children[i].children[j].position.addSelf(entry.children[i].children[j].randVec);
                //Giramos el cubo
                entry.children[i].children[j].rotation.x += 0.4;
                entry.children[i].children[j].rotation.y += 0.4;
            }
        }
        //Incrementamos el numero de frames de la animacion que se han mostrado
        explode.frameCount++;
        //Llamamos a esta misma funcion pero con un retardo de 50 milisegundos
        setTimeout(explode, 50, entry, callback);
    }
    else
    {
        //Llamamos a la funcion callback de fin de la animacion
        callback();
        
        //Restauramos el estado por defecto de la entrada del menu
        for(var i=0; i<entry.children.length; i++)
        {
            for(var j=0; j<entry.children[i].children.length; j++)
            {
                entry.children[i].children[j].position.x = entry.children[i].children[j].iniPosX;
                entry.children[i].children[j].position.y = entry.children[i].children[j].iniPosY;
                entry.children[i].children[j].position.z = 0;
                entry.children[i].children[j].rotation.x = 0;
                entry.children[i].children[j].rotation.y = 0;
            }
        }
    }    
}


/*****************************************
 *  Métodos Publicos
 *****************************************/

/*
 * Nombre: explode
 * Sinopsis: Método público que realiza la animación de explosión de una entrada del menú.
 * Entradas:
 *      -Object3D:entry -> objeto 3D que sufrirá la animación.
 *      -Callback:callback -> funcion callback que será llamada cuando acabe la animación. 
 * Salidas:
 * */
this.explode = function (entry, callback)
{
    menC.remove();
    //Recorremos todos los cubos, creando para cada uno un vector aleatorio normalizado
    //y posteriormente escalado que indicara la direccion del cubo en la animacion de explosion
    for(var i=0; i<entry.children.length; i++)
    {
        for(var j=0; j<entry.children[i].children.length; j++)
        {
            entry.children[i].children[j].randVec = new THREE.Vector3(Math.random()*2-1,Math.random()*2-1,Math.random()).normalize().multiplyScalar(60);
        }
    }
    //Iniciamos la animacion
    explode.frameCount = undefined;
    explode(entry, callback);
}

/*
 * Nombre: changeAllEntrysColor
 * Sinopsis: Método para para cambiar el color de todas las entradas del menu actual.
 * Entradas:
 * Salidas:
 * */
this.changeAllEntrysColor = function ()
{
    //Cambiamos el color de todas las entradas
    for(var i=0; i<entrys[currentMenu].length; i++)
    {
        var rand = Math.random();
        //Cambiamos el color del fondo
        entrys[currentMenu][i].backgroundColor = entrys[currentMenu][i].material.color.setHex(rand*0xffffff).getHex();
        //Cambiamos el color de las letras
        entrys[currentMenu][i].frontColor = entrys[currentMenu][i].children[0].children[0].material.materials[4].color.setHex((1-rand)*0xffffff).getHex();
        entrys[currentMenu][i].backColor = entrys[currentMenu][i].children[0].children[0].material.materials[5].color.setHex(Math.random()*0xffffff).getHex();
    }
}

/*
 * Nombre: changeEntryColor
 * Sinopsis: Método para para cambiar el color de la entrada indicada.
 * Entradas:
 * Salidas:
 * */
this.changeEntryColor = function (entry)
{
    entry.children[0].children[0].material.materials[4].color.setHex(Math.random()*0xffffff);
    entry.material.wireframe = true;
    entry.material.wireframeLinewidth = 10;
}

/*
 * Nombre: restoreEntryColor
 * Sinopsis: Método para para restaurar los colores de la entrada indicada.
 * Entradas:
 * Salidas:
 * */
this.restoreEntryColor = function (entry)
{
    entry.children[0].children[0].material.materials[4].color.setHex(entry.frontColor);
    entry.material.wireframe = false;
    entry.material.wireframeLinewidth = 1;
}

/*
 * Nombre: setMaterials
 * Sinopsis: Método para fijar los materiales con los que se creara el puzzle.
 * Entradas:
 *      -Materials[]:mats -> array con los materiales con los que se creará el puzzle.
 * Salidas:
 * */
this.setMaterials = function (mats)
{
    materials = mats;
    menC.setMaterials(mats);
}

/*
 * Nombre: hide
 * Sinopsis: Método para eliminar de la interfaz todos los elementos de la vista, ocultarlos.
 * Entradas:
 * Salidas:
 * */
this.hide = function ()
{
    //Si el menu a ocultar es de los que tienen entradas de menu
    if(currentMenu < 3)
        //Eliminamos de la escena todas las entradas del menu actual
        for(var i=0; i<entrys[currentMenu].length; i++)
            scene.remove(entrys[currentMenu][i]);
    
    //Si el menu a ocultar es el del modo clasico
    if(currentMenu == 6)
        classicForm.style.display = 'none';
    
    //Si el menu a ocultar es el del modo niveles
    if(currentMenu == 7)
        levelsForm.style.display = 'none';
        
    //Si el menu a ocultar es el del modo contrareloj
    if(currentMenu == 8)
        trialForm.style.display = 'none';
    
    //Si el menu a ocultar es el del modo supervivencia
    if(currentMenu == 9)
        survivalForm.style.display = 'none';
    
    //Escondemos el boton de atras
    backButton.style.display = 'none';
    
    //Paramos el controlador asociado
    menC.remove();
}
    
/*
 * Nombre: showMenu
 * Sinopsis: Método para mostrar el submenu solicitado.
 * Entradas:
 *      -Integer:menuInd-> indice del menu a mostrar.
 * Salidas:
 * */
this.showMenu = function (menuIndex)
{
    //Primero quitamos la vista actual del menu
    this.hide();
    
    //Guardamos el menu actual
    if(menuIndex != undefined)
        currentMenu = menuIndex;
    
    //Si el menu actual no es el menu principal o las opciones
    if(currentMenu != 0 && currentMenu != 3)
        //Mostramos el boton de anterior
        backButton.style.display = 'block';
    
    //Si el menu seleccionado es de los que tienen entradas de menu
    if(currentMenu < 3)
    {
        //Vaciamos los materiales, por si estaba lleno de otro menu
        //materials = [];
        //Mostramos las entradas del menu correspondiente
        for(var i=0; i<entrys[currentMenu].length; i++)
            scene.add(entrys[currentMenu][i]);
    }
    //Si el menu seleccionado es el menu de opciones
    else if(currentMenu == 3)
    {
        //Mostramos el dialogo de opciones pasandole la funcion que se ejecutara al para mostrar la vista correspondiente
        ov.show(function()
        {
            currentMenu = 0;
            //Mostramos las entradas del menu correspondiente
            for(var i=0; i<entrys[currentMenu].length; i++)
                scene.add(entrys[currentMenu][i]);
            //Activamos el controlador para el submenu adecuado
            menC.enable(currentMenu);
        });
    }
    //Si el menu seleccionado es el menu del modo clasico
    else if(currentMenu == 6)
    {
        //Mostramos el formulario
        classicForm.style.display = 'block';
    }
    //Si el menu seleccionado es el menu del modo niveles
    else if(currentMenu == 7)
    {
        //Mostramos el formulario
        levelsForm.style.display = 'block';
    }
    //Si el menu seleccionado es el menu del modo contrareloj
    else if(currentMenu == 8)
    {
        //Mostramos el formulario
        trialForm.style.display = 'block';
    }
    //Si el menu seleccionado es el menu del modo supervivencia
    else if(currentMenu == 9)
    {
        //Mostramos el formulario
        survivalForm.style.display = 'block';
    }
    else
        alert("En construccion");
    
    //Activamos el controlador para el submenu adecuado
    menC.enable(currentMenu);
}

}