import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/paymentcomplete';

export default RiderPaymentComplete = ({ navigation }) => {
   const navigationOptions = {
      header: null,
   };
   const navigateRider = async () => {
      navigation.navigate('Login');
   };
   const navigateDriver = async () => {
      navigation.navigate('MainDriver');
   };

   return (
      <View style={styles.container}>
         <Image
            source={require('../../assets/Images/background_screen_choice.png')}
            style={{}}
         />
         <View style={styles.content}>
            <Text style={{ fontSize: 30, color: 'white' }}>Utilização</Text>
            <Text style={{ color: 'white' }}>
               Selecione como deseja utilizar nosso app!
            </Text>
            <TouchableOpacity
               onPress={navigateDriver}
               style={styles.choiceButton}
            >
               <Text style={styles.buttonText}>Motorista</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={navigateRider}
               style={styles.choiceButton}
            >
               <Text style={styles.buttonText}>Passageiro</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};
