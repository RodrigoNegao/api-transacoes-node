"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_int_1 = __importDefault(require("uuid-int"));
var id = 0;
var generator = uuid_int_1.default(id);
var uuid = generator.uuid();
var User = (function () {
    function User(name, cpf, email, age) {
        this.id = uuid;
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.age = age;
        this.transactions = [];
    }
    return User;
}());
exports.default = User;
