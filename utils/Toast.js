import { ToastAndroid } from "react-native";

export const Toast =(msg='loading...', time=3000)=>{
    ToastAndroid.show(
        msg,
        ToastAndroid.BOTTOM,
      );
    let x = setTimeout(()=>{
        ToastAndroid.hide();
    }, time)
    return clearTimeout(x);
}