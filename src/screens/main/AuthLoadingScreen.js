import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
export default AuthLoadingScreen = props => {
   const [userToken, setUserToken] = useState(null);
   useEffect(() => {
      setTimeout(() => {
         props.navigation.navigate(userToken != null ? 'Main' : 'Login');
      }, 2000);
   }, []);

   return (
      <View
         style={{
            backgroundColor: '#1A1A1A',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}
      >
         <ActivityIndicator size="large" />
         <StatusBar barStyle="default" />
      </View>
   );
};
