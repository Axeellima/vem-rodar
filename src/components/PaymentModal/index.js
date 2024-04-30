import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
   Dimensions,
   Modal,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';

const PaymentModal = ({
   paymentModalOpen,
   setPaymentModalOpen,
   setPaymentMethod,
}) => {
   const { height, width } = Dimensions.get('window');

   return (
      <Modal
         animationIn="slideInUp"
         animationOut="slideOutDown"
         backdropOpacity={0.5}
         style={styles.modal}
      >
         <View style={styles.wrapper}>
            <View style={styles.container}>
               <View>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                     Escolha seu método de pagamento:
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
                     onPress={() => {
                        setPaymentMethod(1);
                        setPaymentModalOpen(false);
                     }}
                  >
                     <Ionicons name="card" size={38} color="lightblue" />
                     <Text
                        style={{ color: 'white', marginLeft: 10, fontSize: 16 }}
                     >
                        Cartão de crédito ou débito
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                     }}
                     onPress={() => {
                        setPaymentMethod(2);
                        setPaymentModalOpen(false);
                     }}
                  >
                     <Ionicons
                        name="wallet-outline"
                        size={38}
                        color="lightgreen"
                     />
                     <Text
                        style={{ color: 'white', marginLeft: 10, fontSize: 16 }}
                     >
                        Dinheiro do app
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                     }}
                     onPress={() => {
                        setPaymentMethod(3);
                        setPaymentModalOpen(false);
                     }}
                  >
                     <Ionicons name="qr-code" size={38} color="lightyellow" />
                     <Text
                        style={{ color: 'white', marginLeft: 10, fontSize: 16 }}
                     >
                        Pix
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
   );
};

const styles = StyleSheet.create({
   modal: {
      flex: 1,
      margin: 0,
   },

   option: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
   },
   optionText: {
      color: 'white',
      marginLeft: 10,
      fontSize: 18,
   },

   wrapper: {
      flex: 1,
      // paddingLeft: 10,
      // paddingRight: 10,
      width: '100%',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: {
      flex: 1,
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1A1A1A',
      marginTop: 40,
   },

   backButton: {
      position: 'absolute',
      right: 20,
      top: 30,
   },
});

export default PaymentModal;
