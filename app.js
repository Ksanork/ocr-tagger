const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render("main"));

app.listen(3000, () => console.log('Example app listening on port 3000'));
