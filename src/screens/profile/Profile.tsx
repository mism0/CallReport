import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import HomeHeaders from '../../components/headers/HomeHeaders';
import AppSafeViews from '../../components/views/AppSafeViews';
import { AppColors } from '../../components/styles/colors';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

const Profile = () => {
  const [user, setUser] = React.useState<any>(null);
  const [userdb, setUserdb] = React.useState<any>(null);
  const [branchName, setBranchName] = React.useState<string>('Unknown Branch');
  const [authReady, setAuthReady] = React.useState(false);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(u => {
      console.log('AUTH USER:', JSON.stringify(u?.uid, null, 2));
      setUser(u);
      setAuthReady(true); // ✅ IMPORTANT
    });
    return unsubscribe;
  }, []);

  const fetchUserProfile = async () => {
    if (!user.uid) return null;

    const db = getFirestore(getApp());
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      console.warn('User profile not found!');
      return null;
    }

    return {
      id: snap.id,
      brcode: snap.data()?.brcode, // default branch code
      ...snap.data(),
    };
  };

  const fetchBranchName = async (brcode: string) => {
    if (!brcode) return 'Unknown Br';

    const db = getFirestore(getApp());
    const branchRef = doc(db, 'branches', brcode);
    const snap = await getDoc(branchRef);
    if (!snap.exists()) {
      console.warn('Branch not found!', brcode);
      return 'Branch Unknown ';
    }
    return snap.data()?.brname || 'Unknown Branch';
  };

  useEffect(() => {
    if (!user?.uid) return;

    const loadUserData = async () => {
      const userData = await fetchUserProfile();
      setUserdb(userData);

      const branch = await fetchBranchName(userData?.brcode || '');
      setBranchName(branch);
    };
    loadUserData();
  }, [user?.uid]);

  return (
    <AppSafeViews>
      <HomeHeaders />
      <View style={styles.headerContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20,
          }}
        >
          <Text style={styles.header}>User Profile</Text>
        </View>
        <View
          style={{
            backgroundColor: AppColors.mediumSeaGreen,
            height: 1,
            marginVertical: 1,
          }}
        ></View>
        <View style={{ flex: 1, marginTop: 20, padding: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.details}>Usercode: </Text>
            <Text style={styles.detailsValue}>{userdb?.username || 'N/A'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.details}>Name: </Text>
            <Text style={styles.detailsValue}>{userdb?.fullname || 'N/A'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.details}>Email: </Text>
            <Text style={styles.detailsValue}>{userdb?.email || 'N/A'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.details}>Branch: </Text>
            <Text style={styles.detailsValue}>
              {userdb?.brcode || 'N/A'} - {branchName}
            </Text>
          </View>
        </View>
      </View>
    </AppSafeViews>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
    borderRadius: 30,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 200,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.darkGreen,
    alignItems: 'center',
  },
  details: {
    fontSize: 16,
    fontWeight: 'regular',
    color: AppColors.darkGreen,
    alignItems: 'center',
  },
  detailsValue: {
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: 'regular',
  },
});
