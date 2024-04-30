import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
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
import plus from '../../assets/Images/plus.png';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/login';
const LATITUDE_DELTA = 0;
const LONGITUDE_DELTA = 0;

export default DriverLogin = ({ navigation }) => {
   const [firstname, setFirstname] = useState('');
   const [lastname, setLastname] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isRequired, setRequired] = useState(0);
   const [isLoading, setLoading] = useState(0);
   const [image, setImage] = useState(null);
   const [imageData, setImageData] = useState(null);
   const [region, setRegion] = useState(null);
   const [location, setLocation] = useState(null);
   const [isValidEmail, setIsValidEmail] = useState(true);
   const router = useRoute();
   const {
      phone: phone,
      driving_licence: driving_licence,
      licence_number: licence_number,
   } = router.params;

   const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
         setErrorMsg('Permission to access location was denied');
         console.log(status);
         return;
      }
      const location = await Location.getCurrentPositionAsync({
         accuracy: Location.Accuracy.Highest,
         maximumAge: 10000,
      }).catch(err => {
         console.log(err);
      });
      setLocation(location);
      setRegion({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
      });
   };

   let lat = region?.latitude;
   let lng = region?.longitude;

   const sendLocationToApi = [lat, lng];

   useEffect(() => {
      (async () => {
         if (Platform.OS !== 'web') {
            const {
               status,
            } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
               alert(
                  'Sorry, we need camera roll permissions to make this work!',
               );
            }
         }
      })();
      getLocation();
   }, []);
   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
         base64: true,
      });
      let base64Img = `data:image/jpg;base64,${result.base64}`;
      let data = {
         file: base64Img,
         upload_preset: 'taxi_app_images_preset',
      };
      if (!result.cancelled) {
         setImageData(data);
         setImage(result.uri);
      }
   };
   const goNext = async () => {
      if (!firstname || !lastname || !email || !password) {
         setRequired(1);
         Toast.show('Preencha todos os campos!');
         return;
      }
      setLoading(1);
      try {
         const { data } = await httpFactory.post(`auth/driver/create`, {
            firstname: firstname,
            lastname: lastname,
            nationality: 'BR',
            country_code: '+55',
            phone_number: phone,
            driving_licence: driving_licence,
            licence_number: licence_number,
            email: email,
            password: password,
            date: Date.now().toString(),
            location: sendLocationToApi,
         });
         if (data?.status === 200 || data?.status === 201) {
            setRequired(0);
            setLoading(0);
            const token = data.message.secret;
            await AsyncStorage.setItem('driverToken', token);
            await AsyncStorage.setItem('driverName', data.message.firstname);
            await AsyncStorage.setItem(
               'driverPhone',
               data.message.phone_number,
            );
            await AsyncStorage.setItem('driverId', data.message._id);
            navigation.navigate('PickUp', {
               driver_id: data.message._id,
               driver_names: data.message.firstname,
               driver_phone_number: data.message.phone_number,
               nearbyRegion: {
                  latitude: data.message.location[0],
                  longitude: data.message.location[1],
               },
            });
            console.log(data);
         } else {
            setRequired(0);
            setLoading(0);
            console.log(data);
            Toast.show('Network error!');
         }
      } catch (err) {
         setRequired(0);
         setLoading(0);
         Toast.show('Netwok Error!');
         console.log(err);
      }
   };

   const validateEmail = email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   };

   const handleEmailChange = text => {
      setEmail(text);
      setIsValidEmail(validateEmail(text.trim()));
   };

   const handleNameChange = text => {
      setFirstname(text);
   };

   return (
      <View style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.content}>
               <View style={{}}>
                  <Text style={{ color: 'white', fontSize: 22 }}>
                     Coloque suas informações
                  </Text>
               </View>
               <View style={{ paddingTop: 50 }}>
                  <TouchableOpacity
                     onPress={pickImage}
                     style={styles.headerContainer}
                  >
                     <View style={styles.imageContainer}>
                        {image ? (
                           <Image
                              source={{ uri: image }}
                              style={{
                                 width: '100%',
                                 height: '100%',
                                 borderRadius: 80,
                              }}
                           />
                        ) : (
                           <MaterialIcons
                              name="person"
                              size={125}
                              color="black"
                           />
                        )}
                     </View>

                     <Image
                        source={plus}
                        style={{
                           width: 40,
                           height: 40,
                           position: 'absolute',
                           bottom: 0,
                           right: 0,
                        }}
                     />
                  </TouchableOpacity>
               </View>
               <View style={{ width: '100%', paddingTop: 50 }}>
                  <View style={styles.inputsContainers}>
                     <TextInput
                        onChangeText={handleNameChange}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           borderBottomColor:
                              isRequired && !firstname ? '#C72C41' : '#DADADA',
                        }}
                        placeholder="Nome"
                        placeholderTextColor={'#EDF6FF'}
                     />
                  </View>
                  <View style={styles.inputsContainers}>
                     <TextInput
                        onChangeText={lName => {
                           setLastname(lName);
                        }}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           borderBottomColor:
                              isRequired && !lastname ? '#C72C41' : '#DADADA',
                        }}
                        placeholder="Sobrenome"
                        placeholderTextColor={'#EDF6FF'}
                     />
                  </View>
                  <View style={styles.inputsContainers}>
                     <TextInput
                        onChangeText={handleEmailChange}
                        value={email}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           borderBottomColor:
                              isRequired && !email ? '#C72C41' : '#DADADA',
                        }}
                        placeholder="Email"
                        placeholderTextColor={'#EDF6FF'}
                     />
                     {!isValidEmail && email.length > 0 && (
                        <Text
                           style={{
                              color: 'red',
                              position: 'absolute',
                              bottom: -15,
                           }}
                        >
                           Email inválido
                        </Text>
                     )}
                  </View>
                  <View style={styles.inputsContainers}>
                     <TextInput
                        secureTextEntry={true}
                        onChangeText={password => {
                           setPassword(password);
                        }}
                        style={{
                           ...styles.allInputs,
                           borderColor: 'transparent',
                           borderBottomColor:
                              isRequired && !email ? '#C72C41' : '#DADADA',
                        }}
                        placeholder="Senha"
                        placeholderTextColor={'#EDF6FF'}
                     />
                  </View>
               </View>
            </View>
            <View style={styles.registerContainer}>
               <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                     goNext();
                     // console.log(Date.now().toString());
                  }}
               >
                  {!isLoading ? (
                     <Text style={styles.nextText}>PRÓXIMO</Text>
                  ) : (
                     <ActivityIndicator color={'white'} />
                  )}
                  <View />
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
