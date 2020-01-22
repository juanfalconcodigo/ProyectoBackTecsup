import   { Schema,model,Model,Document} from "mongoose";
import { UserI } from "./user";
const publicationSchema=new Schema({
    description:{
        type:String,
        required:[true,'La descripción es necesaria'],
        minlength:[30,'Es necesario 30 carácteres como mínimo']
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
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

interface PublicationI extends Document{
    description:string;
    date:Date;
    is_active:boolean;
    photo_url:string;
    photo_public_id:string;
    user:UserI;
}

const Publication:Model<PublicationI>=  model<PublicationI>('Publication',publicationSchema);

export{
    Publication,
    PublicationI
}