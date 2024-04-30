import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
   Dimensions,
   Modal,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/pickup';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const API_KEY = 'AIzaSyANWRmdcfG4hksdtmVYxnqKCIsfW__rsVY';
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default DriverPickUpPoint = ({ navigation }) => {
   const [openModal, setOpenModal] = useState(false);
   const [selectedAddress, setSelectedAddress] = useState(null);
   const [driver_id, setDriver_id] = useState('');
   const [driver_names, setDriver_names] = useState('');
   const [driver_phone_number, setDriver_phone_number] = useState(0);

   useEffect(() => {
      const getInfo = async () => {
         try {
            const name = await AsyncStorage.getItem('driverName');
            const phone = await AsyncStorage.getItem('driverPhone');
            const id = await AsyncStorage.getItem('driverId');
            setDriver_id(id);
            setDriver_names(name);
            setDriver_phone_number(phone);
            console.log(
               'useEffect getInfo',
               driver_names,
               driver_phone_number,
               driver_id,
            );
         } catch {}
      };
      getInfo();
   }, [driver_id]);

   const checkGPS = async () => {
      const status = await Location.getProviderStatusAsync();
      if (status.locationServicesEnabled) {
         console.log('GPS is enabled');
      } else {
         console.log('GPS is disabled');
      }
   };

   useEffect(() => {
      checkGPS();
   }, []);

   const handleStartRun = () => {
      navigation.navigate('DriverHome', {
         driver_id: driver_id,
         driver_names: driver_names,
         driver_phone_number: driver_phone_number,
      });
      console.log(driver_id, driver_names, driver_phone_number);
   };

   const baseDriverLocation = async () => {
      const res = await httpFactory
         .put(`auth/driver/update/${driver_id}`, {
            firstname: driver_names,
            location: selectedAddress,
         })
         .then(response => {
            console.log(response.data);
         })
         .catch(err => {
            console.log(err);
         });
   };

   const handleConfirm = () => {
      // Lógica para confirmar o endereço selecionado
      // console.log(selectedAddress);
      selectedAddress ? baseDriverLocation() : null;
      setOpenModal(false); // Fechar o modal após confirmar
   };

   return (
      <View style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.content}>
               <Text style={{ color: 'white', fontSize: 22, width: '90%' }}>
                  Para encontrar sua localização automaticamente, ative o
                  serviço de localização
               </Text>
               <TouchableOpacity
                  style={{
                     backgroundColor: 'black',
                     borderRadius: 10,
                     padding: 10,
                     display: 'flex',
                     alignItems: 'center',
                  }}
                  onPress={() => setOpenModal(true)}
               >
                  <Text style={{ color: 'white', width: '100%' }}>
                     Definir uma localização padrão
                  </Text>
               </TouchableOpacity>
            </View>
            <Modal visible={openModal} transparent={true} animationType="slide">
               <View style={styles.modalContainer}>
                  <ScrollView
                     keyboardShouldPersistTaps="handled"
                     style={{ ...styles.modalContent }}
                  >
                     <GooglePlacesAutocomplete
                        placeholder="Digite o endereço"
                        keyboardShouldPersistTaps="handled"
                        listViewDisplayed={false}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        onPress={(data, details = null) => {
                           setSelectedAddress(details.geometry.location);
                           console.log(details.geometry.location);
                        }}
                        query={{
                           key: API_KEY,
                           language: 'pt-BR',
                        }}
                        textInputProps={{
                           placeholderTextColor: 'white',
                           borderRadius: 8,
                        }}
                        styles={{
                           container: {
                              borderRadius: 8,
                              backgroundColor: '#0F0F0F',
                           },
                           textInputContainer: {
                              backgroundColor: 'black',
                           },
                           textInput: {
                              backgroundColor: 'black',
                              color: 'white',
                           },
                           predefinedPlacesDescription: {
                              backgroundColor: '#0F0F0F',
                              color: '#1faadb',
                              borderRadius: 8,
                           },
                           description: {
                              color: 'white',
                           },
                           row: {
                              backgroundColor: '#0F0F0F',
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8,
                           },
                        }}
                     />

                     <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => handleConfirm()}
                     >
                        <Text style={{ color: 'white' }}>Confirmar</Text>
                     </TouchableOpacity>
                  </ScrollView>
               </View>
            </Modal>
            <View style={styles.aroundMap}>
               <TouchableOpacity
                  style={{
                     backgroundColor: '#2B2B2B',
                     padding: 10,
                     width: '90%',
                     borderRadius: 10,
                  }}
                  onPress={handleStartRun}
               >
                  <Text style={{ color: 'white', fontSize: 18 }}>
                     Procurar corrida
                  </Text>
               </TouchableOpacity>
               <Text style={{ color: 'white', fontSize: 20 }}>
                  Ao seu redor
               </Text>
               <MapView
                  provider={PROVIDER_GOOGLE}
                  style={{ height: 200, width: '90%' }}
                  showsUserLocation={true}
                  showsBuildings={true}
                  region={selectedAddress ? selectedAddress : null}
               ></MapView>
            </View>
         </View>
      </View>
   );
};
