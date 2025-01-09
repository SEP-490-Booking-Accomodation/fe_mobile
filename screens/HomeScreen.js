import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import SearchField from "../components/Search";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={[styles.container]}>
        <Text>HomeScreen</Text>
        <SearchField
          placeholder="Search for something..."
          value={searchValue}
          onChangeText={setSearchValue}
          backIcon={false}
          filterIcon={false}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
