import React, { createContext, useContext, useState } from "react";
import NotificationModal from "../components/notificationModal";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "success",
    duration: 2000,
  });

  const showNotification = ({ message, type = "success", duration = 2000 }) => {
    setNotification({
      visible: true,
      message,
      type,
      duration,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // Shorthand methods for common notifications
  const showSuccess = (message, duration) => {
    showNotification({ message, type: "success", duration });
  };

  const showError = (message, duration) => {
    showNotification({ message, type: "error", duration });
  };

  const showInfo = (message, duration) => {
    showNotification({ message, type: "info", duration });
  };

  const showFavoriteAdded = (message = "Added to favorites", duration) => {
    showNotification({ message, type: "favorite-added", duration });
  };

  const showFavoriteRemoved = (
    message = "Removed from favorites",
    duration
  ) => {
    showNotification({ message, type: "favorite-removed", duration });
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showInfo,
        showFavoriteAdded,
        showFavoriteRemoved,
      }}
    >
      {children}
      <NotificationModal
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};
