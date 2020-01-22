import {Request,Response, NextFunction} from 'express';
import path from 'path';
import multer from 'multer';
import uuid from 'uuid/v4';
//ojo si lo guarda en el js no en el ts
const storage=multer.diskStorage({
    destination:path.join(__dirname,'../uploads'),
    filename:(req:Request,file:Express.Multer.File,cb)=>{
        cb(null,uuid()+ path.extname(file.originalname).toLowerCase())
    }
});
const fileFilter =(req:Request,file:Express.Multer.File,cb:Function)=>{
    const filetypes:RegExp=/jpg|png|jpeg|gif/;
    const mimetype:boolean=filetypes.test(file.mimetype);
    const extname:boolean=filetypes.test(path.extname(file.originalname).toLowerCase());
    if(mimetype&&extname){
        return cb(null,true);
    }
    cb({
        ok:false,
        err:{
            message: `Solo se aceptan estos formatos : ${filetypes}`
        }
    }, false);
}
const limits={
    fileSize:1000000
}
const dest=path.join(__dirname,'../uploads');
const obj={
    dest,
    limits,
    storage,
    fileFilter
}

const upload=multer(obj).single('image');

const fileUpload = async(req:Request, res:Response,next:NextFunction):Promise<any> => {
    upload(req, res, function (error) {
        if (error) { //instanceof multer.MulterError
           // console.log(error);
            if (error.code == 'LIMIT_FILE_SIZE') {
                error.message = 'File Size is too large. Allowed file size is 1M';
                error.success = false;
                return res.status(400).json({
                    ok:false,
                    err:error
                });  
            }
            return res.status(400).json(error);
        } else {
            /* if (!req.file) {
                res.status(500);
                res.json({
                    ok:false,
                    err:{
                        message:'File not found'
                    }
                });
            } */
            next();
        }
    });
};


export{
    fileUpload
}
