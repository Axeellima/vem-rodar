import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DriverHomeContents from '../screens/driver/DriverHomeContents';
import DriverLogout from '../screens/driver/DriverLogout';
import DriverSettings from '../screens/driver/DriverSettings';
import RiderHomeContents from '../screens/rider/RiderHomeContents';
import RiderPickUp from '../screens/rider/RiderPickUp';
import RiderSettings from '../screens/rider/RiderSettings';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const RiderHomeStackNav = () => {
   return (
      <Stack.Navigator>
         <Stack.Screen
            name="Main"
            component={props => <RiderHomeContents {...props} />}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="pickUpLocation"
            component={RiderPickUp}
            options={{ headerShown: false }}
         />
      </Stack.Navigator>
   );
};

function RiderHomeDrawer() {
   const route = useRoute();
   return (
      <Drawer.Navigator
         screenOptions={{
            headerShown: false, // Oculta o cabeçalho em todas as telas
            drawerActiveTintColor: '#5A87FE', // Define a cor do texto ativo
            drawerInactiveTintColor: 'gray', // Define a cor do texto inativo
            drawerStyle: {
               backgroundColor: '#1A1A1A', // Define o background do drawer
            },
            drawerContentContainerStyle: {
               // Estilos do container do conteúdo do drawer
            },
            drawerLabelStyle: {
               // Estilos do texto do drawer
            },
         }}
      >
         <Drawer.Screen
            name="Inicio"
            component={RiderHomeContents}
            options={{ headerShown: false }}
            initialParams={route.params}
         ></Drawer.Screen>
         {/* <Drawer.Screen
            name="Pagamento"
            component={RiderPayments}
            options={{ headerShown: false }}
            initialParams={route.params}
         /> */}
         <Drawer.Screen
            name="Perfil"
            component={RiderSettings}
            options={{ headerShown: false }}
            initialParams={route.params}
         />
      </Drawer.Navigator>
   );
}

function DriverHomeDrawer() {
   const route = useRoute();

   return (
      <Drawer.Navigator
         screenOptions={{
            headerShown: false, // Oculta o cabeçalho em todas as telas
            drawerActiveTintColor: '#5A87FE', // Define a cor do texto ativo
            drawerInactiveTintColor: 'gray', // Define a cor do texto inativo
            drawerStyle: {
               backgroundColor: '#1A1A1A', // Define o background do drawer
            },
            drawerContentContainerStyle: {
               // Estilos do container do conteúdo do drawer
            },
            drawerLabelStyle: {
               // Estilos do texto do drawer
            },
         }}
      >
         <Drawer.Screen
            name="Inicio"
            component={DriverHomeContents}
            options={{
               headerShown: false,
            }}
            initialParams={route.params}
         />
         <Drawer.Screen
            name="Conta"
            component={DriverSettings}
            options={{ headerShown: false }}
            initialParams={route.params}
         />
         <Drawer.Screen
            name="Sair"
            component={DriverLogout}
            options={{
               headerShown: false,
            }}
         />
      </Drawer.Navigator>
   );
}

export { DriverHomeDrawer, RiderHomeDrawer };
