import {Request,Response} from 'express';
import fs from 'fs-extra';
import cloudinary from 'cloudinary';
import { Publication,PublicationI } from '../models/publication';
import {CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} from '../global/environment'
cloudinary.v2.config({
    cloud_name:CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
class PublicationController{
    constructor(){

    }

    getPublication=async(req:Request,res:Response):Promise<any>=>{

        Publication.find({is_active:true}).sort({'date':-1}).populate('category','name').populate('user','role first_name photo_url email').exec(async(err,publications:PublicationI[]):Promise<Response | undefined>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!publications){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }

            Publication.countDocuments({is_active:true},(err,total:number)=>{
                return  res.status(200).json({
                    ok:true,
                    publications,
                    total
                });
            });

            
        });

    }

    getPublicationId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        Publication.findById(id).populate('category','name').populate('user','role first_name photo_url email').exec(async(err,publicationDB:PublicationI):Promise<Response|undefined>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!publicationDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe una publicación con el id : ${id}`
                    }
                });
            }
            return await res.status(200).json({
                ok:true,
                publication:publicationDB
            });

        });
        

    }



    postPublication=async(req:Request,res:Response):Promise<any>=>{
        const {description,category,cellphone}=req.body;
        try{

            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder: 'PapaGo',
                use_filename: true
               });
    
            const publication=new Publication({
                description,
                cellphone,
                category,
                photo_url:result.url,
                photo_public_id:result.public_id,
                user:(<any>req).usuario.usuario
            });

            await publication.save(async(err,publicationDB):Promise<Response>=>{
                if(err){
                    await fs.unlink(req.file.path);
                    await cloudinary.v2.uploader.destroy(result.public_id);
                    return await res.status(400).json({
                        ok:false,
                        err
                    });
                }

                if(!publicationDB){
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

                return await res.status(201).json({
                    ok:true,
                    publication:publicationDB
                });

            });

        }catch(e){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error en la petición'
                }
            });
        }
    }

    putIdLike=async(req:Request,res:Response):Promise<any>=>{
        const{id,type}=req.params;
        const actiontypes:RegExp=/increment|decrement/;
        if(!actiontypes.test(type)){
            return res.status(400).json({
                ok:false,
                err:{
                    message:`Solo se aceptan estos types :${actiontypes}`
                }
            });
        }
        Publication.findById(id,(err,publicationDB:PublicationI)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!publicationDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe una publicación con el id : ${id}`
                    }
                });
            }

            (type==='increment')?publicationDB.likes+=1:(publicationDB.likes)>0?publicationDB.likes-=1:publicationDB.likes=0;
            publicationDB.save(async(err,publication:PublicationI):Promise<Response>=>{
                if(err){
                    return await res.status(500).json({
                        ok:false,
                        err
                    });
                }
                if(!publication){
                    return await res.status(400).json({
                        ok:false,
                        err:{
                            message:`Error en la petición`
                        }
                    });
                }
                return res.status(202).json({
                    ok:true,
                    publication
                });
            });
        });
        
    }

    putPublicationId=async(req:Request,res:Response):Promise<any>=>{
        //esclusivo para datos normales ojo
        const{id}=req.params;
        if(!req.body.description){
            return await res.status(400).json({
                ok:false,
                err:{
                    message:`Es necesario la descripción`
                }
            });
        }
        const data={
            ...req.body,
            date:Date.now()
        }
        Publication.findByIdAndUpdate(id,data,{new:true,context:'query',runValidators:true},async(err,publicatonDB:PublicationI|null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!publicatonDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe una publicación con el id : ${id}`
                    }
                });
            }
            return await res.status(202).json({
                ok:true,
                publicatonDB
            });
        });
    }

    putPublicationIdPhoto=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        try{
            Publication.findById(id,async(err,publicationDB:PublicationI | null)=>{
                if(err){
                    return await res.status(500).json({
                        ok:false,
                        err
                    });
                }
                if(!publicationDB){
                    return await res.status(400).json({
                        ok:false,
                        err:{
                            message:`No existe una publicación con el id : ${id}`
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
                await cloudinary.v2.uploader.destroy(publicationDB.photo_public_id);
                publicationDB.photo_url=await result.url;
                publicationDB.photo_public_id=await result.public_id;
                publicationDB.save(async(err,publication:PublicationI):Promise<Response | undefined>=>{
                    if(err){
                        await fs.unlink(req.file.path);
                        return await res.status(500).json({
                        ok:false,
                        err
                        });
                    }
                    if(!publication){
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
                        publication
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

    deletePublicationId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        const data={
            is_active:false
        }
        Publication.findByIdAndUpdate(id,data,{new:true,context:'query',runValidators:true},async(err,publicationDB:PublicationI | null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!publicationDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe una publicación con el id : ${id}`
                    }
                });
            }

            return await res.status(202).json({
                ok:true,
                publication:publicationDB
            });

             


        });

    }

    getPublicationUserId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        //.find({user:id})
        /*Test.find({
      $and: [
          { $or: [{a: 1}, {b: 1}] },
          { $or: [{c: 1}, {d: 1}] }
      ]
  }, function (err, results) {
      ...
  } */
  /*Test.find()
      .and([
          { $or: [{a: 1}, {b: 1}] },
          { $or: [{c: 1}, {d: 1}] }
      ])
      .exec(function (err, results) {
          ...
      }); */
        Publication.find({$and:[{user:id},{is_active:true}]}).sort({'date':-1}).populate('category','name').populate('user','role first_name photo_url email').exec(async(err,publications:PublicationI[]):Promise<Response | undefined>=>{

            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!publications){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }
            Publication.countDocuments({$and:[{user:id},{is_active:true}]},(err,total:number)=>{
                return  res.status(200).json({
                    ok:true,
                    publications,
                    total
                });
            });
        });
    }

}
export{
    PublicationController
}