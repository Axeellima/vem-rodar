import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DriverHome from '../screens/driver/DriverHome';
import DriverLicence from '../screens/driver/DriverLicence';
import DriverLogin from '../screens/driver/DriverLogin';
import DriverPickUpPoint from '../screens/driver/DriverPickUpPoint';
import DriverRegister from '../screens/driver/DriverRegister';
import DriverVerifyNumber from '../screens/driver/DriverVerifyNumber';
import RiderHome from '../screens/rider/RiderHome';
import RiderLogin from '../screens/rider/RiderLogin';
import { default as RiderPickUp } from '../screens/rider/RiderPickUp';
import RiderRegister from '../screens/rider/RiderRegister';
import RiderVerifyNumber from '../screens/rider/RiderVerifyNumber';
const Stack = createStackNavigator();
const AuthStackRider = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen
               name="Login"
               component={RiderLogin}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Verify"
               component={RiderVerifyNumber}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Register"
               component={RiderRegister}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Main"
               component={RiderHome}
               options={{ headerShown: false }}
            />
         </Stack.Navigator>
      </NavigationContainer>
   );
};
const AuthStackDriver = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen
               name="Register"
               component={DriverRegister}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Verify"
               component={DriverVerifyNumber}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Licence"
               component={DriverLicence}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Login"
               component={DriverLogin}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="PickUp"
               component={DriverPickUpPoint}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="DriverHome"
               component={DriverHome}
               options={{ headerShown: false }}
            />
         </Stack.Navigator>
      </NavigationContainer>
   );
};

const AuthDriverStack = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen
               name="PickUp"
               component={DriverPickUpPoint}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="DriverHome"
               component={DriverHome}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Register"
               component={DriverRegister}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Verify"
               component={DriverVerifyNumber}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Licence"
               component={DriverLicence}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Login"
               component={DriverLogin}
               options={{ headerShown: false }}
            />
         </Stack.Navigator>
      </NavigationContainer>
   );
};

const AuthStackMain = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen
               name="Home"
               component={RiderHome}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Login"
               component={RiderLogin}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Verify"
               component={RiderVerifyNumber}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Register"
               component={RiderRegister}
               options={{ headerShown: false }}
            />
            <Stack.Screen
               name="Main"
               component={RiderHome}
               options={{ headerShown: false }}
            />
         </Stack.Navigator>
      </NavigationContainer>
   );
};

const RiderHomeStackNav = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen
               name="Main"
               component={RiderHomeStackNav}
               options={{ headerShown: false }}
            />

            <Stack.Screen
               name="pickUpLocation"
               component={RiderPickUp}
               options={{ headerShown: false }}
            />
         </Stack.Navigator>
      </NavigationContainer>
   );
};

export {
   AuthDriverStack,
   AuthStackDriver,
   AuthStackMain,
   AuthStackRider,
   RiderHomeStackNav,
};
