import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions
} from 'react-native';

const ITEM_HEIGHT = 50;
const VISIBLE_ROWS = 5;

export default function DateTimePicker() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('TODAY');
    const flatListRefs = useRef({});

    const years = Array.from({ length: 5 }, (_, i) => 2025 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const centerIndex = Math.floor(VISIBLE_ROWS / 2);

    useEffect(() => {
        const currentDate = new Date();
        setSelectedDate(currentDate);

        const yearIndex = years.indexOf(currentDate.getFullYear());
        const monthIndex = months.indexOf(currentDate.getMonth() + 1);
        const dayIndex = days.indexOf(currentDate.getDate());
        const hourIndex = hours.indexOf(currentDate.getHours());
        const minuteIndex = minutes.indexOf(currentDate.getMinutes());

        setTimeout(() => {
            if (flatListRefs.current.years) {
                scrollToCenter(flatListRefs.current.years, yearIndex);
            }
            if (flatListRefs.current.months) {
                scrollToCenter(flatListRefs.current.months, monthIndex);
            }
            if (flatListRefs.current.days) {
                scrollToCenter(flatListRefs.current.days, dayIndex);
            }
            if (flatListRefs.current.hours) {
                scrollToCenter(flatListRefs.current.hours, hourIndex);
            }
            if (flatListRefs.current.minutes) {
                scrollToCenter(flatListRefs.current.minutes, minuteIndex);
            }
        }, 100);
    }, []);

    const scrollToCenter = (ref, index) => {
        const offset = index * ITEM_HEIGHT;
        ref?.scrollToOffset({
            offset: offset,
            animated: true
        });
    };

    const handleValueChange = (ref, data, selectedValue, onValueChange) => (item) => {
        const selectedIndex = data.indexOf(item);
        scrollToCenter(ref, selectedIndex);
        onValueChange(item);
    };

    const renderPicker = (data, selectedValue, onValueChange, refName) => (
        <View style={[styles.pickerWrapper, refName === 'year' && { width: '22%' }]}>
            <View style={styles.centerLine} />
            <FlatList
                data={data}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                    <View style={[
                        styles.item,
                        selectedValue === item && styles.selectedItem
                    ]}>
                        <Text style={[
                            styles.itemText,
                            selectedValue === item && styles.selectedItemText
                        ]}>
                            {item.toString().padStart(2, '0')}
                        </Text>
                    </View>
                )}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                initialScrollIndex={Math.max(0, data.indexOf(selectedValue) - centerIndex)}
                onScrollToIndexFailed={(error) => {
                    console.warn('Scroll failed', error);
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        const index = Math.max(0, data.indexOf(selectedValue) - centerIndex);
                        flatListRefs.current[refName]?.scrollToIndex({
                            index,
                            animated: true
                        });
                    });
                }}
                onMomentumScrollEnd={(event) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
                    const selectedItem = data[selectedIndex];
                    if (selectedItem !== undefined) {
                        onValueChange(selectedItem);
                    }
                }}
                ref={(ref) => (flatListRefs.current[refName] = ref)}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'TODAY' && styles.activeTab]}
                        onPress={() => setActiveTab('TODAY')}
                    >
                        <Text style={[styles.tabText, activeTab === 'TODAY' && styles.activeTabText]}>
                            TODAY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'TOMORROW' && styles.activeTab]}
                        onPress={() => setActiveTab('TOMORROW')}
                    >
                        <Text style={[styles.tabText, activeTab === 'TOMORROW' && styles.activeTabText]}>
                            TOMORROW
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={styles.checkIcon}>✓</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
                {renderPicker(
                    years,
                    selectedDate.getFullYear(),
                    (year) => setSelectedDate(new Date(year, selectedDate.getMonth(), selectedDate.getDate())),
                    'years'
                )}
                {renderPicker(
                    months,
                    selectedDate.getMonth() + 1,
                    (month) => setSelectedDate(new Date(selectedDate.getFullYear(), month - 1, selectedDate.getDate())),
                    'months'
                )}
                {renderPicker(
                    days,
                    selectedDate.getDate(),
                    (day) => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)),
                    'days'
                )}
                {renderPicker(
                    hours,
                    selectedDate.getHours(),
                    (hour) => {
                        const updatedDate = new Date(selectedDate);
                        updatedDate.setHours(hour);
                        setSelectedDate(updatedDate);
                    },
                    'hours'
                )}
                {renderPicker(
                    minutes,
                    selectedDate.getMinutes(),
                    (minute) => {
                        const updatedDate = new Date(selectedDate);
                        updatedDate.setMinutes(minute);
                        setSelectedDate(updatedDate);
                    },
                    'minutes'
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 5,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#007AFF',
    },
    tabText: {
        color: '#666',
        fontSize: 16,
    },
    activeTabText: {
        color: '#fff',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Changed from space-between
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 30,
        height: ITEM_HEIGHT * VISIBLE_ROWS,
    },
    pickerWrapper: {
        height: ITEM_HEIGHT * VISIBLE_ROWS,
        position: 'relative',
        width: '18%', // Add fixed width percentage
        alignItems: 'center',
    },
    centerLine: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2, // Adjust to center properly
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        zIndex: 1,
    },
    listContainer: {
        paddingVertical: ITEM_HEIGHT * 2, // Match with centerLine top value
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    itemText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    selectedItem: {
        backgroundColor: 'transparent',
    },
    selectedItemText: {
        color: '#007AFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    calendarIcon: {
        fontSize: 24,
    },
    checkIcon: {
        fontSize: 24,
        color: '#007AFF',
    },
});