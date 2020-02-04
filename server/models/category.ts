import {Schema,Model,model,Document} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const categorySchema=new Schema({
    name:{
        type:String,
        required:[true,'El nombre de categoría es requerido'],
        unique:true
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
    }
});

categorySchema.plugin(uniqueValidator,{message:`{PATH} debe ser único`});

interface CategoryI extends Document{
    name:string,
    date:Date;
    is_active:boolean;
}

const Category:Model<CategoryI>=model<CategoryI>('Category',categorySchema);

export{
    Category,
    CategoryI
}