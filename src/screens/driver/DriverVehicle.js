import { Body, Container, Content, Header, Icon, Left } from 'native-base';
import React from 'react';
import { Image, Text, TouchableHighlight } from 'react-native';

export default DriverVehicle = ({ navigation }) => {
   const navigationOptions = {
      drawerIcon: ({ tintColor }) => (
         <Image
            source={require('../../assets/Images/vehicle.png')}
            style={{ width: 30, height: 30 }}
         />
      ),
   };
   return (
      <Container style={{ flex: 1 }}>
         <Header
            style={{
               backgroundColor: '#42A5F5',
               height: 75,
            }}
         >
            <Left>
               <TouchableHighlight
                  style={{
                     width: 50,
                     height: 50,
                     borderRadius: 50,
                     alignItems: 'center',
                     justifyContent: 'center',
                     marginTop: 20,
                  }}
                  onPress={() => navigation.navigate('Login')}
               >
                  <Icon
                     name="arrow-back"
                     style={{
                        color: '#ffffff',
                     }}
                  />
               </TouchableHighlight>
            </Left>
            <Body>
               <Text
                  style={{
                     color: '#ffffff',
                     fontSize: 20,
                     fontWeight: 'bold',
                     marginTop: 20,
                  }}
               >
                  Vehicle Details
               </Text>
            </Body>
         </Header>

         <Content />
      </Container>
   );
};
