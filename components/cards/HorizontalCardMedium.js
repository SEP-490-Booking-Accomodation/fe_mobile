import { Image, StyleSheet, Touchable, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
//#region How to use this components
/**
 * @example
 * <HorizontalCardMedium
            imageUrlLogo = {require("./assets/images/horizontalCardImage.jpeg")}
            placeName = {"Nhà con nhộng giá rẻ Bình Tân"}
            openHour = {"3:00"}
            closeHour = {"23:00"}
            minPrice = {"120.000"}
            maxPrice = {"1.400.000"}
            location = {"Bình Tân, HCM"}
            rating = {"5"}
            numOfReviews = {"12.5k"}
            distance = "22.4"
            ></HorizontalCardMedium>
 * @param {imageUrlLogo, placeName, openHour, closeHour, minPrice, maxPrice,location, rating, numOfReviews} props 
 * @returns HorizontalCardMedium
 */
//#endregion
export default function HorizontalCardMedium(props) {

    const {
        imageUrlLogo,
        placeName,
        openHour,
        closeHour,
        minPrice,
        maxPrice,
        location,
        rating,
        numOfReviews,
        distance
    } = props;

    return (
        <TouchableOpacity style={styles.card}>
            <Image
                source={imageUrlLogo}
                resizeMode="cover"
                style={styles.image}
            >
            </Image>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{placeName}</Text>
                <View style={styles.openingHourContainer}>
                    <Text style={styles.openHourText}>Mở cửa ({openHour} - {closeHour})</Text>
                </View>
                <Text style={styles.priceRange}>{minPrice}đ - {maxPrice}đ</Text>
                <View style={styles.locationContainer}>
                    <Icon name="location-on" size={20} color={'#4e72e3'} ></Icon>
                    <Text style={styles.locationText}>{location}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Icon name="star" size={20} color={'#ffc907'} ></Icon>
                    <Text style={styles.ratingText}>{rating} ({numOfReviews} đánh giá)</Text>
                </View>
            </View>
            <View style={styles.distanceContainer}>
                <Icon name="location-on" size={20} color={'#979797'}></Icon>
                <Text style={styles.distanceText}>{distance} km</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: "white",
        borderRadius: 20,
        marginVertical: 16,
        shadowColor: '#000000f',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 16
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 10
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between'
    },
    title: {
        color: '#101828',
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 4
    },
    openingHourContainer: {
        backgroundColor: '#12b347',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        marginBottom: 4
    },
    openHourText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 500
    },
    priceRange: {
        color: '#4e72e3',
        fontSize: 12,
        fontWeight: 500,
        marginBottom: 4
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    locationText: {
        color: '#00000066',
        marginLeft: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 12,
        color: "#00000099"
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 22
    },
    distanceText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#979797'
    }











});