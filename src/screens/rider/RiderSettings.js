import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import back from '../../assets/Images/back.png';
import styles from './styles/settings';

export default RiderSettings = ({ navigation }) => {
   const [phone, setPhone] = useState(0);
   const [firstname, setFirstname] = useState('');

   useEffect(() => {
      const getInfo = async () => {
         try {
            const name = await AsyncStorage.getItem('userName');
            const phone = await AsyncStorage.getItem('userPhone');
            console.log(name, phone);
            setFirstname(name);
            setPhone(phone);
         } catch {}
      };
      getInfo();
   }, []);

   const handleLogout = async () => {
      try {
         // Limpar o token do AsyncStorage
         await AsyncStorage.removeItem('userToken');
         await AsyncStorage.removeItem('userName');
         await AsyncStorage.removeItem('userPhone');
         setTimeout(() => {
            navigation.navigate('Login');
         }, 500);
      } catch (error) {
         console.error('Erro ao fazer logout:', error);
      }
   };

   return (
      <View style={styles.wrapper}>
         <View style={styles.header}>
            <TouchableOpacity
               onPress={() => navigation.navigate('Inicio')}
               style={{ position: 'absolute', top: 22, left: 15 }}
            >
               <Image source={back} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'flex-start',

                     paddingBottom: 15,
                     // borderBottomColor: '#1A1A1A',
                     // borderBottomWidth: 3,
                  }}
               >
                  <Ionicons
                     name="person"
                     size={60}
                     color="black"
                     style={{
                        marginLeft: 15,
                        borderRadius: 50,
                        backgroundColor: 'gray',
                        padding: 8,
                     }}
                  />
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingLeft: 15,
                     }}
                  >
                     <Text style={{ fontSize: 26, color: 'white' }}>
                        {firstname ? firstname : 'nome'}
                     </Text>
                     <Text style={{ fontSize: 18, color: 'white' }}>
                        {phone}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
         <View style={styles.container}>
            <View
               style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
               }}
            >
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'column',
                     width: '100%',
                     padding: 10,
                  }}
               >
                  <TouchableOpacity
                     onPress={handleLogout}
                     style={{
                        marginTop: 25,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}
                  >
                     <Text style={{ color: 'white', fontSize: 20 }}>Sair</Text>
                     <Ionicons
                        name="log-out-outline"
                        size={30}
                        color={'white'}
                     />
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </View>
   );
};
