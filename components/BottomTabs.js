import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BottomTabs = ({ navigation, state }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { icon: (color) => <Ionicons name="home" size={24} color={color} />, route: 'Home' },
    { icon: (color) => <Ionicons name="chatbubble-outline" size={24} color={color} />, route: 'Messages' },
    { icon: (color) => <Ionicons name="map" size={28} color={color} />, route: 'Map' }, // Icon Map lớn hơn
    { icon: (color) => <MaterialIcons name="local-activity" size={24} color={color} />, route: 'Tickets' },
    { icon: (color) => <Feather name="settings" size={24} color={color} />, route: 'Settings' },
  ];

  const handlePress = (index, route) => {
    setActiveTab(index);
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <View style={styles.tabGroup}>
          {tabs.slice(0, 2).map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                activeTab === index && styles.activeTabItem,
              ]}
              onPress={() => handlePress(index, tab.route)}
            >
              {tab.icon(activeTab === index ? '#FFFFFF' : '#8E8E93')}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tabGroup}>
          {tabs.slice(3).map((tab, index) => (
            <TouchableOpacity
              key={index + 3}
              style={[
                styles.tabItem,
                activeTab === index + 3 && styles.activeTabItem,
              ]}
              onPress={() => handlePress(index + 3, tab.route)}
            >
              {tab.icon(activeTab === index + 3 ? '#FFFFFF' : '#8E8E93')}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.mapTab, activeTab === 2 && styles.activeMapTab]}
        onPress={() => handlePress(2, tabs[2].route)}
      >
        {tabs[2].icon('#FFFFFF')}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 25,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: '#1C1C1E',
      borderRadius: 30,
      padding: 10,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: width - 40,
    },
    tabGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    activeTabItem: {
      
    },
    mapTab: {
      position: 'absolute', 
      bottom: 20, 
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: '#4B7BF5',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5, 
      borderWidth: 4, 
      borderColor: '#FFFFFF',
    },
    activeMapTab: {
      backgroundColor: '#4B7BF5', 
    },
  });
  

export default BottomTabs;
