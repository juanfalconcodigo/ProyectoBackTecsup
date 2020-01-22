import {Request,Response} from 'express';
import { Comment,CommentI } from '../models/comment';

class CommentController{
    constructor(){

    }

    getComment=async(req:Request,res:Response):Promise<any>=>{
       Comment.find({}).sort({'date':-1}).populate('user','role first_name photo_url').populate('publication','description photo_url').exec(async(err,comments:CommentI[]):Promise<Response | undefined>=>{
           if(err){
               return await res.status(500).json({
                   ok:false,
                   err
               });
           }
           if(!comments){
               return await res.status(400).json({
                   ok:false,
                   err:{
                       message:`Huvo un error en la petición realizada`
                   }
               });
           }
           await Comment.countDocuments({},async(err,total:number)=>{    
            return  await res.status(200).json({
                ok:true,
                comments,
                total
            });
           });
       });
    }

    getCommentId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        Comment.findById(id).populate('user','role first_name photo_url').populate('publication','description photo_url').exec(async(err,commentDB:CommentI):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!commentDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un comentario con el id : ${id}`
                    }
                });
            }

            return await res.status(200).json({
                ok:true,
                comment:commentDB
            });
        });
    }

    getCommentPublicationId=async(req:Request,res:Response):Promise<any>=>{
        const{id:publication}=req.params;
        Comment.find({publication}).sort({'date':-1}).populate('user','role first_name photo_url').populate('publication','description photo_url').exec(async(err,comments:CommentI[]):Promise<Response | undefined>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!comments){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }
            Comment.countDocuments({publication},async(err,total:number):Promise<Response>=>{
                return await res.status(200).json({
                    ok:true,
                    comments,
                    total
                });
            });
        });
    }

    postComment=async(req:Request,res:Response):Promise<any>=>{

        const{commentary,publication}=await req.body;
        const comment=new Comment({
            commentary,
            user:(<any>req).usuario.usuario,
            publication
        });
        await comment.save(async(err,commentDB:CommentI):Promise<Response>=>{
            if(err){
                return await res.status(400).json({
                    ok:false,
                    err
                });
            }
            if(!commentDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }

            return await res.status(201).json({
                ok:true,
                comment:commentDB
            });
        });
    }
    //elimina fisicamente
    deleteCommentId=async(req:Request,res:Response):Promise<any>=>{
        const{id}=req.params;
        Comment.findByIdAndRemove(id,async(err,commentDB:CommentI | null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!commentDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un comentario con el id : ${id}`
                    }
                });
            }
            return await res.status(202).json({
                ok:true,
                comment:commentDB
            });

        });

    }

    putCommentId=async(req:Request,res:Response):Promise<any>=>{
        const{id}=req.params;
        const{commentary}=req.body;
        let data={
            commentary
        }
        Comment.findByIdAndUpdate(id,data,{new:true,runValidators:true,context:'query'},async(err,commentDB:CommentI | null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!commentDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un comentario con el id : ${id}`
                    }
                });
            }
            return await res.status(202).json({
                ok:true,
                comment:commentDB
            });
        });
    }

}

export{
    CommentController
}