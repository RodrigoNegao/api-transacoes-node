import Transaction from "./transaction";

class User {
  public id: number;
  public name: string;
  public cpf: string;
  public email: string;
  public age: number;
  public transactions : Transaction[] = []; 

  constructor(
    id: number,
    name: string,
    cpf: string,
    email: string,
    age: number,
  ) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.age = age;
    //this.transactions = transactions;
  }
}

export default User;