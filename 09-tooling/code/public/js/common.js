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
                    ok: (request.status/200|0) == 1,        // 200-299
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
        .catch(() => caches.match(`${serverUrl}api/expense`))
        .then(response => response.json())
        .then(cb);
}

function getExpense(expenseId, cb) {
    apiClient(`${serverUrl}api/expense/${expenseId}`)
        .catch(() => caches.match(`${serverUrl}api/expense/${expenseId}`))
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
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url), '_blank');
    }
}

let swRegistration;

function displayNotification(title, body) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            swRegistration = reg;
            swRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                    if (Notification.permission === 'granted') {
                        createNotification(title, body);
                    } else {
                        if (Notification.permission !== 'denied') {
                            subscribeUser().then(function (subscription) {
                                if (Notification.permission === "granted") {
                                    createNotification(title, body);
                                }
                            })
                        }
                    }
                });
        });
    }
}

function createNotification(title, body) {
    const options = {
        body: body,
        icon: 'img/logo-512.png',
        vibrate: [100, 50, 100]
    };
    swRegistration.showNotification(title, options);
}

const VAPID_VALID_PUBLIC_KEY = "Reemplazar por la public key del paso anterior";
function subscribeUser() {
    return swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_VALID_PUBLIC_KEY)
    })
}
