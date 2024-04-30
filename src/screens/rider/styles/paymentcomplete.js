import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingTop: 100,
   },
   content: {
      width: '90%',
      height: 230,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
   },
   choiceButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2B2B2B',
      textAlign: 'center',
      flexDirection: 'row',
      height: 58,
      // marginTop: 15,
   },
   buttonText: {
      color: 'white',
      fontSize: 18,
   },
});
