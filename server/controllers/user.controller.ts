import {Request,Response} from 'express';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import fs from 'fs-extra';

import {CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} from '../global/environment'
import { User,UserI } from '../models/user';

cloudinary.v2.config({
    cloud_name:CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

class UserController{
    constructor(){
    }
    
    getUsuario=async(req:Request,res:Response):Promise<any>=>{
        User.find({is_active:true}).sort({'first_name':1}).exec((err,usuarios:UserI[])=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!usuarios){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }
            User.countDocuments({is_active:true},(err,total:number)=>{
                return res.status(200).json({
                    ok:true,
                    usuarios,
                    total
                });
            });
        });
    }
    
    postUsuario=async(req:Request,res:Response):Promise<any>=>{
        const{first_name,last_name,email,password}=req.body;
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder: 'PapaGo',
                use_filename: true
               });
            //console.log(result);
            if(password.length<6){
                await fs.unlink(req.file.path);
                await cloudinary.v2.uploader.destroy(result.public_id);
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`La contraseña deve tener 6 carácteres como mínimo`
                    }
                });
            }
            const user= new User({
                first_name,
                last_name,
                email,
                password:bcrypt.hashSync(password,10),
                photo_url:result.url,
                photo_public_id:result.public_id
            });
            await user.save(async(err,usuarioDB)=>{
                if(err){
                    await fs.unlink(req.file.path);
                    await cloudinary.v2.uploader.destroy(result.public_id);
                    return await res.status(400).json({
                        ok:false,
                        err
                    });              
                }
                if(!usuarioDB){
                    await fs.unlink(req.file.path);
                    await cloudinary.v2.uploader.destroy(result.public_id);
                    return await res.status(400).json({
                        ok:false,
                        err:{
                            message:`Huvo un error en la petición realizada`
                        }
                    });
                }

                await fs.unlink(req.file.path);

                return res.status(201).json({
                    ok:true,
                    usuario:usuarioDB
                });
            });
        }
        catch(e){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'File not found'
                }
            });
        }   
    }

    getUsuarioId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        User.findById(id,(err,usuarioDB:UserI | null)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!usuarioDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un usuario con el id : ${id}`
                    }
                });
            }

            return res.status(200).json({
                ok:true,
                usuario:usuarioDB
            });
        });

    }

    deleteUserId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        let data={
            is_active:false
        }
        User.findByIdAndUpdate(id,data,{new:true,runValidators:true,context:'query'},async(err,usuarioDB:UserI | null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!usuarioDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un usuario con el id : ${id}`
                    }
                });
            }
            return  await res.status(202).json({
                ok:true,
                usuario:usuarioDB
            })
        });
    }

    putUserId=async(req:Request,res:Response):Promise<any>=>{
        //esclusivo para datos normales ojo enviar si o si el password
        let{id}=req.params;
        if(!req.body.password){
            return res.status(400).json({
                ok:false,
                err:{
                    message:`Deve ingresar la  contraseña , deve tener 6 carácteres como mínimo`
                }
            });
        }
        if(req.body.password.length<6){
            return res.status(400).json({
                ok:false,
                err:{
                    message:`La contraseña deve tener 6 carácteres como mínimo`
                }
            });
        }
        let data={
            ...req.body, 
            password:bcrypt.hashSync(req.body.password,10), 
        }
        User.findByIdAndUpdate(id,data,{new:true,runValidators:true,context:'query'},(err,usuarioDB:UserI | null)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!usuarioDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un usuario con el id : ${id}`
                    }
                });
            }
            return res.status(202).json({
                ok:true,
                usuario:usuarioDB
            });

        });
    }
    
    putUserIdPhoto=async(req:Request,res:Response):Promise<any>=>{
        //exclusivo para form-data
        let{id}=req.params;
        try{
            User.findById(id,async(err,usuarioDB:UserI | null)=>{
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
                            message:`No existe un usuario con el id : ${id}`
                        }
                    });
                }

                if(!req.file){
                    return await res.status(400).json({
                        ok:false,
                        err:{
                            message:'File not found'
                        }
                    });
                }

                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder: 'PapaGo',
                    use_filename: true
                   });
                await cloudinary.v2.uploader.destroy(usuarioDB.photo_public_id);
                usuarioDB.photo_url=await result.url;
                usuarioDB.photo_public_id=await result.public_id;
                usuarioDB.save(async(err,usuario)=>{
                    if(err){
                        await fs.unlink(req.file.path);
                        return await res.status(500).json({
                        ok:false,
                        err
                        });
                    }
                    if(!usuario){
                        await fs.unlink(req.file.path);
                        return await res.status(400).json({
                            ok:false,
                            err:{
                                message:`Se realizo incorrectamente la petición`
                            }
                        });
                    }
                    await fs.unlink(req.file.path);
                    return await res.status(202).json({
                        ok:true,
                        usuario
                    });
                });

            });

        }catch(e){
            return await res.status(400).json({
                ok:false,
                err:{
                    message:'File not found'
                }
            });
        }
    }


}

 export{
    UserController
 }