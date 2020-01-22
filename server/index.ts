import { Server } from "./server";
import { connect } from "./database";

const server=Server.instance;
connect();
server.start(server.port,(err:any)=>{
    if(err){throw new Error(err)}
    console.log(`Se esta corriendo exitosamente en el puerto : ${server.port}`);
});