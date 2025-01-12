import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ButtonGroup from '../components/ButtonGroup';
import MultiSelectButtonGroup from '../components/MultiSelectButtonGroup';
import CustomButton from '../components/Button';

const Filter = ({ visible, onClose, onApply }) => {
    const [priceRange, setPriceRange] = useState([100000, 100000000]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const screenWidth = Dimensions.get('window').width;
    const sliderWidth = screenWidth - 40;

    const translateY = useRef(new Animated.Value(0)).current;

    const handleReset = () => {
        setPriceRange([100000, 100000000]);
        setSelectedRating(null);
        setSelectedAmenities([]);
        console.log('Filters reset:', { priceRange: [100000, 100000000], selectedRating: null, selectedAmenities: [] });
    };
    const handleApply = () => {
        onApply({
            priceRange,
            selectedRating,
            selectedAmenities,
        });
        onClose();
    };
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 100) {
                    onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <Animated.View
                    style={[styles.container, { transform: [{ translateY }] }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.dot} />
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Lọc nâng cao</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>Hủy</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Giá</Text>
                        <View style={styles.line} />
                        <View style={styles.priceContainer}>
                            <View style={styles.priceRangeLabels}>
                                <View>
                                    <Text style={styles.priceRangeTitle}>Tối thiểu</Text>
                                    <View style={styles.priceBox}>
                                        <Text style={styles.priceText}>
                                            {priceRange[0].toLocaleString()} đ
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.priceSeparator}>-</Text>
                                <View>
                                    <Text style={styles.priceRangeTitle}>Tối đa</Text>
                                    <View style={styles.priceBox}>
                                        <Text style={styles.priceText}>
                                            {priceRange[1].toLocaleString()} đ
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <MultiSlider
                                values={priceRange}
                                onValuesChange={setPriceRange}
                                min={100000}
                                max={100000000}
                                step={100000}
                                allowOverlap={false}
                                snapped
                                selectedStyle={{
                                    backgroundColor: '#4E72E3',
                                    height: 2,
                                }}
                                unselectedStyle={{
                                    backgroundColor: '#E5E7EB',
                                    height: 2,
                                }}
                                containerStyle={{
                                    height: 40,
                                }}
                                markerStyle={{
                                    height: 24,
                                    width: 24,
                                    borderRadius: 12,
                                    backgroundColor: '#fff',
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Đánh giá</Text>
                        <View style={styles.line} />
                        <ButtonGroup
                            items={['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐']}
                            selectedIndex={selectedRating}
                            onChange={setSelectedRating}
                            containerStyle={styles.buttonGroupContainer}
                            buttonStyle={styles.buttonGroupButton}
                            activeButtonStyle={styles.activeButton}
                            inactiveButtonStyle={styles.inactiveButton}
                            textStyle={styles.text}
                            activeTextStyle={styles.activeText}
                            inactiveTextStyle={styles.inactiveText}
                            spacing={10}
                            borderRadius={5}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tiện ích</Text>
                        <View style={styles.line} />
                        <MultiSelectButtonGroup
                            items={['Máy lạnh', 'Tủ lạnh', 'Wifi', 'Tivi', 'Tiện ích khác', 'Pet allowed']}
                            selectedIndexes={selectedAmenities}
                            onChange={setSelectedAmenities}
                            containerStyle={styles.multiSelectContainer}
                            buttonStyle={styles.multiSelectButton}
                            activeButtonStyle={styles.activeMultiSelectButton}
                            inactiveButtonStyle={styles.inactiveMultiSelectButton}
                            textStyle={styles.multiSelectText}
                            activeTextStyle={styles.activeMultiSelectText}
                            inactiveTextStyle={styles.inactiveMultiSelectText}
                            spacing={10}
                            borderRadius={25}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Đặt lại"
                            onPress={handleReset}
                            backgroundColor="#E5E7EB"
                            titleColor="#101828"
                            style={styles.resetButton}
                        />
                        <CustomButton
                            title="Áp dụng"
                            onPress={handleApply}
                            backgroundColor="#1A2741"
                            titleColor="#FFF"
                            style={styles.applyButton}
                        />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    dot: { width: 48, height: 6, borderRadius: 4, backgroundColor: '#EBEBEB', alignSelf: 'center', marginBottom: 24 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    },
    closeText: {
        fontSize: 16,
        color: '#4E72E3',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#98A0B4',
        marginBottom: 10,
    },
    sliderContainer: {
        paddingVertical: 20,
    },
    priceContainer: {
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
    },
    priceRangeLabels: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
        width: '100%',
    },
    priceRangeTitle: {
        fontSize: 14,
        color: '#98A0B4',
        marginBottom: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
    priceBox: {
        backgroundColor: '#F9FAFB',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 140,
    },
    priceText: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
        textAlign: 'center',
    },
    priceSeparator: {
        fontSize: 16,
        color: '#98A0B4',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    buttonGroupContainer: {
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    buttonGroupButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: 1,
    },
    activeButton: {
        backgroundColor: '#4E72E3',
        borderColor: 'transparent',
    },
    inactiveButton: {
        backgroundColor: '#F6F6F6',
        borderColor: '#F6F6F6',
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
    },
    activeText: {
        color: '#FFFFFF',
    },
    inactiveText: {
        color: '#4E72E3',
    },
    multiSelectContainer: {
        marginBottom: 20,
    },
    multiSelectButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
    },
    activeMultiSelectButton: {
        backgroundColor: 'rgba(78, 114, 227, 0.33)',
        borderColor: 'transparent',
    },
    inactiveMultiSelectButton: {
        backgroundColor: '#F2F4F7',
        borderColor: '#F2F4F7',
    },
    multiSelectText: {
        fontSize: 15,
        fontWeight: '500',
    },
    activeMultiSelectText: {
        color: '#4B4B4B',
    },
    inactiveMultiSelectText: {
        color: '#4B4B4B',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resetButton: {
        flex: 1,
        marginRight: 10,
    },
    applyButton: {
        flex: 1,
    },
    line: {
        height: 1,
        width: Dimensions.get('window').width - 40,
        backgroundColor: '#F3F3F3',
        marginVertical: 10,
    },
});

export default Filter;
