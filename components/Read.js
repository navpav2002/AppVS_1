import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, set, get, remove } from 'firebase/database';
import app from "../firebaseConfig";
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'; // Importieren der Icons

function Read() {
    const [productArray, setProductArray] = useState([]);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [editButtonPressed, setEditButtonPressed] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');

    const fetchData = async () => {
        
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setProductArray(Object.values(snapshot.val()).map((product, index) => ({ ...product, id: Object.keys(snapshot.val())[index] })));
        } else {
            alert("Error: No data found");
        }
        setTimeout(() => setButtonPressed(false), 0); 
    };

/*
    useEffect(() => {
        fetchData();
    }, []);
*/
    const startEdit = (product) => {
        setEditProductId(product.id);
        setEditProductName(product.productName);
        setEditProductPrice(product.productPrice);
    };

    const saveEdit = async () => {
        const db = getDatabase(app);
        const productRef = ref(db, `realtime/Products/${editProductId}`);
        await set(productRef, {
            productName: editProductName,
            productPrice: editProductPrice
        });
        setEditProductId(null);
        fetchData(); // Refresh data
    };

    const calculateTotalPrice = () => {
        const sum = productArray.reduce((acc, item) => {
            const price = parseFloat(item.productPrice.replace(',', '.'));
            return acc + price;
        }, 0);
        Alert.alert (
            "Summe",  // Titel des Alerts
            `Die Gesamtsumme der Produktpreise beträgt: ${sum.toFixed(2)}€`,  // Nachricht
            [
                { text: "OK" }  // Button
            ]
        );
    };

    const deleteProduct = async (ProductId) => {
        const db = getDatabase(app);
        const productRef = ref(db, `realtime/Products/${ProductId}`);
        await remove(productRef);
        // window.location.reload();
        fetchData();
    }

    return (
        <View>
            <TouchableOpacity  
                onPress={() => {
                    setButtonPressed(true);
                    fetchData();
                }} 
                activeOpacity={1}
            > 
                <View style={[styles.header, buttonPressed ? styles.buttonActive : styles.buttonInactive]}>
                    <Text style={styles.buttonText}>Display Products</Text>
                </View>
            </TouchableOpacity>
            <ScrollView style={styles.container}>
                {productArray.map((item, index) => (
                    <View key={index} style={styles.productCard}>
                        {/* Der TouchableOpacity hier ist ausschließlich für das Icon. */}
                        <TouchableOpacity style={[styles.editIcon, editButtonPressed ? styles.editButtonActive : styles.editButtonInactive]} onPress={() => startEdit(item)}>
                            <Entypo name="edit" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.deleteIcon}>
                            <MaterialCommunityIcons name="delete-forever" size={30} color="black" />
                        </TouchableOpacity>
                        {editProductId === item.id ? (
                            <View>
                                <TextInput style={styles.productName} value={editProductName} onChangeText={setEditProductName} />
                                <TextInput style={styles.productPrice} value={editProductPrice} onChangeText={setEditProductPrice} />
                                <TouchableOpacity style={styles.doneIcon} title="Gesamtsumme berechnen" onPress={saveEdit} >
                                    <MaterialIcons name="done-outline" size={30} color="#000" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <Text style={styles.productPrice}>{item.productPrice}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.buttonSumProducts} title="Gesamtsumme berechnen" onPress={calculateTotalPrice} >
                    <MaterialIcons name="attach-money" size={30} color="#FFC90E" />
                </TouchableOpacity>
            </View>
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
        marginBottom: 20,
    },
    buttonInactive: {
        backgroundColor: '#21ABA5',  // Hintergrundfarbe beim Aktivieren
    },
    buttonActive: {
        backgroundColor: '#FFC90E',  // Hintergrundfarbe beim Aktivieren
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
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        overflow: 'hidden',  // Wichtig für abgerundete Ecken
        borderColor: '#fff',
        borderWidth: 2,
        backgroundColor:'#21ABA5'
    },
    buttonSumText: {
        color: '#000',
        fontFamily: 'Kalam-Bold',
        fontSize: 22,
    },
});

export default Read;