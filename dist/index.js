"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersArray = void 0;
var express_1 = __importDefault(require("express"));
var transaction_1 = __importDefault(require("./classes/transaction"));
var user_1 = __importDefault(require("./classes/user"));
var cors_1 = __importDefault(require("cors"));
var md_validar_1 = require("./middlewares/md-validar");
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", function (request, response) {
    return response.send("Pagina Principal");
});
exports.usersArray = [];
app.post("/users", md_validar_1.validarNome, md_validar_1.validarCpf, md_validar_1.validarEmail, md_validar_1.validarAge, function (request, response) {
    var _a = request.body, name = _a.name, cpf = _a.cpf, email = _a.email, age = _a.age;
    var user = new user_1.default(name, cpf, email, age);
    exports.usersArray.push(user);
    console.log(user);
    return response.status(200).json("Cadastrado com sucesso");
});
app.get("/users/:userId", md_validar_1.validarUser, function (request, response) {
    var userId = request.params.userId;
    var idInt = parseInt(userId);
    var user = exports.usersArray.find(function (f) { return f.id === idInt; });
    var resposta1 = response.json({
        user: user,
    });
    return response.status(200).json(resposta1);
});
app.get("/users", function (request, response) {
    return response.json({
        User: exports.usersArray,
    });
});
app.put("/users/:userId", md_validar_1.validarUser, function (request, response) {
    var userId = request.params.userId;
    var _a = request.body, name = _a.name, cpf = _a.cpf, email = _a.email, age = _a.age;
    var idInt = parseInt(userId);
    var user = exports.usersArray.find(function (f) {
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
app.delete("/users/:userId", md_validar_1.validarUser, function (request, response) {
    var userId = request.params.userId;
    var idInt = parseInt(userId);
    var indice = exports.usersArray.findIndex(function (f) {
        return f.id === idInt;
    });
    var user = exports.usersArray.splice(indice, 1);
    return response.status(200).json(user);
});
app.post("/user/:userId/transactions", md_validar_1.validarUser, function (request, response) {
    var userId = request.params.userId;
    var _a = request.body, title = _a.title, value = _a.value, type = _a.type;
    var idInt = parseInt(userId);
    var typeLowerCase = type.toLowerCase().trim();
    if (typeLowerCase !== "income") {
        if (typeLowerCase !== "outcome") {
            return response.status(404).json({
                msg: "Pode apenas dois tipos Income and Outcome",
            });
        }
    }
    var user = exports.usersArray.find(function (f) {
        return f.id === idInt;
    });
    if (!user) {
        return response.status(404).json({
            msg: "User not found",
        });
    }
    user.transactions.push(new transaction_1.default(title, value, typeLowerCase));
    return response.status(200).json(user);
});
app.get("/user/:userId/transactions/:id", md_validar_1.validarUser, md_validar_1.validarTransactions, function (request, response) {
    var _a = request.params, userId = _a.userId, id = _a.id;
    var userIdInt = parseInt(userId);
    var idInt = parseInt(id);
    var indiceUser = exports.usersArray.findIndex(function (f) {
        return f.id === userIdInt;
    });
    var transactions = exports.usersArray[indiceUser].transactions.find(function (f) { return f.id === idInt; });
    return response.status(200).json(transactions);
});
app.get("/user/:userId/transactions", md_validar_1.validarUser, function (request, response) {
    var userId = request.params.userId;
    var userIdInt = parseInt(userId);
    var indiceUser = exports.usersArray.findIndex(function (f) {
        return f.id === userIdInt;
    });
    var transactions = exports.usersArray[indiceUser].transactions;
    var total = 0;
    var totalIncome = 0;
    var totalOutcome = 0;
    transactions.forEach(function (_a) {
        var value = _a.value, type = _a.type;
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
    var dados = response.json({
        transactions: transactions,
        balance: {
            income: totalIncome,
            outcome: totalOutcome,
            total: total,
        },
    });
    return response.status(200).json(dados);
});
app.put("/user/:userId/transactions/:id", md_validar_1.validarUser, md_validar_1.validarTransactions, function (request, response) {
    var _a = request.params, userId = _a.userId, id = _a.id;
    var userIdInt = parseInt(userId);
    var idInt = parseInt(id);
    var _b = request.body, title = _b.title, value = _b.value, type = _b.type;
    var typeLowerCase = type.toLowerCase();
    if (typeLowerCase !== "income") {
        if (typeLowerCase !== "outcome") {
            return response.status(404).json({
                msg: "Pode apenas dois tipos Income and Outcome",
            });
        }
    }
    var indiceUser = exports.usersArray.findIndex(function (f) {
        return f.id === userIdInt;
    });
    var transactions = exports.usersArray[indiceUser].transactions.find(function (f) { return f.id === idInt; });
    if (!transactions) {
        return response.status(404).json({
            msg: "Transactions not found",
        });
    }
    transactions.title = title;
    transactions.value = value;
    transactions.type = typeLowerCase;
    return response.status(200).json(transactions);
});
app.delete("/user/:userId/transactions/:id", md_validar_1.validarUser, md_validar_1.validarTransactions, function (request, response) {
    var _a = request.params, userId = _a.userId, id = _a.id;
    var userIdInt = parseInt(userId);
    var idInt = parseInt(id);
    var indiceUser = exports.usersArray.findIndex(function (f) {
        return f.id === userIdInt;
    });
    var userTransactions = exports.usersArray[indiceUser].transactions;
    var transactionIndex = userTransactions.findIndex(function (item) { return item.id === idInt; });
    if (transactionIndex === -1) {
        return response.status(404).json({
            msg: "Transactions not found",
        });
    }
    var transaction = userTransactions.splice(transactionIndex, 1);
    return response.status(200).json(transaction);
});
app.listen(process.env.PORT || 3000);
