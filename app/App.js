/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import App from "./navigation";
import { store, persistor } from "@store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';

import { setDefaultLanguage, setDefaultTranslations } from 'react-multi-lang'
import en from '@translations/en.json'
import ma from '@translations/ma.json'
import ne from '@translations/ne.json'

setDefaultTranslations({ma, en, ne})
setDefaultLanguage('en')

export default class index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
};