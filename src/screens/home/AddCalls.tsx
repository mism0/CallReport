import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import AppTextInput from '../../components/inputs/AppTextInput';
import { AppColors } from '../../components/styles/colors';
import AppButtons from '../../components/buttons/AppButtons';

const AddCalls = () => {
  return (
    <AppSafeViews>
      {/* <HomeHeaders /> */}


      <View style={styles.container}>
        <View style={styles.box}>
          {/* <Text style={styles.label}>Date of call</Text> */}
          <AppTextInput placeholder="Date Of Call" />
          {/* <Text style={styles.label}>Call Type</Text> */}
          <AppTextInput placeholder="Call Type" />
          {/* <Text style={styles.label}>Order Type</Text> */}
          <AppTextInput placeholder="Order Type" />
          {/* <Text style={styles.label}>Customer / Dealer</Text> */}
          <AppTextInput placeholder="Customer / Dealer" />
          <AppTextInput placeholder='Remarks'/>
        </View>

        <View style={styles.buttonContainer}>
            <AppButtons title={"Submit"}/>
        </View>
      </View>
    </AppSafeViews>
  );
};

export default AddCalls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    backgroundColor: AppColors.white,
    borderRadius: 30,
    margin: 20,
    padding: 20,
    elevation: 5,
    width: '90%',
  },
  buttonContainer:{
    marginTop: 20,
    width: '90%',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 20,
  },
  label:{
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal:10,
    marginTop: 10,
  },
});
