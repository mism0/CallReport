import { StyleSheet} from 'react-native'
import React from 'react'
import HomeHeaders from '../../components/headers/HomeHeaders'
import AppSafeViews from '../../components/views/AppSafeViews'

const Profile = () => {
  return (
    <AppSafeViews>
      <HomeHeaders/>
    </AppSafeViews>
  )
}

export default Profile

const styles = StyleSheet.create({})