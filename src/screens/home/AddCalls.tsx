import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import AppTextInput from '../../components/inputs/AppTextInput';
import { AppColors } from '../../components/styles/colors';
import AppButtons from '../../components/buttons/AppButtons';
import { Text } from 'react-native';

const data = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape'];

const AddCalls = () => {
  const [query, setQuery] = useState('');
  const [showList, setShowList] = useState(true);

  const filteredData = data.filter(item =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppSafeViews>
      {/* <HomeHeaders /> */}


      <View style={styles.container}>
        <View style={styles.box}>
          <TextInput
            value={query}
            onChangeText={text => {
              setQuery(text);
              setShowList(true);
            }}
            placeholder="Type a fruit..."
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
            }}
          />

          {showList && query.length > 0 && (
            <FlatList
              data={filteredData}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setQuery(item); // optionally hide list
                    setShowList(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          {/* {selected ? <Text>Selected: {selected}</Text> : null} */}
          {/* <Text style={styles.label}>Date of call</Text> */}
          <AppTextInput placeholder="Date Of Calls" />
          {/* <Text style={styles.label}>Call Type</Text> */}
          <AppTextInput placeholder="Call Type" />
          {/* <Text style={styles.label}>Order Type</Text> */}
          <AppTextInput placeholder="Order Type" />
          {/* <Text style={styles.label}>Customer / Dealer</Text> */}
          <AppTextInput placeholder="Customer / Dealer" />
          {/* <AppTextInput placeholder="Remarks" /> */}
            <TextInput placeholder="Remarks" numberOfLines={4} maxLength={20} multiline style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              marginTop: 10,
              height: 100,
              textAlignVertical: 'top',
            }
            }/>
        </View>

        <View style={styles.buttonContainer}>
          <AppButtons title={'Submit'} />
        </View>
      </View>
    </AppSafeViews>
  );
};

export default AddCalls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginTop: 20,
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
});
