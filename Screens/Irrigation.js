import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal, Pressable, TextInput, ToastAndroid, ActivityIndicator, FlatList } from "react-native";
import { vh, vw } from "../utils/functions";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Toast } from "../utils/Toast";



export default function Irrigation() {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    const [formData, setFormData] = useState({
        oldMoistureLevel: '',
        newMoistureLevel: '',
        date: ''
      });
    
      const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
      };

      const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

      const showDatePicker = () => {
        setDatePickerVisibility(true);
      };

      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
      const handleConfirm = (date) => {
       
        const theDate = new Date(date);
        handleChange("date", theDate.toISOString().split('T')[0]);
        hideDatePicker();
      };


      const handleSubmit = () => {
        setLoading(true);
        fetch('https://irrigation-history-default-rtdb.firebaseio.com/.json?auth=AIzaSyBSCdSKQJbeADC1xsLgyxpT9NI_UkBMpyI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Handle success response from API
          setLoading(false);
          if(formData.oldMoistureLevel === '' || formData.newMoistureLevel === '' || formData.date === '') {
            Toast("Please fill all fields");
            return;
          }
          console.log('Success:', data);
          setFormData({
            oldMoistureLevel: '',
            newMoistureLevel: '',
            date: ''
          });
         
          Toast("Record added successfully");
          setModalVisible(false)
        })
        .catch(error => {
          // Handle error
          setLoading(false)
          Toast("Error: " + error)
          console.error('Error:', error);
        });
      };


  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData =  useCallback(async() => {
    try {
      const response = await fetch(
        'https://irrigation-history-default-rtdb.firebaseio.com/.json?auth=AIzaSyBSCdSKQJbeADC1xsLgyxpT9NI_UkBMpyI'
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
 
      
   
        // console.log(JSON.parse(jsonData));

        const jsonDataStringified = JSON.stringify(jsonData);

        // console.log({...JSON.parse(jsonDataStringified)})

        
        const dataArray = Object.keys(JSON.parse(jsonDataStringified)).map(key => ({ data: JSON.parse(jsonDataStringified)[key], id: key }));
        
        setData((prevData) => dataArray.length > 0 ? [...dataArray] : []);

      // console.log(data)
      
      setFetchLoading(false);
    
    } catch (error) {
      setFetchLoading(false);
      console.error('Error fetching data:', error);
    }
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1); // Increment page number to load next page
    }
  };

  const renderItem = ({ item }) => (
    <View style={{flexDirection: "row", justifyContent: "space-between", width: "82.1%", paddingVertical: 10}}>
        <Text style={{textAlign: "center", flex:1}}>{item.data.date}</Text>
        <Text style={{textAlign: "center", flex:1}}>{item.data.oldMoistureLevel}</Text>
        <Text style={{textAlign: "center", flex:1}}>{item.data.newMoistureLevel}</Text>
    </View>
  );

  const renderFooter = () => {
    return loading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    ) : null;
  };

  

    return (
        <View>

            <View style = {{flexDirection:"column", alignItems: "center", justifyContent: "center", marginTop: "8%", gap:10}}>
                <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)} >
                  <Text style={styles.buttonText}>Add New Irrigation Record</Text>
                </TouchableOpacity>

                {data.length > 0 ?
               <>
               <View style = {{flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>

                  <Text style={{textAlign: "center", flex:1}}>Date</Text>
                  <Text style={{textAlign: "center", flex:1}}>Old Moisture</Text>
                  <Text style={{textAlign: "center", flex:1}}>New Moisture</Text>

               </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5} 
                    initialNumToRender={10}
                    ListFooterComponent={renderFooter}
                    style=  {{height: vh(500)}}
                  /> 

               
               
               
               </>
               
               
                :

                <ActivityIndicator size="large" color="#0000ff" />
                
                }
            </View>



            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>New Data</Text>



                        <TextInput
                            placeholder="Old Moisture Level"
                            value={formData.oldMoistureLevel}
                            onChangeText={text => handleChange('oldMoistureLevel', text)}
                            style={styles.inp}
                            keyboardType="numeric"
                        />
                        <TextInput
                            placeholder="New Moisture Level"
                            value={formData.newMoistureLevel}
                            onChangeText={text => handleChange('newMoistureLevel', text)}
                            style={styles.inp}
                            keyboardType="numeric"
                        />


                        <Pressable onPress={showDatePicker} style={[styles.inp, {justifyContent: "center"}]}><Text>{(formData.date === '') ? "Pick Date" : formData.date }</Text></Pressable>
                        <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                // locale="en_NG"
                        />
                         <View>
                            <Pressable  title={loading ? "loading" : "Submit"}
                              onPress={handleSubmit}
                              disabled={loading}  style={[styles.btn]}><Text style={{color:"#fff"}}> {loading ? <ActivityIndicator size="large" color="#ffffff" /> : "Submit"}</Text></Pressable>
                            <Pressable  title={"Close"}
                              onPress = {() =>setModalVisible(!modalVisible)}
                              style={[styles.btn, {backgroundColor: "red"}]}><Text style={{color:"#fff"}}> {"Close"}</Text></Pressable>
                            
                          </View>







                      
                    </View>
                </View>
            </Modal>







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
    btn: {
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
   
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: "rgba(0,0,0,.25)",
    
    },
    modalView: {
      width: vw(400),
      height: vw(500),
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    inp: {
        height: 40,
        width: '100%',
        borderColor: 'green',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    }
   
  });




  