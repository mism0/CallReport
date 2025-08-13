import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import { AppColors } from '../../components/styles/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CallCards from '../../components/cards/CallCards';
import { products } from '../../data/products';
import { s } from 'react-native-size-matters';
import { AppFonts } from '../../components/styles/fonts';
import BarChart from '../../components/charts/BarChart';
import { useNavigation } from '@react-navigation/native';
import HomeHeaders from '../../components/headers/HomeHeaders';
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from '@react-native-firebase/firestore';
import { auth, db } from '../../components/config/firebaseConfig';
const Home = () => {
  const navigation = useNavigation();
  const sampleData = [
    { label: '3', value: 3, color: 'lightblue' },
    { label: '8', value: 8, color: 'tomato' },
    { label: '4', value: 4, color: 'lightblue' },
    { label: '6', value: 6, color: 'tomato' },
    { label: '2', value: 2, color: 'lightblue' },
    { label: '9', value: 9, color: 'tomato' },
  ];

  const [callReport, setCallReport] = useState<any[]>([]);

  const fetchCallReport = async () => {
    const callReportRef = collection(db, 'call_reports');
    const userId = auth.currentUser?.uid; // Get the current user's ID
    const q = query(callReportRef, where('userId', '==', userId)); // Filter by userId

    const snapshot = await getDocs(q);
    // Include document ID + all fields
    const callReportList = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return callReportList;
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCallReport();
      setCallReport(data);
    };
    loadData();
  }, []);

  // const getCallReportsCount = async () => {
  //   const coll = collection(db, 'call_report');
  //   const snapshot = await getCountFromServer(coll);
  //   console.log('Total call reports:', snapshot.data().count);
  //   return snapshot.data().count.toString();
  // };

  const [callReportCount, setCallReportCount] = useState<number | null>(null);
  useEffect(() => {
    const fetchCallReportsCount = async () => {
      try {
        const userId = auth.currentUser?.uid; // e.g. from auth or props
        const coll = collection(db, 'call_reports');
        const q = query(coll, where('userId', '==', userId)); // Filter by userId

        const snapshot = await getCountFromServer(q);
        setCallReportCount(snapshot.data().count);
      } catch (error) {
        console.error('Failed to fetch call report count:', error);
      }
    };

    fetchCallReportsCount();
  }, []);

  return (
    <AppSafeViews>
      <HomeHeaders />
      <View style={styles.headerContainer}>
        {/*  eslint-disable-next-line react-native/no-inline-styles */}
        <View style={styles.reportContainer}>
          {/* 1st Half of headerContainer */}
          <View style={styles.firstReportContainer}>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontSize: 80,
                fontFamily: 'NotoSans-Light',
                fontWeight: 'bold',
              }}
            >
              {/* {products.length + 29} */}
              {callReportCount !== null ? callReportCount : '...'}
            </Text>
            <Text style={styles.headerContainerText}>
              Call Reports for July
            </Text>
          </View>

          {/* 2nd Half of headerContainer  */}
          <View style={styles.secondReportContainer}>
            {/* <PieChart data={data} radius={50} /> */}
            <BarChart data={sampleData} width={150} height={100} />
            <Text style={styles.secondReportText}>
              Marketing 3 Appraisal 8{'\n'}
              Collection 4 Repossession 6{'\n'}
              Event 3 Insurance 9{'\n'}
            </Text>
          </View>
        </View>
      </View>

      {/* Go to AddCalls.tsx screen */}
      <TouchableOpacity onPress={() => navigation.navigate('AddCalls')}>
        <View style={styles.actionsContainer}>
          <View style={styles.addBox}>
            <MaterialIcon name="post-add" size={30} color={AppColors.green} />
            <Text style={styles.addBoxText}>Add Calls</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.activityContainer}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: s(16),
            fontWeight: 'bold',
            color: AppColors.fontGray,
          }}
        >
          Recent Activity
        </Text>
        <View style={styles.viewContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Calls')}>
            <Text
              style={{
                fontSize: s(14),
                color: AppColors.orange,
                marginRight: s(3),
              }}
            >
              View all
            </Text>
          </TouchableOpacity>
          <MaterialIcon
            name="chevron-right"
            size={s(20)}
            color={AppColors.orange}
          />
        </View>
      </View>
      <FlatList
        initialNumToRender={2}
        data={callReport.slice(0, 10)} // Now using Firebase data
        renderItem={({ item }) => <CallCards report={item} />} // Pass each report
        keyExtractor={item => item.id}
      />
      {/* <FlatList
        initialNumToRender={2}
        data={products.slice(0, 10)}
        renderItem={() => <CallCards />}
        keyExtractor={(item, index) => index.toString()}
      /> */}
    </AppSafeViews>
  );
};

export default Home;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: AppColors.lightCream,
    borderRadius: 30,
    elevation: 5,
    marginHorizontal: 20,
    justifyContent: 'center',
    height: '25%',
  },
  headerContainerText: {
    fontFamily: AppFonts.Noto,
    fontSize: s(12),
    color: AppColors.medGray,
  },
  reportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: AppColors.green,
    marginHorizontal: 5,
    height: 100,
    backgroundColor: AppColors.white,
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
