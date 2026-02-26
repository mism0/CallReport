import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import AppTextInput from '../../components/inputs/AppTextInput';
import AppButtons from '../../components/buttons/AppButtons';
import { AppColors } from '../../components/styles/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HomeHeaders from '../../components/headers/HomeHeaders';
import { IS_Android } from '../../constants/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage } from 'react-native-flash-message';
import firestore, {
  doc,
  getDoc,
  getFirestore,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { CommonActions } from '@react-navigation/native';

type OrderType = { ordername: string };
type CustomerType = { fullname: string };
type DealerType = { fullname: string };

const AddCalls = () => {
  const navigation = useNavigation();

  const [date, setDate] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [callType, setCallType] = useState<string[]>([]);
  const [selectedCallType, setSelectedCallType] = useState('');
  const [showCallTypeList, setShowCallTypeList] = useState(false);
  // const [resetCallType, setResetCallType] = useState('');

  const [orderType, setOrderType] = useState<OrderType[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [showOrderTypeList, setShowOrderTypeList] = useState(false);

  const [customerType, setCustomerType] = useState<CustomerType[]>([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [showCustomerTypeList, setShowCustomerTypeList] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const [dealerType, setDealerType] = useState<DealerType[]>([]);
  const [selectedDealerType, setSelectedDealerType] = useState('');
  const [showDealerTypeList, setShowDealerTypeList] = useState(false);
  const [dealerSearch, setDealerSearch] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<any>(null);

  const [remarks, setRemarks] = useState('');
  const [branchName, setBranchName] = useState<string | null>(null);

  // const user = auth().currentUser;
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

  const hideAllDropdowns = () => {
    setShowCallTypeList(false);
    setShowOrderTypeList(false);
    setShowCustomerTypeList(false);
    setShowDealerTypeList(false);
  };

  const handleDateChange = (event: any, dateValue?: Date) => {
    setShowPicker(IS_Android);
    if (dateValue) {
      setSelectedDate(dateValue);
      setDate(dateValue.toLocaleDateString());
      setShowPicker(false);
    }
  };

  /** =================
   * FETCH DATA FUNCTIONS
   * ================= */
  const fetchCollection = async (collectionName: string) => {
    const snapshot = await firestore().collection(collectionName).get();
    return snapshot.docs.map(doc => doc.data());
  };

  const loadDropdownData = async () => {
    const callTypes = await fetchCollection('call_type');
    setCallType(callTypes.map((c: any) => c.type));

    // const orders = await fetchCollection('order_type');
    // setOrderType(orders.map((o: any) => o.order));
    const orders = await fetchCollection('order');
    setOrderType(
      orders.map((o: any) => ({
        ordername: o.name ? `${o.name} ${o.code}`.trim() : o.code,
      })),
    );

    const customers = await fetchCollection('customer');
    setCustomerType(
      customers.map((c: any) => ({
        fullname: c.fname
          ? `${c.lname}, ${c.fname} ${c.mname ?? ''} ${c.custcode}`.trim()
          : `${c.lname} ${c.custcode}`.trim(),
      })),
    );

    // const customers = await fetchCollection('customer');
    // setCustomerType(
    //   customers.map((c: any) => ({
    //     fullname: c.fname
    //       ? `${c.lname}, ${c.fname} ${c.mname ?? ''}`.trim()
    //       : c.lname,
    //   })),
    // );

    const dealers = await fetchCollection('dealer');
    setDealerType(
      dealers.map((d: any) => ({
        fullname: `${d.dlrname} ${d.dlrcode}`.trim(),
      })),
    );
  };

  useEffect(() => {
    loadDropdownData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        navigation
          .getParent()
          ?.setOptions({ tabBarStyle: { display: 'flex' } });
      };
    }, [navigation]),
  );

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

  useEffect(() => {
    if (!userdb?.brcode) return;

    const unsubscribe = firestore()
      .collection('branches')
      .doc(userdb.brcode)
      .onSnapshot(docSnap => {
        if (docSnap.exists()) {
          setBranchName(docSnap.data()?.brname ?? null);
        }
      });

    return unsubscribe;
  }, [userdb?.brcode]);

  /** =================
   * SAVE CALL REPORT
   * ================= */
  const saveCallReport = async () => {
    if (!authReady) {
      return Alert.alert('Please wait', 'Checking login status...');
    }

    if (!user) {
      return Alert.alert('Error', 'User not logged in');
    }

    if (selectedDate === null) {
      return Alert.alert('Invalid Date', 'Please select a date.');
    }

    if (selectedOrderType === '') {
      return Alert.alert('Invalid Call Order', 'Please select a call order.');
    }

    if (selectedCallType === '') {
      return Alert.alert('Invalid Call Type', 'Please select a call type.');
    }

    if (selectedCallType === 'Customer') {
      if (!selectedCustomer) {
        return Alert.alert(
          'Invalid Customer',
          'Please select a customer from the list.',
        );
      }
    }

    if (selectedCallType === 'Dealer') {
      if (!selectedDealer) {
        return Alert.alert(
          'Invalid Dealer',
          'Please select a dealer from the list.',
        );
      }
    }

    if (remarks === '') {
      return Alert.alert('Please do not leave remarks empty.');
    }

    try {
      await firestore().runTransaction(async transaction => {
        const sequenceRef = firestore().collection('sequence').doc(userdb?.brcode);
        const sequenceSnap = await transaction.get(sequenceRef);

        if (!sequenceSnap.exists)
          throw new Error('Sequence document not found');

        const lastRecord = sequenceSnap.data()?.lastrecord || '0';

        console.log('Sequence:', lastRecord);

        const nextRecord = (parseInt(lastRecord, 10) + 1)
          .toString()
          .padStart(8, '0');

        console.log('Next Record:', nextRecord);

        const callReportRef = firestore()
          .collection('call_reports')
          .doc(userdb.brcode + nextRecord);

        transaction.set(callReportRef, {
          dateofcall: selectedDate,
          brcode: userdb?.brcode || '',
          callmemono: nextRecord || '',
          // userId: user?.uid || '',
          dateencode: firestore.FieldValue.serverTimestamp(),
          aocode: userdb?.username || '',
          aoname: userdb?.fullname || '',
          brname: branchName || '',
          callorder: selectedOrderType.slice(-2) || '',
          calltype:
            selectedCallType == 'Customer'
              ? '1'
              : selectedCallType == 'Dealer'
              ? '2'
              : '3',
          custcode: selectedCustomerType.slice(-8) || '',
          custname: selectedCustomerType.slice(0, -8) || '',
          dlrcode: selectedDealerType.slice(-5) || '',
          dlrname: selectedDealerType.slice(0, -5) || '',
          source: '2', // Mobile
          remarks: remarks,
          sync: 'N',
        });

        // transaction.set(callReportRef, {
        //   dateofcall: date,
        //   customer:
        //     selectedCallType === 'Customer'
        //       ? selectedCustomerType
        //       : selectedDealerType,
        //   remarks,
        //   brcode: '800',
        //   callmemono: nextRecord,
        //   userId: user.uid,
        //   dateencode: firestore.FieldValue.serverTimestamp(),
        // });

        transaction.update(sequenceRef, { lastrecord: nextRecord });
      });

      showMessage({
        message: 'Call Report saved!',
        type: 'success',
        color: AppColors.yellow,
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        }),
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  /** =================
   * FILTERED LISTS
   * ================= */
  const filteredCustomers = selectedCustomerType
    ? customerType.filter(item =>
        item.fullname
          .toLowerCase()
          .includes(selectedCustomerType.toLowerCase()),
      )
    : customerType;

  const filteredDealers = selectedDealerType
    ? dealerType.filter(item =>
        item.fullname.toLowerCase().includes(selectedDealerType.toLowerCase()),
      )
    : dealerType;

  /** =================
   * DATE LIMITS
   * ================= */
  const minimumDate = new Date();
  minimumDate.setDate(1);
  minimumDate.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  );

  return (
    <AppSafeViews>
      <HomeHeaders />
      <View style={styles.container}>
        <View style={styles.box}>
          <AppTextInput
            placeholder="Date Of Calls"
            value={date}
            onChangeText={() => {}}
            onFocus={() => setShowPicker(true)}
          />
          {showPicker && (
            <DateTimePicker
              mode="date"
              display="default"
              value={selectedDate || new Date()}
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={new Date()}
            />
          )}

          {/* Call Order Dropdown */}
          <View style={styles.padding}>
            <TouchableOpacity
              onPress={() => {
                hideAllDropdowns();
                setShowOrderTypeList(true);
              }}
            >
              <AppTextInput
                value={selectedOrderType.slice(0, -2)}
                placeholder="Call Order"
                editable={false}
              />
            </TouchableOpacity>

            {showOrderTypeList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={orderType}
                  // keyExtractor={item => item}
                  keyExtractor={(item, index) => `${index}-${item.ordername}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedOrderType(item.ordername);
                        setShowOrderTypeList(false);
                      }}
                      style={styles.item}
                    >
                      <Text>{item.ordername.slice(0, -2)}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Call Type Dropdown */}
          <View style={styles.padding}>
            <TouchableOpacity
              onPress={() => {
                hideAllDropdowns();
                setShowCallTypeList(true);
              }}
            >
              <AppTextInput
                value={selectedCallType}
                placeholder="Call Type"
                editable={false}
              />
            </TouchableOpacity>
            {showCallTypeList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={callType}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCustomerType('');
                        setSelectedDealerType('');
                        setSelectedCallType(item);
                        setShowCallTypeList(false);
                      }}
                      style={styles.item}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Dealer / Customer */}
          {selectedCallType === 'Dealer' ? (
            <View style={styles.padding}>
              <AppTextInput
                placeholder="Search Dealer"
                // value={selectedDealerType.slice(0, -5)}
                value={dealerSearch}
                onChangeText={text => {
                  setDealerSearch(text);
                  setSelectedDealerType(text);
                  setSelectedDealer(null); // ❌ invalidate selection
                  hideAllDropdowns();
                  setShowDealerTypeList(true);
                }}
                onFocus={() => {
                  hideAllDropdowns();
                  setShowDealerTypeList(true);
                }}
              />
              {showDealerTypeList && (
                <FlatList
                  data={filteredDealers}
                  keyExtractor={(item, index) => `${index}-${item.fullname}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedDealer(item); // ✅ real object
                        setSelectedDealerType(item.fullname); // FULL STRING
                        setDealerSearch(item.fullname.slice(0, -5)); // show name only
                        setShowDealerTypeList(false);

                        // setSelectedDealerType(item.fullname);
                        // setShowDealerTypeList(false);
                      }}
                      style={styles.item}
                    >
                      <Text>{item.fullname}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          ) : selectedCallType === 'Customer' ? (
            <View style={styles.padding}>
              <AppTextInput
                placeholder="Search Customer"
                // value={selectedCustomerType.slice(0, -8)}
                value={customerSearch}
                onChangeText={text => {
                  setCustomerSearch(text);
                  setSelectedCustomerType(text);
                  setSelectedCustomer(null); // ❌ invalidate selection
                  hideAllDropdowns();
                  setShowCustomerTypeList(true);
                }}
                onFocus={() => {
                  hideAllDropdowns();
                  setShowCustomerTypeList(true);
                }}
              />
              {showCustomerTypeList && (
                <FlatList
                  data={filteredCustomers}
                  keyExtractor={(item, index) => `${index}-${item.fullname}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCustomer(item); // ✅ real object
                        setSelectedCustomerType(item.fullname); // FULL STRING
                        setCustomerSearch(item.fullname.slice(0, -8)); // show name only
                        setShowCustomerTypeList(false);

                        // setSelectedCustomerType(item.fullname);
                        // setShowCustomerTypeList(false);
                      }}
                      style={styles.item}
                    >
                      <Text>{item.fullname}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          ) : null}

          <AppTextInput
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Remarks"
            multiline
            numberOfLines={8}
            maxLength={400}
            style={styles.textInputRemarks}
            onFocus={hideAllDropdowns}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButtons title="Submit" onPress={saveCallReport} />
        </View>
      </View>
    </AppSafeViews>
  );
};

export default AddCalls;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  box: {
    backgroundColor: AppColors.white,
    borderRadius: 30,
    margin: 20,
    padding: 20,
    elevation: 5,
    width: '90%',
  },
  buttonContainer: {
    marginTop: 10,
    width: '90%',
    borderRadius: 20,
    padding: 10,
    paddingBottom: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 58,
    width: '100%',
    backgroundColor: AppColors.lighterSeaGreen,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 2,
  },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  padding: { paddingVertical: 5 },
  textInputRemarks: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});
