import { Image, StyleSheet, Touchable, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import CustomButton from '../Button';
import { useState } from "react";

/*
    - Status: 
        + (-1) : has button review + view detail 
        + (0) : has button Cancel + view detail (from customer book and before the cancelation)
        + (1) : has only button Re-booking (after done review just show 1 button is re-booking)

*/
/**
 * 
 * @example 
 * <CardInMyTicket
           imageUrl = {require("./assets/images/horizontalCardImage.jpeg")}
           nameRoom = {'room 1'}
           tagName = {'price'}
           placeName = {'Bình Hưng Hoà'}
           maxPeople = {'3'}
           price = {'1.200.000'}
           dateCompleted = {'12/10/2022'}
           status = '-1'
         ></CardInMyTicket>
 * 
 * @param {imageUrl, nameRoom, tagName, placeName, maxPeople, price, dateCompelete, status
 * } props 
 * @returns componentCardInMyTicket
 * 
 * 
 */

export default function CardInMyTicket(props) {
    const {
        imageUrl,
        nameRoom,
        tagName,
        placeName,
        maxPeople,
        price,
        dateCompleted,
        status,
        onViewDetail = () => { },
        onReviewAction = () => { },
        onCancelAction = () => { },
        onRebookingAction = () => { },
    } = props;

    const [loading, setLoading] = useState(false);
    //'../../assets/images/horizontalCardImage.jpeg'
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.contentRow}>
                <Image
                    source={imageUrl} // Replace with your image path
                    style={styles.thumbnail}
                />

                <View style={styles.rightContainer}>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{nameRoom}</Text>


                        //Wait tag to add
                        <View style={styles.tagContainer}>
                            <Text style={styles.tagText}>Imperial</Text>
                        </View>

                        <View style={styles.locationContainer}>
                            <Icon name="location-on" size={16} color="#4B84F5" />
                            <Text style={styles.locationText}>{placeName}</Text>
                            <Text style={styles.dateText}>{dateCompleted}</Text>
                        </View>

                        <View style={styles.peopleContainer}>
                            <Icon name="person" size={16} color="#4B84F5" />
                            <Text style={styles.peopleText}>{maxPeople} người lớn</Text>
                        </View>

                        <Text style={styles.priceText}>{price}đ</Text>
                    </View>



                    <View style={styles.buttonContainer}>

                        {status === "-1" ?
                            (<CustomButton
                                title="Đánh giá"
                                backgroundColor="#dadada"
                                disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                                titleColor="#101828"
                                disabledTitleColor="#FFFFFF"
                                loading={loading}
                                style={{ minWidth: 127.4 }}
                                disabled={""}

                                onPress={onReviewAction}
                            />
                            )
                            : status === "0" ?
                                (
                                    (<CustomButton
                                        title="Huỷ"
                                        backgroundColor="#fef2f2"
                                        disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                                        titleColor="#101828"
                                        disabledTitleColor="#FFFFFF"
                                        loading={loading}
                                        disabled={""}
                                        style={{ minWidth: 127.4 }}
                                        onPress={onCancelAction}
                                    />)
                                )
                                : null
                        }


                        <CustomButton
                            title={status === "-1" || status === "0" ? "Xem chi tiết" :

                                status === "1" ? "Đặt lại" : "N/a"}
                            backgroundColor="#101828"
                            disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                            titleColor="#ffffff"
                            disabledTitleColor="#FFFFFF"
                            loading={loading}
                            disabled={false}  // Changed from empty string to boolean
                            style={status === "-1" || status === "0" ? {} : status === "1" ? { minWidth: 285 } : {}}  // Fixed style object syntax
                            onPress={
                                status === "-1" ? onViewDetail :
                                    status === "0" ? onViewDetail :
                                        status === "1" ? onRebookingAction :
                                            null
                            }
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minWidth: 350,
    },
    contentRow: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        minHeight: 140,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-between', // This helps distribute space evenly
        minHeight: 130, // Slightly less than contentRow to maintain padding
    },
    detailsContainer: {
        gap: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
    },
    tagContainer: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginVertical: 4,
    },
    tagText: {
        color: '#4B84F5',
        fontSize: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingRight: 8
    },
    locationText: {
        color: '#00000050',
        flex: 1,
    },
    dateText: {
        color: '#4e72e3',
    },
    peopleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    peopleText: {
        color: '#00000050',
    },
    priceText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4e72e3',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
        // justifyContent: 'space-between'
    },

    detailsButton: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#FFFFFF',
    },
});