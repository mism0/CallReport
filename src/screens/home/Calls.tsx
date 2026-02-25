import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import CallCards from '../../components/cards/CallCards';
import HomeHeaders from '../../components/headers/HomeHeaders';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const Calls = () => {
  const navigation = useNavigation();
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
  }, [user]);

  const fetchCallReport = async (userdb: any) => {
    const db = getFirestore(getApp());
    const callReportRef = collection(db, 'call_reports');

    // const userId = auth.currentUser?.uid; // Get the current user's ID
    const q = query(callReportRef, where('aocode', '==', userdb.username)); // Filter by userId

    const snapshot = await getDocs(q);
    // Include document ID + all fields
    const callReportList = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return callReportList;
  };

  useEffect(() => {
    if (!userdb) return;

    const loadCallReports = async () => {
      const reports = await fetchCallReport(userdb);
      console.log('Call Reports:', reports); // this already shows your document
      setCallReport(reports); // ✅ this was missing
    };

    loadCallReports();
  }, [userdb]);

  useFocusEffect(
    useCallback(() => {
      // Hide tab bar when screen is focused
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });

      // Show tab bar again when leaving the screen
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'flex' },
        });
      };
    }, [navigation]),
  );

  // const sortedReports = callReport
  //   .filter(item => !!item.callmemono) // Avoid items without callmemono
  //   .sort((a, b) => Number(b.callmemono) - Number(a.callmemono)); // Most recent first


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

  return (
    <AppSafeViews>
      <View>
        <HomeHeaders />
        <FlatList
          initialNumToRender={8}
          data={callReport}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditCalls', { callData: item })
              }
              activeOpacity={0.7}
            >
              <CallCards report={item} />
            </TouchableOpacity>
          )}
        />
      </View>
    </AppSafeViews>
  );
};

export default Calls;

const styles = StyleSheet.create({});
