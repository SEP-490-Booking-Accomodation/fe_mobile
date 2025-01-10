import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

const MapWithPopup = ({ latitude = 37.78825, longitude = -122.4324, title = "Take me there" }) => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={{ latitude, longitude }}>
                    <View style={styles.popupContainer}>
                        <View style={styles.greenBox}>
                            <MaterialIcons name="location-on" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.whiteBox}>
                            <Text style={styles.text}>{title}</Text>
                        </View>
                        <View style={styles.pointer} />
                    </View>
                </Marker>
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: 202,
        borderRadius: 20,
        overflow: 'hidden',
    },
    popupContainer: {
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    greenBox: {
        backgroundColor: '#59C97E',
        width: 160,
        height: 80,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteBox: {
        backgroundColor: '#FFFFFF',
        width: 160,
        height: 40,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    pointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
        alignSelf: 'center',
        marginTop: -1, 
    },
    text: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    icon: {
        fontSize: 32,
        color: '#FFFFFF',
    },
});

export default MapWithPopup;
