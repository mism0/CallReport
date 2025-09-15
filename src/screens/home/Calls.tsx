import { FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import { products } from '../../data/products';
import CallCards from '../../components/cards/CallCards';
import HomeHeaders from '../../components/headers/HomeHeaders';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { auth, db } from '../../components/config/firebaseConfig';

const Calls = () => {

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

  const sortedReports = callReport
    .filter(item => !!item.createdAt) // Avoid items without timestamp
    .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); // Most recent first

  return (
    <AppSafeViews>
      <View>
        <HomeHeaders />
        <FlatList
          initialNumToRender={8}
          data={sortedReports.slice(0, 10).map(item => ({
            ...item,
            order: item.order ?? '', // Provide a default value if 'order' is missing
          }))}
          renderItem={({ item }) => <CallCards report={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </AppSafeViews>
  );
};

export default Calls;

const styles = StyleSheet.create({});
