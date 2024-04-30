import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
   modalBackground: {
      flex: 1,
      backgroundColor: '#2B2B2B',
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalContent: {
      backgroundColor: '#1B1B1B',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
   },
   question: {
      fontSize: 18,
      color: 'white',
      marginBottom: 20,
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   button: {
      backgroundColor: '#5A87FE',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 10,
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
   },
});
