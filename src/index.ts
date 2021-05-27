import express, { Request, Response } from "express";
import UUID from "uuid-int";
import Transaction from "./classes/transaction";
import User from "./classes/user";
import { IUser } from "./interface/IUser";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//Rotas
app.get("/", (request: Request, response: Response) => {
  return response.send("Pagina Principal");
});

const id = 0;

const usersArray: Array<User> = []; //Cria nome User's' Users

//POST users
app.post("/users", (request: Request, response: Response) => {
  //localhost:3333/users
  // {
  //     "name": "Joao",
  //     "cpf":"00-00",
  //     "email":"ha@ha.com",
  //     "age": 15
  // }

  //uuid - unit
  const generator = UUID(id);
  const uuid = generator.uuid();

  const { name, cpf, email, age }: IUser = request.body;

  const user = new User(uuid, name, cpf, email, age);

  const existe = usersArray.find((f) => {
    return f.cpf === cpf;
  });

  if (existe) {
    return response.status(400).json("CPF já Cadastrado");
  }

  usersArray.push(user);
  console.log(user);
  return response.status(200).json("Cadastrado com sucesso");
});

//GET /users/:id
app.get("/users/:id", (request: Request, response: Response) => {
  //http://localhost:3333/users/:id"
  let { id }: { id?: string } = request.params;

  const idInt: number = parseInt(id);

  const user = usersArray.find((f) => f.id === idInt);

  if (!user) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  //Arrumar a ordem transacions por ultimo
  const resposta1 = response.json({
    user,
  });
  return response.status(200).json(resposta1);
});

//GET /users
app.get("/users", cors(), (request: Request, response: Response) => {
  //localhost:3333/users
  //console.log(usersArray);

  return response.json({
    usersArray
  });
});

// Atualizar um registro específico -- Insominia PUT
app.put("/users/:id", (request: Request, response: Response) => {
  const { id }: { id?: string } = request.params;
  const {
    name,
    cpf,
    email,
    age,
  }: { name: string; cpf: string; email: string; age: number } = request.body;

  const idInt: number = parseInt(id);
  // encontrar o registro que queremos alterar
  const user = usersArray.find((f) => {
    return f.id === idInt;
  });

  if (!user) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  user.name = name;
  user.cpf = cpf;
  user.email = email;
  user.age = age;

  return response.status(200).json(user);
});

// Excluir um user a partir de um ID
app.delete("/users/:id", (request: Request, response: Response) => {
  const { id }: { id?: string } = request.params;

  const idInt: number = parseInt(id);

  const indice = usersArray.findIndex((f) => {
    return f.id === idInt;
  });

  if (indice === -1) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  const user = usersArray.splice(indice, 1);

  return response.status(200).json(user);
});

//POST /user/:userId/transactions
app.post(
  "/user/:userId/transactions",
  cors(),
  (request: Request, response: Response) => {
    const { userId }: { userId?: string } = request.params;
    // {
    //   "title":"Salario",
    //   "value":10000,
    //   "type": "income",
    // }

    const {
      title,
      value,
      type,
    }: { title: string; value: number; type: string } = request.body;

    const idInt: number = parseInt(userId);
    const typeLowerCase = type.toLowerCase();

    if (typeLowerCase !== "income") {
      if (typeLowerCase !== "outcome") {
        return response.status(404).json({
          msg: "Pode apenas dois tipos Income and Outcome",
        });
      }
    }

    // encontrar o registro que queremos alterar
    const user = usersArray.find((f) => {
      return f.id === idInt;
    });

    if (!user) {
      return response.status(404).json({
        msg: "User not found",
      });
    }

    user.transactions.push(new Transaction(title, value, typeLowerCase));

    return response.status(200).json(user);
  }
);

//GET /user/:userId/transactions/:id
app.get(
  "/user/:userId/transactions/:id",
  (request: Request, response: Response) => {
    const { userId, id }: { userId?: string; id?: string } = request.params;

    const userIdInt: number = parseInt(userId);
    const idInt: number = parseInt(id);

    // encontrar o registro que queremos alterar
    const indiceUser = usersArray.findIndex((f) => {
      return f.id === userIdInt;
    });

    const transactions = usersArray[indiceUser].transactions.find(
      (f) => f.id === idInt
    );

    if (!transactions) {
      return response.status(404).json({
        msg: "Transactions not found",
      });
    }

    return response.status(200).json(transactions);
  }
);

//GET /user/:userId/transactions
app.get(
  "/user/:userId/transactions",
  (request: Request, response: Response) => {
    const { userId }: { userId?: string } = request.params;

    const userIdInt: number = parseInt(userId);

    // encontrar o registro
    const indiceUser = usersArray.findIndex((f) => {
      return f.id === userIdInt;
    });

    if (indiceUser === -1) {
      return response.status(404).json({
        msg: "User not found",
      });
    }

    const transactions = usersArray[indiceUser].transactions;

    if (!transactions) {
      return response.status(404).json({
        msg: "Transactions not found",
      });
    }

    let total: number = 0;
    let totalIncome: number = 0;
    let totalOutcome: number = 0;

    transactions.forEach(({ value, type }: { value: number; type: string }) => {
      switch (type) {
        case "income":
          totalIncome += value;
          break;
        case "outcome":
          totalOutcome += value;
          break;
      }
      total = totalIncome - totalOutcome;
    });

    const dados = response.json({
      transactions,
      balance: {
        income: totalIncome,
        outcome: totalOutcome,
        total: total,
      },
    });

    return response.status(200).json(dados);
  }
);

//PUT /user/:userId/transactions/:id
app.put(
  "/user/:userId/transactions/:id",
  (request: Request, response: Response) => {
    const { userId, id }: { userId?: string; id?: string } = request.params;

    // {
    //   "title":"SalarioEditado",
    //   "value":10000,
    //   "type": "income",
    // }

    const userIdInt: number = parseInt(userId);
    const idInt: number = parseInt(id);

    const {
      title,
      value,
      type,
    }: { title: string; value: number; type: string } = request.body;

    const typeLowerCase = type.toLowerCase();

    if (typeLowerCase !== "income") {
      if (typeLowerCase !== "outcome") {
        return response.status(404).json({
          msg: "Pode apenas dois tipos Income and Outcome",
        });
      }
    }

    // encontrar o registro que queremos alterar
    const indiceUser = usersArray.findIndex((f) => {
      return f.id === userIdInt;
    });

    const transactions = usersArray[indiceUser].transactions.find(
      (f) => f.id === idInt
    );

    if (!transactions) {
      return response.status(404).json({
        msg: "Transactions not found",
      });
    }

    transactions.title = title;
    transactions.value = value;
    transactions.type = typeLowerCase;

    return response.status(200).json(transactions);
  }
);

//DELETE /user/:userId/transactions/:id
app.delete(
  "/user/:userId/transactions/:id",
  (request: Request, response: Response) => {
    const { userId, id }: { userId?: string; id?: string } = request.params;

    const userIdInt: number = parseInt(userId);
    const idInt: number = parseInt(id);

    const {
      title,
      value,
      type,
    }: { title: string; value: number; type: string } = request.body;

    const typeLowerCase = type.toLowerCase();

    if (typeLowerCase !== "income") {
      if (typeLowerCase !== "outcome") {
        return response.status(404).json({
          msg: "Pode apenas dois tipos Income and Outcome",
        });
      }
    }

    // encontrar o Index que queremos alterar
    const indiceUser = usersArray.findIndex((f) => {
      return f.id === userIdInt;
    });

    const userTransactions = usersArray[indiceUser].transactions;

    const transactionIndex = userTransactions.findIndex(
      (item: any) => item.id === idInt
    );

    if (transactionIndex === -1) {
      return response.status(404).json({
        msg: "Transactions not found",
      });
    }

    const transaction = userTransactions.splice(transactionIndex, 1);

    return response.status(200).json(transaction);
  }
);

app.listen(process.env.PORT || 3000);
