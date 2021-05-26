class Transaction{
    public id:number = Date.now();
    public title:string;
    public value:number;
    public type:string;
    constructor(title:string,value:number,type:string){
        this.title = title;
        this.value = value;
        this.type = type;
    }
}

export default Transaction;