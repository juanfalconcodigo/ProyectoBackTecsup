import   { Schema,model,Model,Document} from "mongoose";
import { UserI } from "./user";
const publicationSchema=new Schema({
    description:{
        type:String,
        required:[true,'La descripción es necesaria'],
        minlength:[30,'Es necesario 30 carácteres como mínimo']
    },
    cellphone:{
        type:String,
        required:[true,'El número de teléfono es necesario'],
        minlength:[7,'Es necesario tener 7 carácteres como mínimo']
    },
    date:{
        type:Date,
        required:false,
        default:Date.now
    },
    is_active:{
        type:Boolean,
        required:false,
        default:true
    },
    photo_url:{
        type:String,
        required:true,
        lowercase:true,
    },
    photo_public_id:{
        type:String,
        required:true,
        lowercase:true
    },
    likes: {
        type: Number,
        default: 0,
        required:false,
        min:[0,'El valor mínimo de likes es 0']
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }
});

interface PublicationI extends Document{
    description:string;
    cellphone:string;
    date:Date;
    is_active:boolean;
    photo_url:string;
    photo_public_id:string;
    likes:number;
    user:UserI;
}

const Publication:Model<PublicationI>=  model<PublicationI>('Publication',publicationSchema);

export{
    Publication,
    PublicationI
}