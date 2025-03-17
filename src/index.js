/**
 * @fileoverview Entry point for the Three Point Estimation App.
 */
import "./i18n";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./styles.css";
import Navbar from "./common/Navbar";
import AppContainer from "./common/AppContainer";
import SharedStateLoader from "./common/SharedStateLoader";
import { store, persistor } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <>
        <Navbar />
        <SharedStateLoader />
        <AppContainer />
      </>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
