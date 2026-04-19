const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', require('./routes/userRoutes')); //sends to userRoutes if /user
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

module.exports = app;