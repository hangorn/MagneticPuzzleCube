/*
 *  Nombre: Sound.js
 *  Sinopsis: Clase que manejará los sonidos de la aplicación.
 *  
 *  Autor: Vaquero Marcos, Javier
 *  Autor: Thomas Sturm (http://www.storiesinflight.com/html5/audio.html)
 *  Fecha: 27-02-2013
 *  Versión: 0.2
 *  Fecha: 21-02-2013
 *  Versión: 0.1
 *  */


/*
 *  CLASE SOUND
 *  */
function Sound ()
{


/*****************************************
 *  Atributos (son privados, no se podrá acceder a ellos fuera de la clase)
 *****************************************/

    //Flag para saber si el sonido esta activado
    var enabled = false;
    //Flag para saber si esta activado el sonido de ayuda al colocar una pieza
    var helpSoundEnabled = false;
    //Canales para sonido
    var numChannels = 5;
    var channels = [];
    
    //Elemento html para mostrar el icono de sonido activado/desactivado
    var soundIcon;
    //Icono que indicará que el sonido está desactivado
    var notSoundIcon;
    
    //Sonido de pieza encajada
    var placedSound;
    //Sonido de pieza bien encajada
    var rightSound;
    //Sonido de pieza mal encajada
    var wrongSound;
    //Sonido final
    var finalSound;
    //Sonido de movimiento en el menu
    var movedSound;
    //Sonido de explosion al seleccionar un elemento del menu
    var explosionSound;
    

/*****************************************
 *  Constructor
 *****************************************/
/*
 * Nombre: Constructor
 * Sinopsis: Constructor de la clase Sound.
 * Entradas:
 * Salidas:
 * */
    
    //Creamos el icono de sonido
    //Creamos un contenedor y los situamos de manera que no interfiera con el resto de elementos
    iconSound = document.createElement('div');
    iconSound.style.position = 'absolute';
    iconSound.style.margin = '10px'
    //Creamos la imagen con el icono de sonido
    var img = document.createElement('img');
    img.src = 'img/sound.png';
    img.onclick = onSoundClick; //Registramos la funcion al hacer click
    img.style.position = 'absolute';
    img.style.cursor = 'pointer'; //Indicamos que el puntero para este elemento es un puntero ('mano')
    iconSound.appendChild(img); //Añadimos la imagen al contenedor
    //Creamos la imagen el el icono de no sonido
    notSoundIcon = document.createElement('img');
    notSoundIcon.src = 'img/notSound.png';
    notSoundIcon.onclick = onSoundClick; //Registramos la funcion al hacer click
    notSoundIcon.style.position = 'absolute';
    notSoundIcon.style.cursor = 'pointer'; //Indicamos que el puntero para este elemento es un puntero ('mano')
    if(enabled)notSoundIcon.style.display = 'none'; //Si el sonido esta activado no mostramos el icono de sonido desactivado
    iconSound.appendChild(notSoundIcon); //Añadimos la imagen al contenedor
    document.body.appendChild(iconSound); //Añadimos el contenedor a la pagina
    
    //Iniciamos los canales para el sonido
    for(var i=0; i<numChannels; i++)
    {
        channels[i] = [];
        channels[i].channel = -1;
        channels[i].finished = -1;
    }

    //Creamos el sonido de figura colocada
    placedSound = loadAudio('place');
    //Creamos el sonido de pieza bien encajada
    rightSound = loadAudio('rigth');
    //Creamos el sonido de pieza mal encajada
    wrongSound = loadAudio('wrong');
    //Creamos el sonido de movimiento en el menu
    movedSound = loadAudio('move');
    //Creamos el sonido final
    finalSound = loadAudio('final');
    //Creamos el sonido de explosion al seleccionar un elemento del menu
    explosionSound = loadAudio('explosion');
    
    
/*****************************************
 *  Métodos Privados
 *****************************************/

/*
 * Nombre: loadAudio
 * Sinopsis: Método para cargar el archivo de audio indicado, se debe suministrar solo el nombre
 *          del fichero, sin extension, ya que se cargara tanto con extensión WAV como MP3, se
 *          supondrá que el fichero se encuentra en la carpeta '/audio/'.
 * Entradas:
 *      -string:file -> cadena de caracteres con el nombre del fichero de audio.
 * Salidas:
 *      -audio -> objeto del DOM del tipo audio creado con los datos especificados.
 * */
function loadAudio(file)
{
    //Creamos el objeto del DOM audio
    var s = document.createElement('audio');
    s.id = 'movedSound';
    s.preload = 'auto';
    //Le añadimos el recurso WAV
    var source = document.createElement('source');
    source.src = 'audio/'+file+'.wav';
    source.type="audio/wav";
    s.appendChild(source);
    //Le añadimos el recurso MP3
    var source = document.createElement('source');
    source.src = 'audio/'+file+'.mp3';
    source.type="audio/mpeg";
    s.appendChild(source);
    return s;
}

/*
 * Nombre: onSoundClick
 * Sinopsis: Método que se ejecutará cada vez que se haga click en el icono de sonido.
 * Entradas:
 * Salidas:
 * */
function onSoundClick()
{
    if(enabled)
    {
        //Mostramos el icono de no sonido
        notSoundIcon.style.display = 'block';
        //Recorremos todos los canales para silenciarlos
        for(var i=0; i<channels.length; i++)
        {
            //Si se esta utilizando el canal
            thistime = new Date();
            if (channels[i].finished > thistime.getTime())
                channels[i].channel.pause();
            channels[i].channel.channel = -1;
            channels[i].channel.finished = -1;
        }
    }
    else
    {
        //Ocultamos el icono de no sonido
        notSoundIcon.style.display = 'none';
    }
    enabled = !enabled;
}

/*
 * Nombre: addChannel
 * Sinopsis: Método que añade un canal al grupo de canales para el sonido.
 * Entradas:
 * Salidas:
 * */
function addChannel()
{
    //Creamos un canal
    channel = [];
    channel.channel = -1;
    channel.finished = -1;
    //Lo añadimos al grupo de canales
    channels.push(channel);
}

/*
 * Nombre: addChannel
 * Sinopsis: Método para reproducir el sonido indicado.
 * Entradas:
 *      Audio:sound -> objeto de la clase audio que será reproducido
 * Salidas:
 * */
function playSound(sound)
{
    //Si no esta activado el sonido no reproducimos nada
    if(!enabled)
        return;
    
    //Buscamos un canal libre
    for(i=0; i<channels.length; i++)
    {
        thistime = new Date();
        if (channels[i].finished < thistime.getTime())
        {
            //Guardamos la duracion del audio
            channels[i].finished = thistime.getTime() + sound.duration*1000;
            //Guardamos el sonido en el canal
            channels[i].channel = sound.cloneNode(true);
            //Reproducimos el canal
            channels[i].channel.play();
            return;
        }
    }
    //Si llegamos hasta aqui es que no hay canales libres
    //Añadimos un canal
    addChannel();
    //Guardamos la duracion del audio
    channels[channels.length-1].finished = thistime.getTime() + sound.duration*1000;
    //Guardamos el sonido en el canal
    channels[channels.length-1].channel = sound.cloneNode(true);
    //Reproducimos el canal
    channels[channels.length-1].channel.play();
}
 
 /*****************************************
 *  Métodos Públicos
 *****************************************/

/*
 * Nombre: playRigthPlaced
 * Sinopsis: Método que reproducirá el sonido de pieza encajada correctamente en el puzzle.
 * Entradas:
 * Salidas:
 * */
this.playRigthPlaced = function()
{
    playSound(placedSound);
    if(helpSoundEnabled)
        playSound(rightSound);
}

/*
 * Nombre: playWrongPlaced
 * Sinopsis: Método que reproducirá el sonido de pieza encajada erróneamente en el puzzle.
 * Entradas:
 * Salidas:
 * */
this.playWrongPlaced = function()
{
    playSound(placedSound);
    if(helpSoundEnabled)
        playSound(wrongSound);
}

/*
 * Nombre: playFinal
 * Sinopsis: Método que reproducirá el sonido de puzzle acabado.
 * Entradas:
 * Salidas:
 * */
this.playFinal = function()
{
    playSound(finalSound);
}

/*
 * Nombre: playMoved
 * Sinopsis: Método que reproducirá el sonido de pieza encajada en el puzzle.
 * Entradas:
 * Salidas:
 * */
this.playMoved = function()
{
    playSound(movedSound);
}

/*
 * Nombre: playExplosion
 * Sinopsis: Método que reproducirá el sonido de explosión al seleccionar una
 *          entrada del menú.
 * Entradas:
 * Salidas:
 * */
this.playExplosion = function()
{
    playSound(explosionSound);
}

/*
 * Nombre: enableHelpSound
 * Sinopsis: Método para activar el sonido de ayuda al colocar piezas.
 * Entradas:
 * Salidas:
 * */
this.enableHelpSound = function()
{
    helpSoundEnabled = true;
}

/*
 * Nombre: playExplosion
 * Sinopsis: Método para desactivar el sonido de ayuda al colocar piezas.
 * Entradas:
 * Salidas:
 * */
this.disableHelpSound = function()
{
    helpSoundEnabled = false;
}

}