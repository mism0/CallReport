import { StyleSheet, TextInput, TextStyle, View } from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';

interface AppTextInputProps {
  onChangeText?: (text: string) => void;
  placeholder: string;

  value: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  style?: TextStyle;
  editable?: boolean;
  onFocus?: () => void;
  numberOfLines?: number;
  maxLength?: number;
  multiline?: boolean;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  style,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  numberOfLines,
  editable,
  onFocus,
  maxLength,
  multiline,
}) => {

  return (
    <View>
      <TextInput
        style={[styles.placeholder, style]}
        placeholder={placeholder}

        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        onFocus={onFocus}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        multiline={multiline}

      />
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  placeholder: {
    height: vs(40),
    borderColor: AppColors.borderColor,
    borderWidth: s(1),
    borderRadius: s(15),
    paddingHorizontal: s(10),
    fontSize: s(12),
    marginTop: vs(10),
  },
});
