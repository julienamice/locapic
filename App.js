import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './mapscreen';
import ChatScreen from './chatscreen';
import HomeScreen from './homescreen';
import idReducer from './user.reducer';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

const store = createStore(combineReducers({ idReducer }));

const TabNavigator = createBottomTabNavigator({
  Map: MapScreen,
  Chat: ChatScreen,
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      var iconName;
      if (navigation.state.routeName == 'Map') {
        iconName = 'ios-compass';
      } else if (navigation.state.routeName == 'Chat') {
        iconName = 'ios-chatboxes';
      }
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'green',
    inactiveTintColor: 'gray',
  }
});

var StackNavigator = createStackNavigator({
  Home: { screen: HomeScreen, navigationOptions: () => ({ header: null }) },
  Tab: TabNavigator
});

var AppStack = createAppContainer(StackNavigator)

function App() {
  return (
    <Provider store={store}>
      <AppStack />
    </Provider>
  )
}
export default App
