import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
//para sockets
import http from 'http';
import socketIO, { Socket } from 'socket.io';
//para los settings
import { SERVER_PORT } from './global/environment';
//routes
import { UserRouter } from './routes/user';
import { SocketRouter } from './routes/socket';
import { PublicationRouter } from './routes/publication';
import { CommetRouter } from './routes/comment';
import { CategoryRouter } from './routes/category';

//socket action
import { emitConnect,emitDisconnect,onMessage,configUser,connectClient,disconnectClient,obtainUsers } from './socket/socket';





class  Server{
    /*singleton*/
    private static _instance:Server;

    app:express.Application;
    io:socketIO.Server;
    httpServer:http.Server;
    port:number;
    private constructor(){
        this.app=express();
        this.httpServer=new http.Server(this.app);
        this.io=socketIO(this.httpServer);
        this.port=SERVER_PORT;
        this.listenSockets();
        this.settings();
        this.middlewares();
        this.routes();
    }
    private settings(){
        
    }
    private middlewares(){
        this.app.use(cors({origin:true,credentials:true}));
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(express.json());
    }
    private routes(){

        this.app.use('/user',new UserRouter().router);
        this.app.use('/socket',new SocketRouter().router);
        this.app.use('/publication',new PublicationRouter().router);
        this.app.use('/commet',new CommetRouter().router);
        this.app.use('/category',new CategoryRouter().router);

    }
    private listenSockets(){

        this.io.on('connection',(client:Socket)=>{
            console.log('Usuario conectado');
            client.on('disconnect',()=>{
                console.log('Usuario desconectado');
                emitDisconnect(client,this.io);
            });
            emitConnect(client,this.io);
            onMessage(client,this.io);
            configUser(client,this.io);
            connectClient(client,this.io);
            disconnectClient(client,this.io);
            obtainUsers(client,this.io);
        });

    }
    start(port:number,callback:Function){
        this.httpServer.listen(port,callback());
    }

    public static get instance(){
        return this._instance || (this._instance=new this());
    }
   
}

export{
    Server
}