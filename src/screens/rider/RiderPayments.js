import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/payments';

export default RiderPayments = props => {
   const [mobileMoney, setMobileMoney] = useState('');
   const [cash, setCash] = useState('');
   const [bitcoin, setBitcoin] = useState('');
   const [paypal, setPaypal] = useState('');

   return (
      <View style={styles.wrapper}>
         <View style={styles.container}>
            <View>
               <Text style={{ color: 'white', fontSize: 18 }}>
                  Escolha seu método de pagamento
               </Text>
            </View>
            <View
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginTop: 30,
               }}
            >
               <TouchableOpacity
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'center',
                  }}
                  onClick={() => {
                     props.navigation.navigate('RiderPaymentComplete');
                     console.log('props');
                  }}
               >
                  <Ionicons name="card" size={38} color="lightblue" />
                  <Text
                     style={{ color: 'white', marginLeft: 10, fontSize: 18 }}
                  >
                     Cartão de crédito ou débito
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'center',
                     marginTop: 6,
                  }}
                  onClick={() =>
                     props.navigation.navigate('RiderPaymentComplete')
                  }
               >
                  <Ionicons name="cash" size={38} color="lightgreen" />
                  <Text
                     style={{ color: 'white', marginLeft: 10, fontSize: 18 }}
                  >
                     Pix
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
         <TouchableOpacity
            onPress={() => props.navigation.navigate('Inicio')}
            style={styles.backButton}
         >
            <Text
               style={{ color: '#5A87FE', fontWeight: 'bold', fontSize: 18 }}
            >
               DEIXAR PARA DEPOIS
            </Text>
         </TouchableOpacity>
      </View>
   );
};
