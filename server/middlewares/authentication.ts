import { Request,Response,NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import { SEED } from '../global/environment';

const verificaToken=(req:Request,res:Response,next:NextFunction)=>{
    const token: string= <string>req.get('token');

    jwt.verify(token,SEED,(err:jwt.VerifyErrors,decoded)=>{
        if(err){
            //debemos iniciar una sesión
            return res.status(401).json({
                ok:false,
                err
            });
        }
        //console.log(decoded);
        //existen 3 formas:any,configuracion .ts,interface
        (<any>req).usuario = decoded;
        //console.log((<any>req).usuario);
        next();
    });
}

const verificaRolAdmin=(req:Request,res:Response,next:NextFunction)=>{
    let {usuario}=(<any>req).usuario;
    if(usuario.role==='USER_ADMIN'){
        next();
    }else{
        //no tenemos permisos
        return res.status(403).json({
            ok:false,
            err:{
                message:`No es administrador`
            }
        });
    }
}

export{
    verificaToken,
    verificaRolAdmin
}