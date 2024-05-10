import React, {useState} from 'react';
import app from "../firebaseConfig";
import { getDatabase, ref, get } from 'firebase/database';
import { TextInput, View, Button, StyleSheet, Text} from 'react-native'; // geändert von 'react-native-web' zu 'react-native'

function Read() {

    let [productArray, setProductArray] = useState([]);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "realtime/Products");
        const snapshot = await get(dbRef);
        if(snapshot.exists()) {
            setProductArray(Object.values(snapshot.val()))
        } else {
            alert("error");
        }
    }
    return ( 
        <View>
            <Button onPress={fetchData} title="Display Products" />
            {productArray.map((item, index) => (
                <Text key={index}>
                    {item.productName} {item.productPrice}
                </Text>
            ))}
        </View>
     );
}

export default Read;