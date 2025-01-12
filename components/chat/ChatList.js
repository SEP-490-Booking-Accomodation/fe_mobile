import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ChatRow from "./chatRow";

const ChatList = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatRow
          sender={item.sender}
          message={item.message}
          time={item.time}
          status={item.status} // Pass the status to the component
        />
      )}
    />
  );
};

export default ChatList;
