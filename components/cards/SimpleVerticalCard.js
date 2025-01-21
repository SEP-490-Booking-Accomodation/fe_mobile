import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SimpleVerticalCard(props) {
    const {
        imageUrl,
        placeName,
        price,
        location,
        ratingPoint,
        numberOfReview,
        onCardPress,
    } = props;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onCardPress}
            activeOpacity={0.97}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={imageUrl}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{placeName}</Text>
                <Text style={styles.price}>{price}</Text>

                <View style={styles.locationContainer}>
                    <Icon name="location-on" size={16} color={"#4e72e3"} />
                    <Text style={styles.locationText}>{location}</Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color={"#ffc907"} />
                    <Text style={styles.ratingText}>
                        {ratingPoint} ({numberOfReview} reviews)
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
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        borderRadius: 16,
        margin: 16,
        overflow: "hidden",
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#101828",
        marginBottom: 8,
    },
    price: {
        fontSize: 14,
        color: "#4e72e3",
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    locationText: {
        fontSize: 12,
        color: "#6b7280",
        marginLeft: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingText: {
        fontSize: 12,
        color: "#6b7280",
        marginLeft: 4,
    },
});
