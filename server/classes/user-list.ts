import { UserChat } from "./user-chat";

class UserListChat{
    userList:UserChat[]=[];

    constructor(){}

    addUser(user:UserChat){
        this.userList.push(user);
        console.log(this.userList);
        return user;
    }

    updateData(id:string,_id:string,first_name:string,photo_url:string,role:string){
        for(let user of this.userList){
            if(user.id===id){
                user._id=_id;
                user.first_name=first_name;
                user.photo_url=photo_url;
                user.role=role;
                break;
            }
        }
        console.log('======Actualizando usuario======');
        console.log(this.userList);
    }

    getListUser(){
        return this.userList.filter(user=>user._id!=='sin-id-mongo');
    }

    getUser(id:string){
        return this.userList.find(user=>user.id===id);
    }

    deleteUser(id:string){
        const tempUser=this.getUser(id);
        this.userList=this.userList.filter(user=>user.id!==id)
        console.log(tempUser);
        return this.userList
    }


}

export{
    UserListChat
}