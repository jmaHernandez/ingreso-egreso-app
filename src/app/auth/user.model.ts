interface DataObj {
    uid: string;
    email: string;
}

export class User {
    public uid: string;
    public email: string;
    
    constructor(obj: DataObj) {
        this.uid = obj && obj.uid || null;
        this.email = obj && obj.email || null;
    }
}