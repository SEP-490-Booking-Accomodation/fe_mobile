import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomTabs navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
