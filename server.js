const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;


app.use(bodyParser.json());


const readData = () => JSON.parse(fs.readFileSync('./users.json', 'utf8'));


const writeData = (data) => fs.writeFileSync('./users.json', JSON.stringify(data, null, 2));


app.get('/', (req, res) => {
  res.send('Welcome to the REST API for managing user details!');
});


app.get('/users', (req, res) => {
  const data = readData();
  res.json(data);
});


app.get('/users/:id', (req, res) => {
  const data = readData();
  const user = data.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});


app.post('/users', (req, res) => {
  const data = readData();
  const newUser = {
    id: data.length + 1,
    companyName: req.body.companyName,
    employees: req.body.employees,
    positions: req.body.positions,
    location: req.body.location,
  };
  data.push(newUser);
  writeData(data);
  res.status(201).json(newUser);
});


app.put('/users/:id', (req, res) => {
  const data = readData();
  const userIndex = data.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send('User not found');
  data[userIndex] = { ...data[userIndex], ...req.body };
  writeData(data);
  res.json(data[userIndex]);
});


app.delete('/users/:id', (req, res) => {
  const data = readData();
  const updatedData = data.filter((u) => u.id !== parseInt(req.params.id));
  if (data.length === updatedData.length) return res.status(404).send('User not found');
  writeData(updatedData);
  res.send('User deleted');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
