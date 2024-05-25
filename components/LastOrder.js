import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, get, query, orderByChild, equalTo, set, push, onValue } from 'firebase/database';
import app from "../firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';

const LastOrder = ({ email }) => {
    const [recentProducts, setRecentProducts] = useState([]);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toString(); // Im gleichen Format wie in der Write-Komponente
    };

    const getLastOrder = async () => {
        const db = getDatabase(app);
        const productsRef = ref(db, 'realtime/Products');
        const userProductsQuery = query(productsRef, orderByChild('email'), equalTo(email));

        try {
            const snapshot = await get(userProductsQuery);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const productsArray = Object.values(data);
                const sortedProducts = productsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                const lastOrderDate = new Date(sortedProducts[0].date).toString();
                const lastOrderProducts = sortedProducts.filter(product => new Date(product.date).toString() === lastOrderDate);

                const promises = lastOrderProducts.map(product => {
                    const newDocRef = push(productsRef);
                    return set(newDocRef, { ...product, date: new Date().toString() });
                });

                await Promise.all(promises);
                Alert.alert("Success", "Last order repeated successfully!");
            } else {
                Alert.alert("Error", "No previous order found!");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to repeat last order: " + error.message);
        }
    };

    useEffect(() => {
        const db = getDatabase(app);
        const productsRef = ref(db, 'realtime/Products');
        const userProductsQuery = query(productsRef, orderByChild('email'), equalTo(email));

        const unsubscribe = onValue(userProductsQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const productsArray = Object.values(data);
                setRecentProducts(productsArray.sort((a, b) => new Date(b.date) - new Date(a.date)));
            }
        });

        return () => unsubscribe();
    }, [email]);

    return (
        <View>
            <TouchableOpacity style={styles.LastOrderContainer} onPress={getLastOrder}>
                <MaterialIcons name="replay" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    LastOrderContainer: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: '#e84c3c',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default LastOrder;
