import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
   logo: {
      width: 300,
      height: 150,
      resizeMode: 'cover',
   },
   button: {
      width: 300,
      height: 50,
      borderRadius: 8,
      // overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
   },
   contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
   },
});
