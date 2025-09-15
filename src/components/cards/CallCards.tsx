import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import { AppFonts } from '../styles/fonts';

type ReportType = {
  date: string;
  order: string;
  customer: string;
  remarks: string;
  type: string;
  // Add other fields as needed, e.g. customer, remarks, etc.
};

const CallCards = ({ report }: { report: ReportType }) => {

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>{report.date}</Text>
      </View>
      <View style={styles.callDateView}>
        <Text style={styles.bodyText}>Date of Call</Text>
        <Text style={styles.bodyText}>{report.order}</Text>
      </View>

      {report.type == 'Customer' ? <View style={styles.customerView}>
        <Text numberOfLines={1} style={styles.bodyText}>Customer: {report.customer} </Text>
      </View> : <View style={styles.customerView}>
        <Text numberOfLines={1} style={styles.bodyText}>Dealer: {report.customer} </Text>
      </View>}


      <View style={styles.customerView}>
        <Text numberOfLines={2} style={styles.bodyText}>Remarks: {report.remarks} </Text>
      </View>
    </View>
  );
};

export default CallCards;

const styles = StyleSheet.create({
  container: {
    height: vs(100),
    marginTop: vs(10),
    alignItems: 'center',
    backgroundColor: AppColors.lighterSeaGreen,
    borderRadius: s(15),
    marginHorizontal: s(10),
  },
  titleView: {
    alignItems: 'flex-end',
    backgroundColor: AppColors.mediumSeaGreen,
    width: '100%',
    height: vs(20),
    justifyContent: 'center',
    paddingHorizontal: s(10),
    borderTopEndRadius: s(15),
    borderTopStartRadius: s(15),
  },
  titleText: {
    fontSize: s(14),
    fontWeight: 'bold',
    fontFamily: AppFonts.Noto,
    color: AppColors.black,

  },
  callDateView: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: s(10),
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  customerView: {
    width: '100%',
    paddingHorizontal: s(10),
  },
  bodyText: {
    fontFamily: AppFonts.Noto,
    fontSize: s(12),
    fontWeight: "500",
    color: AppColors.black,

  },
});
