import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import app from "../firebaseConfig";
import { getDatabase, ref, onValue, query, orderByChild } from 'firebase/database';

const LineChartComponent = ({ email }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const productsRef = ref(db, 'realtime/Products');
        const dateProductsQuery = query(productsRef, orderByChild('date'));
      
        onValue(dateProductsQuery, (snapshot) => {
          const products = snapshot.val();
          const userProducts = products ? Object.values(products).filter(product => product.email === email) : [];
      
          // Gruppieren Sie die Produkte nach Datum und berechnen Sie die Summe
          const groupedByDate = userProducts.reduce((acc, product) => {
            const productDate = new Date(product.date);
            const day = productDate.getDate();
            const month = productDate.getMonth() + 1;
            const dateKey = `${day}.${month}`;
      
            if (!acc[dateKey]) {
              acc[dateKey] = {
                value: 0,
                label: dateKey,
              };
            }
      
            acc[dateKey].value += parseFloat(product.productPrice.replace(',', '.')) * parseFloat(product.productAmount.replace(',', '.'));
            
            return acc;
          }, {});
      
          // Konvertieren Sie das Objekt zurück in ein Array
          const prices = Object.values(groupedByDate);
      
          setData(prices);
        });
      }, [email]);
      

    const yMaxValue = Math.max(...data.map(d => d.value)) || 0;
    const yStep = yMaxValue / 10;

    return (
        <ScrollView horizontal>
            <View style={styles.container}>
                <LineChart
                    data={data}
                    width={Dimensions.get('window').width * 2}
                    height={300}
                    xAxisLabel="Products"
                    yAxisLabel="Price (€)"
                    yAxisMinValue={0}
                    yAxisMaxValue={yMaxValue}
                    yAxisStep={yStep}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726'
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    xLabelsOffset={-5}
                    yLabelsOffset={5}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});

export default LineChartComponent;
