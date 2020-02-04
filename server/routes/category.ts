import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

class CategoryRouter{
    router:Router;
    categoryController:CategoryController=new CategoryController();
    constructor(){
        this.router=Router();
        this.routes();
    }
    routes(){
        this.router.route('/list').get(this.categoryController.getCategory);
        this.router.route('/create').post(this.categoryController.postCategory);
        this.router.route('/delete/:id').delete(this.categoryController.deleteCategoryId);
    }

}
export{
    CategoryRouter
}