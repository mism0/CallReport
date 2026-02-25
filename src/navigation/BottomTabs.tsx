import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import Profile from '../screens/profile/Profile';
import Sync from '../screens/sync/Sync';
import { AppColors } from '../components/styles/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SyncStack from './SyncStack';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const HomeTabBarIcon = ({ color }: { color: string }) => <MaterialIcon name="home" size={30} color={color} />;
const SyncTabBarIcon = ({ color }: { color: string }) => <MaterialIcon name="sync" size={30} color={color} />;
const ProfileTabBarIcon = ({ color }: { color: string }) => <MaterialIcon name="person" size={30} color={color} />;

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: AppColors.orange,
        tabBarInactiveTintColor: AppColors.disabledGray,
        tabBarStyle: {
          backgroundColor: AppColors.white,
          height: 80,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen options={{ title: 'Home', tabBarIcon: HomeTabBarIcon }} name="Home" component={HomeStack} />
      <Tab.Screen options={{ title: 'Sync', tabBarIcon: SyncTabBarIcon }} name="Sync" component={SyncStack} />
      <Tab.Screen options={{ title: 'Profile', tabBarIcon: ProfileTabBarIcon }} name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
