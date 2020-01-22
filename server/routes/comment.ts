import { Router } from 'express';
import { verificaToken,verificaRolAdmin} from '../middlewares/authentication';
import { CommentController } from '../controllers/comment.controller';

class CommetRouter{
    router:Router;
    commentController:CommentController=new CommentController();

    constructor(){
        this.router=Router();
        this.routes();

    }

    routes(){

        this.router.route('/list').get(verificaToken,this.commentController.getComment);
        this.router.route('/list/:id').get(verificaToken,this.commentController.getCommentId);
        this.router.route('/list/publication/:id').get(verificaToken,this.commentController.getCommentPublicationId);
        this.router.route('/create').post(verificaToken,this.commentController.postComment);
        this.router.route('/delete/:id').delete(verificaToken,this.commentController.deleteCommentId);
        this.router.route('/put/:id').put(verificaToken,this.commentController.putCommentId);

    }

}

export{
    CommetRouter
}