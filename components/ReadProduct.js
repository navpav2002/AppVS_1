import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, set, remove, query, orderByChild, equalTo, get } from 'firebase/database';
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
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

const ReadProduct = ({ item, editButtonPressed, editProductId, editProductName, editProductPrice, editProductAmount, editProductDate, startEdit, saveEditProp, deleteProductProp }) => {
    const totalAmount = item.users.reduce((acc, user) => acc + parseFloat(user.amount), 0);
    const totalPrice = item.users.reduce((acc, user) => acc + parseFloat(user.price) * user.amount, 0);
    const [isProductVisible, setIsProductVisible] = useState(true);

    const saveEdit = async () => {
        const db = getDatabase(app);
        const productRef = ref(db, `realtime/Products/${editProductId}`);
        await set(productRef, {
            productName: editProductName,
            productPrice: editProductPrice,
            productAmount: editProductAmount,
            date: editProductDate,
        });
        Alert.alert("Success", "Product updated successfully!");
        startEdit(null); // Reset the editing state
    };

    const deleteProduct = async (productName) => {
        try {
            await deleteProductProp(productName);
            Alert.alert("Success", "Product deleted successfully!");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const deleteUserProduct = async (userEmail, productId) => {
        const db = getDatabase(app);
        console.log(productId);
        console.log(userEmail);
    
        // Stellen Sie sicher, dass der Pfad zur Produkt-ID korrekt ist
        const productRef = ref(db, `realtime/Products/${productId}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
            let product = snapshot.val();
            console.log("Product data:", product);  // Debugging-Log
    
            if (product.email === userEmail) {
                await remove(productRef);  // Entferne das gesamte Produkt, wenn die E-Mail übereinstimmt
                Alert.alert("Success", "User and product removed successfully!");
                setIsProductVisible(false);  // Setze isProductVisible auf false, um die Karte zu entfernen
                // Rufen Sie die Funktion aus den Props auf, um das Produkt aus der Liste zu entfernen
                deleteProductProp(productId);
            } else {
                Alert.alert("Error", "User email does not match!");
                setIsProductVisible(false); 
            }
        } else {
            Alert.alert("Error", "Product not found!");
        }
    };
    
    
    
    
    
    
    return (
        isProductVisible && (
            <View style={styles.productCard}>
                <TouchableOpacity style={[styles.editIcon, editButtonPressed ? styles.editButtonActive : styles.editButtonInactive]} onPress={() => {
                    console.log("From product with id: ", item.id); startEdit(item) }}>
                    <Entypo name="edit" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProduct(item.productName)} style={styles.deleteIcon}>
                    <MaterialCommunityIcons name="delete-forever" size={30} color="black" />
                </TouchableOpacity>
                {editProductId === item.id ? (
                    <View>
                        <TextInput style={styles.productName} value={editProductName} onChangeText={startEdit} />
                        <TextInput style={styles.productPrice} value={editProductPrice} onChangeText={startEdit} />
                        <TextInput style={styles.productAmount} value={editProductAmount} onChangeText={startEdit} />
                        <TextInput style={styles.productDate} value={editProductDate} onChangeText={startEdit} />
                        <TouchableOpacity style={styles.doneIcon} onPress={saveEdit}>
                            <MaterialIcons name="done-outline" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.productName}>{item.productName}</Text>
                        <Text style={styles.totalAmount}>Total Amount: {totalAmount}</Text>
                        <Text style={styles.totalPrice}>Total Price: {totalPrice}</Text>
                        <Text style={styles.productUsers}>Users:</Text>
                        {item.users && item.users.map((user, idx) => (
                            <View key={idx} style={styles.userContainer}>
                                <TouchableOpacity onPress={() => {console.log("From product with id: ", item.id)}} style={styles.editUserIcon}>
                                    <Entypo name="edit" size={30} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteUserProduct(user.email, item.id)} style={styles.deleteUserIcon}>
                                    <MaterialCommunityIcons name="delete" size={30} color="red" />
                                </TouchableOpacity>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                <Text style={styles.userAmount}>    Amount: {user.amount}</Text>
                                <Text style={styles.userPrice}>    Price: {user.price}</Text>
                                <Text style={styles.userDate}>    {formatDate(user.date)}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        )
    );
};


const styles = StyleSheet.create({
    // Add your styles here
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
    productName: {
        fontSize: 24,
        color: '#333',
        fontFamily: 'Kalam-Bold',
    },
    totalAmount: {
        fontSize: 22,
        color: '#07688C',
        fontFamily: 'Kalam-Regular',
    },
    totalPrice: {
        fontSize: 22,
        color: '#07688C',
        fontFamily: 'Kalam-Regular',
    },
    productUsers: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kalam-Bold',
    },
    userContainer: {
        marginTop: 5,
    },
    userEmail: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kalam-Regular',
    },
    userAmount: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kalam-Regular',
    },
    userPrice: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kalam-Regular',
    },
    userDate: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kalam-Regular',
    },
    editIcon: {
        position: 'absolute',
        top: 5,
        right: 10,
        zIndex: 10
    },
    editUserIcon: {
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
    deleteUserIcon: {
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
    editButtonActive: {
        // your styles
    },
    editButtonInactive: {
        // your styles
    },
});

export default ReadProduct;
