const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get("/", (req, res) => {
    res.json({ message: "Bloodee's NodeJS" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('This NodeJS Server run at port: ' + PORT);
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
