import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 30,
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'center',
   },
   map: {
      height: 650,
      marginTop: 0,
      width: '100%',
   },
   drawerButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      fontSize: 20,
   },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor de fundo semi-transparente
   },
   modalContent: {
      // backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
   },
   modalButton: {
      backgroundColor: '#2B2B2B', // Cor de fundo do botão
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginVertical: 10,
   },
   modalOption: {
      fontSize: 18,
      marginVertical: 10,
      color: 'white',
   },
   searchButton: {
      backgroundColor: '#1A1A1A',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
   },
   searchButtonText: {
      color: 'white',
      fontSize: 18,
      textAlign: 'center',
   },
});
