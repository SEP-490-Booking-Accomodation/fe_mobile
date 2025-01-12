import { Image, StyleSheet, Touchable, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { useState } from 'react';

//#region How to use this components?
/* 
         <VerticalCard 
                imageUrl = {require("./assets/images/verticalCardImage.jpeg")}
                openHour = {"3:00"}
                closeHour = {"20:00" }
                placeName = {"Nhà con nhộng Bình Thạnh giá rẻ" }
                minPrice = {"300.000"}
                maxPrice = {"1.200.000" }
                location = {"Bình Thạnh HCM" }
                ratingPoint = {"5"  }
                numberOfReview ={ "3.5k" }
                initFavourite = {false }
                >
                
                </VerticalCard>
 * 
 * 
 * 
 * */
//#endregion

export default function VerticalCard(props) {
    const {
        imageUrl,
        openHour,
        closeHour,
        placeName,
        minPrice,
        maxPrice,
        location,
        ratingPoint,
        numberOfReview,
        initFavourite,
        onFavouritePress,
        onCardPress
    } = props;

    const [isFavourite, setIsFavourite] = useState(initFavourite);
    const handleFavouritePress = () => {
        const newValue = !isFavourite;
        setIsFavourite(newValue);
        if (onFavouritePress) {
            onFavouritePress(newValue);
        }
    }; setIsFavourite

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={
                onCardPress
            }
            activeOpacity={0.97}

        >
            <View style={styles.imageContainer}>
                <Image
                    source={imageUrl}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.favouriteContainer}
                    onPress={handleFavouritePress}
                    activeOpacity={0.8}>
                    <Icon
                        name={isFavourite ? "favorite" : "favorite-border"}
                        size={24}
                        color={isFavourite ? "#FF4B26" : "#666666"}
                    />
                </TouchableOpacity>
                <View style={styles.openingHoursContainer}>
                    <Text style={styles.openHoursText}>
                        Mở cửa ({openHour} - {closeHour})
                    </Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{placeName}</Text>
                <Text style={styles.priceRange}>{minPrice}đ - {maxPrice}đ</Text>

                <View style={styles.locationContainer}>
                    <Icon name="location-on" size={20} color={"#4e72e3"}></Icon>
                    <Text style={styles.locationText}>{location}</Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Icon name="star" size={20} color={"#ffc907"}></Icon>
                    <Text style={styles.ratingText}>
                        {ratingPoint} ({numberOfReview} đánh giá)
                    </Text>
                </View>
            </View>
        </TouchableOpacity>

    );


}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 20,

        marginVertical: 16,
        shadowColor: '#000000f',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        borderRadius: 16,
        margin: 16
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16

    },
    favouriteContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'white',
        borderRadius: 100,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        zIndex: 1
    },
    openingHoursContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#12B347',
        borderTopLeftRadius: 16,
        borderBottomRightRadius: 13,
    },

    openHoursText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 500,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    contentContainer: {
        padding: 16
    },
    title: {
        color: '#101828',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8
    },
    priceRange: {
        fontSize: 13,
        color: '#4e72e3',
        marginBottom: 8
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    locationText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#00000061'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#00000099'
    }


});