import { Socket } from "socket.io"
import socketIO from 'socket.io';
import { UserChat } from "../classes/user-chat";
import { UserListChat } from "../classes/user-list";
const usersConnect=new UserListChat();

const connectClient=(client:Socket,io:socketIO.Server)=>{

    const usuario=new UserChat(client.id);
    usersConnect.addUser(usuario);

}
const disconnectClient=(client:Socket,io:socketIO.Server)=>{
    
    client.on('disconnect',()=>{
        usersConnect.deleteUser(client.id);
        io.emit('usuarios-activos',usersConnect.getListUser());
    });
    
}

const obtainUsers=(client:Socket,io:socketIO.Server)=>{

    client.on('obtener-usuarios',()=>{
        io.to(client.id).emit('usuarios-activos',usersConnect.getListUser());
    });

}


const configUser=(client:Socket,io:socketIO.Server)=>{

    client.on('configurar-usuario',(payload:{_id:string,first_name:string,photo_url:string,role:string},callback:Function)=>{
        console.log('Configurando usuario',payload);
        usersConnect.updateData(client.id,payload._id,payload.first_name,payload.photo_url,payload.role);
        io.emit('usuarios-activos',usersConnect.getListUser());
        callback({
            ok:true,
            message:`Usuario configurado : ${payload.first_name}`
        });

    });

}

/* */
const emitConnect=(client:Socket,io:socketIO.Server)=>{
    client.broadcast.emit('client-connect',{info:'Cliente nuevo conectado'});
}
const emitDisconnect=(client:Socket,io:socketIO.Server)=>{
    client.broadcast.emit('client-disconnect',{info:'Cliente desconectado'});
}
const onMessage=(client:Socket,io:socketIO.Server)=>{
    client.on('enviar-mensaje',(payload:{message:String,first_name:string,photo_url:string,role:string})=>{
        console.log('mensaje recibido:',payload);
        io.emit('mensaje-nuevo',payload);
    });
}


export{
    emitConnect,
    emitDisconnect,
    onMessage,
    configUser,
    usersConnect,
    connectClient,
    disconnectClient,
    obtainUsers

}