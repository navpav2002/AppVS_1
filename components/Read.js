import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import app from "../firebaseConfig";
import { useFonts } from 'expo-font';

function Read() {
    const [productArray, setProductArray] = useState([]);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [cardButtonActive, setButtonCardActive] = useState(false);

    const fetchData = async () => {
        setButtonPressed(true);
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setProductArray(Object.values(snapshot.val()));
        } else {
            alert("Error: No data found");
        }
        setTimeout(() => setButtonPressed(false), 0);  // Setzt den Zustand nach 0 Sekunden zurück
    };

    const productInfo = async (index) => {
        setButtonCardActive(prevState => ({
            ...prevState,
            [index]: !prevState[index]  // Umschalten des Zustands der einzelnen Karte
        }));
        setTimeout(() => setButtonCardActive(false), 250);
    }

    let [fontsLoaded] = useFonts({
        'PoetsenOne-Regular': require('../assets/fonts/PoetsenOne-Regular.ttf'),
        'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
        'Kalam-Bold': require('../assets/fonts/Kalam-Bold.ttf'),
        'Kalam-Light': require('../assets/fonts/Kalam-Light.ttf'),
        'Kalam-Regular': require('../assets/fonts/Kalam-Regular.ttf'),
      })

    return (
    <View>
        <TouchableOpacity onPress={fetchData} activeOpacity={1}> 
                <View style={[styles.header, buttonPressed ? styles.buttonActive : styles.buttonInactive]}>
                    <Text style={styles.buttonText}>Display Products</Text>
                </View>
            </TouchableOpacity>
        <ScrollView style={styles.container}>
                                                {/* activeOpacity, damit der Button nur eine Farbe beim Anklicken hat */} 
            {productArray.map((item, index) => (
                <View key={index} style={[ index === productArray.length - 1 ? styles.lastCard : null]}>
                    <TouchableOpacity key={index} onPress={() => productInfo(index)} activeOpacity={1}> 
                        <View style={[cardButtonActive[index] ? styles.cardActive : styles.cardInactive]}>
                            <Text style={styles.productName} >{item.productName}</Text>
                            <Text style={styles.productPrice}>{item.productPrice}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#21ABA5',
        width: 370,
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 15,
        overflow: 'hidden', // Wichtig, um den Inhalt innerhalb der abgerundeten Grenzen zu halten
        marginTop: 10,
    },
    header: {
        padding: 20,
        backgroundColor: '#B4DEE4',
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        overflow: 'hidden',  // Wichtig für abgerundete Ecken
        marginTop: 20,
        borderColor: '#fff',
        borderWidth: 4,
    },
    buttonText: {
        color: '#000',
        fontFamily: 'Kalam-Bold',
        fontSize: 22,
    },
    productCard: {
        backgroundColor: '#B4DEE4',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderColor: '#fff',
        borderWidth: 2,
        height: 80,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 24,
        color: '#333',
        fontFamily: 'Kalam-Bold',
    },
    productPrice: {
        fontSize: 22,
        color: '#07688C',
        fontFamily: 'Kalam-Regular',
    },
    lastCard: {
        marginBottom: 30,
    },
    buttonInactive: {
        backgroundColor: '#21ABA5',  // Hintergrundfarbe beim Aktivieren
    },
    buttonActive: {
        backgroundColor: '#FFC90E',  // Hintergrundfarbe beim Aktivieren
    },
    cardActive: {
        backgroundColor: '#FFC90E',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderColor: '#fff',
        borderWidth: 2,
        height: 80,
        justifyContent: 'center',  // Hintergrundfarbe beim Aktivieren
    },
    cardInactive: {
        backgroundColor: '#B4DEE4',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderColor: '#fff',
        borderWidth: 2,
        height: 80,
        justifyContent: 'center',
    }
});

export default Read;