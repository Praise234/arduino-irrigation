import { ActivityIndicator, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Location from 'expo-location';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [resolvedAddress] = await Location.reverseGeocodeAsync(location.coords);
      setAddress(resolvedAddress);
    })();
  }, []);

  useEffect(() => {
    if (!address) return;

    console.log(process.env.WEATHER_API_KEY)
    const fetchData = async () => {
      try {
        const city = address.city || 'Ibadan'; // Fallback to 'Ibadan' if city is not found
        const apiUrl = `https://api.weatherapi.com/v1/current.json?q=${city}&key=${process.env.WEATHER_API}`;

        const response = await axios.get(apiUrl, {
          headers: {
            'accept': 'application/json'  // This sets the Accept header to application/json
          }
        });
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data: ', error);
      }
    };

    const fetchDataForecast = async () => {
      try {
        const city = address.city || 'Ibadan'; 
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?q=${city}&days=5&key=${process.env.WEATHER_API}`;
        
        const response = await axios.get(apiUrl, {
          headers: {
            'accept': 'application/json'  // This sets the Accept header to application/json
          }
        });
        setForecast(response.data.forecast.forecastday);
      } catch (error) {
        console.error('Error fetching weather forecast: ', error);
      }
    };

    fetchData();
    fetchDataForecast();
  }, [address]);

  const renderList = ({ item }) => (
    <View style={styles.forecastList}>
      <View><Text>
            <Image source={{ uri: `https:${item.day.condition.icon}` }} style={{borderColor: "#000", width: 24, height: 34 }} />
        {/* {item.day.condition.text.includes("cloud") ? <Ionicons name="cloud" size={25} style={[styles.otherLogo, {color: "skyblue"}]} /> :
          <Ionicons name="sunny" size={25} style={[styles.otherLogo, {color: "yellow"}]} />} */}
        <Text>{ '   ' }</Text>
        <Text style={styles.forecastDay}> {formatDate(new Date(item.date).toLocaleDateString())}  </Text>
        <Text>{ '   ' }</Text>
        <Text style={styles.forecastDay}>{item.day.condition.text.charAt(0).toUpperCase() + item.day.condition.text.slice(1)}</Text>
      </Text></View>
      <View style={{alignItems: "flex-end", justifyContent: "flex-end"}}>
        <Text style={styles.forecastValue}>{Math.round(item.day.avgtemp_c)}{String.fromCharCode(176)}</Text>
      </View>
    </View>
  );


const getCurrentDate = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthIndex = currentDate.getMonth();
  const monthName = months[monthIndex];
  
  return `${day} ${monthName}`;
};


const formatDate = (dateString) => {
  // Parse the original date string
  const [year, month, day] = dateString.split('/').map(Number);
  
  // Create a Date object
  const date = new Date(day, month-1 , year);

  // Format the date
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;

  return formattedDate;
};





    return(
      <>
      {forecast !== null ? <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topLeft}>
          <Ionicons name="location" size={30} style={styles.weatherLocationLogo} />
          <Text style={styles.weatherLocation}>{address && address.city}, {address && address.country}</Text>
        </View>
        <View style={styles.topRight}>
          {/* <Ionicons name="search" size={30} style={styles.weatherSearch} /> */}
        </View>
      </View>

      <View style={styles.weatherDetails}>
        <Text style={styles.currentDate}>Today, {getCurrentDate()}</Text>
        <Text style={styles.weatherResult}>{weatherData && weatherData.current.condition.text.charAt(0).toUpperCase() + weatherData.current.condition.text.slice(1)}</Text>
        {/* {weatherData && weatherData.current.condition.text.includes("cloud") ? <Image source={require("../assets/cloud.png")} style={styles.cloudImg} /> :
          <Image source={require("../assets/sun.png")} style={styles.sunImg} />} */}
          <Image source={{ uri: `https:${weatherData.current.condition.icon}` }}  style={styles.sunImg} />
        <View style={styles.resContainer}>
          <Text style={styles.weatherValue}>{weatherData && Math.round(weatherData.current.temp_c)}</Text>
          <Text style={styles.degreeSym}>{String.fromCharCode(176)}c</Text>
        </View>
      </View>

      <View style={styles.otherDetailsContainer}>
        <View style={styles.windSpeedCont}>
          <Text style={styles.othDetTitle}>Wind Speed</Text>
          <Text style={styles.othDetValue}><Ionicons name="speedometer" size={20} style={styles.otherLogo} /> {weatherData && weatherData.current.wind_mph}m/s</Text>
        </View>
        <View style = {styles.space} />
        <View style={styles.humidityCont}>
          <Text style={styles.othDetTitle}>Humidity</Text>
          <Text style={styles.othDetValue}><Icon name="tint" size={20} style={styles.otherLogo} /> {weatherData && weatherData.current.humidity}%</Text>
        </View>
      </View>

      <View style={styles.forecastContainer}>
        <View style={{padding: 15, paddingBottom: 0}}>
          <Text><Icon name="calendar" size={15} style={styles.otherLogo} />
          <Text>   </Text>
          <Text style={styles.forecastTitle}>{forecast && forecast.length}-day forecast</Text></Text>
        </View>
        <View style={styles.spaceHeight} />
        <FlatList
          data={forecast}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderList}
          showsVerticalScrollIndicator = {false}
        />
      </View>
    </SafeAreaView>
       :
        <SafeAreaView style= {{flex:1, alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicator size="large" color="green"  />
        </SafeAreaView>
      }
      
      </>
    );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#000',
      alignItems: 'center',
      // justifyContent: 'center',
      
      marginTop: StatusBar.currentHeight + 10,
      padding: 20,
      paddingTop: 25,
    },
    
    scrollView: {
      // padding: 20,
      // paddingTop: 10,
      minHeight: "100%",
      // flex: 1

    },

    topSection: {
      flexDirection: "row",
      // borderColor: "black",
      // borderWidth: 2,
      width: "100%",
      color: "#000",
      bottom: 20
    },

    topLeft: {
      flexDirection: "row",
      width: "50%",
      alignItems: 'center'
    },

    topRight: {
      width: "50%",
      flexDirection: "row",
      justifyContent: "flex-end",
    },

    weatherSearch: {
      color: "#000",
      right: 5,
    },
    weatherLocation: {
      color: "#000",
      left: 7,
    },

    weatherLocationLogo: {
      color: "#000",
      // left: 5,
    },
    
    otherLogo: {
      color: "#fff",
    },

    currentDate: {
      color: "#fff",
      textAlign: "left",
      fontWeight: "600"
    },
    weatherDetails: {
      backgroundColor: "green",
      width: "100%",
      borderRadius: 20,
      height: 200,
      padding: 20,
    },
    weatherResult: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
      flexWrap: "wrap"
    },
    weatherValue: {
      color: "#fff",
      fontSize: 70,
      fontWeight: "bold",
    },
    sunImg: {
      flexDirection: "row", 
      alignSelf: "flex-end", 
      height: 120, 
      width: 120,
      top: -40
    },
    cloudImg: {
      flexDirection: "row", 
      alignSelf: "flex-end", 
      height: 120, 
      width: 120,
      top: -35
    },
    rainImg: {
      flexDirection: "row", 
      alignSelf: "flex-end", 
      height: 120, 
      width: 130,
      top: -20
    },
    degreeSym: {
      color: "#fff",
      fontSize: 40,
      fontWeight: "400",
      textAlign: "left",
      // borderWidth: 2,
      // borderColor: "#fff",
      left: -5,
      top: 5
    },

    resContainer: {
      flexDirection: "row", 
      top: -90
    },

    otherDetailsContainer: {
      flexDirection: "row",
      width: "100%",
      alignContent: "center",
      justifyContent: "space-evenly",
      top: 30,
      
    },
    
    windSpeedCont: {
      backgroundColor: "green",
      flex: .5,
      borderRadius: 20,
      padding: 15,
    },
    
    humidityCont: {
      backgroundColor: "green",
      flex: .5,
      borderRadius: 20,
      padding: 15,
      paddingLeft: 20
    },
    space: {
      flex: .5
    },
    othDetTitle: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "400",
      bottom: 2
    },

    othDetValue: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
    },

    forecastContainer: {
      top: 60,
      backgroundColor: "green",
      width: "100%",
      borderRadius: 20,
      // flex: 1,
      // paddingBottom: 20,
      marginBottom: 400
    },

    forecastTitle: {
      fontWeight: "800",
      color: "#fff"
    },

    forecastList: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
 
      borderBottomColor: "rgba(255,255,255, .7)",
      borderBottomWidth: .5
    },

    forecastDay: {
      color: "#fff",
      fontWeight: "500",
    },

    forecastValue: {
      color: "#fff",
      fontWeight: "500",
      textAlign: "right"
    },

    spaceHeight: {
      height: 15
    },
  
  
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(128, 128, 0, 0.55)',
    }
  });