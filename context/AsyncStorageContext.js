import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AsyncStorageContext = createContext();

export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};

export const AsyncStorageProvider = ({ children }) => {
  const navigation = useNavigation();

  const [data, setData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("your_key");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load data from AsyncStorage:", error);
    }
  };

  const saveData = async (value) => {
    try {
      await AsyncStorage.setItem("your_key", JSON.stringify(value));
      setData(value);
    } catch (error) {
      console.error("Failed to save data to AsyncStorage:", error);
    }
  };

  const removeItems = async (itemIds) => {
    try {
      const currentData = await AsyncStorage.getItem("your_key");
      if (currentData) {
        const parsedData = JSON.parse(currentData);
        const updatedData = parsedData.filter(
          (item) => !itemIds.includes(item._id)
        );
        await AsyncStorage.setItem("your_key", JSON.stringify(updatedData));
        setData(updatedData);
      }
    } catch (error) {
      console.error("Failed to remove items from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    loadData();
    loadSearchHistory();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("expToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("search_history");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  };
  const addSearchTerm = async (term) => {
    try {
      const updatedHistory = [term, ...searchHistory.filter((t) => t !== term)];
      if (updatedHistory.length > 6) {
        updatedHistory.pop(); // Giới hạn 6 mục
      }
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        "search_history",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Failed to add search term:", error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem("search_history");
      setSearchHistory([]);
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  };
  const removeSearchTerm = async (term) => {
    try {
      const updatedHistory = searchHistory.filter((t) => t !== term);
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        "search_history",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Failed to remove search term:", error);
    }
  };

  return (
    <AsyncStorageContext.Provider
      value={{
        data,
        saveData,
        removeItems,
        logout,
        searchHistory,
        addSearchTerm,
        clearSearchHistory,
        removeSearchTerm,
      }}
    >
      {children}
    </AsyncStorageContext.Provider>
  );
};
