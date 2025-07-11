import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import AppSafeViews from '../../components/views/AppSafeViews';
import { products } from '../../data/products';
import CallCards from '../../components/cards/CallCards';
import HomeHeaders from '../../components/headers/HomeHeaders';

const Calls = () => {
  return (
    <AppSafeViews>
      <View>
        <HomeHeaders />
        <FlatList
          initialNumToRender={2}
          data={products.slice(0, 10)}
          renderItem={() => <CallCards />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </AppSafeViews>
  );
};

export default Calls;

const styles = StyleSheet.create({});
