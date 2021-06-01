"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_int_1 = __importDefault(require("uuid-int"));
var id = 0;
var generator = uuid_int_1.default(id);
var uuid = generator.uuid();
var Transaction = (function () {
    function Transaction(title, value, type) {
        this.id = 0;
        this.title = title;
        this.value = value;
        this.type = type;
    }
    return Transaction;
}());
exports.default = Transaction;
