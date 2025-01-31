
// This component is a custom date and time picker that allows the user to select a date and time.

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const DateTimePicker = ({ onSelect }) => {
  const [selectedDate, setSelectedDate] = useState({
    year: 2024,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
  });
  const [activeTab, setActiveTab] = useState('TODAY');

  // Generate arrays for each column
  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Refs for ScrollViews
  const scrollRefs = {
    year: useRef(),
    month: useRef(),
    day: useRef(),
    hour: useRef(),
    minute: useRef(),
  };

  // Function to scroll to a specific value
  const scrollToValue = useCallback((type, value) => {
    const arrays = { years, months, days, hours, minutes };
    const index = arrays[type].findIndex(item => item === value);
    if (index !== -1 && scrollRefs[type.slice(0, -1)]?.current) {
      scrollRefs[type.slice(0, -1)].current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  }, [years, months, days, hours, minutes]);

  // Function to set current date and time
  const setCurrentDateTime = useCallback((addDays = 0) => {
    const now = new Date();
    if (addDays) {
      now.setDate(now.getDate() + addDays);
    }
    
    const newDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    };
    
    setSelectedDate(newDate);
    if (onSelect) {
      onSelect(newDate);
    }

    // Scroll each column to the current value
    setTimeout(() => {
      scrollToValue('years', newDate.year);
      scrollToValue('months', newDate.month);
      scrollToValue('days', newDate.day);
      scrollToValue('hours', newDate.hour);
      scrollToValue('minutes', newDate.minute);
    }, 100);
  }, [scrollToValue, onSelect]);

  // Initialize with current date/time when component mounts
  useEffect(() => {
    setCurrentDateTime();
  }, []); 

  // Handle tab changes
  const handleTabPress = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'TODAY') {
      setCurrentDateTime();
    } else {
      setCurrentDateTime(1); // Add 1 day for tomorrow
    }
  }, [setCurrentDateTime]);

  const renderItem = (value, isSelected) => (
    <View style={[styles.item, isSelected && styles.selectedItem]} key={value}>
      <Text style={[styles.itemText, isSelected && styles.selectedText]}>
        {value}
      </Text>
    </View>
  );

  const handleScroll = (event, type) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const value = {
      year: years[index],
      month: months[index],
      day: days[index],
      hour: hours[index],
      minute: minutes[index],
    }[type];

    const newSelectedDate = { ...selectedDate, [type]: value };
    setSelectedDate(newSelectedDate);
    if (onSelect) {
      onSelect(newSelectedDate);
    }
  };

  const renderColumn = (data, type) => (
    <ScrollView
      ref={scrollRefs[type]}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      style={styles.scrollView}
      onMomentumScrollEnd={(e) => handleScroll(e, type)}
      contentContainerStyle={{
        paddingVertical: ITEM_HEIGHT * 2,
      }}
    >
      {data.map((value) => renderItem(value, selectedDate[type] === value))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'TODAY' && styles.activeTab]}
          onPress={() => handleTabPress('TODAY')}
        >
          <Text style={[styles.tabText, activeTab === 'TODAY' && styles.activeTabText]}>
            TODAY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'TOMORROW' && styles.activeTab]}
          onPress={() => handleTabPress('TOMORROW')}
        >
          <Text style={[styles.tabText, activeTab === 'TOMORROW' && styles.activeTabText]}>
            TOMORROW
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <View style={styles.selectionOverlay} />
        {renderColumn(years, 'year')}
        {renderColumn(months, 'month')}
        {renderColumn(days, 'day')}
        {renderColumn(hours, 'hour')}
        {renderColumn(minutes, 'minute')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  tab: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    flexDirection: 'row',
    backgroundColor: '#fff',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    height: PICKER_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
    color: '#999',
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },
  selectionOverlay: {
    position: 'absolute',
    top: '50%',
    marginTop: -ITEM_HEIGHT/2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default DateTimePicker;
