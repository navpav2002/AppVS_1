import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, get, remove, query, orderByChild, equalTo, onValue, set } from 'firebase/database';
import app from "../firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import ReadProduct from './ReadProduct';

const Read = () => {
    const [productArray, setProductArray] = useState([]);
    const [editButtonPressed, setEditButtonPressed] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');
    const [editProductAmount, setEditProductAmount] = useState('');
    const [editProductDate, setEditProductDate] = useState('');
    const [email, setEditProductEmail] = useState('');

    useEffect(() => {
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");

        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                const productMap = {};

                Object.keys(products).forEach(productId => {
                    const product = products[productId];
                    if (!productMap[product.productName]) {
                        productMap[product.productName] = {
                            id: productId,
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productAmount: product.productAmount,
                            productDate: product.date,
                            users: []
                        };
                    }
                    productMap[product.productName].users.push({
                        email: product.email,
                        amount: product.productAmount,
                        price: product.productPrice,
                        date: product.date
                    });
                });

                setProductArray(Object.values(productMap));
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const startEdit = (product) => {
        setEditProductId(product.id);
        setEditProductName(product.productName);
        setEditProductPrice(product.productPrice);
        setEditProductAmount(product.productAmount);
        setEditProductDate(product.productDate);
        setEditProductEmail(product.email);
        setEditButtonPressed(true); // Set the edit button pressed state to true
    };

    const saveEditProp = async () => {
        const db = getDatabase(app);
        const productRef = ref(db, `realtime/Products/${editProductId}`);
        await set(productRef, {
            productName: editProductName,
            productPrice: editProductPrice,
            productAmount: editProductAmount,
            date: editProductDate,
            email: email,
        });
        setEditProductId(null);
        setEditButtonPressed(false); // Reset the edit button pressed state
    };

    const deleteProductProp = async (productName) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");
        const q = query(dbRef, orderByChild('productName'), equalTo(productName));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            const updates = {};
            snapshot.forEach(childSnapshot => {
                updates[childSnapshot.key] = null;
            });
            await set(dbRef, updates);
            // alert("Product deleted successfully!");
            // Remove the product from the local state
            setProductArray(prevProducts => prevProducts.filter(product => product.productName !== productName));
        }
    };

    const calculateTotalPrice = () => {
    const totalSum = productArray.reduce((acc, product) => {
        const productSum = product.users.reduce((userAcc, user) => {
            return userAcc + (parseFloat(user.price) * parseFloat(user.amount));
        }, 0);
        return acc + productSum;
    }, 0);

    Alert.alert(
        "Summe",  // Titel des Alerts
        `Die Gesamtsumme der Produktpreise beträgt: ${totalSum.toFixed(2)}€`,  // Nachricht
        [
            { text: "OK" }  // Button
        ]
    );
};


    return (
        <View>
            <ScrollView style={styles.container}>
                {productArray.map((item, index) => (
                    <View key={index}>
                        <ReadProduct
                            item={item}
                            editButtonPressed={editButtonPressed}
                            editProductId={editProductId}
                            editProductName={editProductName}
                            editProductPrice={editProductPrice}
                            editProductAmount={editProductAmount}
                            editProductDate={editProductDate}
                            startEdit={startEdit}
                            saveEditProp={saveEditProp}
                            deleteProductProp={deleteProductProp}
                            productId={item.id}
                        />
                    </View>
                ))}
            </ScrollView>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.buttonSumProducts} onPress={calculateTotalPrice}>
                    <MaterialIcons name="attach-money" size={30} color={'#fff'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        borderColor: '#fff',
        borderWidth: 4,
        marginTop: -5,
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
        marginBottom: 20,
    },
    buttonInactive: {
        backgroundColor: '#21ABA5',  // Hintergrundfarbe beim Aktivieren
        height: 80,
    },
    buttonActive: {
        backgroundColor: '#FFC90E',  // Hintergrundfarbe beim Aktivieren
        height: 80,
    },
    editButtonActive: {

    },
    editButtonInactive: {

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
    },
    editIcon: {
        position: 'absolute',
        top: 5,
        right: 10,
        zIndex: 10
    },
    deleteIcon: {
        position: 'absolute',
        top: 45,
        right: 10,
        zIndex: 10,
    },
    doneIcon: {
        position: 'absolute',
        top: 55,
        right: 120,
        zIndex: 10,
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 3,
    },
    buttonSumProducts: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#fff',
        width: 60,
        height: 60,
        backgroundColor: '#FFC90E',
        shadowColor: '#000', // Farbe des Schattens
        shadowOffset: { width: 0, height: 4 }, // Versatz des Schattens
        shadowOpacity: 0.5, // Deckkraft des Schattens
        shadowRadius: 5, // Radius des Schattens
        elevation: 10, // Für Android-Schatten
        marginTop: 8,
    },
    buttonSumText: {
        color: '#000',
        fontFamily: 'Kalam-Bold',
        fontSize: 22,
    },
});

export default Read;
