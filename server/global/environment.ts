//configuración del puerto
const SERVER_PORT:number=Number(process.env.PORT)||5000;

//conexión con mongo atlas

const PROCESS_ENV_NODE:string=process.env.NODE_ENV||"dev";
let URL_DB:string;
if(PROCESS_ENV_NODE==="dev"){
    URL_DB='mongodb://localhost:27017/papago';
}else{
    URL_DB=String(process.env.MONGO_URI);
}

//conexión con cloudinary
const CLOUDINARY_CLOUD_NAME:string=process.env.CLOUDINARY_CLOUD_NAME || 'dbxg3ojl8';
const CLOUDINARY_API_KEY:string=process.env.CLOUDINARY_API_KEY || '736914682311471'
const CLOUDINARY_API_SECRET:string=process.env.CLOUDINARY_API_SECRET || '4R-TT-lVpJrO5G4qySTT7EdZB2w';

//configuración de jwt
const SEED:string=process.env.SEED || 'SEED-DEV';
const CADUCIDAD_TOKEN:string='1h';
export{
    SERVER_PORT,
    URL_DB,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    SEED,
    CADUCIDAD_TOKEN
}
