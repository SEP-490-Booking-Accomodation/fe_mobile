import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "favoriteLocations";

const AsyncStorageContext = createContext();

export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};

export const AsyncStorageProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [idChatPlatform, setIdChatPlatform] = useState([]);

  useEffect(() => {
    loadFavorites();
    loadSearchHistory();
    loadIdChatPlatform();
  }, []);

  // Favorites functionality
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const isFavorite = (itemId) => {
    if (!itemId) return false;
    return favorites.some((item) => item.id === itemId || item._id === itemId);
  };

  const toggleFavorite = async (item) => {
    try {
      const itemId = item.id || item._id;
      let updatedFavorites;

      if (isFavorite(itemId)) {
        // Remove from favorites
        updatedFavorites = favorites.filter(
          (fav) => fav.id !== itemId && fav._id !== itemId
        );
      } else {
        // Add to favorites - ensure we have a consistent item structure
        const favoriteItem = {
          _id: itemId,
          id: itemId,
          imageUrl:
            item.imageUrl ||
            item.image?.[0] ||
            `https://ui-avatars.com/api/?name=${
              item.placeName || item.name
            }&background=random`,
          placeName: item.placeName || item.name,
          openHour: item.openHour || "00:00",
          closeHour: item.closeHour || "23:59",
          minPrice: item.minPrice || 0,
          maxPrice: item.maxPrice || 0,
          location:
            item.location ||
            `${item.address || ""}, ${item.ward || ""}, ${
              item.district || ""
            }, ${item.city || ""}`,
          rating: item.ratingPoint || item.averageRating || 0,
          numOfReviews: item.numberOfReview || item.totalFeedbacks || 0,
          status: item.status || 0,
          isOverNight: item.isOverNight || false,
          latitude: item.latitude,
          longitude: item.longitude,
        };

        updatedFavorites = [...favorites, favoriteItem];
      }

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );

      return !isFavorite(itemId); // Return the new favorite state
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      return isFavorite(item.id || item._id); // Return current state if error
    }
  };

  // Search history functionality
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
        updatedHistory.pop(); // Limit to 6 items
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

  // Chat platform ID functionality
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
        // Favorites
        favorites,
        isFavorite,
        toggleFavorite,

        // Search history
        searchHistory,
        addSearchTerm,
        clearSearchHistory,
        removeSearchTerm,

        // Chat platform IDs
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

export default AsyncStorageProvider;
