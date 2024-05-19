import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, set, get, remove } from 'firebase/database';
import app from "../firebaseConfig";
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'; // Importieren der Icons


function ReadProduct ({myItem}) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const name = myItem.productName;

    const fetchData = async (myItem) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const products = Object.values(snapshot.val());
            const productKeys = Object.keys(snapshot.val());
            // Filtern der Produkte nach dem gegebenen Produktnamen
            function compare(item) { return item.productName === name; }
            const filteredProducts2 = products.filter(compare);
                                             
            setFilteredProducts(filteredProducts2);
        } else {
            alert("Error: No data found");
        }
    };

    useEffect(() => {
        fetchData(myItem);
    }, []);
    

    return (
            <View>
                <Text> {myItem.productName}</Text>
                {filteredProducts.map((item, index) => (
                    <View key={index} >
                        {/* Der TouchableOpacity hier ist ausschließlich für das Icon. */}
                        <TouchableOpacity >
                            <Entypo name="edit" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteProduct(item.id)} >
                            <MaterialCommunityIcons name="delete-forever" size={30} color="black" />
                        </TouchableOpacity>
                            <View>
                                <Text >{item.productName}</Text>
                                <Text >{item.productPrice}</Text>
                                <Text >{item.productAmount}</Text>
                                <Text >{item.productDate}</Text>
                            </View>
                    </View>
                ))}
            </View>
        );
}

export default ReadProduct;