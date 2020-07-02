const BASE_URL="http://localhost:3000/";

export default class ServerConnector {

    static myInstance = null;

    /**
    * @returns {ServerConnector}
    */
    static getInstance() {
        if (ServerConnector.myInstance == null) {
            ServerConnector.myInstance = new ServerConnector();
        }
        return this.myInstance;
    }

    sendToServer(type, data) {
      return new Promise((resolve, reject) => {
        fetch(BASE_URL+type, {
          body: JSON.stringify(data),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }
}
