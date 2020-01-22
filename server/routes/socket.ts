import {Router} from 'express';
import { SocketController } from '../controllers/socket.controller';



class SocketRouter{
    router:Router;
    socketController:SocketController=new SocketController();

    constructor(){
        this.router=Router();
        this.routes();
    }

    routes(){

        this.router.route('/user/get').get(this.socketController.getUserChat);
        this.router.route('/user/get/detail').get(this.socketController.getUserChatDetail);
        this.router.route('/message/public').post(this.socketController.postMessagePublic);
        this.router.route('/message/private/:id').post(this.socketController.postMessagePrivate);

    }
}

export{
    SocketRouter
}
