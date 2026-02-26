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
  setDoc,
} from '@react-native-firebase/firestore';
// import { db } from '../../components/config/firebaseConfig';
import { AppColors } from '../../components/styles/colors';
import Sync from './Sync';
import { getApp } from '@react-native-firebase/app';

import auth from '@react-native-firebase/auth';

const SyncReports = () => {
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

  //Getting user info
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

  console.log('USER CODEs:', userdb?.username);

  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const startSync = async () => {
    if (loading) return; // prevent double press
    setLoading(true);

    try {
      const db = getFirestore(getApp());
      // const q = query(collection(db, 'refresh'), limit(1));
      // const snapshot = await getDocs(q);

      const usersRef = doc(
        db,
        'refresh',
        'firebaseRTSS',
        'users',
        userdb?.username,
      );

      // const snapshot2 = await getDocs(usersRef);

      const snap = await getDoc(usersRef);

      if (!snap.exists()) {
        console.log(userdb?.username + ' does not exist, creating document...');

        await setDoc(usersRef, {
          sync: 'Y',
          createdAt: new Date(),
        });

        console.log(userdb?.username + ' document created with sync = Y');
      }

      await updateDoc(snap.ref, { sync: 'Y' });
      console.log(userdb?.username + ' Sync is set to Y');

      //      3️⃣ Start listener to wait for dealer to become "N"
      unsubscribeRef.current = onSnapshot(usersRef, snapshot => {
        if (snapshot.exists()) {
          const synced = snapshot.data()?.sync;

          if (synced === 'N') {
            setLoading(false);
            setShowText(true);
            if (unsubscribeRef.current) {
              unsubscribeRef.current();
              unsubscribeRef.current = null;
            }
            console.log(
              userdb?.username + ' Sync changed to N, spinner stopped',
            );
          } else {
            setShowText(false);
            console.log(
              'Waiting for sync to change to N, current value:',
              synced,
            );
          }
        } else {
          console.warn(userdb?.username + ' does not exists');
        }
      });
    } catch (error) {
      console.error('Error updating call_reports:', error);
      setLoading(false);
    }

    // try {
    //   // 1️⃣ Get the first document
    //   const db = getFirestore(getApp());
    //   const q = query(collection(db, 'refresh'), limit(1));
    //   const snapshot = await getDocs(q);

    //   if (snapshot.empty) {
    //     console.log('No documents in refresh collection');
    //     setLoading(false);
    //     return;
    //   }

    //   const docSnap = snapshot.docs[0];

    //   // 2️⃣ Change call_reports to "Y"
    //   await updateDoc(docSnap.ref, { call_reports: 'Y' });
    //   console.log('call_reports set to Y');

    //   // 3️⃣ Start listener to wait for dealer to become "N"
    //   unsubscribeRef.current = onSnapshot(q, snapshot => {
    //     if (!snapshot.empty) {
    //       const call_reports = snapshot.docs[0].data().call_reports;

    //       if (call_reports === 'N') {
    //         setLoading(false);
    //         setShowText(true);
    //         if (unsubscribeRef.current) {
    //           unsubscribeRef.current();
    //           unsubscribeRef.current = null;
    //         }
    //         console.log('Call reports changed to N, spinner stopped');
    //       }else
    //       {
    //         setShowText(false);
    //         console.log('Waiting for call_reports to change to N, current value:', call_reports);
    //       }
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error updating call_reports:', error);
    //   setLoading(false);
    // }
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
              Sync Call Report
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 80 }}>
        {showText && <Text>Call report is now updated</Text>}
      </View>
    </AppSafeViews>
  );
};

export default SyncReports;

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
