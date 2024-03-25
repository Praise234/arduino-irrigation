import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import SoilMoisture from "./Screens/SoilMoisture";
import Irrigation from "./Screens/Irrigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import registerNNPushToken from 'native-notify';


const Tab = createBottomTabNavigator();

export default function App() {

  registerNNPushToken(20386, 'qkdzwVG8foXdGwb8b1Z5Wf');
  
  return (
   <NavigationContainer>
     <Tab.Navigator screenOptions={{
      tabBarLabelPosition: "below-icon",
      tabBarShowLabel: true,
      tabBarActiveTintColor: "#708238",
      tabBarInactiveTintColor: "#8F9779",
      }}>

        <Tab.Screen name="Soil Moisture" component={SoilMoisture} PRAISE
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


