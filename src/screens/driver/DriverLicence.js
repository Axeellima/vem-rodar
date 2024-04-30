import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
   ActivityIndicator,
   Image,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import back from '../../assets/Images/back.png';
import styles from './styles/licence';

export default DriverLicence = ({ navigation }) => {
   const [drivingLicence, setDrivingLicence] = useState('');
   const [licenceNumber, setLicenceNumber] = useState('');
   const [model, setModel] = useState('');
   const [validate, setValidate] = useState('');
   const [isRequired, setRequired] = useState(0);
   const [isLoading, setLoading] = useState(0);
   const [image, setImage] = useState(null);
   const [imageData, setImageData] = useState(null);
   const [isValidDrivingLicence, setIsValidDrivingLicence] = useState(true);
   const [isValidLicenceNumber, setIsValidLicenceNumber] = useState(true);
   const router = useRoute();
   const { phone: phone } = router.params;

   const isValidDrivingLicenseNumber = drivingLicenseNumber => {
      const regex = /^[0-9A-Za-z]+$/;
      return regex.test(drivingLicenseNumber);
   };

   const handleDrivingLicenceChange = text => {
      if (text.length <= 15) {
         setDrivingLicence(text);
         setIsValidDrivingLicence(isValidDrivingLicenseNumber(text.trim()));
      } else {
         setIsValidDrivingLicence(false);
      }
   };

   const isValidLicenceNumberChange = licenceNumber => {
      const regex = /^[0-9]+$/;
      return regex.test(licenceNumber);
   };

   const handleLicenceNumberChange = text => {
      if (text.length <= 10) {
         setLicenceNumber(text);
         setIsValidLicenceNumber(isValidLicenceNumberChange(text.trim()));
      } else {
         setIsValidLicenceNumber(false);
      }
   };

   const goNext = () => {
      console.log(isValidDrivingLicence, isValidDrivingLicence);
      if (!drivingLicence || !licenceNumber || !validate) {
         setLoading(0);
         setRequired(1);
         Toast.show('Preencha todos os campos!');
         return;
      }
      navigation.navigate('Login', {
         phone: phone,
         licence_number: licenceNumber,
         driving_licence: drivingLicence,
      });
   };

   const formatMonthYear = text => {
      text = text.replace(/\D/g, '');
      text = text.slice(0, 4);
      if (text.length > 2) {
         text = text.slice(0, 2) + '/' + text.slice(2);
      }

      setValidate(text);
   };

   return (
      <View style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.content}>
               <View style={{}}>
                  <Text style={{ color: 'white', fontSize: 22 }}>
                     Sua carteira de motorista
                  </Text>
               </View>
               <View style={{ width: '100%', paddingTop: 30 }}>
                  <View style={styles.inputsContainers}>
                     <TextInput
                        maxLength={10}
                        onChangeText={handleLicenceNumberChange}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           borderBottomColor:
                              isRequired && !licenceNumber
                                 ? '#C72C41'
                                 : '#DADADA',
                        }}
                        placeholder="Número do registro"
                        placeholderTextColor={'#EDF6FF'}
                     />
                     {!licenceNumber && licenceNumber.length > 0 && (
                        <Text style={{ color: 'red' }}>
                           {' '}
                           Número de registro Incorreta
                        </Text>
                     )}
                  </View>
                  <View
                     style={{
                        ...styles.inputsContainers,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                     }}
                  >
                     <TextInput
                        maxLength={15}
                        keyboardType="numeric"
                        onChangeText={handleDrivingLicenceChange}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           width: '55%',
                           borderBottomColor:
                              isRequired && !drivingLicence
                                 ? '#C72C41'
                                 : '#DADADA',
                        }}
                        placeholder="Número da carteira"
                        placeholderTextColor={'#EDF6FF'}
                     />
                     {!isValidDrivingLicence && drivingLicence.length > 0 && (
                        <Text style={{ color: 'red' }}>Carteira Incorreta</Text>
                     )}
                     <TextInput
                        maxLength={5}
                        keyboardType="numeric"
                        onChangeText={formatMonthYear}
                        value={validate}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           width: '55%',
                           borderBottomColor:
                              isRequired && !drivingLicence
                                 ? '#C72C41'
                                 : '#DADADA',
                        }}
                        placeholder="MM/YY"
                        placeholderTextColor="#EDF6FF"
                     />
                     {!isValidDrivingLicence && drivingLicence.length > 0 && (
                        <Text style={{ color: 'red' }}>Validade Incorreta</Text>
                     )}
                  </View>
               </View>
            </View>
            <View style={styles.registerContainer}>
               <TouchableOpacity
                  disabled={isLoading}
                  style={styles.registerButton}
                  onPress={() => {
                     goNext();
                  }}
               >
                  <Text style={styles.nextText}>PRÓXIMO</Text>
                  {isLoading ? <ActivityIndicator color={'white'} /> : <View />}
               </TouchableOpacity>
            </View>
         </View>

         <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.backButton}
         >
            <Image source={back} />
         </TouchableOpacity>
      </View>
   );
};
