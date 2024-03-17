import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { vh, vw } from '../utils/functions';


export default function SoilMoisture() {


  const [data, setData] = useState(null);

  
  
  useEffect(() => {
    const startInterval = setInterval(() => fetchData(), 30000);


    return () => {
      clearInterval(startInterval);
    }
  }, []);

  const fetchData =  useCallback(async() => {
    try {
      const response = await fetch(
        'https://irrigation-esp32-default-rtdb.firebaseio.com/.json?auth=' + process.env.API_KEY
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  console.log(data);

  const [selectedCrop, setSelectedCrop] = useState('ball_pepper');
  
    return (
        <View style={styles.container}>
          <View style= {{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10}}>
            <Text style={{fontWeight: "600", fontSize: 15}}>SOIL</Text>
            <View style={[styles.theInput, { height:vh(55), width: vw(250) }]}>
              <Picker
              style = {styles.cropSelect}
                selectedValue={selectedCrop}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCrop(itemValue)
                }>
                <Picker.Item label="Ball Pepper" value="ball_pepper" />
              </Picker>
            </View>
          </View>
          <View style = {{flexDirection:"column", alignItems: "center", justifyContent: "center", marginTop: "20%"}}>
            <CircularProgress
              size={320}
              width={15}
              fill={(data !== null ? data.moistureSensor : 0)}
              tintColor={`${ data !== null && data.moistureSensor < 50 ? "red" : "green"}`}
              backgroundColor="#d3d3d3"
              rotation={90}
              lineCap="round"
            >
              {
                (fill) => (
                  <Text style={styles.moistureText}>{`${fill} wfv`}</Text> // You can customize the content inside the circular progress
                )
              }
            </CircularProgress>
            <TouchableOpacity style={styles.button} >
              <Text style={styles.buttonText}>Irrigate</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
      button: {
        marginTop: 20,
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
      },
      moistureText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'black',
      },
      cropSelect:{
        height: vh(55) ,
        width: '100%',
        margin: "auto",
        borderLeftWidth: 0,
        paddingHorizontal: vw(10),
        // backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        shadowColor: "#000",
        shadowOffset: {
            width: vw(0),
            height: vh(2),
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: "center",
        justifyContent: "center",
        // elevation: 3,
        fontSize: vw(18)
      },
      theInput:{
        height: vh(75) ,
        width: '100%',
        marginTop: vh(20),
        marginBottom: vh(20),
        borderLeftWidth: 0,
        paddingHorizontal: vw(10),
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        shadowColor: "#000",
        shadowOffset: {
            width: vw(0),
            height: vh(2),
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // alignItems: "center",
        justifyContent: "center",

        elevation: 3,
        fontSize: vw(18)
      },
    });
    