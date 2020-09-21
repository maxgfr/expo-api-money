const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const {
  v4: uuidv4
} = require("uuid");
const {
  ApiMoney
} = require("api-money-node-sdk");
const app = express();
const port = 4321;
const client = new ApiMoney({
  secretKey: process.env.SECRET_KEY,
  accessKey: process.env.ACCESS_KEY,
  mode: process.env.MODE,
  version: 1,
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '10mb',
  })
); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({
  extended: true,
  limit: '10mb',
})); // parse application/json
app.use(cors());

app.get("/", (req, res, next) => {
  res.json({
    success: true,
  });
});

app.post("/createAccount", (req, res, next) => {
  client
    .request("POST", "/accounts/standard", {
      subscriber: {
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        birthdate: req.body.birthdate,
        birth_country: req.body.birth_country,
        birth_city: req.body.birth_city,
        nationality: req.body.nationality,
        citizen_us: req.body.citizen_us,
        fiscal_us: req.body.fiscal_us,
        fiscal_out_france: req.body.fiscal_out_france,
      },
      address: {
        label1: req.body.label1,
        zip_code: req.body.zip_code,
        city: req.body.city,
        country: req.body.country,
      },
      email: req.body.email,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});


app.post("/createBusinessAccount", (req, res, next) => {
  client
    .request("POST", "/accounts/business", {
      name: req.body.name,
      business_type: req.body.business_type,
      email: req.body.email,
      registration_number: req.body.registration_number,
      phone_number: req.body.phone_number,
      representative: {
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        birthdate: req.body.birthdate,
        nationality: req.body.nationality,
      },
      address: {
        label1: req.body.label1,
        zip_code: req.body.zip_code,
        city: req.body.city,
        country: req.body.country,
      },
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.get("/getAccounts", (req, res, next) => {
  client
    .request("GET", "/accounts", {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getAccount", (req, res, next) => {
  client
    .request("GET", "/accounts/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/createWallet", (req, res, next) => {
  client
    .request("POST", "/wallets/", {
      account_id: req.body.account_id,
      type: req.body.type,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getWallet", (req, res, next) => {
  client
    .request("GET", "/wallets/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getWalletBalance", (req, res, next) => {
  client
    .request("GET", "/wallets/" + req.body.id + "/balance", {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getWalletActivities", (req, res, next) => {
  client
    .request(
      "GET",
      `/wallets/${req.body.id}/activities/?per_page=${req.body.per_page}&page=${req.body.page}`, {}
    )
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getWalletActivity", (req, res, next) => {
  client
    .request(
      "GET",
      "/wallets/" + req.body.id + "/activities/" + req.body.activity_id, {}
    )
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/addDocument", (req, res, next) => {
  client
    .request("POST", "/accounts/" + req.body.account_id + "/documents", {
      type: req.body.type,
      files: req.body.files,
      // files: [{
      //   file_name: req.body.file_name,
      //   content: req.body.content
      // }]
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getDocument", (req, res, next) => {
  client
    .request(
      "GET",
      "/accounts/" + req.body.account_id + "/documents/" + req.body.document_id, {}
    )
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/askKyc", (req, res, next) => {
  client
    .request(
      "PUT",
      "/accounts/" +
      req.body.account_id +
      "/validations/" +
      req.body.kyc_level +
      "/submit", {}
    )
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getLastKyc", (req, res, next) => {
  client
    .request(
      "GET",
      "/accounts/" + req.body.account_id + "/validations/last", {}
    )
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getTransaction", (req, res, next) => {
  client
    .request("GET", "/transactions/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/refundTransaction", (req, res, next) => {
  client
    .request("PUT", "/transactions/" + req.body.id + "/refund", {
      amount: req.body.amount,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/confirmTransaction", (req, res, next) => {
  client
    .request("PUT", "/cash-in/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/receiptTransaction", (req, res, next) => {
  client
    .request(
      "GET",
      "/transactions/" + req.body.id + "/receipt/" + req.body.language, {}
    )
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/partnerTransaction", (req, res, next) => {
  client
    .request("GET", "/transactions/reference/" + req.body.partner_ref, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/transfers", (req, res, next) => {
  client
    .request("POST", "/transfers", {
      partner_ref: req.body.partner_ref,
      sender_wallet_id: req.body.sender_wallet_id,
      receiver_wallet_id: req.body.receiver_wallet_id,
      amount: req.body.amount,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/card", (req, res, next) => {
  client
    .request("POST", "/cash-in/creditcards/init", {
      partner_ref: req.body.partner_ref,
      receiver_wallet_id: req.body.receiver_wallet_id,
      fees_wallet_id: req.body.fees_wallet_id,
      amount: req.body.amount,
      fees: req.body.fees,
      return_url: req.body.return_url,
      lang: req.body.lang,
      auth_timeout_delay: 86400,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/transfers-with-card", (req, res, next) => {
  client
    .request("POST", "/cash-in/creditcards/" + req.body.card_id, {
      partner_ref: req.body.partner_ref,
      payment_method: "CREDIT_CARD",
      receiver_wallet_id: req.body.receiver_wallet_id,
      fees_wallet_id: req.body.fees_wallet_id,
      amount: req.body.amount,
      fees: req.body.fees,
      return_url: req.body.return_url,
      lang: req.body.lang,
      auth_timeout_delay: 86400,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/authorize-bank-transfer", (req, res, next) => {
  client
    .request("POST", "/cash-in/bankwire/authorize", {
      partner_ref: req.body.partner_ref,
      receiver_wallet_id: req.body.receiver_wallet_id,
      fees_wallet_id: req.body.fees_wallet_id,
      amount: req.body.amount,
      fees: req.body.fees,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/cash-out", (req, res, next) => {
  client
    .request("POST", "/cash-out", {
      partner_ref: req.body.partner_ref,
      sender_wallet_id: req.body.sender_wallet_id,
      fees_wallet_id: req.body.fees_wallet_id,
      amount: req.body.amount,
      fees: req.body.fees,
      bankaccount_id: req.body.bankaccount_id,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/createBankAccount", (req, res, next) => {
  client
    .request("POST", "/bankaccounts", {
      account_id: req.body.account_id,
      number: req.body.number,
      holder_name: req.body.holder_name,
    })
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getBankAccount", (req, res, next) => {
  client
    .request("GET", "/bankaccounts/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/deleteBankAccount", (req, res, next) => {
  client
    .request("DELETE", "/bankaccounts/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/listCreditCard", (req, res, next) => {
  client
    .request("GET", "/creditcards/?account_id=" + req.body.account_id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/getCreditCard", (req, res, next) => {
  client
    .request("GET", "/creditcards/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.post("/deleteCreditCard", (req, res, next) => {
  client
    .request("DELETE", "/creditcards/" + req.body.id, {})
    .then(response => {
      res.json({
        url: response,
      });
    })
    .catch(error => {
      res.json({
        err: error,
      });
    });
});

app.listen(port, () =>
  console.log(`The application is listening on port ${port}!`)
);