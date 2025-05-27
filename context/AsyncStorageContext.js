import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AsyncStorageContext = createContext();

export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};

export const AsyncStorageProvider = ({ children }) => {
  const navigation = useNavigation();
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [idChatPlatform, setIdChatPlatform] = useState([]);

  useEffect(() => {
    loadFavorites();
    loadSearchHistory();
    loadIdChatPlatform();
  }, []);

  //========================================================================
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
        updatedHistory.pop();
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
  //Favorite Locations
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
        (fav) => fav.id === item.id
      );

      if (existingIndex === -1) {
        updatedFavorites.push(item);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      return false;
    }
  };

  const removeFavorite = async (itemId) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.id !== itemId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      return false;
    }
  };

  const isFavorite = (itemId) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  const toggleFavorite = async (item) => {
    try {
      const isCurrentlyFavorite = isFavorite(item.id);

      if (isCurrentlyFavorite) {
        await removeFavorite(item.id);
        return false;
      } else {
        await addFavorite(item);
        return true;
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      return false;
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
        return parsedData;
      }
      return [];
    } catch (error) {
      console.error("Failed to load idChatPlatform:", error);
      return [];
    }
  };

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
  };

  const removeAllIdChatPlaform = async () => {
    try {
      await AsyncStorage.removeItem("idChatPlatform");
      setIdChatPlatform([]);
    } catch (error) {
      console.log("Failed to remove idChatPlatform:", error);
    }
  };

  return (
    <AsyncStorageContext.Provider
      value={{
        //Search Provider
        searchHistory,
        addSearchTerm,
        clearSearchHistory,
        removeSearchTerm,

        //Favorite Provider
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,

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
