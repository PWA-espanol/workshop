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

if (navigator.serviceWorker) {
    window.addEventListener('message', event => { // non-standard Chrome behaviour
        if (event.origin && event.origin !== location.origin) return;
        onServiceWorkerMessage(event.data);
    });
    navigator.serviceWorker.addEventListener("message", event => onServiceWorkerMessage(event.data));
}

function onServiceWorkerMessage(message) {
    if (message.action === 'updateHome') {
        updateHomeView();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateHomeView();

    const addBtn = document.querySelector('#add');
    addBtn.addEventListener('mousedown', () => {
        const newExpense = createNewExpense();
        saveExpense(newExpense, () => {
            updateHomeView();
            displayNotification("Nuevo gasto!", "Tu nuevo gasto fue guardado con éxito!");
        });
     });


    const deleteBtn = document.querySelector('#delete');
    deleteBtn.addEventListener('mousedown', () => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(function(reg) {
                return reg.sync.register('delete-expenses');
            }).catch(function() {
                // No se pudo registrar el pedido de sincro,
                // puede ser una restricción del sistema operativo
                deleteExpenses(() => {
                    updateHomeView(); 
                });
            });
        } else {
            // serviceworker/sync no soportado
            deleteExpenses(() => {
                updateHomeView(); 
            });
        }
    });
}, false);