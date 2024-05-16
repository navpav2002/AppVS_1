import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

const RecentProducts = ({ email }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, 'realtime/Products');
    const userProductsQuery = query(productsRef, orderByChild('email'), equalTo(email));

    const unsubscribe = onValue(userProductsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.values(data);
        const sortedProducts = productsArray.reverse().slice(0, 5); // Get last 5 products
        setRecentProducts(sortedProducts);
      }
    });

    return () => unsubscribe();
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Products</Text>
      <FlatList
        data={recentProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.productName} - {item.productPrice}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginTop: 16,
    width: '90%'
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  productItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default RecentProducts;
