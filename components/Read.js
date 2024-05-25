import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import app from "../firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import ReadProduct from './ReadProduct';

const Read = ({ theme }) => {
    const [productArray, setProductArray] = useState([]);
    const [editButtonPressed, setEditButtonPressed] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');
    const [editProductAmount, setEditProductAmount] = useState('');
    const [editProductDate, setEditProductDate] = useState('');
    const [editProductEmail, setEditProductEmail] = useState('');

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
                            productName: product.productName,
                            users: []
                        };
                    }

                    productMap[product.productName].users.push({
                        id: productId,
                        email: product.email,
                        amount: product.productAmount,
                        price: product.productPrice,
                        date: product.date
                    });
                });

                setProductArray(Object.values(productMap));
            }
        });

        return () => unsubscribe();
    }, []);

    const startEdit = (product) => {
        setEditProductId(product.id);
        setEditProductName(product.productName);
        setEditProductPrice(product.price);
        setEditProductAmount(product.amount);
        setEditProductDate(product.date);
        setEditProductEmail(product.email);
        setEditButtonPressed(true);
    };

    const saveEditProp = async () => {
        const db = getDatabase(app);
        const productRef = ref(db, `realtime/Products/${editProductId}`);
        await set(productRef, {
            productName: editProductName,
            productPrice: editProductPrice,
            productAmount: editProductAmount,
            date: editProductDate,
            email: editProductEmail,
        });
        setEditProductId(null);
        setEditButtonPressed(false);
    };

    const deleteUserProductProp = async (productId, productName) => {
        const db = getDatabase(app);
        const productRef = ref(db, `realtime/Products/${productId}`);
        await remove(productRef);
        setProductArray(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.productName === productName) {
                    product.users = product.users.filter(user => user.id !== productId);
                }
                return product;
            }).filter(product => product.users.length > 0); // Entferne leere Karten
            return updatedProducts;
        });
        Alert.alert("Success", "User product deleted successfully!");
    };

    const calculateTotalPrice = () => {
        const totalSum = productArray.reduce((acc, product) => {
            const productSum = product.users.reduce((userAcc, user) => {
                return userAcc + (parseFloat(user.price) * parseFloat(user.amount));
            }, 0);
            return acc + productSum;
        }, 0);

        Alert.alert(
            "Summe",
            `Die Gesamtsumme der Produktpreise beträgt: ${totalSum.toFixed(2)}€`,
            [{ text: "OK" }]
        );
    };

    return (
        <View style={styles.wrapper}>
            <View style={theme === 'light' ? styles.container : styles.containerDark}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {productArray.map((item, index) => (
                        <View key={index} style={index === productArray.length - 1 ? styles.lastItem : null}>
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
                                deleteUserProductProp={deleteUserProductProp}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.buttonSumProducts} onPress={calculateTotalPrice}>
                <MaterialIcons name="attach-money" size={30} color={'#fff'} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#21ABA5',
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 60, // Platz für den Button unter dem Container
        width: 360,
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#333',
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 60, // Platz für den Button unter dem Container
        width: 360,
    },
    scrollContainer: {
        paddingBottom: 10, // Platz für den Button
    },
    lastItem: {
        marginBottom: 10, // zusätzlicher Platz für den letzten Eintrag
    },
    buttonSumProducts: {
        position: 'absolute',
        marginBottom: -10,
        bottom: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#fff',
        width: 60,
        height: 60,
        backgroundColor: '#FFC90E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
});

export default Read;
