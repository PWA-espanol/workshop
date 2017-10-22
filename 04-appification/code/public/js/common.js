const serverUrl = 'http://localhost:3000/';
function apiClient(url, options) {
    options = options || {};
    if (!('fetch' in window)) {
        // Real fetch polyfill: https://github.com/github/fetch
        return new Promise( (resolve, reject) => {
            let request = new XMLHttpRequest();
            
            request.open(options.method || 'get', url);
            request.setRequestHeader('Content-type', 'application/json');

            request.onload = () => {
                resolve(response());
            };

            request.onerror = reject;

            request.send(options.body);

            function response() {
                return {
                    ok: (request.status/200|0) == 1,		// 200-299
                    status: request.status,
                    statusText: request.statusText,
                    url: request.responseURL,
                    clone: response,
                    text: () => Promise.resolve(request.responseText),
                    json: () => Promise.resolve(request.responseText).then(JSON.parse),
                    blob: () => Promise.resolve(new Blob([request.response]))
                };
            };
        });
    }

    return fetch(url, options);
}

function saveExpense(expense, cb) {
    apiClient(`${serverUrl}api/expense/${expense.id || ''}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => response.json())
    .then(cb);
}

function deleteExpenses(cb) {
    apiClient(`${serverUrl}api/expense`, { method: 'DELETE' })
        .then(response => response.json())
        .then(cb)
        .catch(() => alert("Error deleting expenses"));
}

function getExpenses(cb) {
    apiClient(`${serverUrl}api/expense`)
        .then(response => response.json())
        .then(cb);
}

function getExpense(expenseId, cb) {
    apiClient(`${serverUrl}api/expense/${expenseId}`)
        .then(response => response.json())
        .then(cb);
}

function createNewExpense() {
    return {
        name: 'Nombre',
        details: []
    };
}

function getExpenseTotal(expense) {
    let total = 0;
    if (expense && expense.details) {
        expense.details.forEach( item => {
            total += item.cost;
        });
    }

    return total;
}

function getTotal(expenses) {
    let total = 0;
    expenses.forEach( expense => {
        total += getExpenseTotal(expense);
    });

    return total;
}

function share(title) {
    const url = window.location.href;    
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url), '_blank');
}