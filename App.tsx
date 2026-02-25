import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainAppStack from './src/navigation/MainAppStack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import FlashMessage from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AuthStack from './src/navigation/AuthStack';
import BottomTabs from './src/navigation/BottomTabs';

const App = () => {
  // auth().onAuthStateChanged(user => {
  //   console.log('🔥 GLOBAL AUTH STATE:', user);  
  // });

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
      console.log('🔥 GLOBAL AUTH STATE:', u);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    // Show a splash/loading screen while checking auth
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            {/* {user ? <MainAppStack /> : <AuthStack />} */}
             {user ? <BottomTabs /> : <AuthStack />}
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
      <FlashMessage position="top" />
    </>
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
