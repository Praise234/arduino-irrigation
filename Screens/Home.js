import { Button, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from "@expo/vector-icons/Ionicons";
// import { useFonts } from 'expo-font';
import { 
  useFonts,
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
} from '@expo-google-fonts/lato';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Location from 'expo-location';
// SplashScreen.preventAutoHideAsync();

export default function Home() {

  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [address, setAddress] = useState("");

  


  
  useLayoutEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);
      setAddress(address);
    })();
    
    const fetchData = async () => {
      try {
        const WEATHER_API_KEY = "bfedf0ae0f79fd26309a34da079af80f"; 
        const city = address ? address[0].city : "";
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        
        const response = await axios.get(apiUrl);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data: ', error);
      }
    };

    const fetchDataForecast = async () => {
      try {
        const WEATHER_API_KEY = "bfedf0ae0f79fd26309a34da079af80f"; 
        const city = 'Ibadan';
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        
        const response = await axios.get(apiUrl);
       
        setForecast(response.data.list);
      } catch (error) {
        console.error('Error fetching weather data: ', error);
      }
    };


    if(address.length > 0){

      fetchData();
      fetchDataForecast();
    }
    
    
    






  }, [address]);










  

// console.log(address)


const [fontsLoaded, fontError] = useFonts({
    Lato_100Thin,
    Lato_100Thin_Italic,
    Lato_300Light,
    Lato_300Light_Italic,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
    Lato_900Black_Italic,
});

const onLayoutRootView = useCallback(async () => {
  if (fontsLoaded || fontError) {
    await SplashScreen.hideAsync();
  }
}, [fontsLoaded, fontError]);

if (!fontsLoaded && !fontError) {
  return null;
}


const renderList = ({item}) => (
  <View style={styles.forecastList}>
    <View><Text>
    {item.weather[0].description.includes("cloud") ? <Ionicons name="cloud" size={25}  style={[styles.otherLogo, {color: "skyblue"}]} /> :
      <Ionicons name="sunny" size={25}  style={[styles.otherLogo, {color: "yellow"}]} /> }
      <Text>{ '   ' }</Text>
      <Text style={styles.forecastDay}> {formatDate(new Date(item.dt * 1000).toLocaleDateString())}  </Text>
      <Text>{ '   ' }</Text>
      <Text style={styles.forecastDay}>{item.weather[0].description.charAt(0).toUpperCase()+item.weather[0].description.slice(1)}</Text>
    </Text></View>
    <View>
      <Text style={styles.forecastValue}>{Math.round(item.main.temp)}{String.fromCharCode(176)}</Text>
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
  const [month, day, year] = dateString.split('/').map(Number);
  
  // Create a Date object
  const date = new Date(year, month - 1, day);

  // Format the date
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;

  return formattedDate;
};




    return(
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView} >
          {/* <ScrollView contentContainerStyle={styles.scrollView} > */}
          <View style={styles.topSection}>
              <View style={styles.topLeft}>
                <Ionicons name="location" size={30} style={styles.weatherLocationLogo} />
                <Text style={styles.weatherLocation}>{address && address[0].city}, {address && address[0].country}</Text>
              </View>
              <View style={styles.topRight}>
                <Ionicons name="search" size={30} style={styles.weatherSearch} />
              </View>
            </View>

            <View style={styles.weatherDetails}>
              {/* <ImageBackground source={require("../assets/sun.png")} resizeMode="contain" 
              imageStyle= {{width: "100%", justifyContent: "flex-end"}}>   */}
                <Text style={styles.currentDate}>Today, {getCurrentDate()}</Text>
                <Text style={styles.weatherResult}>{weatherData && weatherData.weather[0].description.charAt(0).toUpperCase()+weatherData.weather[0].description.slice(1)}</Text>
                {weatherData && weatherData.weather[0].description.includes("cloud") ? <Image source={require("../assets/cloud.png")} style={styles.cloudImg} /> :
                <Image source={require("../assets/sun.png")} style={styles.sunImg} />}
                {/* <Image source={require("../assets/rain.png")} style={styles.rainImg} /> */}
                <View style={styles.resContainer}>
                  <Text style={styles.weatherValue}>{weatherData && Math.round(weatherData.main.temp)}</Text>
                  <Text style={styles.degreeSym}>{String.fromCharCode(176)}c</Text>
                </View>
              {/* </ImageBackground>   */}
            
            </View>

            <View style={styles.otherDetailsContainer}>
              <View style={styles.windSpeedCont}>
                <Text style={styles.othDetTitle}>Wind Speed</Text>
                <Text style={styles.othDetValue}><Ionicons name="speedometer" size={20} style={styles.otherLogo} /> {weatherData && weatherData.wind.speed}m/s</Text>
              </View>
              <View style = {styles.space} />
              <View style={styles.humidityCont}>
                <Text style={styles.othDetTitle}>Humidity</Text>
                <Text style={styles.othDetValue}><Icon name="tint" size={20} style={styles.otherLogo} /> {weatherData && weatherData.main.humidity}%</Text>
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
              // contentContainerStyle= {styles.scrollView}
              showsVerticalScrollIndicator = {false}
              />
             
              
            </View>

            
          {/* </ScrollView> */}
        </SafeAreaView>
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
      fontSize: 18
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
      top: -60
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
      left: -8,
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