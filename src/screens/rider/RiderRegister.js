import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
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
import styles from './styles/register';

export default RiderRegister = ({ navigation }) => {
   const [firstname, setFirstname] = useState('');
   const [lastname, setLastname] = useState('');
   const [email, setEmail] = useState('');
   const [isRequired, setRequired] = useState(0);
   const [isLoading, setLoading] = useState(0);
   const [image, setImage] = useState(null);
   const [imageData, setImageData] = useState(null);
   const [isValidEmail, setIsValidEmail] = useState(true);
   const router = useRoute();
   const { phone: phone } = router.params;
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
   const updateProfile = async () => {
      if (!firstname || !phone || !email) {
         setRequired(1);
         Toast.show('Preencha todos os campos!');
         return;
      }
      if (!isValidEmail) {
         setRequired(1);
         Toast.show('Email Inválido');
         return;
      }

      setRequired(0);
      setLoading(1);
      console.log('---------------------', phone);
      try {
         const { data } = await httpFactory.put('auth/rider/profile/update', {
            phone_number: phone,
            firstname: firstname,
            date: Date.now().toString(),
         });
         if (data?.status === 200 || data?.status === 201) {
            console.log(data);
            loginAfterUpdate();
         } else {
            console.log('erro vindo daqui ');
         }
      } catch (err) {
         console.log(err);
      }
   };

   const loginAfterUpdate = async () => {
      try {
         // const imageUrl = await httpCloudFactory
         //    .post('image/upload', imageData)
         //    .then(res => res.data.url)
         //    .catch(err => err.message);
         console.log('login...');
         const { data } = await httpFactory.post(`auth/rider/login`, {
            phone_number: phone,
            date: Date.now().toString(),
         });
         if (data?.status === 200 || data?.status === 201) {
            // updateProfile();
            console.log(data);
            const token = data.data.token;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userName', firstname);
            await AsyncStorage.setItem('userPhone', phone);
            navigation.navigate('Main', {
               phone: phone,
               firstname: firstname,
               lastname: lastname,
            });
         } else {
            console.log(data);
            setRequired(0);
            setLoading(0);
            Toast.show('Network error!');
         }
      } catch (err) {
         console.log(err.message);
         setRequired(0);
         setLoading(0);
         Toast.show('Netwok Error!');
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
                        onChangeText={fName => {
                           setFirstname(fName);
                        }}
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
               </View>
            </View>
            <View style={styles.registerContainer}>
               <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                     updateProfile();
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
