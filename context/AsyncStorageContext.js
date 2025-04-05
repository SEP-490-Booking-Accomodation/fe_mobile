import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const AsyncStorageContext = createContext();
export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};
export const AsyncStorageProvider = ({ children }) => {
  const navigation = useNavigation();
  // const [data, setData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  // This is missing:
  const [idChatPlatform, setIdChatPlatform] = useState([]);


  useEffect(() => {
    // loadData();
    loadFavorites();
    loadSearchHistory();
    loadIdChatPlatform(); 
  }, []);
  // const loadData = async () => {
  //   try {
  //     const storedData = await AsyncStorage.getItem("your_key");
  //     if (storedData) {
  //       setData(JSON.parse(storedData));
  //     }
  //   } catch (error) {
  //     console.error("Failed to load data from AsyncStorage:", error);
  //   }
  // };

  // const saveData = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("your_key", JSON.stringify(value));
  //     setData(value);
  //   } catch (error) {
  //     console.error("Failed to save data to AsyncStorage:", error);
  //   }
  // };

  // const removeItems = async (itemIds) => {
  //   try {
  //     const currentData = await AsyncStorage.getItem("your_key");
  //     if (currentData) {
  //       const parsedData = JSON.parse(currentData);
  //       const updatedData = parsedData.filter(
  //         (item) => !itemIds.includes(item._id)
  //       );
  //       await AsyncStorage.setItem("your_key", JSON.stringify(updatedData));
  //       setData(updatedData);
  //     }
  //   } catch (error) {
  //     console.error("Failed to remove items from AsyncStorage:", error);
  //   }
  // };

  // const logout = async () => {
  //   try {
  //     await AsyncStorage.removeItem("token");
  //     await AsyncStorage.removeItem("expToken");
  //     navigation.navigate("Login");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };
  //====================================================================
  //Search History
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
  //========================================================================
  //Favorite
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const addFavorite = async (item) => {
    try {
      const updatedFavorites = [...favorites];
      const existingIndex = updatedFavorites.findIndex(
        (fav) => fav._id === item._id
      );

      if (existingIndex === -1) {
        updatedFavorites.push(item);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
      }
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };
  //========================================================================
  // idChatPlatform

  const loadIdChatPlatform = async () => {
    try {
      const storedIdChatPlatform = await AsyncStorage.getItem("idChatPlatform");
      if (storedIdChatPlatform) {
        const parsedData = JSON.parse(storedIdChatPlatform);
        setIdChatPlatform(parsedData);
        return parsedData; // Return the loaded data
      }
      return []; // Return empty array if no data
    } catch(error) {
      console.error("Failed to load idChatPlatform:", error);
      return []; // Return empty array on error
    }
  }

  const addIdChatPlatform = async (item) => {
    try {
      const updatedIdChatPlatform = [...idChatPlatform];
      const existingIndex = updatedIdChatPlatform.findIndex(
        (fav) => fav._id === item._id
      );
      if (existingIndex === -1) {
        updatedIdChatPlatform.push(item);
        setIdChatPlatform(updatedIdChatPlatform);
        await AsyncStorage.setItem(
          "idChatPlatform",
          JSON.stringify(updatedIdChatPlatform)
        );
      }
    } catch (error) {
      console.error("Failed to add idChatPlatform:", error);
      
    }
  }

  const removeAllIdChatPlaform = async () => {
    try {
      await AsyncStorage.removeItem("idChatPlatform");  
      setIdChatPlatform([]);
    } catch (error) {
      console.log("Failed to remove idChatPlatform:", error);
    }
  }



  return (
    <AsyncStorageContext.Provider
      value={{
        //GIữ lại xem thử nếu bị ảnh hưởng mở ra
        // data,
        // saveData,
        // removeItems,
        // logout,

        //Search Provider
        searchHistory,
        addSearchTerm,
        clearSearchHistory,
        removeSearchTerm,

        //Favorite Provider
        favorites,
        addFavorite,

        //IdChatPlatform
        idChatPlatform,
        addIdChatPlatform,
        loadIdChatPlatform,
        removeAllIdChatPlaform,

      }}
    >
      {children}
    </AsyncStorageContext.Provider>
  );
};
