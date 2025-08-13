import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import AppTextInput from '../../components/inputs/AppTextInput';
import { AppColors } from '../../components/styles/colors';
import AppButtons from '../../components/buttons/AppButtons';
import { Text } from 'react-native';
import firestore, {
  collection,
  getDocs,
  // getCountFromServer,
} from '@react-native-firebase/firestore';
import { auth, db } from '../../components/config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import HomeHeaders from '../../components/headers/HomeHeaders';
// import { event } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

// const data = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape'];

const AddCalls = () => {
  const navigation = useNavigation();
  // const [query, setQuery] = useState('');

  // const filteredData = data.filter(item =>
  //   item.toLowerCase().includes(query.toLowerCase()),
  // );

  const [date, setDate] = useState('');
  // const [type, setType] = useState('');
  // const [order, setOrder] = useState('');
  // const [customer, setCustomer] = useState('');
  const [callType, setCallType] = useState([]);
  const [selectedCallType, setSelectedCallType] = useState('');
  const [showCallTypeList, setShowCallTypeList] = useState(false);
  const [orderType, setOrderType] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [showOrderTypeList, setShowOrderTypeList] = useState(false);

  type CustomerType = { fullname: string | null };
  const [customerType, setCustomerType] = useState<CustomerType[]>([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [showCustomerTypeList, setShowCustomerTypeList] = useState(false);

  type DealerType = { fullname: string | null };
  const [dealerType, setDealerType] = useState<DealerType[]>([]);
  const [selectedDealerType, setSelectedDealerType] = useState('');
  const [showDealerTypeList, setShowDealerTypeList] = useState(false);

  const [remarks, setRemarks] = useState('');

  const hideAllDropdowns = () => {
    setShowCallTypeList(false);
    setShowOrderTypeList(false);
    setShowCustomerTypeList(false);
    setShowDealerTypeList(false);
  };

  const user = auth.currentUser;
  console.log(auth.currentUser);

  const saveUser = async () => {
    try {
      const token = await user?.getIdToken();
      console.log('Firebase Auth Token:', token);

      await firestore()
        .collection('call_reports') // Collection name
        .add({
          date: date,
          type: selectedCallType,
          order: selectedOrderType,
          customer: selectedCustomerType,
          createdAt: firestore.FieldValue.serverTimestamp(),
          remarks: remarks,
          userId: user?.uid, // Store the user ID
        })
        .then(() => {
          console.log('Call report added!');
        });
      Alert.alert('Report saved!');
      navigation.navigate('BottomTabs');
    } catch (error) {
      Alert.alert('Error:', String(error));
    }
  };

  const fetchCallType = async () => {
    const callTypeRef = collection(db, 'call_type');
    const snapshot = await getDocs(callTypeRef);
    const callTypeList = snapshot.docs.map((doc: any) => doc.data().type);
    return callTypeList;
  };

  const fetchOrderType = async () => {
    const orderTypeRef = collection(db, 'order_type');
    const snapshot = await getDocs(orderTypeRef);
    const orderTypeList = snapshot.docs.map((doc: any) => doc.data().order);
    return orderTypeList;
  };

  const fetchCustomerType = async () => {
    const customerTypeRef = collection(db, 'customer');
    const snapshot = await getDocs(customerTypeRef);
    const customerTypeList = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        fullname: data
          ? data.fname != null
            ? `${data.lname}, ${data.fname} ${data.mname}`.trim()
            : `${data.lname}`
          : null,
      };
    });
    return customerTypeList;
  };

  const fetchDealerType = async () => {
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

  // const getCustomerCount = async () => {
  //   const coll = collection(db, 'customer');
  //   const snapshot = await getCountFromServer(coll);
  //   console.log('Total customers:', snapshot.data().count);
  //   return snapshot.data().count;
  // };

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

  return (
    <AppSafeViews>
      <HomeHeaders />

      <View style={styles.container}>
        <View style={styles.box}>
          <AppTextInput
            placeholder="Date Of Calls"
            value={date}
            onChangeText={setDate}
            onFocus={hideAllDropdowns} 
          />
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

          <View style={styles.padding}>
            <TouchableOpacity
              onPress={() => {
                hideAllDropdowns();
                setShowOrderTypeList(true);
              }}
            >
              <AppTextInput
                value={selectedOrderType}
                editable={false}
                placeholder="Order Type"
                // style={styles.textInputStyle}
              />
            </TouchableOpacity>

            {showOrderTypeList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={orderType}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedOrderType(item);
                        setShowOrderTypeList(false);
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
            <AppTextInput
              placeholder="Search Customer"
              value={selectedCustomerType}
              onChangeText={text => {
                setSelectedCustomerType(text);
                hideAllDropdowns();
                setShowCustomerTypeList(true);
              }}
              onFocus={() => {
                hideAllDropdowns();
                setShowCustomerTypeList(true);
              }}
              // style={styles.textInputStyle}
            />

            {showCustomerTypeList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={filteredCustomers}
                  keyExtractor={(item, index) => `${index}-${item.fullname}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCustomerType(item.fullname ?? '');
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

          <View style={styles.padding}>
            <AppTextInput
              placeholder="Search Dealer"
              value={selectedDealerType}
              onChangeText={text => {
                setSelectedDealerType(text);
                hideAllDropdowns();
                setShowDealerTypeList(true);
              }}
              onFocus={() => {
                hideAllDropdowns();
                setShowDealerTypeList(true);
              }}
              // style={styles.textInputStyle}
            />

            {showDealerTypeList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={filteredDealers}
                  keyExtractor={(item, index) => `${index}-${item.fullname}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedDealerType(item.fullname ?? '');
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
          {/* <AppTextInput placeholder="Remarks" /> */}

          <AppTextInput
            value={remarks}
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
          <AppButtons title={'Submit'}  onPress={saveUser}/>
          {/* <Button title="Submit" onPress={getCustomerCount} /> */}
          {/* <Button title="Submit" onPress={saveUser} /> */}
        </View>
      </View>
    </AppSafeViews>
  );
};

export default AddCalls;

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
});
