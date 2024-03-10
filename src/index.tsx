
import React from "react";
// import { Web3Provider } from "@ethersproject/providers";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import store from "./store";
import Web3 from "web3";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Contracts } from "./web3";
import "antd/dist/antd.min.css";
import 'animate.css';
// import Vconsole from "vconsole";

// new Vconsole({ maxLogNumber: 5000 });
function getLibrary(provider: any): Web3 {
  const library = new Web3(provider);
  new Contracts(provider);
  return library;
}
ReactDOM.render(
  <React.StrictMode>
    {/* @ts-ignore  */}
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Web3ReactProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
