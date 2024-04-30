import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/logout';

const DriverLogout = () => {
   const navigation = useNavigation();

   const handleLogout = async () => {
      try {
         // Limpar o token do AsyncStorage
         await AsyncStorage.removeItem('driverToken');
         await AsyncStorage.removeItem('driverName');
         await AsyncStorage.removeItem('driverPhone');
         setTimeout(() => {
            navigation.navigate('Register');
         }, 500);
      } catch (error) {
         console.error('Erro ao fazer logout:', error);
      }
   };

   return (
      <View style={styles.modalBackground}>
         <View style={styles.modalContent}>
            <Text style={styles.question}>Tem certeza que deseja sair?</Text>
            <View style={styles.buttonContainer}>
               <TouchableOpacity onPress={handleLogout} style={styles.button}>
                  <Text style={styles.buttonText}>Sim</Text>
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={() => navigation.navigate('Inicio')}
                  style={styles.button}
               >
                  <Text style={styles.buttonText}>Não</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};

export default DriverLogout;
