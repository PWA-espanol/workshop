function createExpenseElement(expense) {
    const element = document.createElement('li');
    element.className = 'list-group-item expense';
    element.innerHTML = `<a href="/expense/${expense.id}">${expense.name}
                            <span class="total">${getExpenseTotal(expense)}</span>
                        </a>`;

    return element;    
}

function updateHomeView() {
    const expensesListElement = document.querySelector('#expenses-list');
    const expenseElements = expensesListElement.querySelectorAll('.expense');

    getExpenses(expenses => {
        expenseElements.forEach(e => {
            expensesListElement.removeChild(e);
        });

        expenses.forEach(expense => {
            expensesListElement.appendChild(createExpenseElement(expense));
        });
    
        const totalField = expensesListElement.querySelector('.total-row .total');
        totalField.innerHTML = getTotal(expenses);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateHomeView();

    const addBtn = document.querySelector('#add');
    addBtn.addEventListener('mousedown', () => {
        const newExpense = createNewExpense();
        saveExpense(newExpense, () => {
            updateHomeView(); 
        });
     });


    const deleteBtn = document.querySelector('#delete');
    deleteBtn.addEventListener('mousedown', () => {
        deleteExpenses(() => {
            updateHomeView(); 
        });
    });
}, false);
