import {Router} from 'express';
import { verificaToken } from '../middlewares/authentication';
import { PlaceController } from '../controllers/place.controller';

class PlaceRouter{
    router:Router;
    placeController:PlaceController=new PlaceController();

    constructor(){
        this.router=Router();
        this.routes();
    }
    routes(){

        this.router.route('/list').get(verificaToken,this.placeController.getPlace);
        this.router.route('/list/user/:id').get(verificaToken,this.placeController.getPlaceUserId);
        this.router.route('/create').post(verificaToken,this.placeController.postPlace);
        this.router.route('/delete/:id').delete(verificaToken,this.placeController.deletePlaceId);
        
    }

}

export{
    PlaceRouter
}