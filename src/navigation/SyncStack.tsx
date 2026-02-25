import { StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerData from '../screens/sync/CustomerData';
import DealerData from '../screens/sync/DealerData';
import Sync from '../screens/sync/Sync';
import SyncReports from '../screens/sync/SyncReports';

const Stack = createStackNavigator();

const SyncStack = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sync" component={Sync} />
      <Stack.Screen name="CustomerData" component={CustomerData} />
      <Stack.Screen name="DealerData" component={DealerData} />
      <Stack.Screen name="SyncReports" component={SyncReports} />
    </Stack.Navigator>
  );
};

export default SyncStack;

const styles = StyleSheet.create({});
