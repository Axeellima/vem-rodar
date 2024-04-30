import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
   ActivityIndicator,
   Image,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import logo from '../../assets/Images/logo.png';
import start from '../../assets/Images/start.png';
import styles from './styles/splash';
export default SplashScreen = props => {
   const [userToken, setUserToken] = useState(null);
   const [driverToken, setDriverToken] = useState(null);
   const [userName, setUserName] = useState(null);
   const [userPhone, setUserPhone] = useState(null);
   const [driverName, setDriverName] = useState(null);
   const [driverPhone, setDriverPhone] = useState(null);
   const [driverId, setDriverId] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const checkToken = async () => {
         try {
            const token = await AsyncStorage.getItem('userToken');
            const name = await AsyncStorage.getItem('userName');
            const phone = await AsyncStorage.getItem('userPhone');
            setUserToken(token);
            setUserName(name);
            setUserPhone(phone);
            const tokenDriver = await AsyncStorage.getItem('driverToken');
            const driverName = await AsyncStorage.getItem('driverName');
            const driverPhone = await AsyncStorage.getItem('driverPhone');
            const driverId = await AsyncStorage.getItem('driverId');
            setDriverToken(tokenDriver);
            setDriverName(driverName);
            setDriverPhone(driverPhone);
            setDriverId(driverId);
         } catch (error) {
            console.error('Error checking user token:', error);
         }
      };

      checkToken();
   }, []);

   const handleStart = async () => {
      setLoading(true);
      if (userToken) {
         console.log('userToken existe');
         setTimeout(() => {
            props.navigation.navigate('Main');
            setLoading(false);
         }, 2000);
         return;
      }
      if (driverToken) {
         console.log('driverToken existe');
         setTimeout(() => {
            props.navigation.navigate('DriverMap', {
               driverId,
               driverName,
               driverPhone,
            });
            setLoading(false);
         }, 2000);
         return;
      } else {
         console.log('caiu sem token');
         setTimeout(() => {
            setLoading(false);
            props.navigation.navigate('RiderDriverScreenChoice');
         }, 2000);
      }
   };

   return (
      <View
         style={{
            backgroundColor: '#EDF6FF',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
         }}
      >
         <View />
         <Image source={logo} style={styles.logo} />

         <View styles={styles.buttonContent}>
            <TouchableOpacity
               onPress={handleStart}
               style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
               }}
            >
               <LinearGradient
                  // Button Linear Gradient
                  colors={['#2D4DA2', '#5A87FE']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.button}
               >
                  {!loading ? (
                     <View style={styles.contentContainer}>
                        <Text style={styles.buttonText}>Começar</Text>
                        <Image
                           source={start}
                           style={{
                              width: 20,
                              height: 20,
                              marginLeft: 10,
                           }}
                        />
                     </View>
                  ) : (
                     <ActivityIndicator color={'white'} />
                  )}
               </LinearGradient>
            </TouchableOpacity>
         </View>
      </View>
   );
};
