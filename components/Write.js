import React, { useState } from 'react';
import app from "../firebaseConfig";
import { getDatabase, ref, set, push } from 'firebase/database';
import { TextInput, View, Button, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

function Write({ email, theme }) {
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [amount, setAmount] = useState("");
    const [products, setProducts] = useState([]);
    const date = Date();

    const addProduct = () => {
        setProducts([...products, { productName: inputValue1, productPrice: inputValue2, productAmount: amount }]);
        setInputValue1("");
        setInputValue2("");
        setAmount("");
    };

    const removeProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index)); // (element, index, array) => Condition
    };

    const saveProducts = async () => {
        const db = getDatabase(app);
        const productsRef = ref(db, "realtime/Products");

        const promises = products.map(product => {
            const newDocRef = push(productsRef);
            return set(newDocRef, { ...product, email, date });
        });

        Promise.all(promises)
            .then(() => {
                Alert.alert("Success", "All products saved successfully!");
                setProducts([]);
            }).catch((error) => {
                alert("Error: " + error.message);
            });
    };

    const calculateTotalPrice = () => {
        const sum = products.reduce((acc, item) => {
            const price = parseFloat(item.productPrice.replace(',', '.'));
            const amount = parseFloat(item.productAmount.replace(',', '.'));
            return acc + (price * amount);
        }, 0);
        Alert.alert(
            "Summe",  // Titel des Alerts
            `Die Gesamtsumme der Produktpreise beträgt: ${sum.toFixed(2)}€`,  // Nachricht
            [
                { text: "OK" }  // Button
            ]
        );
    };

    const getBackgroundColor = () => {
        return theme === 'light' ? '#21ABA5' : '#333'; // Wechselt die Hintergrundfarbe je nach Theme
    };

    return (
        <View style={styles.newListView}>
            <View style={styles.addProductInputs}>
                <View style={[styles.textInput1View, { backgroundColor: getBackgroundColor() }]}>
                    <TextInput
                        value={inputValue1}
                        onChangeText={(text) => setInputValue1(text)}
                        placeholder="Product Name"
                        placeholderTextColor="#fff"
                        placeholderFontFamily='Kalam-Regular'
                        style={{ color: '#fff' }}
                    />
                </View>

                <View style={[styles.textInput2View, { backgroundColor: getBackgroundColor() }]}>
                    <TextInput
                        value={inputValue2}
                        onChangeText={(text) => setInputValue2(text)}
                        placeholder="Product Price"
                        placeholderTextColor="#fff"
                        style={{ color: '#fff' }}
                    />
                </View>

                <View style={[styles.textInput2View, { backgroundColor: getBackgroundColor() }]}>
                    <TextInput
                        value={amount}
                        onChangeText={(text) => setAmount(text)}
                        placeholder="Product Amount"
                        placeholderTextColor="#fff"
                        style={{ color: '#fff' }}
                    />
                </View>
            </View>
            <View style={styles.addProductView}>
                <TouchableOpacity style={styles.addButtonIcon} title="Add Product" onPress={addProduct} >
                    <FontAwesome6 name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
                <FlatList
                    data={products}
                    renderItem={({ item, index }) => (
                        <View style={styles.productItem}>
                            <Text>{item.productName} - {item.productPrice}€ - {item.productAmount}ME </Text>
                            <TouchableOpacity onPress={() => removeProduct(index)} style={styles.deleteIcon}>
                                <MaterialCommunityIcons name="delete-forever" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={styles.addListView}>
                <TouchableOpacity style={styles.addListIcon2} title="Add Product" onPress={saveProducts} >
                    <MaterialCommunityIcons name="playlist-check" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sumButton} title="Gesamtsumme berechnen" onPress={calculateTotalPrice} >
                    <MaterialIcons name="attach-money" size={30} color={"#fff"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#21ABA5',
        width: 300,
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 15,
        overflow: 'hidden', // Wichtig, um den Inhalt innerhalb der abgerundeten Grenzen zu halten
        marginTop: 10,
    },
    textInput1View: {
        borderColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        width: 300,
        borderWidth: 3,
        borderRadius: 15,
        borderColor: '#fff',
    },
    textInput2View: {
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        width: 300,
        borderWidth: 3,
        borderRadius: 15,
        borderColor: '#fff',
    },
    buttonStyle1: {
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#B4DEE4',
        borderRadius: 10,
        borderColor: '#DDD',
        marginBottom: 10,
        margin: 10,
        borderColor: '#fff',
        borderWidth: 2,
    },
    addButtonIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#fff',
        width: 60,
        height: 60,
        backgroundColor: '#e60b75',
        shadowColor: '#000', // Farbe des Schattens
        shadowOffset: { width: 0, height: 4 }, // Versatz des Schattens
        shadowOpacity: 0.5, // Deckkraft des Schattens
        shadowRadius: 5, // Radius des Schattens
        elevation: 10, // Für Android-Schatten
    },
    addListIcon2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 10,
        width: 60,
        height: 60,
        backgroundColor: '#e60b75',
        shadowColor: '#000', // Farbe des Schattens
        shadowOffset: { width: 0, height: 4 }, // Versatz des Schattens
        shadowOpacity: 0.5, // Deckkraft des Schattens
        shadowRadius: 5, // Radius des Schattens
        elevation: 10, // Für Android-Schatten
    },
    addListView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: -10,
        gap: 50
    },
    addProductView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    allProductsButtonView: {
        width: 120,
        height: 70,
        backgroundColor: '#B4DEE4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addProductInputs: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        borderColor: '#fff',
        overflow: 'hidden', // Wichtig, um den Inhalt innerhalb der abgerundeten Grenzen zu halten
    },
    sumButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 10,
        width: 60,
        height: 60,
        backgroundColor: '#e60b75',
        shadowColor: '#000', // Farbe des Schattens
        shadowOffset: { width: 0, height: 4 }, // Versatz des Schattens
        shadowOpacity: 0.5, // Deckkraft des Schattens
        shadowRadius: 5, // Radius des Schattens
        elevation: 10, // Für Android-Schatten
    }
});

export default Write;