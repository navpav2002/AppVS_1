import React, {useState} from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import LogoApp from '../assets/LogoApp.png';

function CustomImage() {
    return (
        <View style={styles.containerView}>
            <Image source={LogoApp} style={styles.containerImage} />
            <Text style={styles.containerText}>Shopping Cart</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containerView: {
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B4DEE4',
        position: 'absolute', // Position auf 'absolute' setzen
        top: -260, // Von oben 0 Pixel
        left: 68
    },
    containerImage: {
        width: 170,
        height: 170,
    },
    containerText: {
        color: "#5DA8FB",
        fontSize: 25,
    }
})

export default CustomImage;