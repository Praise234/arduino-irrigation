import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import SoilMoisture from "./Screens/SoilMoisture";
import Irrigation from "./Screens/Irrigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import registerNNPushToken from 'native-notify';
// import * as Notifications from 'expo-notifications';
// import { useEffect } from "react";



const Tab = createBottomTabNavigator();

export default function App() {
  // registerNNPushToken(20386, 'qkdzwVG8foXdGwb8b1Z5Wf');

  registerNNPushToken(20969, 'Dr58q5ID2s9p5g047MihFX');

  // const navigationRef = useNavigationContainerRef();

  // async function registerForPushNotificationsAsync () {
  //   let token;
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }
  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  //   Notifications.setNotificationHandler({
  //     handleNotification: async () => ({
  //       shouldShowAlert: true, // This allows notifications to show as alerts in the foreground
  //       shouldPlaySound: true,
  //       shouldSetBadge: false,
  //       importance: Notifications.AndroidImportance.HIGH,
        
  //     }),
  //   });

  //   Notifications.setNotificationChannelAsync('default', {
  //     name: 'Arduino',
  //     importance: Notifications.AndroidImportance.HIGH,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
    
  //   return token;
  // }
  
  
  // useEffect(() => {

  //   const activate = async() => {

  //       const token = await registerForPushNotificationsAsync();
  //       // console.log(typeof token);
    
  //       if(token) {
  //         console.log(JSON.stringify({token:token}))
  //         // https://arduinio-api.onrender.com/activate
  //         fetch('https://arduinio-api.onrender.com/activate', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify({token:token})
  //           })
  //           .then(response => {
  //             if (!response.ok) {
  //               throw new Error('Network response was not ok');
  //             }
  //             return response.json();
  //           })
  //           .then(data => {
  //             console.log('Success:', data);
  //           })
  //     }
  //   };

  //   activate();
  
  //   Notifications.addNotificationReceivedListener(notification => {
  //     console.log('Notification Received:', notification);
  //   });
  
  //   Notifications.addNotificationResponseReceivedListener(response => {
  //     if(navigationRef.isReady()){
  //       navigationRef.navigate('Soil Moisture');

  //     }
  //   });
  
  //   // return () => {
  //   //   Notifications.removeAllNotificationListeners();
  //   // };
  // }, []);
  

  
  return (
   <NavigationContainer >
     <Tab.Navigator screenOptions={{
      tabBarLabelPosition: "below-icon",
      tabBarShowLabel: true,
      tabBarActiveTintColor: "#708238",
      tabBarInactiveTintColor: "#8F9779",
      }}>

        <Tab.Screen name="Soil Moisture" component={SoilMoisture}
        options={{
          tabBarLabel: "Soil Moisture",
          tabBarIcon: ({ color }) => (<Ionicons name="snow" size={20} color={color} />),
          
        }}
        />
        <Tab.Screen name="Irrigation" component={Irrigation} 
        options={{
          tabBarLabel: "Irrigation",
          tabBarIcon: ({ color }) => (<Ionicons name="water" size={20} color={color} />),
          
        }}
        />
      <Tab.Screen name="Home" component={Home}
      options={{
        tabBarLabel: "Weather",
        tabBarIcon: ({ color }) => (<Ionicons name="thunderstorm" size={20} color={color} />),
        headerShown:false
      }}
      />
    </Tab.Navigator>
   </NavigationContainer>
  );
}


