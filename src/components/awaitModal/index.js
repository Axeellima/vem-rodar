import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

const AwaitModal = ({
   searchingDriver,
   searchingMessage,
   setSearchingDriver,
   reloadComponent,
}) => {
   return (
      <Modal isVisible={searchingDriver}>
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Text style={{ fontSize: 22, color: 'white' }}>
               {searchingMessage}
            </Text>
            {searchingMessage === 'Nenhum Motorista encontrado!' && (
               <TouchableOpacity
                  style={{
                     backgroundColor: '#2B2B2B',
                     padding: 13,
                     paddingLeft: 18,
                     paddingRight: 18,
                     marginTop: 20,
                     borderRadius: 8,
                  }}
                  onPress={() => {
                     setSearchingDriver(false);
                     if (searchingMessage === 'Nenhum Motorista encontrado!') {
                        reloadComponent();
                     }
                  }}
               >
                  <Text style={{ color: 'white', fontSize: 18 }}>Ok</Text>
               </TouchableOpacity>
            )}
         </View>
      </Modal>
   );
};

export default AwaitModal;
