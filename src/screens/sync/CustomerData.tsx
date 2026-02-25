import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import {
  collection,
  query,
  limit,
  onSnapshot,
  getDocs,
  updateDoc,
  Unsubscribe,
  getFirestore,
  getDoc,
  doc,
} from '@react-native-firebase/firestore';
// import { db } from '../../components/config/firebaseConfig';
import { AppColors } from '../../components/styles/colors';
import { getApp } from '@react-native-firebase/app';

const CustomerData = () => {
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const startSync = async () => {
    if (loading) return; // prevent double press
    setLoading(true);

    try {
      // 1️⃣ Get the first document
      const db = getFirestore(getApp());
      const customerRef = doc(db, 'refresh', 'database');
      const snap = await getDoc(customerRef);

      if (!snap.exists()) {
        console.log('No documents in refresh collection');
        setLoading(false);
        return;
      }

      await updateDoc(snap.ref, { customer: 'Y' });
      console.log('Customer is set to Y');

      // 3️⃣ Start listener to wait for customer to become "N"
      unsubscribeRef.current = onSnapshot(customerRef, snapshot => {
        if (snapshot.exists()) {
          const customer = snapshot.data()?.customer;

          if (customer === 'N') {
            setLoading(false);
            setShowText(true);
            if (unsubscribeRef.current) {
              unsubscribeRef.current();
              unsubscribeRef.current = null;
            }
            console.log('Customer changed to N, spinner stopped');
          } else {
            setShowText(false);
            console.log(
              'Waiting for customer to change to N, current value:',
              customer,
            );
          }
        }
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      setLoading(false);
    }
  };

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return (
    <AppSafeViews>
      {/* <Text style={{ fontSize: 18, marginBottom: 20 }}>CustomerData</Text> */}

      <View style={styles.buttonPosition}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={startSync}
          style={styles.syncButton}
          disabled={loading} // disable while syncing
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Sync Customer Data
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 80 }}>
        {showText && <Text>Customer data is now updated</Text>}
      </View>
    </AppSafeViews>
  );
};

export default CustomerData;

const styles = StyleSheet.create({
  buttonPosition: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  syncButton: {
    backgroundColor: AppColors.orange,
    padding: 12,
    borderRadius: 20,
    height: 53,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
