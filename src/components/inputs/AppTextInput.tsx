import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import { AppColors } from '../styles/colors';

interface AppTextInputProps {
  placeholder: string;
  secureTextEntry?:boolean;
}

const AppTextInput: React.FC<AppTextInputProps> = ({ placeholder,secureTextEntry }) => {
  return (
    <View>
      <TextInput
        style={styles.placeholder}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

export default AppTextInput

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
})