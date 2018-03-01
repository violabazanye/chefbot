import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import MainScreen from './MainScreen';
import ListScreen from './ListScreen';

const App = DrawerNavigator({
  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
      drawerLabel: 'Home',
    },
  },
  ListScreen: {
    screen: ListScreen,
    navigationOptions: {
      drawerLabel: 'Shopping List',
    },
  },
});

export default App;
