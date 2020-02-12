import {Request,Response} from 'express';
import { Place,PlaceI } from "../models/place"


class PlaceController{
    constructor(){

    }

    getPlace=async(req:Request,res:Response):Promise<any>=>{
        Place.find({}).select('_id name lng lat color').exec(async(err,places:PlaceI[])=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!places){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }

            Place.countDocuments({},(err,total:number)=>{
                return  res.status(200).json({
                    ok:true,
                    places,
                    total
                });
            });

        })

    }

    getPlaceUserId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        Place.find({user:id}).exec(async(err,places:PlaceI[])=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!places){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Huvo un error en la petición realizada`
                    }
                });
            }
            Place.countDocuments({user:id},(err,total:number)=>{
                return  res.status(200).json({
                    ok:true,
                    places,
                    total
                });
            });

        });
    }
    //servicio post limitado a 2 registros por usuario
    postPlace=async(req:Request,res:Response):Promise<any>=>{
        const{name,lng,lat,color}=await req.body;
        const place=new Place({
            name,lng,lat,color,user:(<any>req).usuario.usuario
        });
        const {usuario}=await (<any>req).usuario;
        await Place.countDocuments({user:usuario},(err,total:number)=>{
            if(total>=2){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:`Solo puede ingresar 2 locales`
                    }
                });
            }
            place.save(async(err,placeDB:PlaceI):Promise<Response>=>{
                if(err){
                    return await res.status(500).json({
                        ok:false,
                        err
                    });
                }
                if(!placeDB){
                    return await res.status(400).json({
                        ok:false,
                        err:{
                            message:`Huvo un error en la petición realizada`
                        }
                    });
                }
                return res.status(201).json({
                    ok:true,
                    place:placeDB
                });
            });
        });
    }

    deletePlaceId=async(req:Request,res:Response):Promise<any>=>{
        let{id}=req.params;
        Place.findByIdAndRemove(id,async(err,placeDB:PlaceI | null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!placeDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe un lugar con el id:${id}`
                    }
                });
            }
            return res.status(202).json({
                ok:true,
                place:placeDB
            });
        });
    }

}

export{
    PlaceController
}