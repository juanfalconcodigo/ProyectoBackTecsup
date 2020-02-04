import {Router} from 'express';
import { PublicationController } from '../controllers/publication.controller';
import { verificaToken,verificaRolAdmin} from '../middlewares/authentication';
import { fileUpload } from '../middlewares/multer';
class PublicationRouter{
    router:Router;
    publicationController:PublicationController=new PublicationController();
    constructor(){
        this.router=Router();
        this.routes();
    }

    routes(){

        this.router.route('/list').get(verificaToken,this.publicationController.getPublication);
        this.router.route('/list/:id').get(verificaToken,this.publicationController.getPublicationId);
        this.router.route('/create').post([verificaToken,fileUpload],this.publicationController.postPublication);
        this.router.route('/delete/:id').delete(verificaToken,this.publicationController.deletePublicationId);
        this.router.route('/put/:id').put(verificaToken,this.publicationController.putPublicationId);
        this.router.route('/put/photo/:id').put([verificaToken,fileUpload],this.publicationController.putPublicationIdPhoto);
        this.router.route('/list/user/:id').get(verificaToken,this.publicationController.getPublicationUserId);
        this.router.route('/put/:id/like/:type').put(verificaToken,this.publicationController.putIdLike);
        
    }

}

export{
    PublicationRouter
}