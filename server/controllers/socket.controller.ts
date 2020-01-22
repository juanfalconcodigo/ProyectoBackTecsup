import {Request,Response} from 'express';
import { Server } from '../server';
import { usersConnect } from '../socket/socket';


class SocketController{
    constructor(){

    }

    postMessagePrivate=async(req:Request,res:Response):Promise<Response>=>{
        const{id}=req.params;
        const{first_name,message}=req.body;
        const server=Server.instance;
        await server.io.in(id).emit('mensaje-privado',{first_name,message});
        return await res.status(201).json({
            ok:true,
            id,
            first_name,
            message
        });
    }

    postMessagePublic=async(req:Request,res:Response):Promise<Response>=>{
        let{first_name,message}=req.body;
        const server=Server.instance;
        await server.io.emit('mensaje-publico',{first_name,message});
        return await res.status(201).json({
            ok:true,
            first_name,
            message
        });
    }

    getUserChat=async(req:Request,res:Response):Promise<any>=>{
        const server=Server.instance;
        server.io.clients(async(err:any,usuariosChat:string[]):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }

            return await res.status(200).json({
                ok:true,
                usuarios:usuariosChat
            });

        });
    }

    getUserChatDetail=async(req:Request,res:Response):Promise<Response>=>{

        return res.status(200).json({
            ok:true,
            users:usersConnect.getListUser()
        });

    }

    

}

export{
    SocketController
}