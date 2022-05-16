const express = require('express');
const cors = require('cors');
const {SerialPort}= require('serialport');
const {io} = require('socket.io-client');



class Server{
    

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3030;
        this.server = require('http').createServer(this.app); 
        this.io = require('socket.io')(this.server);        

        this.middlewares();

        //SI NO ESTA CONECTADO EL ARDUINO DA ERROR EL CODIGO
        //this.arduinoEventos = new SerialPort({path:process.env.PORTARDUINO,baudRate:process.env.SERIAL});
        this.arduinoEventos = new SerialPort({path:"/dev/cu.usbmodem14101",baudRate:9600});


        //EVENTOS PARA DOMINIO MAESTRO
        this.socketEventos = io(process.env.DOMINIOREMITENTE);


 
                
        //CUANDO SE CONECTA EL ARDUINO
        this.arduinoEventos.on('open',()=>{   
            console.log('Arduino conectado.');
        });


        //CUANDO EL ARDUINO ENVIA INFORMACION
        this.arduinoEventos.on('data',(data)=>{

            //enviar informacion del arduino
            const objeto = {
                datos: String(data)
            }
            //socketEventos.emit('ARDUINO:DATOS',"desde el servidor");
            console.log(String(data));

            this.socketEventos = io(process.env.DOMINIOREMITENTE); // connecting a server en la nube 

            this.socketEventos.emit("DATOS:ARDUINO",String(data)); // emitidiendo data al server nube
            //this.socketEventos.on("SERVIDOR:RESPUESTA",(data)=>{ });
        })


        //CUENTO PRESENTA ALGUN ERROR PERO FALLA
        this.arduinoEventos.on('error',(error)=>{
            console.log(error);
        })

    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }


    listen(){
        this.server.listen(this.port,()=>{
            console.log("Servidor corriendo en el puerto",this.port);
        });
    }

}

module.exports = Server;