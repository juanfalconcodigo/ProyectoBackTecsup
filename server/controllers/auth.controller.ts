import {Request,Response} from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SEED,CADUCIDAD_TOKEN } from '../global/environment';

class AuthController{
    
    constructor(){

    }

    postLogin=async(req:Request,res:Response):Promise<any>=>{
        let{email,password}=req.body;
        User.findOne({email},async(err,usuarioDB)=>{

            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }

            if(!usuarioDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`El (usuario) o la contraseña es errado`
                    }
                });
            }

            if(!bcrypt.compareSync(password,usuarioDB.password)){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`El usuario o la (contraseña) esta errado`
                    }
                });
            }

            let token=jwt.sign({usuario:usuarioDB},SEED,{expiresIn:CADUCIDAD_TOKEN});

            return await res.status(202).json({
                ok:true,
                usuario:usuarioDB,
                token
            });

        });
    }

}

export{
    AuthController
}