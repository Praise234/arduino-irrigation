import { Dimensions, PixelRatio } from "react-native";

// Get the device's pixel density
const pixelDensity = PixelRatio.get();


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate the responsive width and height
const responsiveWidth = screenWidth / pixelDensity;
const responsiveHeight = screenHeight / pixelDensity;


export const vh = (value) => {
  const screenHeight = Dimensions.get('window').height;
  if(typeof value == 'string') return value
  let result = (value*0.22)/75;
  return responsiveHeight * result;
  // return (screenHeight * percentage) / 100;
};
export const vw = (value) => {
  const screenWidth = Dimensions.get('window').width;
  if(typeof value == 'string') return value
  let result = (value*0.262)/45;
  return responsiveWidth * result;
    // return (screenWidth * percentage) / 100;
  };