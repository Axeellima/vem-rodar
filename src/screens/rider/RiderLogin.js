import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import {
   ActivityIndicator,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import Toast from 'react-native-simple-toast';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/login';

export default RiderLogin = ({ navigation }) => {
   const [phoneNumber, setPhone] = useState('');
   const [isLoading, setLoading] = useState(0);
   const [isFieldRequired, setRequired] = useState(0);
   const [show, setShow] = useState(false);
   const [phoneToApi, setPhoneToApi] = useState('');
   const [countryCode, setCountryCode] = useState('+55');
   const [countryFlag, setCountryFlag] = useState('🇧🇷');
   const phoneRef = useRef(null);

   const directLogin = async sendToApiPhone => {
      console.log('sendToApiPhone');
      const { data } = await httpFactory.post(`auth/rider/login`, {
         phone_number: sendToApiPhone,
      });

      if (data) {
         setLoading(0);
         setRequired(0);
         console.log(data);
         const token = data.data.token;

         await AsyncStorage.setItem('userToken', token);
         await AsyncStorage.setItem('userName', data.data.firstname);
         await AsyncStorage.setItem('userPhone', sendToApiPhone);

         console.log(data);
         navigation.navigate('Main');
      } else {
         console.log(data);
         console.log(sendToApiPhone);
      }
   };

   const signIn = async phoneNumber => {
      console.log('sigIn');
      if (!phoneNumber) {
         setRequired(1);
         Toast.show('O número de telefone é obrigatório!');
         return;
      }

      setRequired(0);
      setLoading(1);
      try {
         const { data } = await httpFactory.post(`auth/rider/create`, {
            phone_number: sendToApiPhone,
            date: Date.now().toString(),
            firstname: 'firstnameAuto',
         });
         if (data) {
            console.log(data);
            navigation.navigate('Verify', {
               phone: sendToApiPhone,
            });
            setLoading(0);
         } else {
            console.log(data);
            Toast.show('Network error!');
            setLoading(0);
         }
      } catch (error) {
         console.log(error);
         if (error.message === 'Request failed with status code 403') {
            directLogin(sendToApiPhone);
            setLoading(0);
            // navigation.navigate('Register', { user_id: res });
         } else {
            console.log(error);
            Toast.show('Network error!');
            setLoading(0);
         }
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

   return (
      <View style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.content}>
               <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>
                     Digite seu número de telefone.
                  </Text>
                  <Text style={styles.headerText}></Text>
               </View>
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
            </View>
            <View style={styles.loginContainer}>
               <Text
                  style={{
                     color: 'white',
                     fontSize: 12,
                     paddingBottom: 8,
                     textAlign: 'center',
                  }}
               >
                  Ao continuar você receberá um SMS para verificação. Podem ser
                  aplicadas taxas de dados e mensagens.
               </Text>
               <TouchableOpacity
                  style={styles.LoginButton}
                  onPress={() => {
                     signIn(phoneNumber);
                     // navigation.navigate('Verify');
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
