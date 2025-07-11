import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainAppStack from './src/navigation/MainAppStack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store'; // Ensure this path is correct
const App = () => {
  return (
    // <Provider store={}>
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainAppStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
    // </Provider>
  );
};

export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   text: {
//     fontSize: 40,
//     textAlign: 'center',
//     margin: 10,
//   },
// });
