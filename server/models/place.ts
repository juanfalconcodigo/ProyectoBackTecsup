import {Schema,Model,model,Document} from 'mongoose';
import { UserI } from './user';

const placeSchema=new Schema({
    name:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    lng:{
        type:Number,
        required:[true,'La longitud  es requerida']
    },
    lat:{
        type:Number,
        required:[true,'La latitud  es requerida']
    },
    color:{
        type:String,
        required:[true,'El color  es requerido']
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

});

interface PlaceI extends Document{
    name:string;
    lng:number;
    lat:number;
    color:string;
    user:UserI;
}

const Place:Model<PlaceI>=model<PlaceI>('Place',placeSchema);

export{
    Place,PlaceI
}