/*
 *  Nombre: Socket.js
 *  Sinopsis: Clase que manejará la comunicación con el servidor
 *  en el modo multijugador mediante sockets.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 30-04-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE SOCKET
 *  */
function Socket ()
{


/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Flag para saber si estamos conectados
    var connected = false;
    //El socket en sí
    var socket;
    //ID unico que suministra el servidor a cada uno de sus clientes
    var ID;
    //ID unico que suministra el servidor para la partida
    var gameID;
    
    //Función que será ejecutada cuando se cree una partida,
    //la guardamos para poder borrar su receptor de evento
    var onCreatedGame;
    //Función que será ejecutada cuando se una un jugador a la partida,
    //la guardamos para poder borrar su receptor de evento
    var onJointClient;
    //Función que será ejecutada cuando se reciban todas las partidas 
    //disponibles, la guardamos para poder borrar su receptor de evento
    var onSentGames;
    //Función que será ejecutada cuando se una a una partida
    //la guardamos para poder borrar su receptor de evento
    var onJointGame;
    //Función que será ejecutada cuando ambos jugadores esten lista para
    //empezar la partida, la guardamos para poder borrar su receptor de evento
    var onAllReady;
    //Función que será ejecutada cuando el otro jugador abandone la partida,
    //la guardamos para poder borrar su receptor de evento
    var onOtherPlayerLeft;
    //Función que será ejecutada cuando se reciban las puntuaciones solicitadas,
    //la guardamos para poder borrar su receptor de evento
    var onSentScores
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase Socket.
 * Entradas:
 * Salidas:
 * */
    
    //Obtenemos el socket y conectamos con el servidor
    socket = io.connect();

    //No nos consideramos conectados hasta que no obtenemos nuestro ID
    socket.on('connect', function()
    {        
    }.bind(this));
    socket.on('onconnected', function(data)
    {
        ID = data.id;
        connected = true;
        console.log("conected with server with ID: "+ID);
    }.bind(this));
    
    
 /*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: onServerUpdate
 * Sinopsis: Método con el que se procesarán los mensajes del servidor.
 * Entradas:
 * Salidas:
 * */
function onServerUpdate(message)
{
    //Dividimos el mensaje en las partes correspondientes
    var parts = message.split("#");
    //Si el mensaje no tiene cabecera y subcabecera no hacemos nada
    if(parts.length <2)
        return;
    
    //Decodificamos el mensaje
    switch(parts[0])
    {
        //Mensaje del juego
        case "g" :
            switch(parts[1])
            {
                case "s" :
                    if(parts[3] == '-1')
                    {
                        mmv.releasePiece(parseInt(parts[2]));
                    }
                    else
                    {
                        mmv.otherSelectedPiece(parseInt(parts[2]), parts[3] == 1 ? true : false);
                    }
                    break;
                case "m" :
                    mmv.otherMovePiece(parts[2], new THREE.Vector3(parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5])) );
                    break;
                case "r" :
                    mmv.otherRotatePiece(parts[2], new THREE.Vector3(parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5])) );
                    break;
                case "p" :
                    //Creamos un vector para la posicion y otro para la rotacion
                    var pos = new THREE.Vector3(parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6]));
                    var rot = new THREE.Vector3(parseFloat(parts[7]), parseFloat(parts[8]), parseFloat(parts[9]));
                    //Indicamos a la vista que se ha introducido una pieza
                    mmv.otherPlacedPiece(parseInt(parts[2]), parts[3] == 1 ? true : false, pos, rot);
                    break;
            }
            break;
    }
}

/*
 * Nombre: onSolvedGame
 * Sinopsis: Método que se ejecutará cuando el servidor nos diga que
 *          se ha resuelto el puzzle.
 * Entradas:
 *      -Data:data -> información recibida por el servidor con el
 *      tiempo invertido en la resolución del puzzle.
 * Salidas:
 * */
function onSolvedGame(data)
{
    //Le indicamos a la vista del modo que se ha resuelto
    //el puzzle con el tiempo invertido en ello
    mmv.solvedPuzzle(parseInt(data.time), data.winner);
    //Dejamos de escuchar los mensajes que nos pueda mandar el servidor
    socket.removeListener('message', onServerUpdate);
    //Borramos la recepcion del evento para que no se reciba y no duplicarlo
    socket.removeListener('onSolvedGame', onSolvedGame);
    //Borramos la recepcion del evento para que no se reciba y no duplicarlo
    socket.removeListener('onOtherPlayerLeft', onOtherPlayerLeft);
    //Borramos el ID de la partida en la que estabamos
    gameID = undefined;
}


/*****************************************
 *  Métodos Públicos
 *****************************************/
 
/*
 * Nombre: createdGame
 * Sinopsis: Método que será ejecutado cuando se quiera crear una partida
 *          multijugador para indicarselo al servidor.
 * Entradas:
 *      -String:name -> cadena con el nombre de la partida.
 *      -Integer:type -> entero que identificará el tipo de partida.
 *      -String[]:images -> array con las imagenes con las que se ha creado
 *      la partida codificadas en base 64 para su envio al servidor.
 *      -Vector3[]:iniPos -> posiciones iniciales de los cubos de la partida creada.
 *      -Vector3[]:iniRot -> rotaciones iniciales de los cubos de la partida creada.
 *      -Callback:callback -> función de rellamada que se ejecutará cuando
 *      se conenecte otro jugador a la partida.
 *      -Callback:leftAction -> función de rellamada que se ejecutará si el otro jugador
 *      abandona la partida.
 * Salidas:
 * */
this.createdGame = function(name, type, images, iniPos, iniRot, callback, leftAction)
{
    //Le indicamos al servidor que deseamos crear una partida
    socket.emit('onCreateGame', {name : name, type : type, images:images, iniPos : iniPos, iniRot : iniRot});
    
    //Registramos el evento para cuando se conecte otro jugador
    socket.on('onCreatedGame', onCreatedGame=function(data)
    {
        gameID = data.gameID;
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onCreatedGame', onCreatedGame);
    });
    
    //Registramos el evento para cuando se conecte otro jugador
    socket.on('onJointClient', onJointClient=function(data)
    {
        callback();
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onJointClient', onJointClient);
    });
    
    //Registramos el evento para cuando abandone otro jugador
    socket.on('onOtherPlayerLeft', onOtherPlayerLeft=function(data)
    {
        leftAction();
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onOtherPlayerLeft', onOtherPlayerLeft);
        //Borramos la recepcion del evento para que no se reciba y no duplicarlo
        socket.removeListener('message', onServerUpdate);
        //Borramos la recepcion del evento para que no se reciba y no duplicarlo
        socket.removeListener('onSolvedGame', onSolvedGame);
    });
}
 
/*
 * Nombre: getGames
 * Sinopsis: Método para pedir al servidor las partidas disponibles.
 * Entradas:
 * Salidas:
 * */
this.getGames = function()
{
    //Le indicamos al servidor que deseamos obtener los juegos disponibles
    socket.emit('onGetGames', {});
    //Esperamos por la respuesta del servidor con los datos
    socket.on("onSentGames", onSentGames = function(data)
    {
        //Rellenamos el dialogo con las partidas obtenidas
        mv.fillGameEntrys(data.games);
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onSentGames', onSentGames);
    });
}
 
/*
 * Nombre: joinGame
 * Sinopsis: Método para pedir al servidor conectarse a una partida.
 * Entradas:
 *      -String:gID -> ID del juego al que se desea unirse.
 *      -Callback:cbJoint -> funcion de rellamada que se ejecutará cuando se conecte a la partida.
 *      -Callback:cbNoJoint -> funcion de rellamada que se ejecutará cuando se no se
 *      pueda conectar a la partida.
 *      -Callback:leftAction -> función de rellamada que se ejecutará si el otro jugador
 *      abandona la partida.
 * Salidas:
 * */
this.joinGame = function(gID, cbJoint, cbNoJoint, leftAction)
{
    //Le indicamos al servidor que deseamos unirnos a la partida que le indicamos
    socket.emit('onJoinGame', {gameID : gID});
    
    //Registramos el evento para cuando se conecte a la partida
    socket.on('onJointGame', onJointGame=function(data)
    {
        //Si la partida no existe
        if(data.game == undefined)
        {
            //Realizamos la accion de par
            cbNoJoint();
            //Borramos la recepcion del evento para que no se reciba mas de una vez
            socket.removeListener('onJointGame', onJointGame);
            return;
        }
        //Guardamos la partida a la que nos hemos conectado
        gameID = data.game.ID;
        //Llamamos a la funcion para cuando se conecte a la partida
        cbJoint(data.game.images, data.game.type, data.game.iniPos, data.game.iniRot);
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onJointGame', onJointGame);
        console.log("conected game "+gameID+"  "+data.game.type+"  "+data.game.name);
    });
    
    //Registramos el evento para cuando abandone el otro jugador
    socket.on('onOtherPlayerLeft', onOtherPlayerLeft=function(data)
    {
        leftAction();
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onOtherPlayerLeft', onOtherPlayerLeft);
        //Borramos la recepcion del evento para que no se reciba y no duplicarlo
        socket.removeListener('message', onServerUpdate);
        //Borramos la recepcion del evento para que no se reciba y no duplicarlo
        socket.removeListener('onSolvedGame', onSolvedGame);
    });
}
 
/*
 * Nombre: readyToPlay
 * Sinopsis: Método para decirle al servidor que estamos listos para iniciar la partida.
 * Entradas:
 *      -Callback:callback -> funcion de rellamada que se ejecutará cuando ambos jugadores
 *      esten listos, es decir para iniciar la partida.
 * Salidas:
 * */
this.readyToPlay = function(callback)
{
    //Le indicamos al servidor que deseamos unirnos a la partida que le indicamos
    socket.emit('onReadyToPlay', {});
    //Registramos el evento para cuando se conecte a la partida
    socket.on('onAllReady', onAllReady=function(data)
    {
        //Llamamos a la funcion para iniciar la partida
        callback();
        //Empezamos a escuchar los mensajes que nos pueda mandar el servidor
        socket.on('message', onServerUpdate);
        //Empezamos a escuchar si el servidor nos dice que se ha resuelto el puzzle
        socket.on('onSolvedGame', onSolvedGame);
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onAllReady', onAllReady);
    });
}
 
/*
 * Nombre: solvedGame
 * Sinopsis: Método para indicarle al servidor que hemos resuelto el puzzle.
 * Entradas:
 * Salidas:
 * */
this.solvedGame = function()
{
    socket.emit('onSolvedGame', {});
}
 
/*
 * Nombre: finishedGame
 * Sinopsis: Método que será ejecutado cuando se termine una partida
 *          multijugador para indicarselo al servidor.
 * Entradas:
 * Salidas:
 * */
this.finishedGame = function()
{
    //Si estamos conectados a una partida
    if(gameID != undefined)
    {
        //Dejamos de escuchar los mensajes que nos pueda mandar el servidor
        socket.removeListener('message', onServerUpdate);
        //Borramos la recepcion del evento para que no se reciba y no duplicarlo
        socket.removeListener('onSolvedGame', onSolvedGame);
        //Le indicamos al servidor que deseamos borrar la partida
        socket.emit('onFinishedGame', {gameID : gameID});
        //Borramos la recepcion del evento para que no se reciba y no duplicarlo
        socket.removeListener('onOtherPlayerLeft', onOtherPlayerLeft);
        //Borramos el ID de la partida en la que estabamos
        gameID = undefined;
    }
}
 
/*
 * Nombre: selectedPiece
 * Sinopsis: Método que será ejecutado cuando se seleccione una pieza del puzzle.
 * Entradas:
 *      -Integer:ID -> ID del cubo que se ha seleccionado.
 *      -Boolean:isSelected -> booleano para indicar si el cubo esta
 *      seleccionado o deseleccionado.
 * Salidas:
 * */
this.selectedPiece = function(ID, isSelected)
{
    //Creamos el mensaje ha enviar
    var message = "";
    //Añadimos una cabecera para indicar que es un mensaje del juego
    message += "g";
    //Añadimos una subcabecera para indicar que tipo de mensaje es
    message += "#s#";
    //Añadimos el cuerpo del mensaje
    message += ID+"#";
    message += isSelected ? "1" : "0";
    socket.send(message);
}
 
/*
 * Nombre: movedPiece
 * Sinopsis: Método que será ejecutado cuando se mueva una pieza del puzzle.
 * Entradas:
 *      -Integer:ID -> ID del cubo que se ha movido.
 *      -Vector3:pos -> vector de 3 elementos con la nueva posición de
 *      la pieza se ha movido.
 * Salidas:
 * */
this.movedPiece = function(ID, pos)
{
    //Creamos el mensaje ha enviar
    var message = "";
    //Añadimos una cabecera para indicar que es un mensaje del juego
    message += "g";
    //Añadimos una subcabecera para indicar que tipo de mensaje es
    message += "#m#";
    //Añadimos el cuerpo del mensaje
    message += ID+"#";
    message += pos.x.toFixed(4)+"#"+pos.y.toFixed(4)+"#"+pos.z.toFixed(4);
    socket.send(message);
}
 
/*
 * Nombre: rotatedPiece
 * Sinopsis: Método que será ejecutado cuando se gire una pieza del puzzle.
 * Entradas:
 *      -Integer:ID -> ID del cubo que se ha girado.
 *      -Vector3:rot -> vector de 3 elementos con la nueva rotación de
 *      la pieza se ha girado.
 * Salidas:
 * */
this.rotatedPiece = function(ID, rot)
{
    //Creamos el mensaje ha enviar
    var message = "";
    //Añadimos una cabecera para indicar que es un mensaje del juego
    message += "g";
    //Añadimos una subcabecera para indicar que tipo de mensaje es
    message += "#r#";
    //Añadimos el cuerpo del mensaje
    message += ID+"#";
    message += rot.x.toFixed(4)+"#"+rot.y.toFixed(4)+"#"+rot.z.toFixed(4);
    socket.send(message);
}
 
/*
 * Nombre: placedPiece
 * Sinopsis: Método que será ejecutado cuando se introduzca una pieza del puzzle
 *          en el puzzle.
 * Entradas:
 *      -Integer:ID -> ID del cubo que se ha seleccionado.
 *      -Boolean:isPlaced -> booleano para indicar si el cubo es
 *      colocado o sacado del puzzle.
 *      -Vector3:pos -> vector de 3 elementos con la nueva posición de
 *      la pieza al sacarla o introducirla en el puzzle.
 *      -Vector3:rot -> vector de 3 elementos con la nueva rotación de
 *      la pieza al sacarla o introducirla en el puzzle.
 * Salidas:
 * */
this.placedPiece = function(ID, isPlaced, pos , rot)
{
    //Creamos el mensaje ha enviar
    var message = "";
    //Añadimos una cabecera para indicar que es un mensaje del juego
    message += "g";
    //Añadimos una subcabecera para indicar que tipo de mensaje es
    message += "#p#";
    //Añadimos el cuerpo del mensaje
    message += ID+"#";
    message += (isPlaced ? "1" : "0");
    message += "#"+pos.x.toFixed(4)+"#"+pos.y.toFixed(4)+"#"+pos.z.toFixed(4);
    message += "#"+rot.x.toFixed(4)+"#"+rot.y.toFixed(4)+"#"+rot.z.toFixed(4);
    socket.send(message);
}
 
/*
 * Nombre: getScores
 * Sinopsis: Método para pedir al servidor las puntuaciones disponibles
 *          de los modos indicados.
 * Entradas:
 *      -Integer:mode -> modo del que se quieren obtener las puntuaciones.
 *      -Integer:submode -> submodo del que se quieren obtener las puntuaciones.
 *      -Callback:callback -> funcion de rellamada que se ejecutará cuando se
 *      reciban las puntuaciones.
 * Salidas:
 * */
this.getScores = function(mode, submode, callback)
{
    //Le indicamos al servidor que deseamos obtener las puntuaciones disponibles
    socket.emit('onGetScores', {mode:mode, submode:submode});
    //Esperamos por la respuesta del servidor con los datos
    socket.on("onSentScores", onSentScores = function(data)
    {
        //Ejecutamos la funcion de rellamada pasandole las puntuaciones
        callback(data.scores);
        //Borramos la recepcion del evento para que no se reciba mas de una vez
        socket.removeListener('onSentScores', onSentScores);
    });
}
 
/*
 * Nombre: saveScore
 * Sinopsis: Método para pedir al servidor que guarde la puntuacion suministrada con
 *          los datos suministrados.
 * Entradas:
 *      -String:name -> nombre del jugador que ha conseguido la puntuación.
 *      -Integer:score -> puntuación obtenida a guardar.
 *      -Integer:mode -> modo en el que se ha conseguido la puntuación.
 *      -Integer:submode -> submodo en el que se ha conseguido la puntuación.
 * Salidas:
 * */
this.saveScore = function(name, score, mode, submode)
{
    var date = new Date();
    //Le indicamos al servidor que deseamos guardar la puntuacion
    socket.emit('onSaveScore', {name:name, score:score, date:date, mode:mode, submode:submode});
}

}