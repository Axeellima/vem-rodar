import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
   ActivityIndicator,
   Animated,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import Toast from 'react-native-simple-toast';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/register';

export default DriverRegister = ({ navigation }) => {
   const [phoneNumber, setPhone] = useState('');
   const [isLoading, setLoading] = useState(0);
   const [isFieldRequired, setRequired] = useState(0);
   const [show, setShow] = useState(false);
   const [userExists, setUserExists] = useState(false);
   const [phoneToApi, setPhoneToApi] = useState('');
   const [countryCode, setCountryCode] = useState('+55');
   const [countryFlag, setCountryFlag] = useState('🇧🇷');
   const [password, setPassword] = useState('');
   const opacity = useState(new Animated.Value(0))[0];
   const phoneRef = useRef(null);

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         setUserExists(false);
         setPhoneToApi('');
         setPhone('');
         setPassword('');
         setRequired(0);
         setLoading(0);
      });

      return unsubscribe;
   }, [navigation]);

   const findRetrieveDriver = async phone => {
      const res = await httpFactory
         .get(`auth/driver/retrieve/${phone}`)
         .then(response => {
            handleButtonPress();
            console.log(res);
         })
         .catch(err => {
            console.log(err);
            navigation.navigate('Licence', {
               phone: phone,
            });
         });
   };

   const loginWithEmail = async (phone, password) => {
      if (!phone || !password) {
         setRequired(1);
         Toast.show('Preencha todos os campos');
         return;
      }
      setRequired(0);
      setLoading(1);
      try {
         const { data } = await httpFactory.post('auth/driver/login', {
            phone_number: phone,
            password: password,
         });
         if (data) {
            setPassword('');
            setPhone('');
            setRequired(0);
            setLoading(1);
            console.log(data.data);
            const token = data.data[0].secret;
            await AsyncStorage.setItem('driverToken', token);
            await AsyncStorage.setItem('driverName', data.data[0].firstname);
            await AsyncStorage.setItem(
               'driverPhone',
               data.data[0].phone_number,
            );
            await AsyncStorage.setItem('driverId', data.data[0]._id);
            navigation.navigate('PickUp', {
               driver_id: data.data[0]._id,
               driver_names: data.data[0].firstname,
               driver_phone_number: data.data[0].phone_number,
               region: {
                  latitude: data.data[0].location[0],
                  longitude: data.data[0].location[1],
               },
            });
            console.log(data.data[0].firstname);
         } else {
            Toast.show('Email ou senha Incorreto!');
            setLoading(0);
         }
      } catch (err) {
         Toast.show('Email ou senha Incorreto!');
         setLoading(0);
         console.log(err);
      }
   };

   const sendToApiPhone = countryCode + phoneToApi;

   const formatPhoneNumber = input => {
      const cleaned = input.replace(/\D/g, '');
      let formatted = '';
      if (cleaned.length >= 2) {
         formatted += `(${cleaned.slice(0, 2)})`;
      }
      if (cleaned.length > 2) {
         formatted += ` ${cleaned.slice(2, 7)}`;
      }
      if (cleaned.length > 7) {
         formatted += `-${cleaned.slice(7, 11)}`;
      }
      return formatted;
   };

   const handleBlur = () => {
      setPhone(formatPhoneNumber(phoneNumber));
   };

   const handleButtonPress = () => {
      setUserExists(true);
      Animated.timing(opacity, {
         toValue: 1,
         duration: 500,
         useNativeDriver: true,
      }).start();
   };

   return (
      <View style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.content}>
               <View style={styles.headerContainer}>
                  {!userExists ? (
                     <Text style={styles.headerText}>
                        Digite seu número de telefone.
                     </Text>
                  ) : (
                     <Text style={styles.headerText}>Digite sua senha</Text>
                  )}
                  <Text style={styles.headerText}></Text>
               </View>
               <View style={{ paddingHorizontal: 10 }}>
                  {!userExists && (
                     <View style={styles.mobileContainer}>
                        <View style={{}}>
                           <Text style={{ fontSize: 35 }}>{countryFlag}</Text>
                        </View>
                        <View style={styles.contryContainer}>
                           <TouchableOpacity
                              onPress={() => setShow(true)}
                              style={{
                                 ...styles.contryButton,
                                 paddingBottom: 10,
                              }}
                           >
                              <Text style={styles.countryCodeText}>
                                 {countryCode}
                              </Text>
                           </TouchableOpacity>
                           <CountryPicker
                              lang={'en'}
                              show={show}
                              selectedCountry={'BR'}
                              pickerButtonOnPress={item => {
                                 setCountryCode(item.dial_code);
                                 setCountryFlag(item.flag);
                                 setShow(false);
                              }}
                           />
                        </View>
                        <TextInput
                           ref={phoneRef}
                           style={{
                              ...styles.textInputMobile,
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                              fontSize: 20,

                              marginLeft: 10,
                              borderBottomColor: isFieldRequired
                                 ? '#C72C41'
                                 : '#2F2F2F',
                           }}
                           placeholderTextColor="grey"
                           placeholder="(00) 0000-0000"
                           keyboardType="numeric"
                           maxLength={15}
                           value={phoneNumber}
                           onChangeText={phone => {
                              setPhone(phone);
                              setPhoneToApi(phone);
                           }}
                           selectionColor="#5A87FE"
                           onBlur={handleBlur}
                        />
                     </View>
                  )}
                  {!userExists ? (
                     <></>
                  ) : (
                     <Animated.View
                        style={{
                           opacity,
                        }}
                     >
                        <Text
                           style={{
                              ...styles.textInputMobile,
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                              width: '100%',
                              fontSize: 20,
                              height: 40,
                              borderBottomColor: '#2F2F2F',
                           }}
                        >
                           {sendToApiPhone}
                        </Text>
                        <TextInput
                           placeholder="Senha"
                           secureTextEntry={true}
                           placeholderTextColor="#808080" // Cinza para o placeholder
                           style={{
                              ...styles.textInputMobile,
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                              fontSize: 20,
                              width: '100%',
                              marginTop: 15,
                              height: 40,
                              borderBottomColor: isFieldRequired
                                 ? '#C72C41'
                                 : '#2F2F2F',
                           }}
                           onChangeText={pass => setPassword(pass)}
                        />
                     </Animated.View>
                  )}
               </View>
            </View>
            <View style={styles.loginContainer}>
               <TouchableOpacity
                  style={styles.LoginButton}
                  onPress={() => {
                     findRetrieveDriver(sendToApiPhone);
                     if (userExists) {
                        loginWithEmail(sendToApiPhone, password);
                     }
                  }}
               >
                  {isLoading ? (
                     <ActivityIndicator color={'white'} />
                  ) : (
                     <Text style={styles.loginText}>PRÓXIMO</Text>
                  )}
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};
