import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import { AppFonts } from '../styles/fonts';
import { Timestamp } from 'firebase/firestore';

type ReportType = {
  dateofcall: Timestamp;
  dateencode: Timestamp;
  brcode: string;
  callmemono: string;
  order: string;
  custname: string;
  custcode: string;
  dlrname: string;
  dlrcode: string;
  remarks: string;
  calltype: string;
  sync: string;
};

const formatDate = (value: any) => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (value.toDate) return value.toDate().toLocaleDateString();
  if (value._seconds)
    return new Date(value._seconds * 1000).toLocaleDateString();
  return '—';
};

const CallCards = ({ report }: { report: ReportType }) => {
  const isSynced = report.sync === 'Y';

  return (
    <View style={[
        styles.container,
        isSynced && { backgroundColor: AppColors.lightOrange }, // 👈 change color here
      ]}>
      <View style={[styles.titleView,
        isSynced && { backgroundColor: AppColors.orange }
      ]}>
        <Text style={styles.titleText}>{report.callmemono}</Text>
        <Text style={styles.titleText}>{formatDate(report.dateencode)}</Text>
      </View>
      <View style={styles.callDateView}>
        <Text style={styles.bodyText}>Date of Call</Text>
        <Text style={styles.bodyText}>{formatDate(report.dateofcall)}</Text>
      </View>

      {report.calltype == '1' ? (
        <View style={styles.customerView}>
          <Text numberOfLines={1} style={styles.bodyText}>
            Customer: {report.custname}{' '}
          </Text>
        </View>
      ) : report.calltype == '2' ? (
        <View style={styles.customerView}>
          <Text numberOfLines={1} style={styles.bodyText}>
            Dealer: {report.dlrname}{' '}
          </Text>
        </View>
      ) : (
        <View style={styles.customerView}>
          <Text numberOfLines={1} style={styles.bodyText}>
            Others:{' '}
          </Text>
        </View>
      )}

      <View style={styles.customerView}>
        <Text numberOfLines={2} style={styles.bodyText}>
          Remarks: {report.remarks}{' '}
        </Text>
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
    flexDirection: 'row',
    backgroundColor: AppColors.mediumSeaGreen,
    width: '100%',
    height: vs(20),
    justifyContent: 'space-between',
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
    fontWeight: '500',
    color: AppColors.black,
  },
});
