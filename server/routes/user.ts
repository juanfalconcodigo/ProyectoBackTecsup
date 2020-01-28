import {Router} from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { fileUpload } from '../middlewares/multer';
import { verificaToken,verificaRolAdmin} from '../middlewares/authentication';


class UserRouter{
    router:Router;
    userController:UserController=new UserController();
    authController:AuthController=new AuthController();
    constructor(){
        this.router=Router();
        this.routes();
    }
    routes(){
        this.router.route('/login').post(this.authController.postLogin);
        this.router.route('/list').get(verificaToken,this.userController.getUsuario);
        this.router.route('/list/:id').get(verificaToken,this.userController.getUsuarioId);
        this.router.route('/create').post(fileUpload,this.userController.postUsuario);    
        this.router.route('/delete/:id').delete(verificaToken,this.userController.deleteUserId);
        this.router.route('/put/:id').put(verificaToken,this.userController.putUserId);
        this.router.route('/put/password/:id').put(verificaToken,this.userController.putUserIdPassword);
        this.router.route('/put/photo/:id').put([verificaToken,fileUpload],this.userController.putUserIdPhoto);
    }
}

export{
    UserRouter
}