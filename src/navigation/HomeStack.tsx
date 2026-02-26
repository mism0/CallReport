import { StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Calls from '../screens/home/Calls';
import BottomTabs from './BottomTabs';
import AddCalls from '../screens/home/AddCalls';
import EditCalls from '../screens/home/EditCalls';
import Home from '../screens/home/Home';

const Stack = createStackNavigator();

const HomeStack = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="BottomTabs" component={BottomTabs} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Calls" component={Calls} />
      <Stack.Screen name="AddCalls" component={AddCalls}/>
      <Stack.Screen name="EditCalls" component={EditCalls}/>
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
