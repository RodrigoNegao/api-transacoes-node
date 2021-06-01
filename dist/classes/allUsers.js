"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = void 0;
var data_1 = require("../data");
var allUsers = (function () {
    function allUsers() {
    }
    allUsers.prototype.findUser = function (id) {
        var user = data_1.usersArray.find(function (f) { return f.id === id; });
        if (!user) {
            return;
        }
        return user;
    };
    allUsers.prototype.finIdTransaction = function (userId, transId) {
        var findTransition = this.findUser(userId);
        findTransition.transactions.find(function (f) { return f.id === transId; });
        return findTransition;
    };
    return allUsers;
}());
exports.allUsers = allUsers;
