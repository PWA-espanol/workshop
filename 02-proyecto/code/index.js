const Repository = require('./repository');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/expense', function (req, res) {
  console.log(`---- GET ('/api/expense/')`);

  res.json(Repository.getExpenses());
});

app.get('/api/expense/:id', function (req, res) {
  console.log(`---- GET ('/api/expense/${req.params.id}')`);

  const id = parseInt(req.params.id, 10);
  res.json(Repository.getExpense(id));
});

app.delete('/api/expense', function (req, res) {
    console.log(`---- DELETE ('/api/expense')`);
    Repository.deleteExpenses();
    return res.json(Repository.getExpenses());
  });

app.post('/api/expense/:id', function (req, res) {
  console.log(`---- POST ('/api/expense/${req.params.id}')
---- ---- Body: ${JSON.stringify(req.body)}`);

  const expense = req.body;
  if (!expense.id) {
    expense.id = req.params.id;
  }

  Repository.saveExpense(expense);
  return res.json(Repository.getExpenses());
});

app.post('/api/expense/', function (req, res) {
  console.log(`---- POST ('/api/expense/')
----Body: ${JSON.stringify(req.body)}`);

  Repository.saveExpense(req.body);
  return res.json(Repository.getExpenses());
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/expense/:id', function (req, res) {
  if (!req.params.id) {
    res.redirect('/');
  }

  res.sendFile(__dirname + '/public/expense.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
