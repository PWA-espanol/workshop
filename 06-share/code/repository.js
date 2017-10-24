'use strict';

var expensesStorage = [{
        id: 1,
        name: "Super",
        details: [
            { name: "Gaseosas", cost: 10 },
            { name: "Galletas", cost: 20 },
            { name: "Pan", cost: 5 },
        ]
    }, {
        id: 2,
        name: "Viaje",
        details: [
            { name: "Tren", cost: 10 },
            { name: "Colectivo", cost: 5 }
        ]
    }],
    Repository = {};

Repository.getExpenses = function () {
    return expensesStorage;
};

Repository.getExpense = function (id) {
    const result = expensesStorage.filter( expense => expense.id === id);
    return ((result && result.length > 0) ? result[0] : undefined);
};

Repository.deleteExpenses = function () {
    expensesStorage = [];
};

Repository.saveExpense = function (expense) {
    if (expense.id) {
        for (let index = 0; index < expensesStorage.length; index++) {
            let element = expensesStorage[index];
            if (element.id === expense.id) {
                element.name = expense.name || '';
                element.details = expense.details || [];
                return;
            }
        }
    } else {
        const maxId = expensesStorage.length ? Math.max(...expensesStorage.map(o => o.id )) : 0;
        expense.id = maxId + 1;
    }

    expensesStorage.push(expense);
};

module.exports = Repository;