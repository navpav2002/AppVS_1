
import React, {useState} from 'react';
import app from "../firebaseConfig";
import { getDatabase, ref, set, push } from 'firebase/database';
import { TextInput, View, Button, StyleSheet} from 'react-native'; // geändert von 'react-native-web' zu 'react-native'

function Write() {
    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");

    const saveProducts = async () => {
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "realtime/Products"));
        set(newDocRef, {productName: inputValue1, productPrice: inputValue2})
        .then(() => {
            alert("data saved successfully");
        }).catch((error) => {
            alert("error: " + error.message); // geändert zur korrekten Fehlerausgabe
        });
    };

    return (
        <View>
            <View style={styles.textInput1View}>
                <TextInput value={inputValue1}
                onChangeText={(text) => setInputValue1(text)} /> 
            </View>
            <View style={styles.textInput2View}>
                <TextInput value={inputValue2}
                onChangeText={(text) => setInputValue2(text)} />
            </View>
            <View>
                <Button onPress={saveProducts} title="Save Product" />
            </View> 
        </View>
    );
}

const styles = StyleSheet.create({
    textInput1View: {
        backgroundColor: '#B4DEE4',
        borderColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
    },
    textInput2View: {
        backgroundColor: '#B4DEE4',
        borderRadius: 10,
        borderWidth: 1,
    },
    buttonStyle1: {
        borderRadius: 10,
        borderWidth: 1,
    }
})

export default Write;
