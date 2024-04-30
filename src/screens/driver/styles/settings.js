import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
   wrapper: {
      flex: 1,
      paddingTop: 30,
      width: '100%',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
   },
   container: {
      flex: 1,
      width: '90%',
      height: '100%',
      marginTop: 30,
   },
   header: {
      width: '100%',
      height: '25%',
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
   },
   headerContent: {
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginTop: 30,
      height: '60%',
   },

   logoutButton: {
      width: '90%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2B2B2B',
      flexDirection: 'row',
      height: 45,
      borderRadius: 2,
      marginBottom: 25,
   },
});
