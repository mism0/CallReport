import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../styles/colors';
import { IS_Android } from '../../constants/constants';

interface AppSafeViewsProps {
  children: React.ReactNode;
  style?: object;
}

const AppSafeViews = ({ children, style }: AppSafeViewsProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default AppSafeViews;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.white,

    // paddingTop: IS_Android ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
  },
});
