import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, set, get } from 'firebase/database';
import app from "../firebaseConfig";

const ReadProduct = ({ item, editButtonPressed, editProductId, editProductName, editProductPrice, editProductAmount, editProductDate, startEdit, saveEditProp, deleteUserProductProp }) => {
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingUserAmount, setEditingUserAmount] = useState('');
    const [editingUserPrice, setEditingUserPrice] = useState('');

    const totalAmount = item.users.reduce((acc, user) => acc + parseFloat(user.amount), 0);
    const totalPrice = item.users.reduce((acc, user) => acc + (parseFloat(user.price) * user.amount), 0);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        }).replace(/,/g, '');
    };
    
    const saveEdit = async () => {
        await saveEditProp();
        Alert.alert("Success", "Product updated successfully!");
        startEdit(null);
    };

    const deleteUserProduct = async (userId) => {
        try {
            await deleteUserProductProp(userId, item.productName);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const startUserEdit = (user) => {
        setEditingUserId(user.id);
        setEditingUserAmount(user.amount);
        setEditingUserPrice(user.price);
    };

    const saveUserEdit = async (userId) => {
        const db = getDatabase(app);
        const userRef = ref(db, `realtime/Products/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            await set(userRef, {
                ...userData,
                productAmount: editingUserAmount,
                productPrice: editingUserPrice,
            });
            setEditingUserId(null);
            Alert.alert("Success", "User product updated successfully!");
        }
    };

    return (
        <View style={styles.productCard}>
            {editProductId === item.id ? (
                <View>
                    <TextInput style={styles.productName} value={editProductName} onChangeText={setEditProductName} />
                    <TextInput style={styles.productPrice} value={editProductPrice} onChangeText={setEditProductPrice} />
                    <TextInput style={styles.productAmount} value={editProductAmount} onChangeText={setEditProductAmount} />
                    <TextInput style={styles.productDate} value={editProductDate} onChangeText={setEditProductDate} />
                    <TouchableOpacity style={styles.doneIcon} onPress={saveEdit}>
                        <MaterialIcons name="done-outline" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.totalAmount}>Total Amount: {totalAmount}</Text>
                    <Text style={styles.totalPrice}>Total Price: {totalPrice.toFixed(2)}</Text>
                    <Text style={styles.productUsers}>Users:</Text>
                    {item.users.map((user, idx) => (
                        <View key={idx} style={styles.userContainer}>
                            {editingUserId === user.id ? (
                                <View>
                                    <TextInput
                                        style={styles.userInput}
                                        value={editingUserAmount}
                                        onChangeText={setEditingUserAmount}
                                        placeholder="Amount"
                                    />
                                    <TextInput
                                        style={styles.userInput}
                                        value={editingUserPrice}
                                        onChangeText={setEditingUserPrice}
                                        placeholder="Price"
                                    />
                                    <TouchableOpacity style={styles.doneIcon} onPress={() => saveUserEdit(user.id)}>
                                        <MaterialIcons name="done-outline" size={30} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <TouchableOpacity onPress={() => deleteUserProduct(user.id)} style={styles.deleteUserIcon}>
                                        <MaterialCommunityIcons name="delete" size={30} color="red" />
                                    </TouchableOpacity>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                    <Text style={styles.userAmount}>    Amount: {user.amount}</Text>
                                    <Text style={styles.userPrice}>    Price: {user.price}</Text>
                                    <Text style={styles.userDate}>    {formatDate(user.date)}</Text>
                                    <TouchableOpacity onPress={() => startUserEdit(user)} style={styles.editUserIcon}>
                                        <Entypo name="edit" size={30} color="black" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
        position: 'relative',
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
        top: 0,
        right: 10,
        zIndex: 10
    },
    doneIcon: {
        position: 'absolute',
        top: 40,
        right: -5,
        zIndex: 10,
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 3,
    },
    deleteUserIcon: {
        position: 'absolute',
        top: 0,
        right: -5,
        zIndex: 10,
    },
    userInput: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kalam-Regular',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    editUserIcon: {
        position: 'absolute',
        top: 40,
        right: -5,
        zIndex: 10,
    },
    editButtonActive: {
        // your styles
    },
    editButtonInactive: {
        // your styles
    },
});

export default ReadProduct;
