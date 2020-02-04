import { Request,Response } from 'express';
import { Category,CategoryI } from '../models/category';

class CategoryController{
    constructor(){
    }
    getCategory=async(req:Request,res:Response):Promise<any>=>{
        Category.find({is_active:true}).sort({name:1}).exec(async(err,categories:CategoryI[]):Promise<any>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!categories){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Error en la petición`
                    }
                });
            }
            Category.countDocuments({is_active:true},async(err,total:number):Promise<Response>=>{
                return await res.status(200).json({
                    ok:true,
                    categories,
                    total
                });
            });
        });
    }

    postCategory=async(req:Request,res:Response):Promise<any>=>{
        const {name}=req.body;
        const category=new Category({
            name
        });
        category.save(async(err,categoryDB:CategoryI):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!categoryDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`Error en la petición`
                    }
                });
            }
            return await res.status(201).json({
                ok:true,
                category:categoryDB
            })
        });
    }

    deleteCategoryId=async(req:Request,res:Response):Promise<any>=>{
        const {id}=req.params;
        const data:{is_active:boolean}={
            is_active:false
        }
        Category.findByIdAndUpdate(id,data,{new:true,runValidators:true,context:'query'},async(err,categoryDB:CategoryI | null):Promise<Response>=>{
            if(err){
                return await res.status(500).json({
                    ok:false,
                    err
                });
            }
            if(!categoryDB){
                return await res.status(400).json({
                    ok:false,
                    err:{
                        message:`No existe una categoría con el id : ${id}`
                    }
                });
            }
            return res.status(202).json({
                ok:true,
                category:categoryDB
            });
        });
    }


}

export{
    CategoryController
}