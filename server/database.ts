import mongoose from 'mongoose';
import { URL_DB } from './global/environment';

const connect=async()=>{
    try{
        await mongoose.connect(URL_DB,{ useNewUrlParser: true , useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:false});
        await console.log('Conexión exitosa');
    }catch(e){
        await console.log('Huvo un error en la conexión')
    }
}

export{
    connect
}