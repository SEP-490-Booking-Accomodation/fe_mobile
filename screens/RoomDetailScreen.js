import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapWithPopup from '../components/MapWithPopup';
import CustomButton from '../components/Button';
import Tag from '../components/Tag';
import ImageViewing from 'react-native-image-viewing';
import MultipleButtonNoSelect from '../components/MultipleButtonNoSelect';

const RoomDetailScreen = ({ route, navigation }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentImageSet, setCurrentImageSet] = useState([]);
    const { room } = route.params;

    const amenities = [
        'Máy lạnh',
        'Wifi',
        'Máy giặt',
        'Bếp',
        'TV',
        'Bãi đỗ xe',
        'Hồ bơi',
        'Gym'
    ];

    const galleryImages = Array(12).fill(null).map((_, index) => ({
        id: `image-${index}`,
        source: require('../assets/images/beach.jpg')
    }));

    const reviewImages = Array(3).fill(null).map((_, index) => ({
        id: `review-image-${index}`,
        source: require('../assets/images/beach.jpg')
    }));

    const openGalleryModal = (index) => {
        setCurrentImageSet(galleryImages.map(img => ({ uri: Image.resolveAssetSource(img.source).uri })));
        setSelectedImageIndex(index);
        setImageModalVisible(true);
    };

    const openReviewModal = (index) => {
        setCurrentImageSet(reviewImages.map(img => ({ uri: Image.resolveAssetSource(img.source).uri })));
        setSelectedImageIndex(index);
        setImageModalVisible(true);
    };

    const openSingleImageModal = (image) => {
        setCurrentImageSet([{ uri: Image.resolveAssetSource(image).uri }]);
        setSelectedImageIndex(0);
        setImageModalVisible(true);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="more-vert" size={24} color="#333" />
            </TouchableOpacity>
        </View>
    );

    const renderMainInfo = () => (
        <View style={styles.mainInfo}>
            <TouchableOpacity onPress={() => openSingleImageModal(require('../assets/images/beach.jpg'))}>
                <Image
                    source={require('../assets/images/beach.jpg')}
                    style={styles.mainImage}
                />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <View style={styles.roomHeader}>
                    <Text style={styles.roomName}>Phòng 1</Text>
                    <Tag
                        text="Imperial"
                        backgroundColor="#E8EDFB"
                        textColor="#4e72e3"
                    />
                </View>
                <View style={styles.locationContainer}>
                    <MaterialIcons name="location-on" size={20} color="#4e72e3" />
                    <Text style={styles.locationText}>Vũng Tàu</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>500.000đ/h</Text>
                </View>
                <View style={styles.reviewContainer}>
                    <MaterialIcons name="star" size={20} color="#ffc907" />
                    <Text style={styles.ratingText}>4.5 (3k Reviews)</Text>
                </View>
            </View>
        </View>
    );

    const renderAmenities = () => (
        <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <MultipleButtonNoSelect
                items={amenities}
                containerStyle={styles.amenitiesContainer}
                buttonStyle={styles.amenityButton}
                textStyle={styles.amenityText}
                spacing={8}
                borderRadius={20}
            />
        </View>
    );

    const renderLocation = () => (
        <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapWithPopup />
        </View>
    );

    const renderTabs = () => {
        const tabs = ['Chi tiết', 'Ảnh', 'Đánh giá'];
        return (
            <View style={styles.tabContainer}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.tab,
                            activeTab === index && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(index)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === index && styles.activeTabText,
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderPhotos = () => {
        const numColumns = 3;
        const spacing = 8;
        const screenWidth = Dimensions.get('window').width;
        const contentPadding = 16;
        const totalSpacing = (numColumns - 1) * spacing;
        const totalPadding = contentPadding * 2;
        const imageWidth = (screenWidth - totalSpacing - totalPadding) / numColumns;

        return (
            <FlatList
                data={galleryImages}
                numColumns={numColumns}
                contentContainerStyle={styles.photosContainer}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => openGalleryModal(index)}
                        style={[
                            styles.imageWrapper,
                            {
                                marginRight: (index + 1) % numColumns === 0 ? 0 : spacing,
                                marginBottom: spacing,
                            },
                        ]}
                    >
                        <Image
                            source={item.source}
                            style={[
                                styles.gridImage,
                                { width: imageWidth, height: imageWidth },
                            ]}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        );
    };

    const renderReviews = () => (
        <View style={styles.reviewsContainer}>
            <View style={styles.ratingSummaryContainer}>
                <View style={styles.ratingAverageContainer}>
                    <Text style={styles.averageRating}>4.5</Text>
                    <Text style={styles.totalReviews}>(273 Đánh giá)</Text>
                </View>
                <View style={styles.ratingBreakdownContainer}>
                    {[5, 4, 3, 2, 1].map((rating, index) => (
                        <View key={rating} style={styles.ratingRow}>
                            <Text style={styles.ratingNumber}>{rating}</Text>
                            <View style={styles.ratingBarBackground}>
                                <View style={[styles.ratingBar, { width: `${rating * 20}%` }]} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                    <Image
                        source={require('../assets/images/beach.jpg')}
                        style={styles.reviewerImage}
                    />
                    <View style={styles.reviewerDetails}>
                        <Text style={styles.reviewerName}>Zane Pham</Text>
                        <View style={styles.starContainer}>
                            {Array(5).fill(null).map((_, index) => (
                                <MaterialIcons
                                    key={index}
                                    name="star"
                                    size={16}
                                    color="#ffc907"
                                />
                            ))}
                        </View>
                    </View>
                </View>
                <Text style={styles.reviewText}>Gất tuyệt 🥰💯</Text>
                <View style={styles.reviewImagesContainer}>
                    {reviewImages.map((image, index) => (
                        <TouchableOpacity
                            key={image.id}
                            onPress={() => openReviewModal(index)}
                        >
                            <Image
                                source={image.source}
                                style={styles.reviewImage}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.reviewDate}>30/12/2024</Text>
            </View>
        </View>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <ScrollView>
                        {renderAmenities()}
                        {renderLocation()}
                    </ScrollView>
                );
            case 1:
                return renderPhotos();
            case 2:
                return (
                    <ScrollView>
                        {renderReviews()}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={styles.content}>
                {renderMainInfo()}
                {renderTabs()}
                {renderContent()}
            </View>
            <View style={styles.footer}>
                <CustomButton
                    title="Đặt ngay"
                    style={styles.bookButton}
                    backgroundColor="#101828"
                />
            </View>
            <ImageViewing
                images={currentImageSet}
                imageIndex={selectedImageIndex}
                visible={isImageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
                keyExtractor={(_, index) => `modal-image-${index}`}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    mainImage: {
        width: '100%',
        height: 200,
        borderRadius: 20,
    },
    mainInfo: {
        padding: 16,
    },
    content: {
        flex: 1,
    },
    infoContainer: {
        marginTop: 16,
    },
    roomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    roomName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    locationText: {
        marginLeft: 4,
        color: '#666',
    },
    priceContainer: {
        marginTop: 8,
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4e72e3',
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    ratingText: {
        marginLeft: 8,
        color: '#555',
    },
    amenitiesContainer: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    locationSection: {
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4e72e3',
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: '#4e72e3',
        fontWeight: '600',
    },
    photosContainer: {
        padding: 16,
    },
    imageWrapper: {
        overflow: 'hidden',
    },
    gridImage: {
        borderRadius: 8,
    },
    reviewsContainer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    ratingSummaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    ratingAverageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22
    },
    averageRating: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4e72e3',
    },
    totalReviews: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    ratingBreakdownContainer: {
        flex: 1,
        marginLeft: 16,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingNumber: {
        width: 20,
        fontSize: 14,
        color: '#333',
        marginRight: 8,
    },
    ratingBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
    },
    ratingBar: {
        height: 8,
        backgroundColor: '#ffc907',
        borderRadius: 4,
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerDetails: {
        flex: 1,
    },
    reviewerName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    starContainer: {
        flexDirection: 'row',
    },
    reviewText: {
        color: '#666',
    },
    reviewImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 8,
    },
    reviewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    footer: {
        padding: 14,
        backgroundColor: '#f8f9fa',
    },
    bookButton: {
        width: '100%',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullScreenImage: {
        width: '90%',
        height: '90%',
        borderRadius: 20,
        resizeMode: 'contain',
    },
});

export default RoomDetailScreen;
