import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from '../screens/main/AuthLoadingScreen';
import RiderDriverScreenChoice from '../screens/main/RiderDriverScreenChoice';
import SplashScreen from '../screens/main/SplashScreen';
import { DriverHomeDrawer } from './NavigationDrawer';
import {
   AuthDriverStack,
   AuthStackDriver,
   AuthStackMain,
   AuthStackRider,
} from './NavigationStack';

export default switchNavigator = createAppContainer(
   createSwitchNavigator(
      {
         SplashScreen: SplashScreen,
         AuthLoading: AuthLoadingScreen,
         Main: AuthStackMain,
         Login: AuthStackRider,
         MainDriver: AuthStackDriver,
         DriverHome: DriverHomeDrawer,
         DriverMap: AuthDriverStack,
         RiderDriverScreenChoice: RiderDriverScreenChoice,
      },
      {
         initialRouteName: 'SplashScreen',
      },
   ),
);
