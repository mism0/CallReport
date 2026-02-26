import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import { AppColors } from '../../components/styles/colors';
import { AppFonts } from '../../components/styles/fonts';
import { s } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const Sync = () => {
  const navigation = useNavigation();
  return (
    <AppSafeViews>
      <View style={styles.headerContainer}>
        {/* Go to CustomerData.tsx screen */}
        <TouchableOpacity onPress={() => navigation.navigate('CustomerData')}>
          <View style={styles.actionsContainer}>
            <View style={styles.addBox}>
              {/* <MaterialIcon name="post-add" size={30} color={AppColors.green} /> */}
              <Text style={styles.addBoxText}>Update Customer Data</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('DealerData')}>
          <View style={styles.actionsContainer}>
            <View style={styles.addBox}>
              {/* <MaterialIcon name="post-add" size={30} color={AppColors.green} /> */}
              <Text style={styles.addBoxText}>Update Dealer Data</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SyncReports')}>
          <View style={styles.actionsContainer}>
            <View style={styles.addBox}>
              {/* <MaterialIcon name="post-add" size={30} color={AppColors.green} /> */}
              <Text style={styles.addBoxText}>Sync Call Reports</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </AppSafeViews>
  );
};

export default Sync;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.lightCream,
    borderRadius: 30,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 100,
    justifyContent: 'center',
    alignContent: 'center',
  },
  headerContainerText: {
    fontFamily: AppFonts.Noto,
    fontSize: s(12),
    color: AppColors.medGray,
  },
  reportContainer: {
    flexDirection: 'row',
    justifyContent: 'center', //'space-between',
    alignItems: 'center',
  },
  firstReportContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 40,
    backgroundColor: AppColors.white,
  },
  secondReportContainer: { justifyContent: 'center', alignItems: 'center' },
  secondReportText: {
    fontFamily: AppFonts.Medium,
    fontSize: s(8),
    fontWeight: 'bold',
    color: AppColors.yellow,
    paddingTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  addBox: {
    flex: 1,
    width: 50,
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.orange,
    marginHorizontal: 5,
    height: 100,
    backgroundColor: AppColors.lightOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addBoxIcon: {
    fontSize: 30,
    color: AppColors.green,
    fontWeight: 'bold',
  },
  addBoxText: {
    fontSize: 16,
    color: AppColors.black,
    fontWeight: 'bold',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 10,
  },
});
