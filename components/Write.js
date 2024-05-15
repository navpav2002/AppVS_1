import React, { useState } from 'react';
import app from "../firebaseConfig";
import { getDatabase, ref, set, push } from 'firebase/database';
import { TextInput, View, Button, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native'; 
import { FontAwesome6 } from '@expo/vector-icons';

function Write({ email }) {
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [products, setProducts] = useState([]);

    const addProduct = () => {
        setProducts([...products, { productName: inputValue1, productPrice: inputValue2 }]);
        setInputValue1("");
        setInputValue2("");
    };

    const removeProduct = (index) => { 
        setProducts(products.filter((_, i) => i !== index)); // (element, index, array) => Condition
    };

    const saveProducts = async () => {
        const db = getDatabase(app);
        const productsRef = ref(db, "realtime/Products");

        const promises = products.map(product => {
            const newDocRef = push(productsRef);
            return set(newDocRef, { ...product, email });
        });

        Promise.all(promises)
        .then(() => {
            alert("All products saved successfully");
        }).catch((error) => {
            alert("Error: " + error.message); 
        });
    };

    return (
        <View style={styles.newListView}>
            <View style={styles.textInput1View}>
                <TextInput 
                    value={inputValue1}
                    style={styles.textInput1}
                    onChangeText={(text) => setInputValue1(text)}
                    placeholder="Product Name"
                /> 
            </View>
            <View style={styles.textInput2View}>
                <TextInput 
                    value={inputValue2}
                    onChangeText={(text) => setInputValue2(text)}
                    placeholder="Product Price"
                />
            </View>
            <View style={styles.addProductView}>
                <TouchableOpacity style={styles.addButtonIcon} title="Add Product" onPress={addProduct} >
                    <FontAwesome6 name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={({ item, index }) => (
                    <View style={styles.productItem}>
                        <Text>{item.productName} - {item.productPrice}</Text>
                        <Button title="Remove" onPress={() => removeProduct(index)} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            </View>
            <View style={styles.allProductsButtonView}>
                <Button onPress={saveProducts} title="Save All Products" />
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
        backgroundColor: '#B4DEE4',
        borderColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        width: 200,
    },
    textInput2View: {
        backgroundColor: '#B4DEE4',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        width: 200
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
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 10,
    },
    addButtonIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 90,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10,
        width: 60,
        height: 60,
        backgroundColor: '#6420AA'
    },
    addProductView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    allProductsButtonView: {
        width: 120,
        height: 60,
        backgroundColor: '#B4DEE4',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Write;
