const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const {
  v4: uuidv4
} = require('uuid');
const ApiMoney = require('api-money-node-sdk');
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
app.use(bodyParser.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({
    success: true
  });
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
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.get('/getAccounts', (req, res, next) => {
  client.request('GET', '/accounts', {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/getAccount', (req, res, next) => {
  client.request('GET', '/accounts/' + req.body.id, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/createWallet', (req, res, next) => {
  client.request('POST', '/wallets/', {
      account_id: req.body.account_id,
      type: req.body.type
    })
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.post('/getWallet', (req, res, next) => {
  client.request('GET', '/wallets/' + req.body.id, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.post('/getWalletBalance', (req, res, next) => {
  client.request('GET', '/wallets/' + req.body.id + "/balance", {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.post('/getWalletActivity', (req, res, next) => {
  client.request('GET', '/wallets/' + req.body.id + "/activities/" + req.body.activity_id, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/createBankAccount', (req, res, next) => {
  client.request('POST', '/bankaccounts/', {
      account_id: req.body.account_id,
      number: req.body.number,
      bic: req.body.number,
      holder_name: req.body.holder_name,
      file_content: req.body.file_content,
    })
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.post('/getBankAccount', (req, res, next) => {
  client.request('GET', '/bankaccounts/' + req.body.id, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/addDocument', (req, res, next) => {
  client.request('POST', '/accounts/' + req.body.account_id + '/documents', {
      type: req.body.type,
      files: [{
        file_name: req.body.file_name,
        content: req.body.content
      }]
    })
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/getDocument', (req, res, next) => {
  client.request('GET', '/accounts/' + req.body.account_id + '/documents/' + req.body.document_id, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/askKyc', (req, res, next) => {
  client.request('PUT', '/accounts/' + req.body.account_id + '/validations/' + req.body.kyc_level + '/submit', {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/getLastKyc', (req, res, next) => {
  client.request('GET', '/accounts/' + req.body.account_id + '/validations/last', {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.post('/getTransaction', (req, res, next) => {
  client.request('GET', '/transactions/' + req.body.id, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.post('/refundTransaction', (req, res, next) => {
  client.request('PUT', '/transactions/' + req.body.id + '/refund', {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});


app.get('/receiptTransaction', (req, res, next) => {
  client.request('GET', '/transactions/' + req.body.id + '/receipt' + req.body.language, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.get('/partnerTransaction', (req, res, next) => {
  client.request('GET', '/transactions/partner_ref/' + req.body.partner_ref, {})
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});

app.post('/transfers', (req, res, next) => {
  client.request('POST', '/transfers', {
      partner_ref: req.body.partner_ref,
      sender_wallet_id: req.body.sender_wallet_id,
      receiver_wallet_id: req.body.receiver_wallet_id,
      amount: req.body.amount,
    })
    .then((response) => {
      res.json({
        url: response
      })
    })
    .catch((error) => {
      res.json({
        err: error.response.data
      });
    });
});





app.listen(port, () => console.log(`The application is listening on port ${port}!`))