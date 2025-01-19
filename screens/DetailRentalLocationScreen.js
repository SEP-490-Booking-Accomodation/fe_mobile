import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelectButtonGroup from '../components/MultiSelectButtonGroup';
import Tag from '../components/Tag';
import SimpleVerticalCard from '../components/cards/SimpleVerticalCard';

const mockData = {
    destination: {
        name: "Imperial",
        location: "Vũng Tàu",
        rating: 4.8,
        reviews: 150,
        description: "Khách sạn Imperial Vũng Tàu là khách sạn có view mặt tiền hướng biển. Khách sạn Imperial Vũng Tàu là khách sạn có view mặt tiền hướng biển. Khách sạn Imperial Vũng Tàu là khách sạn có view mặt tiền hướng biển.",
        openHours: "Mở cửa (09:00 - 16:00)",
        amenities: ["Máy lạnh", "Tủ lạnh", "Wifi"],
    },
    rooms: [
        {
            id: 1,
            name: "Phòng 1",
            price: "500.000",
            location: "Vũng Tàu",
            rating: 4.8,
            reviews: 50,
            amenities: ["Máy lạnh", "Wifi"],
            imageUrl: require('../assets/images/beach.jpg'),
        },
        {
            id: 2,
            name: "Phòng 2",
            price: "300.000",
            location: "Vũng Tàu",
            rating: 4.8,
            reviews: 50,
            amenities: ["Wifi"],
            imageUrl: require('../assets/images/beach.jpg'),
        },
    ],
};

const DetailRentalLocationScreen = () => {
    const { destination, rooms } = mockData;
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
        const loadFavoriteStatus = async () => {
            const favoriteStatus = await AsyncStorage.getItem('favoriteStatus');
            if (favoriteStatus !== null) {
                setIsFavorite(JSON.parse(favoriteStatus));
            }
        };
        loadFavoriteStatus();
    }, []);

    const toggleFavorite = async () => {
        const newStatus = !isFavorite;
        setIsFavorite(newStatus);
        await AsyncStorage.setItem('favoriteStatus', JSON.stringify(newStatus));
    };

    const handleMoreOptions = () => {
        Alert.alert('More Options', 'Choose an action', [
            { text: 'Share', onPress: () => console.log('Share pressed') },
            { text: 'Report', onPress: () => console.log('Report pressed') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const filteredRooms = selectedAmenities.length > 0
        ? rooms.filter((room) =>
            selectedAmenities.every((amenity) => room.amenities?.includes(amenity))
        )
        : rooms;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.headerActionContainer}>
                    <TouchableOpacity onPress={() => console.log('Back button pressed')}>
                        <Icon name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.actionIcons}>
                        <TouchableOpacity onPress={toggleFavorite}>
                            <Icon
                                name={isFavorite ? 'favorite' : 'favorite-border'}
                                size={24}
                                color="red"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleMoreOptions}>
                            <Icon name="more-vert" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../assets/images/beach.jpg')}
                        style={styles.headerImage}
                    />
                    <View style={styles.headerDetails}>
                        <View style={styles.destinationHeader}>
                            <Text style={styles.destinationName}>{destination.name}</Text>
                            <Tag text={destination.openHours} backgroundColor="#4CAF50" textColor="#fff" />
                        </View>
                        <View style={styles.locationContainer}>
                            <Icon name="location-on" size={20} color={'#4e72e3'} />
                            <Text style={styles.locationText}>{destination.location}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={20} color={'#ffc907'} />
                            <Text style={styles.ratingText}>
                                {destination.rating} ({destination.reviews} Reviews)
                            </Text>
                        </View>
                        <Text style={styles.description}>
                            {isDescriptionExpanded
                                ? destination.description
                                : `${destination.description.slice(0, 90)}...`}
                            <TouchableOpacity
                                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                style={styles.readMoreContainer}
                            >
                                <Text style={styles.readMoreText}>
                                    {isDescriptionExpanded ? "Thu gọn" : "Đọc thêm"}
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
                <MultiSelectButtonGroup
                    items={destination.amenities}
                    activeButtonStyle={styles.activeButton}
                    inactiveButtonStyle={styles.inactiveButton}
                    activeTextStyle={styles.activeText}
                    inactiveTextStyle={styles.inactiveText}
                    onSelect={(selectedItems) => setSelectedAmenities(selectedItems)}
                />
                {filteredRooms.map((room) => (
                    <SimpleVerticalCard
                        key={room.id}
                        imageUrl={room.imageUrl}
                        placeName={room.name}
                        price={`${room.price}đ`}
                        location={room.location}
                        ratingPoint={room.rating}
                        numberOfReview={room.reviews}
                        onCardPress={() => console.log(`${room.name} pressed`)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerContainer: {
        marginBottom: 16,
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 20,
    },
    headerDetails: {
        marginTop: 16,
    },
    destinationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    destinationName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 1,
        marginRight: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    locationText: {
        marginLeft: 8,
        color: '#555',
    },
    readMoreText: {
        color: '#4E72E3',
        fontWeight: 'bold',
    },
    readMoreContainer: {
        marginLeft: 4,
        marginTop: 25,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    ratingText: {
        marginLeft: 8,
        color: '#555',
    },
    description: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingTop: 12,
        paddingBottom: 12,
    },

    activeButton: {
        backgroundColor: 'rgba(78, 114, 227, 0.33)',
        borderColor: 'transparent',
    },
    inactiveButton: {
        backgroundColor: 'white',
        borderColor: '#E5E7EB',
    },
    activeText: {
        color: '#4e72e3',
    },
    inactiveText: {
        color: '#374151',
    },
});

export default DetailRentalLocationScreen;
