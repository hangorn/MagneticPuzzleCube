/*
 *  Copyright (c) 2013 Javier Vaquero <javi_salamanca@hotmail.com>
 *
 *  See the file license.txt for copying permission.
 *
 */

/*
 *  Nombre: Server.js
 *  Sinopsis: clase que se ejecutará en la parte del servidor, se encargará de
 *  toda la lógica del servidor: gestionar partidas, gestionar jugadores, ...
 *
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 28-04-2013
 *  Versión: 0.1
 *  */

/*
 *  CLASE SERVER
 *  */

Server = function()
{


/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/
	
	//Incluimos el modulo UUID para asignar IDs a las partidas
	var UUID = require('node-uuid');
	//Array con todos los jugos activos
	var games = [];
	//Objeto para el acceso a datos persistentes
	var dao;


/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase Server.
 * Entradas:
 * Salidas:
 * */

 
 
 
/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: solvedGame
 * Sinopsis: Método que se ejecutará al resolver el puzzle.
 * Entradas:
 * 		-Game:game -> objeto de la clase Game con los datos de la partida.
 * Salidas:
 * */
function solvedGame(game)
{
	//Buscamos la partida
	for(var i=0; i<games.length; i++)
		if(game.ID == games[i].ID)
			break;
	if(i >= games.length)
		return;
	//Si hemos empezado la partida
	if(game.core != undefined)
		//Terminamos la partida
		game.core.finishGame();
	//Marcamos a los clientes como no preparados por si vuelven a jugar
	game.players.client.ready = false;
	game.players.host.ready = false;
	//Desasociamos los jugadores con sus partidas
	game.players.client.gameID = undefined;
	game.players.host.gameID = undefined;
	//Guardamos el ultimo jugador con el que ha jugado cada uno para
	//luego guardar la puntuacion
	game.players.client.lastPartner = game.players.host;
	game.players.host.lastPartner = game.players.client;
	//Borramos la partida
	games.splice(i, 1);
	console.log("game "+game.ID+" solved");
}


/*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: saveLastScore
 * Sinopsis: Método para guardar una puntuación cuando empieze otra partida o se
 * 			desconecte el cliente, si hay alguna puntuacion que guardar.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que
 *		quiere desconectarse.
 * Salidas:
 * */
this.saveLastScore = function(client)
{
	//Si el cliente que se va a desconectar tiene un ultimo jugador con el
	//que ha jugado y este ultimo jugador quiere guardar la partida
	if(client.lastPartner != undefined && client.lastPartner.savingScore)
	{
		//Si no tenemos un DAO
		if(dao == undefined)
			dao = require('./DataAccessObject.js');
		//Guardamos la puntuacion con el nombre anonimo
		var score = client.lastPartner.score;
		//Si se trata del modo contrareloj
		if(score.submode == 2 || score.submode == 3)
		{
			//Si el cliente que quiere guardar la puntuacion es el ganador lo
			//ponemos primero, si no ponemos primero al otro jugador
			if(client.winner)
				score.name = 'Anonimo#'+client.lastPartner.score.name;
			else
				score.name = client.lastPartner.score.name+'#Anonimo';
		}
		//Si se trata del modo cooperativo
		else
			score.name = client.lastPartner.score.name+'#Anonimo';
		//Guardamos la puntuacion en la bb dd
		dao.saveScore(score);
		//Marcamos a ambos jugadores como que no quieren guardar la puntuacion
		client.savingScore = false;
		client.lastPartner.savingScore = false;
	}
}
 
/*
 * Nombre: createGame
 * Sinopsis: Método para crear una partida en el servidor.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que ha creado la partida.
 *      -String:name -> cadena con el nombre de la partida.
 *      -Integer:type -> entero que identificará el tipo de partida.
 *      -String[]:images -> array con cadenas de texto que representan las imágenes con las que se
 *      ha iniciado la partida codificadas en base 64.
 *      -Vector3[]:iniPos -> posiciones iniciales de los cubos de la partida creada.
 *      -Vector3[]:iniRot -> rotaciones iniciales de los cubos de la partida creada.
 * Salidas:
 * */
this.createGame = function(client, name, type, images, iniPos, iniRot)
{
	//Creamos un objeto partida
	var	game = {name:name, type:type, images:images, iniPos : iniPos, iniRot : iniRot};
	//Le asiganmos un ID
	game.ID = UUID();
	//Guardamos los jugadores de la partida
	game.players = {};
	//Guardamos el jugador que ha creado la partida como host
	game.players.host = client;
	//Guardamos el jugador que se conectara como vacio
	game.players.client = null;
	//Guardamos la partida en el array de partidas
	games.push(game);
	//Le indicamos al cliente en que juego esta
	client.gameID = game.ID;
	//Le indicamos al cliente que se ha creado la partida con su ID
	client.socket.emit('onCreatedGame', { gameID: game.ID} );
	
	console.log("Game named: "+name+" type: "+type+" was created with ID: "+game.ID+" by the player "+game.players.host.ID+" with "+game.images.length+" images.  We have "+games.length+" games");
}

/*
 * Nombre: sendGames
 * Sinopsis: Método para enviar al cliente la información de todas las partidas disponibles.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que
 *		quiere recibir las partidas disponibles.
 * Salidas:
 * */
this.sendGames = function(client)
{
	//Buscamos los juegos disponibles
	var availableGames = [];
	for(var i=0; i<games.length; i++)
		//Si la partida solo tiene un jugador
		if(games[i].players.client == null)
		{
			availableGames.push({name:games[i].name, ID:games[i].ID, type:games[i].type});
		}
	//Enviamos la respuesta con los datos al cliente
    client.socket.emit("onSentGames", {games:availableGames});
}

/*
 * Nombre: finishGame
 * Sinopsis: Método para unir un cliente a una partida disponible.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que se quiere unir a la partida.
 *		-String:gameID -> ID del juego al que se quiere unir el cliente.
 * Salidas:
 * */
this.joinClient = function(client, gameID)
{
	//Buscamos la partida
	for(var i=0; i<games.length; i++)
		if(gameID == games[i].ID)
			break;
	
	//Si no se ha encontrado la partida o la partida ya se ha iniciado
	if(i >= games.length || games[i] == undefined || games[i].players.client != null)
	{
		//Registramos el evento para cuando se conecte a la partida
		//Pero sin enviarle ninguna partida
		client.socket.emit('onJointGame', { game: undefined});
		return;
	}
	
	//Guardamos el juego al que se quiere conectar
	var game = games[i];
	//Guardamos el cliente como el cliente de la partida
	game.players.client = client;
	//Asignamos el juego al que esta jugando el cliente
	client.gameID = game.ID;
    //Guardamos los datos de la partida para enviarselos a los jugadores
	var gameData = {name: game.name, type:game.type, ID:game.ID, images:game.images, iniPos:game.iniPos, iniRot:game.iniRot, players:{host : {ID: game.players.host.ID}, client:{ID: game.players.client.ID}}};
	
	//Le enviamos los datos de la partida al cliente que se desea unir a esta
	client.socket.emit('onJointGame', {game: gameData});
	//Le decimos al host de la partida que ya hay un jugador disponible
	game.players.host.socket.emit('onJointClient', { });
}

/*
 * Nombre: readyToPlay
 * Sinopsis: Método para un cliente a una partida disponible.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que esta lista para jugar.
 * Salidas:
 * */
this.readyToPlay = function(client)
{
	//Buscamos la partida en la que esta el cliente
	for(var i=0; i<games.length; i++)
		if(client.gameID == games[i].ID)
			break;
	//Si no encontramos la partida
	if(i >= games.length)
		return;
	//Guardamos la partida
	var game = games[i];
	//Indicamos que el cliente esta listo
	client.ready = true;
	//Si el cliente es el host de la partida y el cliente de la partida ya esta listo
	if(game.players.host == client && game.players.client.ready)
	{
		//Indicamos a ambos jugadores que los dos estan listos para empezar la partida
		client.socket.emit('onAllReady', {});
		game.players.client.socket.emit('onAllReady', {});
		//Miramos a ver si alguno de los dos jugadores tiene alguna puntuacion pendiente de guardar
		this.saveLastScore(game.players.client);
		this.saveLastScore(game.players.host);
		//Iniciamos la partida
		game.core = new (require("./MultiplayerServer.js"))();
		game.core.startGame(game, function(){solvedGame(game)});
	}
	//Si el cliente es el cliente de la partida y el host de la partida ya esta listo
	if(game.players.client == client && game.players.host.ready)
	{
		//Indicamos a ambos jugadores que los dos estan listos para empezar la partida
		client.socket.emit('onAllReady', {});
		game.players.host.socket.emit('onAllReady', {});
		//Miramos a ver si alguno de los dos jugadores tiene alguna puntuacion pendiente de guardar
		this.saveLastScore(game.players.client);
		this.saveLastScore(game.players.host);
		//Iniciamos la partida
		game.core = new (require("./MultiplayerServer.js"))();
		game.core.startGame(game, function(){solvedGame(game)});
	}
}
	
/*
 * Nombre: finishGame
 * Sinopsis: Método para terminar una partida en el servidor.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que quiere borrar la partida.
 *		-String:gameID -> ID del juego que será terminado.
 * Salidas:
 * */
this.finishGame = function(client, gameID)
{
	//Buscamos la partida
	for(var i=0; i<games.length; i++)
		if(gameID == games[i].ID)
			break;
	if(i >= games.length)
		return;
	var game = games[i];
	
	//Si hemos empezado la partida
	if(game.core != undefined)
		//Terminamos la partida
		game.core.finishGame();
	//Si la partida tiene dos jugadorres
	if(game.players.client != null && game.players.host != null)
	{
		//Marcamos a los clientes como no preparados por si vuelven a jugar
		game.players.client.ready = false;
		game.players.host.ready = false;
		//Si el que ha abandonado es el host de la partida
		if(client == game.players.host)
		{
			//Le decimos al cliente de la partida que se ha desconectado el host
			game.players.client.socket.emit('onOtherPlayerLeft', {});
			game.players.client.gameID = undefined;
			game.players.client = null;
		}
		//Si el que ha abandonado es el cliente de la partida
		if(client == game.players.client)
		{
			//Le decimos al host de la partida que se ha desconectado el cliente
			game.players.host.socket.emit('onOtherPlayerLeft', {});
			game.players.host.gameID = undefined;
			game.players.host = null;
		}
	}
	console.log("game "+game.ID+" finished");
	//Desasociamos el cliente con la partida
	client.gameID = undefined;
	//La borramos
	games.splice(i, 1);
}

/*
 * Nombre: sendScores
 * Sinopsis: Método para enviar al cliente la información de las puntuaciones del modo solicitado.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que
 *		quiere recibir las puntuaciones.
 *      -Integer:mode -> modo del que se quieren obtener las puntuaciones.
 *      -Integer:submode -> submodo del que se quieren obtener las puntuaciones.
 * Salidas:
 * */
this.sendScores = function(client, mode, submode)
{
	//Si no tenemos un DAO
	if(dao == undefined)
		dao = require('./DataAccessObject.js');
	//Obtenemos las puntuaciones solicitadas
	dao.getScores(mode, submode, function(scores)
	{
		//Enviamos la respuesta con los datos al cliente
		client.socket.emit("onSentScores", {scores:scores});
	});
}

/*
 * Nombre: saveScore
 * Sinopsis: Método para guardar una puntuación.
 * Entradas:
 *		-Client:client-> objeto de la clase cliente con los datos del cliente que
 *		quiere guardar una puntuación.
 *      -Data:data-> objeto que contendrá los datos de la puntuación
 *		a guardar : nombre, puntuación, fecha, modo y submodo.
 * Salidas:
 * */
this.saveScore = function(client, data)
{
	//Si no tenemos un DAO
	if(dao == undefined)
		dao = require('./DataAccessObject.js');
	//Si no se trata de un modo multijugador
	if(data.mode != 4)
		//Unicamente guardamos las puntuaciones
		dao.saveScore(data);
	//Si es un modo multijugador
	else
	{
		//Indicamos que quiere guardar una puntuacion
		client.savingScore = true;
		//Guardamos la puntuacion que quiere guardar el cliente
		client.score = data;
		//Si el ultimo compañero con el que se jugo ya quiere guardar la puntuacion
		if(client.lastPartner != undefined && client.lastPartner.savingScore == true)
		{
			var score = client.score;
			//Guardamos los nombres de los jugadores
			//Si se trata del modo contrareloj
			if(score.submode == 2 || score.submode == 3)
			{
				//Si el cliente que quiere guardar la puntuacion es el ganador lo
				//ponemos primero, si no ponemos primero al otro jugador
				if(client.winner)
					score.name = client.score.name+'#'+client.lastPartner.score.name;
				else
					score.name = client.lastPartner.score.name+'#'+client.score.name;
			}
			//Si se trata del modo cooperativo
			else
				score.name = client.score.name+'#'+client.lastPartner.score.name;
			//Guardamos la puntuacion en la bb dd
			dao.saveScore(score);
			//Marcamos a ambos jugadores como que no quieren guardar la puntuacion
			client.savingScore = false;
			client.lastPartner.savingScore = false;
		}
	}
}

}

//Exportamos la clase servidor para que pueda ser usada exteriormente en
//el lado del servidor
module.exports = new Server();
