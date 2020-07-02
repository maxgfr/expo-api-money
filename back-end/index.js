const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({success: true});
})

app.post('/createAccount', (req, res, next) => {
  res.json({
    id: uuidv4(),
    details: {
      email: req.body.email,
      individualDetails: {
        name: {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }
      },
      address: {
        country: req.body.country
      }
    }
  })
});

app.listen(port, () => console.log(`The application is listening on port ${port}!`))
