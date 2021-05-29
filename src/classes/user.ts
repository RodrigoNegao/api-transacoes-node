import Transaction from "./transaction";
import UUID from "uuid-int";

const id = 0;
const generator = UUID(id);
const uuid = generator.uuid();

class User {
  public id: number = uuid;
  public name: string;
  public cpf: string;
  public email: string;
  public age: number;
  public transactions : Transaction[] = []; 

  constructor(
    //id: number,
    name: string,
    cpf: string,
    email: string,
    age: number,
  ) {
    //this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.age = age;
    //this.transactions = transactions;
  }
}

export default User;