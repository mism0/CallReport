import { StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Calls from '../screens/home/Calls';
import BottomTabs from './BottomTabs';
import AddCalls from '../screens/home/AddCalls';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="Calls" component={Calls} />
      <Stack.Screen name="AddCalls" component={AddCalls} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
