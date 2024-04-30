import React from 'react';
import { View } from 'react-native';
import { DriverHomeDrawer } from '../../navigation/NavigationDrawer';
import styles from './styles/home';

export default DriverHome = props => {
   return (
      <View style={styles.container}>
         <DriverHomeDrawer {...{ props }} />
      </View>
   );
};
