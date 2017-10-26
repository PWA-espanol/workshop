const serverUrl = 'http://localhost:3000/';
function apiClient(url, options, success, error) {
  options = options || {};
  let request = new XMLHttpRequest();

  request.open(options.method || 'get', url);
  request.setRequestHeader('Content-type', 'application/json');

  request.onload = () => {
      if (request.status == 200 &&
        request.getResponseHeader('Content-Type').indexOf('application/json') !== -1) {
        const responseObj = JSON.parse(request.response);
        if (success) {
          success(responseObj);
        }
      } else {
        throw new TypeError();
      }
    };

  request.onerror = error;

  request.send(options.body);
}

function saveExpense(expense, cb) {
  apiClient(`${serverUrl}api/expense/${expense.id || ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    }, cb);
}

function deleteExpenses(cb) {
  try {
    apiClient(`${serverUrl}api/expense`, { method: 'DELETE' }, cb);
  } catch (error) {
    alert('Error deleting expenses');
  }
}

function getExpenses(cb) {
  apiClient(`${serverUrl}api/expense`, {}, cb);
}

function getExpense(expenseId, cb) {
  apiClient(`${serverUrl}api/expense/${expenseId}`, {}, cb);
}

function createNewExpense() {
  return {
      name: 'Nombre',
      details: [],
    };
}

function getExpenseTotal(expense) {
  let total = 0;
  if (expense && expense.details) {
    expense.details.forEach(item => {
        total += item.cost;
      });
  }

  return total;
}

function getTotal(expenses) {
  let total = 0;
  expenses.forEach(expense => {
      total += getExpenseTotal(expense);
    });

  return total;
}

function share(title) {
  const url = window.location.href;
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) +
    '&url=' + encodeURIComponent(url), '_blank');
}
