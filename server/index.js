require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

//init app
const app = express();
const PORT = process.env.PORT || 5000;

//Dependencies
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

//Routes
const users = require('./routes/api/users'); //Users API
app.use('/api/users', users);
const login = require('./routes/api/login'); //Login API
app.use('/api/login', login);
const token = require('./routes/api/token'); //Token API
app.use('/api/token', token);

//Handle Production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname + '/public/'));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

app.listen(PORT, () => console.log(`Listening to http://localhost:${PORT}`));