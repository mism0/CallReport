import { StyleSheet, Text, TextProps,TextStyle, View } from 'react-native'
import React, {FC} from 'react'
import { s } from 'react-native-size-matters'
import { AppColors } from '../styles/colors'
import { AppFonts } from '../styles/fonts'


interface AppTextProps extends TextProps{
  children?: React.ReactNode;
  variant: 'bold' | 'medium';
  style?: TextStyle | TextStyle[];// For additional props like onPress, etc.
}

const AppText: FC<AppTextProps> = ({children,variant, style, ...rest}) => {
  return (
    <View>
      <Text {...rest} style={[styles[variant],style]}>{children}</Text>
    </View>
  )
}

export default AppText

const styles = StyleSheet.create({
    bold:{
        fontSize: s(16),
        color: AppColors.black,
        fontFamily: AppFonts.Bold,
    },
    medium:{
        fontSize: s(16),
        color: AppColors.black,
        fontFamily: AppFonts.Medium,
    },

})