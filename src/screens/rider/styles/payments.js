import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
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
      marginTop: '30%',
   },

   backButton: {
      position: 'absolute',
      right: 20,
      top: 60,
   },
});
