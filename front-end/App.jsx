import React, { useReducer } from "react";
import { ScrollView, Text, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import JSONTree from "react-native-json-tree";
import ServerConnector from "./lib/server";

const getCountryISO3 = require("./lib/country-iso-2-to-3");

const makeId = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const formatDate = date => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

const initialState = {
  json: {},
  id: "",
  other_id: "",
  wallet_id: "",
  other_wallet_id: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ID":
      return {
        ...state,
        id: action.value,
      };
    case "SET_OTHER_ID":
      return {
        ...state,
        other_id: action.value,
      };
    case "SET_WALLET_ID":
      return {
        ...state,
        wallet_id: action.value,
      };
    case "SET_OTHER_WALLET_ID":
      return {
        ...state,
        other_wallet_id: action.value,
      };
    case "SET_JSON":
      return {
        ...state,
        json: action.value,
      };
    default:
      throw new Error();
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  _onCreateCustomer = async isOther => {
    let response = await fetch(`https://randomuser.me/api?nat=gb,fr,de`);
    let data = await response.json();
    let fiscal_out_france = false;
    let fiscal_us = false;
    let citizen_us = false;
    let iso = getCountryISO3(data.results[0].nat);
    if (iso != "FRA") {
      fiscal_out_france = true;
    }
    if (iso == "USA") {
      fiscal_us = true;
      citizen_us = true;
    }
    ServerConnector.getInstance()
      .sendToServer("createAccount", {
        lastname: data.results[0].name.last,
        firstname: data.results[0].name.first,
        birthdate: formatDate(data.results[0].dob.date),
        birth_country: iso,
        birth_city: data.results[0].location.city,
        nationality: iso,
        citizen_us: citizen_us,
        fiscal_us: fiscal_us,
        fiscal_out_france: fiscal_out_france,
        label1:
          data.results[0].location.street.number +
          " " +
          data.results[0].location.street.name,
        zip_code: data.results[0].location.postcode,
        city: data.results[0].location.city,
        country: iso,
        email: makeId(5) + "@sinaps.io",
      })
      .then(res => {
        if (res && res.url) {
          if (isOther) {
            dispatch({ type: "SET_OTHER_ID", value: res.url.id });
          } else {
            dispatch({ type: "SET_ID", value: res.url.id });
          }
        }
        dispatch({ type: "SET_JSON", value: res });
      })
      .catch(err => {
        console.log(err);
      });
  };

  _onCreateWallet = (id, isOther) => {
    ServerConnector.getInstance()
      .sendToServer("createWallet", {
        account_id: id,
        type: "EMONEY",
      })
      .then(res => {
        if (res && res.url) {
          if (isOther) {
            dispatch({ type: "SET_OTHER_WALLET_ID", value: res.url.id });
          } else {
            dispatch({ type: "SET_WALLET_ID", value: res.url.id });
          }
        }
        dispatch({ type: "SET_JSON", value: res });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="auto" />

      <Button
        onPress={() => {
          _onCreateCustomer(false);
        }}
        title="1.1 Create customer 1"
      />
      <Text>{state.id}</Text>

      <Button
        onPress={() => {
          _onCreateCustomer(true);
        }}
        title="1.2 Create customer 2"
      />
      <Text>{state.other_id}</Text>

      <Button
        onPress={() => {
          _onCreateWallet(state.id, false);
        }}
        title="2.1 Attach a wallet to customer 1"
      />
      <Text>{state.wallet_id}</Text>

      <Button
        onPress={() => {
          _onCreateWallet(state.other_id, true);
        }}
        title="2.1 Attach a wallet to customer 2"
      />
      <Text>{state.other_wallet_id}</Text>

      <JSONTree data={state.json} />
    </ScrollView>
  );
}
