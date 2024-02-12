import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';


export default function SoilMoisture() {
  
    return (
        <View style={styles.container}>
          <CircularProgress
        size={320}
        width={15}
        fill={40}
        tintColor="green"
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
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
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
    });
    