/*
 *  Nombre: index.js
 *  Sinopsis: archivo que se ejecutará en el servidor utilizando node.js, y con su framework Express.
 *  Se encarga de poner a punto el servidor y activar los sockets.
 *
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 28-04-2013
 *  Versión: 0.1
 *  */


/************************************************
 *  Creamos tanto  el servidor  como los sockets
 ************************************************/

	var gameport = 8080;
	var verbose = true;
	
	var UUID = require('node-uuid');
	
	var express = require('express');
	var app = express();
	var http = require('http');
	var server = http.createServer(app);
	
	var io = require('socket.io');


/************************************************
 *  Ponemos en marcha el servidor
 ************************************************/

	//Hacemos que el servidor escuche en el puerto indicado
	server.listen(gameport);
	console.log('\t :: Express :: Listening on port ' + gameport);

	//Establecemos la accion para cuando se acceda a la pagina principal
	app.get('/', function(req, res)
	{
		res.sendfile( __dirname + '/public/index.html');
	});
	//Establecemos la accion para cuando se acceda a cualquier otra pagina
	app.get('/*', function( req, res, next )
	{
		//Obtenemos el fichero que se ha pedido
		var file = req.params[0];
		//if(verbose)
		//	console.log('\t :: Express :: file requested : ' + file);
		//Enviamos el fichero solicitado
		res.sendfile( __dirname + '/public/' + file );
	});
	
/************************************************
 *  Ponemos en marcha los sockets
 ************************************************/
	
	//Creamos una instancia de socket.io usando el servidor
    var sio = io.listen(server);
	
	//Configuramos los sockets
    sio.configure(function ()
	{
        //Mensajes en log: 0-error 1-warn 2-info 3-debug
		sio.set('log level',2);
		//Permitimos que se conecte cualquiera
        sio.set('authorization', function (handshakeData, callback)
		{
			callback(null, true);
        });
    });

/************************************************
 *  Registramos el evento de conexion
 ************************************************/

	//Creamos el manejador del evento de conexion, es decir cuando se conecta un cliente
    sio.sockets.on('connection', function (socket)
	{
        //Creamos un objeto cliente
		var client = {ID : UUID()};
		//Asignamos el socket al cliente correspondiente
		client.socket = socket;
		
		//Le indicamos al cliente que esta conectado con su ID
        client.socket.emit('onconnected', { id: client.ID } );
        if(verbose)
	        console.log('\t socket.io:: player ' + client.ID + ' connected');
			
		//Obtenemos el nucleo de la logica del servidor
		var server = require("./Server.js");

/********************************************************
 *  Registramos los eventos que recibiremos del cliente
 ********************************************************/

		//Registramos el evento de partida creada
		socket.on('onCreateGame', function(data)
		{
			server.createGame(client, data.name, data.type, data.images, data.iniPos, data.iniRot);
		});
		
		//Registramos el evento de enviar todos las partidas disponibles al cliente
		socket.on('onGetGames', function(data)
		{
			server.sendGames(client);
		});
		
		//Registramos el evento de agregar un cliente al juego disponible solicidado
		socket.on('onJoinGame', function(data)
		{
			server.joinClient(client, data.gameID);
		});
		
		//Registramos el evento de indicar que un cliente esta listo para jugar
		socket.on('onReadyToPlay', function(data)
		{
			server.readyToPlay(client);
		});
		
		//Registramos el evento de partida terminada
		socket.on('onFinishedGame', function(data)
		{
			server.finishGame(client, data.gameID);
		});
		
		//Evento de cliente desconectado
		socket.on('disconnect', function ()
		{
			if(verbose)
				console.log('\t socket.io:: disconnected client ' + client.ID);
			//Si el cliente esta en una partida y es el propietario de esta
            if(client.gameID)
			{
                server.finishGame(client, client.gameID);
            }
        });

/********************************************************
 *  Registramos los eventos que recibiremos del cliente
 ********************************************************/

        /*//Evento de mensaje recibido
		socket.on('message', function(message)
		{
            server.onMessage(socket, message);
        });*/
    });