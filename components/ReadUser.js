import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getDatabase, ref, onValue } from 'firebase/database';
import app from "../firebaseConfig";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    });
};

const ReadUserProduct = ({ item }) => {
    return (
        <View style={styles.productCard}>
            <Text style={styles.readUserText}>{item.productName}</Text>
            <Text style={styles.readUserTextSmall}>Preis: {item.productPrice}</Text>
            <Text style={styles.readUserTextSmall}>Menge: {item.productAmount}</Text>
            <Text style={styles.readUserTextSmall}>Datum: {formatDate(item.productDate)}</Text>
        </View>
    );
}

const ReadUser = ({ email, theme }) => {
    const [productArray, setProductArray] = useState([]);

    console.log("READ USER EMAIL " + email);

    useEffect(() => {
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");

        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                const today = new Date().toISOString().split('T')[0]; 

                const userProducts = Object.keys(products).reduce((prod, productId) => {
                    const product = products[productId];
                    const productDate = new Date(product.date).toISOString().split('T')[0];
                    
                    console.log(productDate + "                   " + today)

                    if (product.email === email && productDate === today) {
                        prod.push({
                            id: productId,
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productAmount: product.productAmount,
                            productDate: product.date,
                        });
                    }
                    return prod;
                }, []);
                setProductArray(userProducts);
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, [email]);

    return (
        <View>
            <ScrollView style={theme === 'light' ? styles.container : styles.containerDark}>
                {productArray.map((item, index) => (
                    <View key={index}>
                        <ReadUserProduct item={item} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default ReadUser;

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
    containerDark: {
        flex: 1,
        backgroundColor: '#333',
        width: 370,
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 15,
        overflow: 'hidden', // Wichtig, um den Inhalt innerhalb der abgerundeten Grenzen zu halten
        marginTop: 10,
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
        justifyContent: 'center',
    },
    readUserText: {
        fontSize: 24,
        color: '#333',
        fontFamily: 'Kalam-Bold',
    },
    readUserTextSmall: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Kalam-Regular',
    },
});
