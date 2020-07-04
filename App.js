/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';

import Phonebook from './components/Phonebook';

const App = () => {
  return (
    <PaperProvider>
      <Phonebook /> 
    </PaperProvider>
  );
};

export default App;
