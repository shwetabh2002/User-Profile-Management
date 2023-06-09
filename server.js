const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');


const app= express();

mongoose.connect('CONNECTION_STRING', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(9000, () => {
      console.log('Server started on port 9000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', routes);

module.exports = app;
