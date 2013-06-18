/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: HelpView.js
 *  Sinopsis: Clase de la vista de la ayuda.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 27-05-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE HELPVIEW
 *  */
function HelpView ()
{
    

/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Contenedor con el formulario para la ayuda.
    var formCont;
    //Contenedor para el texto de ayuda
    var textCont
    //Textos de la ayuda
    var helpText = [];

    //Opción seleccionada
    var sel;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase HelpView.
 * Entradas:
 * Salidas:
 * */
    //Creamos los textos
    //Ayuda del menú
    helpText.push([]);
    helpText[0].push("<h3>Menu</h3>");
    helpText[0].push("<p>La primera vista que se tiene de la aplicación es el menú principal, el cual es utilizado para acceder a todas las partes del sistema. El menú principal consta de varias entradas de menú, con las que se accederá a las distintas opciones disponibles. Además, en la esquina superior izquierda se muestra en todo momento, no solo en el menú principal, la opción de desactivar o activar el sonido, el cual viene desactivado por defecto.</p>");
    helpText[0].push("<p>La primera opción del menú es, como indica, para empezar a jugar a un modo de un jugador. Una vez se entre en esta opción se mostrarán todos los modos de juego para un jugador disponibles. Al seleccionar un modo de juego se ofrecerá un pequeño diálogo de configuración para empezar el modo seleccionado de la manera que se quiera.</p>");
    helpText[0].push("<p>La segunda opción, el modo multijugador, permite jugar con otros jugadores. Dentro de este modo existen dos opciones: crear una partida o unirse a una que ya ha sido creada.</p>");
    helpText[0].push("<p>La siguiente opción ofrece una serie de opciones para configurar la aplicación. Permite elegir la velocidad de giro de las figuras, es decir la sensibilidad de giro. También da la opción de activar la ayuda con sonidos, que, siempre que se tenga el sonido activado, reproducirá un sonido para indicar que una pieza ha sido encajada correctamente, y otro sonido para indicar que la pieza no coincide con ninguna de sus adyacentes. Finalmente también se pueden personalizar las funciones de los botones del ratón.</p>");
    helpText[0].push("<p>Con la cuarta opción se pueden consultar todas las puntuaciones obtenidas hasta la fecha por todos los usuarios que han querido guardarlas. Se muestran agrupadas por los distintos modos en los que se han conseguido y ordenadas de mejor a peor.</p>");
    helpText[0].push("<p>Para terminar la última opción muestra una ayuda para facilitar el uso de la aplicación.</p>");
    //Ayuda del juego
    helpText.push([]);
    helpText[1].push("<h3>Juego</h3>");
    helpText[1].push("<p>Una vez iniciado cualquier modo de juego se muestra el puzzle. Esta vista se divide en tres partes, el meńu de opciones a la izquierda, una zona del puzzle en el centro delimitada por un cuadrado rojo, y todas las piezas del puzzle repartidas por la pantalla.</p>");
    helpText[1].push("<p>El juego consiste en trasladar las piezas a la zona del puzzle, donde quedarán encajadas simulando el efecto imán. Pero han de ser giradas previamente para orientarlas de manera acorde a la posición del resto de piezas ya encajadas en el puzzle. Este giro puede resultar complicado al principio para usuarios que no tengan experiencia girando objetos tridimensionales. En la siguiente imagen se muestra un esquema de como girar la cara frontal de una  pieza. Este efecto también se puede conseguir más rápidamente realizando pequeños giros con el ratón. Para facilitar el giro, al pulsar la tecla CTRL se girará la figura cada 90 grados, no continuamente, y también al pulsar los dos botones a la vez se girará la figura sobre el eje Z.</p>");
    helpText[1].push("<img src='img/help.png' style='width:100%'>");
    helpText[1].push("<p>Para terminar el puzzle hay que encajar todas las piezas formando un cubo, de manera que todas las caras del cubo formado tengan una imagen bien compuesta por las porciones de imágenes de las piezas del puzzle. Cuando se termine el puzzle se ofrecerá la opción de guardar la puntuación obtenida.</p>");
    helpText[1].push("<p>Durante el juego, en el menú de opciones, se pueden realizar diferentes acciones. Estas acciones dependen del modo de juego al que se este jugando. En cualquier modo de juego siempre existe la opción de abandonar dicho modo de juego y salir al menú principal, y la opción de acceder a las opciones para configurar la aplicación. Además en algunos modos de juego existen otras opciones, como reiniciar o pausar el modo actual. También existen las opciones de mostrar todas las posibles soluciones en una ventana aparte, mostrar una solución al estado actual del puzzle, y colocar una pieza automáticamente en el puzzle.</p>");
    //Ayuda de los modos de juego
    helpText.push([]);
    helpText[2].push("<h3>Modos de juego</h3>");
    helpText[2].push("<p>Dentro de la aplicación existen varios tipos de juego para un jugador:</p>");
    helpText[2].push("<ul style='list-style-position:inside'><li>Modo de juego clásico. En este modo simplemente se tendrá que resolver un puzzle normal, pudiendo elegir el tamaño del mismo. Cuando se empieza se comenzará a cronometrar el tiempo que se emplea en la resolución. Cuando se soluciona se da la opción de guardar el tiempo obtenido.</li><li>Modo niveles. En este modo existen distintos niveles a los que jugar, cada uno con su propia característica. Para cada tipo de nivel existen los dos tamaños de puzzle posibles, 8 y 27 piezas. También se cronometrará el tiempo que se tarda en resolver el nivel. Los distintos niveles son:<ul style='list-style-type:circle; list-style-position:inside'><li>Empezando. Este nivel es un puzzle normal para empezar con algo fácil.</li> <li>Dos imágenes repetidas. En este nivel cada imagen estará repetida dos veces, con lo cual en un puzzle de 8 piezas habrá 6 imágenes distintas y en uno 27 piezas habrá 9 imágenes distintas.</li> <li>Colores. Este nivel estará formado por piezas de colores en lugar de imágenes.</li> <li>Tres imágenes repetidas. En este nivel cada imagen estará repetida tres veces, con lo cual en un puzzle de 8 piezas habrá 4 imágenes distintas y en uno 27 piezas habrá 6 imágenes distintas.</li><li>Sobran cubos. En este nivel se han añadido algunos cubos extra con porciones de imágenes aleatorias y se han colocado entre el resto de piezas, con lo cual para terminar el puzzle no hay que introducir todas las piezas en el puzzle.</li><li>Seis imágenes repetidas. En este nivel cada imagen estará repetida seis veces, con lo cual en un puzzle de 8 piezas habrá 2 imágenes distintas y en uno 27 piezas habrá 3 imágenes distintas.</li><li>En movimiento. En este nivel todas las piezas permanecerán en movimiento a no ser que se seleccionen o se encajen en el puzzle.</li><li>Todas las imágenes repetidas. En este nivel solo habrá una imagen repetida multiples veces, en un puzzle de 8 piezas repetida 12 veces y en uno 27 piezas repetida 18 veces.</li></ul></li><li>Modo contrareloj. En este modo se dará un tiempo para resolver un puzzle, este tiempo dependerá de la dificultad seleccionada, siendo menos tiempo cuanto más dificil.</li><li>Modo supervivencia. En este modo también se dará un tiempo para resolver el puzzle acorde a la dificultad seleccionada, pero al resolver el puzzle se añadirá más tiempo y se iniciará otro puzzle. El objetivo es resolver el mayor número de puzzles posible.</li></ul>");
    //Ayuda de la biblioteca de imagenes
    helpText.push([]);
    helpText[3].push("<h3>Biblioteca de imagenes</h3>");
    helpText[3].push("<p>Para cualquier modo de juego se pueden personalizar las imágenes del puzzle. Para ello existe la opción de 'personalizar imágenes' en cada uno de los diálogos de configuración de los distintos modos.</p>");
    helpText[3].push("<p>Existen dos formas de biblioteca dependiendo del modo seleccionado. Para el modo niveles y para el modo supervivencia la biblioteca constará de distintas imágenes seleccionables, las cuales serán mostradas consecutivamente en cada nivel o puzzle. Si en uno de estos modos se eligen menos imágenes de las que tiene un puzzle las imágenes se repetirán hasta contar con las imágenes necesarias.</p>");
    helpText[3].push("<p>Para el resto de modos se permitirá seleccionar las imágenes arrastrándolas a los cubos de la derecha, que son las posibles soluciones. Estos cubos se pueden girar y tienen que tener en la parte frontal la cara en la que se desea introducir la imagen.</p>");
    helpText[3].push("<p>Todas la imágenes se pueden agrandar haciendo doble click sobre ellas, para poder apreciarlas mejor.</p>");
    //Ayuda del modo multijugador
    helpText.push([]);
    helpText[4].push("<h3>Multijugador</h3>");
    helpText[4].push("<p>A este juego pueden jugar dos personas a la vez, para ello una ha de crear una partida y la otra ha de unirse a dicha partida. Todo este se hace a través de la opción multijugador del menú principal.</p>");
    helpText[4].push("<p>Existen dos modos de juego multijugador, uno cooperativo en el que los dos jugadores tendrá que contribuir para resolver un mismo puzzle; y otro contrarreloj en el que los dos jugadores tendrán que competir por ver quien acaba antes el puzzle.</p>");
    helpText[4].push("<p>Para jugar primero un jugador ha de crear una partida, eligiendo el tipo de juego, y también si así lo desea personalizando las imágenes. Después se cargará el juego y podrá unirse el otro jugador tras un pequeño tiempo de espera.</p>");
    helpText[4].push("<p>Cada uno de los dos tipos de juego tiene sus particularidades a la hora de jugar. En el modo cooperativo, lógicamente todo lo que haga un jugador se verá reflejado en el otro jugador. Además si un jugador selecciona una pieza, el otro jugador no podrá seleccionarla hasta que se suelte. Esta pieza seleccionada se resalta en un tono azul para que el otro jugador sepa cual es la pieza que está usando el jugador que la tiene seleccionada.</p>");
    helpText[4].push("<p>En el modo contrarreloj se muestra una pequeña vista del estado del puzzle del otro jugador para que los jugadores sepan en todo momento lo que hace el otro jugador. Cuando un jugador solucione su puzzle se acabará la partida, indicándoselo al otro jugador y parando su partida.</p>");
    
    //Creamos el contenedor que contendra el formulario con la ayuda
    formCont = document.createElement('div');
    //Le aplicamos su estilo
    formCont.style.backgroundColor = '#dddddd';
    formCont.style.margin = '3% 7%';
    formCont.style.width = '85%';
    formCont.style.height = '85%';
    formCont.style.borderRadius = '30px';
    formCont.style.textAlign = 'center';
    formCont.style.position = 'absolute';
    formCont.style.top = '0';
    document.body.appendChild(formCont);
    
    //Creamos el formulario
    var form = document.createElement('form');
    form.id = 'helpForm';
    form.style.height = '100%'; //Colocamos la altura al 100% para que los hijos puedan calcular su altura con porcentajes
    formCont.appendChild(form);
    
    //Creamos un titulo
    var title = document.createElement('h1');
    //Añadimos el contenido    
    title.innerHTML = 'Ayuda';
    //Añadimos el titulo al contenedor
    form.appendChild(title);
    
    //Creamos un contenedor para los botones
    var buttonsCont = document.createElement('div');
    buttonsCont.style.width = '20%';
    buttonsCont.style.cssFloat = 'left';
    buttonsCont.style.textAlign = 'left';
    buttonsCont.style.margin = '0 5%';
    form.appendChild(buttonsCont);
    var list = document.createElement('ul');
    buttonsCont.appendChild(list);
    //Añadimos los botones
    createButton = function(value, name, n)
    {
        var b = document.createElement('input');
        b.type = 'button';
        b.name = name;
        b.value = value;
        b.onclick = function()
        {
            textCont.innerHTML = "";
            sel = n;
            //Si no es el boton de controles
            if(sel != 5)
                for(var i=0; i<helpText[sel].length; i++)
                    textCont.innerHTML += helpText[sel][i];
            //Si es el boton de controles
            else
            {
                //Guardamos las imagenes de los botones del raton en
                //funcion de sus funciones
                //Si el boton de movimiento es el izquierdo
                if(ov.getOptions().getMovOpt() == 0)
                {
                    var movButton = "leftButton.gif";
                    var rotButton = "rightButton.gif";
                }
                //Si no, es el derecho
                else
                {
                    var movButton = "rightButton.gif";
                    var rotButton = "leftButton.gif";
                }                
                //Añadimos el titulo
                textCont.innerHTML = "<h3>Controles</h3>";
                //Creamos una tabla
                var table = document.createElement('table');
                table.style.height = '100%';
                table.style.margin = '0 auto';
                textCont.appendChild(table);
                //Creamos una fila para el control de movimiento
                var row = document.createElement('tr');
                table.appendChild(row);
                //Creamos una celda para el boton
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/"+movButton;
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/arrow.gif";
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/movShape.png";
                cell.appendChild(img);
                cell.innerHTML += '<span style="vertical-align:180%"> Traslacion<span>';
                
                //Creamos una fila para el control de giro
                var row = document.createElement('tr');
                table.appendChild(row);
                //Creamos una celda para el boton
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/"+rotButton;
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/arrow.gif";
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/rotShape.png";
                cell.appendChild(img);
                cell.innerHTML += '<span style="vertical-align:180%"> Giro continuo<span>';
                
                //Creamos una fila para el control de giro de noventa grados
                var row = document.createElement('tr');
                table.appendChild(row);
                //Creamos una celda para el boton
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/"+rotButton;
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/arrowCtrl.gif";
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/rotShape90.png";
                cell.appendChild(img);
                cell.innerHTML += '<span style="vertical-align:180%"> Giro cada 90 grados<span>';
                
                //Creamos una fila para el control de giro en el eje Z
                var row = document.createElement('tr');
                table.appendChild(row);
                //Creamos una celda para el boton
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/buttons.gif";
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/arrow.gif";
                cell.appendChild(img);
                //Creamos una celda para la flecha
                var cell = document.createElement('td');
                row.appendChild(cell);
                var img = document.createElement('img');
                img.height = 80;
                img.src = "img/rotShapeZ.png";
                cell.appendChild(img);
                cell.innerHTML += '<span style="vertical-align:180%"> Giro en el eje Z<span>';
                
    
            }
            
        }
        var i = document.createElement('li');
        i.appendChild(b);
        i.style.listStyleType = 'none';
        i.style.padding = '5px 0';
        return i;
    }
    list.appendChild(createButton("Controles", 'controls', 5));
    list.appendChild(createButton("Menu", 'menu', 0));
    list.appendChild(createButton("Juego", 'game', 1));
    list.appendChild(createButton("Modos de juego", 'modes', 2));
    list.appendChild(createButton("Biblioteca de imagenes", 'library', 3));
    list.appendChild(createButton("Multijugador", 'multiplayer', 4));
    
    //Creamos un contendor para mostrar el texto de la ayuda
    textCont = document.createElement('div');
    form.appendChild(textCont);
    textCont.style.width = '55%';
    textCont.style.height = '65%';
    textCont.style.margin = '0 5%';
    textCont.style.padding = "10px";
    textCont.style.textAlign = 'justify';
    textCont.style.textIndent = '20px';
    textCont.style.overflow = 'auto';
    textCont.style.cssFloat = 'right';
    textCont.style.backgroundColor = '#ffffff';
    var sel = 0;
    for(var i=0; i<helpText[sel].length; i++)
        textCont.innerHTML += helpText[sel][i];
    
 
/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: show
 * Sinopsis: Método para mostrar en la interfaz todos los elementos de la vista.
 * Entradas:
 * Salidas:
 * */
this.show = function ()
{
    //Si la ayuda seleccionada con los controles
    if(sel == 5)
        //Los actualizamos
        formCont.getElementsByTagName('ul')[0].childNodes[0].childNodes[0].onclick();
    
    //Mostramos la interfaz
    formCont.style.display = 'block';
}

/*
 * Nombre: hide
 * Sinopsis: Método para eliminar de la interfaz todos los elementos de la vista, ocultarlos.
 * Entradas:
 * Salidas:
 * */
this.hide = function ()
{
    //Ocultamos la interfaz
    formCont.style.display = 'none';
}

}