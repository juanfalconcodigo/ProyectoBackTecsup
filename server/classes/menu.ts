class Menu{

    readonly menu:MenuI[]=[];
    
    constructor(){
        this.menu=[
            {
            title:'Cambiar password',
            icon:'fas fa-wrench',
            path:'user/edit/password'
          }
        ]
    }

    getMenu(role:string):MenuI[]{
        if(role==='USER_ADMIN'){
            return this.getMenuAdmin();
        }
      return this.menu;
    }

    getMenuAdmin():MenuI[]{
        return [
            {
              title:'Cambiar password',
              icon:'fas fa-wrench',
              path:'user/edit/password'
            },
            {
              title:'Enviar mensaje',
              icon:'fas fa-envelope-square',
              path:'user/admin'
            }
        ];
    }

}

export{
    Menu
}

interface MenuI{
    title:string;
    icon:string;
    path:string;
}