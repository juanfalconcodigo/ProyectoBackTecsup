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
        this.router.route('/list/:id').get(this.userController.getUsuarioId);
        this.router.route('/create').post([verificaToken,fileUpload],this.userController.postUsuario);    
        this.router.route('/delete/:id').delete(this.userController.deleteUserId);
        this.router.route('/put/:id').put(this.userController.putUserId);
        this.router.route('/put/photo/:id').put([verificaToken,fileUpload],this.userController.putUserIdPhoto);
    }
}

export{
    UserRouter
}