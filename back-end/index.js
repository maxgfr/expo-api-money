const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const ApiMoney = require('./lib/api-money');
const app = express();
const port = 3000;
const client = new ApiMoney({
  secret_key: process.env.SECRET_KEY,
  access_key: process.env.ACCESS_KEY,
  mode: process.env.MODE,
  version: 1
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({success: true});
})

app.post('/createAccount', (req, res, next) => {
  client.request('POST', '/accounts/standard', {
    subscriber: {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      birthdate: req.body.birthdate,
      birth_country: req.body.birth_country,
      birth_city: req.body.birth_city,
      nationality: req.body.nationality,
      citizen_us: req.body.citizen_us,
      fiscal_us: req.body.fiscal_us,
      fiscal_out_france: req.body.fiscal_out_france
    },
    address: {
        label1: req.body.label1,
        zip_code: req.body.zip_code,
        city: req.body.city,
        country: req.body.country
    },
    email: req.body.email,
  })
  .then((response) => {
    res.json({url: response})
  })
  .catch((error) => {
    res.json({err: error});
  });
});

app.listen(port, () => console.log(`The application is listening on port ${port}!`))
