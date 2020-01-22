import { Schema, Model, model, Document } from 'mongoose';
import { PublicationI } from './publication';
import {UserI} from './user';

const commentSchema=new Schema({
    commentary:{
        type:String,
        required:[true,'Es necesario ingresar el comentario']
    },
    date:{
        type:Date,
        required:false,
        default:Date.now
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    publication:{
        type:Schema.Types.ObjectId,
        ref:'Publication',
        required:true
    }
});

interface CommentI extends Document{
    commentary:string;
    date:Date;
    user:UserI;
    publication:PublicationI;
}

const Comment:Model<CommentI>=model<CommentI>('Commet',commentSchema);

export{
    Comment,
    CommentI
}

