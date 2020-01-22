import { Schema,model,Model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
let valoresValidos:{values:String[],message:String}={
    values:['USER_NORMAL','USER_ADMIN','SYSTEM'],
    message:'{VALUE} no es un rol permitido'
}
const userSchema=new Schema({
    first_name:{
        type:String,
        required:[true,'El nombre es necesario']
    },
    last_name:{
        type:String,
        required:[true,'El apellido es necesario']
    },
    email:{
        type:String,
        required:[true,'El email es necesario'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'La contraseña es necesaria'],
        minlength:[6,'Es necesario tener mínimo 6 carácteres']
    },
    role:{
        type:String,
        required:false,
        uppercase:true,
        default:'USER_NORMAL',
        enum:valoresValidos
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
    }
});

userSchema.plugin(uniqueValidator,{message:`{PATH} debe ser único`});

userSchema.methods.toJSON=function(){
    let user=this;
    let userObject=user.toObject();
    delete userObject.password;
    return userObject;
}


interface UserI extends Document{
    first_name:string;
    last_name:string;
    email:string;
    password:string;
    role:string;
    is_active:boolean;
    photo_url:string;
    photo_public_id:string;
}

const User:Model<UserI>= model<UserI>('User',userSchema);

export{
    User,
    UserI
}

