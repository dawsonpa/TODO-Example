/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { StoreProvider } from "../context/TodoListStoreContext";
import TodoListStore from '../stores/TodoListStore'
import NavigationContainer from '../navigation/NavigationContainer'
import {Provider as PaperProvider, Surface} from 'react-native-paper'
import theme from '../theme/theme'

const App = () => {
  const todoListStore = new TodoListStore();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <StoreProvider value={todoListStore}>
          <PaperProvider theme={theme}>
            <Surface style={{flex: 1}}>
              <NavigationContainer/>
            </Surface>
          </PaperProvider>
        </StoreProvider>
      </SafeAreaView>
    </>
  );
};

export default App;
