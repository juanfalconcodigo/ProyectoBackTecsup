import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { verificaToken,verificaRolAdmin} from '../middlewares/authentication';

class CategoryRouter{
    router:Router;
    categoryController:CategoryController=new CategoryController();
    constructor(){
        this.router=Router();
        this.routes();
    }
    routes(){
        this.router.route('/list').get(verificaToken,this.categoryController.getCategory);
        this.router.route('/create').post(verificaToken,this.categoryController.postCategory);
        this.router.route('/delete/:id').delete(verificaToken,this.categoryController.deleteCategoryId);
    }

}
export{
    CategoryRouter
}