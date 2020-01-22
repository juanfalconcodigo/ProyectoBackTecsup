class UserChat{
    public id:string;
    public _id:string;
    public first_name:string;
    public photo_url:string;
    public role:string;

    constructor(id:string){
        this.id=id;
        this._id='sin-id-mongo';
        this.first_name='sin-nombre';
        this.photo_url='sin-photo';
        this.role='sin-rol';
    }

}
export{
    UserChat
}