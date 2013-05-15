/*
 *  Nombre: DataAccessObject.js
 *  Sinopsis: clase que proveerá la información consistente a sus clientes,
 *          utilizando el patrón DAO.
 *
 *  Autor: Vaquero Marcos, Javier
 *  Fecha: 13-05-2013
 *  Versión: 0.1
 *  */

/*
 *  CLASE DATAACCESSOBJECT
 *  */

DataAccessObject = function()
{


/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/
    
    //Cliente con el cual nos conectaremos a la base de datos
    var mongoClient;
    //Base de datos que se utilizará con MongoDB
    var database;
    
    var orderModes = [1,1,-1,-1,1];
    var modes = [0,1,2,3,4];
    var submodes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];


/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase DataAccessObject.
 * Entradas:
 * Salidas:
 * */

    //Obtenemos el modulo de mongodb
    var mongodb = require("mongodb");
    //Nos conectamos a la base de datos
    var mongoserver = new mongodb.Server('localhost', mongodb.Connection.DEFAULT_PORT, {auto_reconnect: true});
    //Creamos un cliente para conectarnos a la base de datos
    mongoClient = new mongodb.MongoClient(mongoserver);
    
    

/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: getCollection
 * Sinopsis: Método para obtener una colección (tabla).
 * Entradas:
 * 		-String:name -> nombre de la coleccion a buscar.
 * 		-Callback:callback -> función de rellamada que se
 * 		ejecutará cuando se obtenga la colección.
 * Salidas:
 * */
function getCollection(name, callback)
{
    database.collection(name, function(error, collection)
    {
        if(error) console.log("db.collection::error");
        callback(collection);
    });
}
    
    
/*****************************************
 *  Métodos Públicos
 *****************************************/
 
/*
 * Nombre: getScores
 * Sinopsis: Método para obtener las puntuaciones de un determinado modo y
 *          submodo de la base de datos.
 * Entradas:
 *      -Integer:mode -> modo del que se quieren obtener las puntuaciones.
 *      -Integer:submode -> submodo del que se quieren obtener las puntuaciones.
 *      -Callback:callback -> función de rellamada que se ejecutará cuando se
 *      consigan las puntuaciones para enviarselas al cliente.
 * Salidas:
 * */
this.getScores = function(mo, sub, callback)
{
    //Nos conectamos con el cliente y obtenemos la base de datos
    mongoClient.open(function(err, mc)
    {
        database = mc.db('magPCdb');
        //Obtenemos la coleccion (tabla) de las puntuaciones
        getCollection('scores', function(collection)
        {
            //Buscamos las puntuaciones del modo y submodo solicitado
            collection.find({mode: modes[mo], submode: submodes[sub]}, {sort:[['score',orderModes[mo]],['date', -1]]}).toArray(function(error, array)
            {
                if(error) console.log("db.collection.find::error");
                callback(array);
                console.log("Served "+array.length+" elements for mode "+mo+"  "+sub);
                mongoClient.close();
            });
        });
    });
}
 
/*
 * Nombre: saveScore
 * Sinopsis: Método para obtener las puntuaciones de un determinado modo y
 *          submodo de la base de datos.
 * Entradas:
 *      -Data:data-> objeto que contendrá los datos de la puntuación
 *		a guardar : nombre, puntuación, fecha, modo y submodo.
 * Salidas:
 * */
this.saveScore = function(data)
{
    //Nos conectamos con el cliente y obtenemos la base de datos
    mongoClient.open(function(err, mc)
    {
        database = mc.db('magPCdb');
        //Obtenemos la coleccion (tabla) de las puntuaciones
        getCollection('scores', function(collection)
        {
            //Insertamos el documento (puntuacion) en la coleccion (tabla)
            collection.insert([{name:data.name, score:data.score, date:data.date, mode:data.mode, submode:data.submode}], function(error, result)
            {
                if(error) console.log("cant save score");
                else console.log("score saved by "+data.name+" with "+data.score+"    ");
                mongoClient.close();
                console.log(data);
            });
        });
    });
}

}

//Exportamos la clase DAO para que pueda ser usada exteriormente en
//el lado del servidor
module.exports = new DataAccessObject();