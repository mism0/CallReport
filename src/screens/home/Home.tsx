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
import { s } from 'react-native-size-matters';
import { AppFonts } from '../../components/styles/fonts';
import BarChart from '../../components/charts/BarChart';
import { useNavigation } from '@react-navigation/native';
import HomeHeaders from '../../components/headers/HomeHeaders';
import auth from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

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
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(u => {
      console.log('AUTH USER:', JSON.stringify(u?.uid, null, 2));
      setUser(u);
      setAuthReady(true); // ✅ IMPORTANT
    });

    return unsub;
  }, []);

  const [userdb, setUserdb] = useState<any>(null);

  const fetchUserProfile = async () => {
    if (!user?.uid) return null;

    const db = getFirestore(getApp());
    const userRef = doc(db, 'users', user.uid); // ✅ DOCUMENT
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.warn('User profile not found');
      return null;
    }

    return {
      id: snap.id,
      ...snap.data(),
    };
  };

  useEffect(() => {
    if (!user?.uid) return;

    const loadUserData = async () => {
      const data = await fetchUserProfile();
      setUserdb(data);
    };

    loadUserData();
  }, [user?.uid]);

  console.log('USER CODE:', userdb?.username);

  useEffect(() => {
    if (!userdb?.username) return;

    const db = getFirestore(getApp());
    const callReportRef = collection(db, 'call_reports');
    const q = query(
      callReportRef,
      where('aocode', '==', userdb.username),
      // where('sync', '==', 'N'),
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, snapshot => {
      const callReportList = snapshot.docs.map(
        (doc: { id: any; data: () => any }) => ({
          id: doc.id,
          ...doc.data(),
        }),
      );

      const sorted = callReportList.sort(
        (a: { callmemono: string }, b: { callmemono: string }) =>
          Number(b.callmemono) - Number(a.callmemono),
      );

      setCallReport(sorted);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userdb]);

  const getLastCallReport = (): any | null => {
    if (callReport.length === 0) return null;

    // Sort by dateofcall if it exists
    const sorted = [...callReport].sort(
      (a, b) => b.dateofcall?.seconds - a.dateofcall?.seconds,
    );

    return sorted[0]; // most recent
  };

  const getMonthName = (timestamp: any): string => {
    if (!timestamp?.seconds) return '';

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('default', { month: 'long' });
  };

  const lastReport = getLastCallReport();
  // const monthName = getMonthName(lastReport?.dateofcall);
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  const [callReportCount, setCallReportCount] = useState<number | null>(null);

  useEffect(() => {
    if (!callReport) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const count = callReport.filter(report => {
      const date = report.dateofcall?.seconds
        ? new Date(report.dateofcall.seconds * 1000)
        : null;
      return date && date >= startOfMonth && date <= endOfMonth;
    }).length;

    setCallReportCount(count);
  }, [callReport]);

  return (
    <AppSafeViews>
      <HomeHeaders />
      {/* <View style={styles.headerContainer}> */} //pepe topbox
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
            Call Reports for {monthName}
          </Text>
        </View>

        {/* 2nd Half of headerContainer  */}
        {/* <View style={styles.secondReportContainer}>
            <BarChart data={sampleData} width={150} height={100} />
            <Text style={styles.secondReportText}>
              Marketing 3 Appraisal 8{'\n'}
              Collection 4 Repossession 6{'\n'}
              Event 3 Insurance 9{'\n'}
            </Text>
          </View> */}
      </View>
      {/* </View> */}
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
        data={callReport} // Now using Firebase data
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditCalls', { callData: item })}
            activeOpacity={0.7}
          >
            <CallCards report={item} />
          </TouchableOpacity>
        )}
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
    justifyContent: 'center', //'space-between',
    alignItems: 'center',
  },
  firstReportContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 40,
    elevation: 5,
    marginHorizontal: 20,
    borderColor: AppColors.lightSeaGreen,
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
