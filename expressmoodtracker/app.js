const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv').config({ path: './config.env' });
const router = require('./routes/myroutes');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(process.env.PORT, (err) => {
    if (err) return console.log(err);

    console.log(`Express listening on port ${process.env.PORT}`);
});