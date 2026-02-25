import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IS_Android } from '../../constants/constants';
// import { auth, db } from '../../components/config/firebaseConfig';
import firestore, {
  collection,
  doc,
  FirebaseFirestoreTypes,
  getDocs,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import AppSafeViews from '../../components/views/AppSafeViews';
import HomeHeaders from '../../components/headers/HomeHeaders';
import AppTextInput from '../../components/inputs/AppTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButtons from '../../components/buttons/AppButtons';
import { AppColors } from '../../components/styles/colors';
import { useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/Ionicons';

type CallReport = {
  id: string;
  callmemono: string;
  dateofcall?: FirebaseFirestoreTypes.Timestamp;
  calltype?: string;
  callorder?: string;
  custname?: string;
  custcode?: string;
  dlrname?: string;
  dlrcode?: string;
  remarks?: string;
  sync?: string;
};

type OrderType = { ordername: string };
type CustomerType = { fullname: string };
type DealerType = { fullname: string };

const EditCalls = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { callData } = route.params as { callData: CallReport };

  useEffect(() => {
    if (!callData?.id) {
      Alert.alert('Invalid call report');
      navigation.goBack();
    }
  }, [callData]);

  const [dateofcall, setDateofcall] = useState<Date | null>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (event: any, dateValue?: Date) => {
    setShowPicker(IS_Android); // keep open on iOS
    if (dateValue) {
      setSelectedDate(dateValue);
      //const formatted = dateValue.toLocaleDateString(); // e.g. 9/12/2025
      setDateofcall(dateValue);
      setShowPicker(false);
    }
  };
  const [callType, setCallType] = useState<string[]>([]);
  const [selectedCallType, setSelectedCallType] = useState('');
  const [showCallTypeList, setShowCallTypeList] = useState(false);
  const [orderType, setOrderType] = useState<OrderType[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [showOrderTypeList, setShowOrderTypeList] = useState(false);

  //type CustomerType = { fullname: string | null };
  const [customerType, setCustomerType] = useState<CustomerType[]>([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [showCustomerTypeList, setShowCustomerTypeList] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSearchFocused, setCustomerSearchFocused] = useState(false);

  //type DealerType = { fullname: string | null };
  const [dealerType, setDealerType] = useState<DealerType[]>([]);
  const [selectedDealerType, setSelectedDealerType] = useState('');
  const [showDealerTypeList, setShowDealerTypeList] = useState(false);
  const [editable, setEditable] = useState(true);
  const [dealerSearch, setDealerSearch] = useState('');
  const [dealerSearchFocused, setDealerSearchFocused] = useState(false);
  

  const [remarks, setRemarks] = useState('');
  const CALL_TYPE_MAP: Record<string, string> = {
    '1': 'Customer',
    '2': 'Dealer',
    '3': 'Others',
  };

  const CALL_ORDER_MAP: Record<string, string> = {
    '01': 'Marketing 01',
    '02': 'Appraisal 02',
    '03': 'Collection 03',
    '04': 'Repossession 04',
    '05': 'Event 05',
    '06': 'Insurance 06',
  };

  const onCallTypeChange = (value: string) => {
    setSelectedCallType(value);
  };

  useEffect(() => {
    if (!callData) return;

    const initialCallType =
      (callData.calltype ? CALL_TYPE_MAP[callData.calltype] : undefined) ??
      callData.calltype ??
      'Others';

    setEditable(callData.sync === 'Y');

    //const callType = callData.calltype ? CALL_TYPE_MAP[callData.calltype] : 'Others';

    const callOrder = callData.callorder
      ? CALL_ORDER_MAP[callData.callorder]
      : 'Insurance';
    //(callData.type ? CALL_TYPE_MAP[callData.type] : undefined) ??
    // callData.type ??
    // 'Others';

    setDateofcall(callData.dateofcall ? callData.dateofcall.toDate() : null);
    setSelectedCallType(initialCallType);
    setSelectedOrderType(callOrder);
    setRemarks(callData.remarks || '');
    setDealerSearch(callData.dlrname || '');
    setCustomerSearch(callData.custname || '');

    if (initialCallType === 'Customer') {
      setSelectedCustomerType(
        callData.custname + ' ' + callData.custcode || '',
      );
    } else if (initialCallType === 'Dealer') {
      setSelectedDealerType(callData.dlrname + ' ' + callData.dlrcode || '');
      // } else if (initialCallType === 'Others') {
      // setSelectedDealerType('Others' || '');
    }
  }, [callData]);

  const hideAllDropdowns = () => {
    setShowCallTypeList(false);
    setShowOrderTypeList(false);
    setShowCustomerTypeList(false);
    setShowDealerTypeList(false);
  };

  // const user = auth.currentUser;
  // console.log(auth.currentUser);
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

  const saveUser = async () => {
    try {
      if (!user || !callData?.id) {
        Alert.alert('No report to update');
        return;
      }

      const reportRef = doc(firestore(), 'call_reports', callData.id);

      const reportData = {
        dateofcall: dateofcall,
        calltype:
          selectedCallType == 'Customer'
            ? '1'
            : selectedCallType == 'Dealer'
            ? '2'
            : '3',
        callorder: selectedOrderType.slice(-2) || '',
        custcode: selectedCustomerType.slice(-8) || '',
        custname: selectedCustomerType.slice(0, -8) || '',
        dlrcode: selectedDealerType.slice(-5) || '',
        dlrname: selectedDealerType.slice(0, -5) || '',
        remarks: remarks,
        // userId: user.uid,
        dateencode: serverTimestamp(),
      };

      await updateDoc(reportRef, reportData);

      showMessage({
        message: 'Call Report updated!',
        type: 'success',
        color: AppColors.yellow,
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update report');
    }
    // try {
    //   const token = await user?.getIdToken();
    //   console.log('Firebase Auth Token:', token);

    //   const reportData = {
    //     date: date,
    //     type: selectedCallType,
    //     order: selectedOrderType,
    //     customer:
    //       selectedCallType === 'Customer'
    //         ? selectedCustomerType
    //         : selectedDealerType,
    //     remarks: remarks,
    //     userId: user?.uid,
    //     updatedAt: firestore.FieldValue.serverTimestamp(),
    //   };

    //   if (callData?.id) {
    //     // Update existing document
    //     await firestore()
    //       .collection('call_reports')
    //       .doc(callData.id)
    //       .update(reportData);
    //     console.log('Call report updated!');
    //     showMessage({
    //       message: 'Call Report saved!',
    //       type: 'success',
    //       color: AppColors.yellow,
    //     });
    //     // Alert.alert('Report updated!');
    //   } else {
    //     // // Create new document
    //     // await firestore()
    //     //   .collection('call_reports')
    //     //   .add({
    //     //     ...reportData,
    //     //     createdAt: firestore.FieldValue.serverTimestamp(),
    //     //   });
    //     // console.log('Call report added!');
    //     Alert.alert('Report not saved!');
    //   }

    //   navigation.navigate('Home');
    // } catch (error) {
    //   Alert.alert('Error:', String(error));
    // }
  };

  /*

  const fetchCallType = async () => {
    const db = getFirestore(getApp());
    const callTypeRef = collection(db, 'call_type');
    const snapshot = await getDocs(callTypeRef);
    const callTypeList = snapshot.docs.map((doc: any) => doc.data().type);
    return callTypeList;
  };

  const fetchOrderType = async () => {
    const db = getFirestore(getApp());
    const orderTypeRef = collection(db, 'order_type');
    const snapshot = await getDocs(orderTypeRef);
    const orderTypeList = snapshot.docs.map((doc: any) => doc.data().order);
    return orderTypeList;
  };
  */

  //FEB 5
  // const fetchCustomerType = async () => {
  //   const db = getFirestore(getApp());
  //   const customerTypeRef = collection(db, 'customer');
  //   const snapshot = await getDocs(customerTypeRef);
  //   const customerTypeList = snapshot.docs.map((doc: any) => {
  //     const data = doc.data();
  //     return {
  //       fullname: data
  //         ? data.fname != null
  //           ? `${data.lname}, ${data.fname} ${data.mname}`.trim()
  //           : `${data.lname}`
  //         : null,
  //     };
  //   });
  //   return customerTypeList;
  // };

  /** =================
   * FETCH DATA FUNCTIONS
   * ================= */
  const fetchCollection = async (collectionName: string) => {
    const snapshot = await firestore().collection(collectionName).get();
    return snapshot.docs.map(doc => doc.data());
  };
  /*
  const fetchDealerType = async () => {
    const db = getFirestore(getApp());
    const dealerTypeRef = collection(db, 'dealer');
    const snapshot = await getDocs(dealerTypeRef);
    const dealerTypeList = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        fullname: data ? `${data.dlrname}`.trim() : null,
      };
    });
    return dealerTypeList;
  };
  */

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

    const dealers = await fetchCollection('dealer');
    setDealerType(
      dealers.map((d: any) => ({
        fullname: `${d.dlrname} ${d.dlrcode}`.trim(),
      })),
    );
  };

  //FEB 5 - fetch all dropdown data on mount
  useEffect(() => {
    loadDropdownData();
  }, []);

  //FEB 5
  /*
  useEffect(() => {
    const loadData = async () => {

      const data = await fetchCallType();
      setCallType(data);

      const data2 = await fetchOrderType();
      setOrderType(data2);


      const data3 = await fetchCustomerType();
      console.log('Customer Type Data:', data3);
      setCustomerType(data3);

      const data4 = await fetchDealerType();
      console.log('Dealer Type Data:', data4);
      setDealerType(data4);

    };
    loadData();
  }, []);
      */
  const filteredCustomers = selectedCustomerType
    ? customerType.filter(
        item =>
          item.fullname &&
          item.fullname
            .toLowerCase()
            .includes(selectedCustomerType.toLowerCase()),
      )
    : customerType;

  const filteredDealers = selectedDealerType
    ? dealerType.filter(
        item =>
          item.fullname &&
          item.fullname
            .toLowerCase()
            .includes(selectedDealerType.toLowerCase()),
      )
    : dealerType;

  // Minimum date = first day of current month
  const minimumDate = new Date();
  minimumDate.setDate(1); // first day of current month
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
            value={dateofcall ? dateofcall.toLocaleDateString() : ''}
            onChangeText={() => {}} // prevent manual typing
            onFocus={() => {
              setShowPicker(true);
              // optionally hide dropdowns here
            }}
          />

          {showPicker && (
            <DateTimePicker
              mode="date"
              display="default"
              value={selectedDate || new Date()}
              onChange={handleChange}
              minimumDate={minimumDate}
              maximumDate={endOfMonth}
            />
          )}
          <View style={styles.padding}>
            <TouchableOpacity
              onPress={() => {
                hideAllDropdowns();
                setShowCallTypeList(true);
              }}
            >
              <AppTextInput
                value={selectedCallType}
                placeholder={'Call Type'}
                editable={false}
                // style={styles.textInputStyle}
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
                        //setSelectedCallType(item);
                        setSelectedCustomerType('');
                        setSelectedDealerType('');
                        onCallTypeChange(item);
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

          <View style={styles.padding}>
            <TouchableOpacity
              onPress={() => {
                hideAllDropdowns();
                setShowOrderTypeList(true);
              }}
            >
              <AppTextInput
                value={selectedOrderType.slice(0, -2)}
                editable={false}
                placeholder="Order Type"
              />
            </TouchableOpacity>

            {showOrderTypeList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={orderType}
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

          {selectedCallType == 'Dealer' ? (
            <View style={styles.inputWrapper}>
              <AppTextInput
                placeholder="Search Dealer"
                value={dealerSearch}
                
                onChangeText={text => {
                  setDealerSearch(text);
                  setSelectedDealerType(text);
                  hideAllDropdowns();
                  setShowDealerTypeList(true);
                }}
                onFocus={() => {
                  hideAllDropdowns();
                  setShowDealerTypeList(true);
                  setDealerSearchFocused(true)
                }}
                onBlur={() => setDealerSearchFocused(false)}
                // style={styles.textInputStyle}
                style={styles.textInputWithClear}
                
              />

              {dealerSearchFocused && dealerSearch.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setDealerSearch('');
                    setSelectedDealerType('');
                    setShowDealerTypeList(false);
                  }}
                >
                  {/* <Text style={styles.clearText}>✕</Text> */}
                  <Icon name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}

              {showDealerTypeList && (
                <View style={styles.dropdown}>
                  <FlatList
                    data={filteredDealers}
                    keyExtractor={(item, index) => `${index}-${item.fullname}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedDealerType(item.fullname);
                          setDealerSearch(item.fullname.slice(0, -5));
                          setShowDealerTypeList(false);
                        }}
                        style={styles.item}
                      >
                        <Text>{item.fullname}</Text>
                      </TouchableOpacity>
                    )}
                    initialNumToRender={10}
                    maxToRenderPerBatch={15}
                    windowSize={10}
                    removeClippedSubviews={true}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              )}
            </View>
          ) : selectedCallType == 'Customer' ? (
            <View style={styles.inputWrapper}>
              <AppTextInput
                placeholder="Search Customer"
                value={customerSearch}
                onChangeText={text => {
                  setCustomerSearch(text);
                  setSelectedCustomerType(text);
                  hideAllDropdowns();
                  setShowCustomerTypeList(true);
                }}
                onFocus={() => {
                  hideAllDropdowns();
                  setShowCustomerTypeList(true);
                  setCustomerSearchFocused(true);
                }}
                onBlur={() => {setCustomerSearchFocused(false)}}
                // style={styles.textInputStyle}
                style={styles.textInputWithClear}
              />

              {customerSearchFocused && customerSearch.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setCustomerSearch('');
                    setSelectedCustomerType('');
                    setShowCustomerTypeList(false);
                  }}
                >
                  {/* <Text style={styles.clearText}>✕</Text> */}
                  <Icon name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}

              {showCustomerTypeList && (
                <View style={styles.dropdown}>
                  <FlatList
                    data={filteredCustomers}
                    keyExtractor={(item, index) => `${index}-${item.fullname}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCustomerType(item.fullname);
                          setCustomerSearch(item.fullname.slice(0, -8));
                          setShowCustomerTypeList(false);
                        }}
                        style={styles.item}
                      >
                        <Text>{item.fullname}</Text>
                      </TouchableOpacity>
                    )}
                    initialNumToRender={10}
                    maxToRenderPerBatch={15}
                    windowSize={10}
                    removeClippedSubviews={true}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              )}
            </View>
          ) : null}

          {/* <AppTextInput placeholder="Remarks" /> */}

          <AppTextInput
            value={remarks}
            editable={true}
            onChangeText={setRemarks}
            placeholder="Remarks"
            numberOfLines={6}
            maxLength={200}
            multiline
            style={styles.textInputRemarks}
            onFocus={hideAllDropdowns}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButtons title={'Submit'} onPress={saveUser} disabled={editable} />
          {/* <Button title="Submit" onPress={getCustomerCount} /> */}
          {/* <Button title="Submit" onPress={saveUser} /> */}
        </View>
      </View>
    </AppSafeViews>
  );
};

export default EditCalls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 58, // height of TextInput + margin (adjust as needed)
    width: '100%',
    backgroundColor: AppColors.lighterSeaGreen,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 2,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
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
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  textInputWithClear: {
    paddingRight: 40, // 👈 space for the X button
  },

  clearButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  clearText: {
    fontSize: 18,
    color: '#999',
  },
});
