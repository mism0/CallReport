import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { s } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import { AppFonts } from '../styles/fonts';

type AppButtonsProps = {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
};

const AppButtons: React.FC<AppButtonsProps> = ({
  title = 'Submit',
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={[styles.button, disabled && styles.disabledButton]}>
        <Text
          style={{
            color: AppColors.white,
            fontFamily: AppFonts.Bold,
            fontSize: s(14),
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppButtons;

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.green,
    padding: s(10),
    height: s(40),
    borderRadius: s(25),
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    elevation: 3, // Add shadow for Android
  },
  disabledButton: {
    backgroundColor: AppColors.disabledGray,
    elevation: 0,
  },
});
