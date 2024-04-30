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
      width: '95%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#1A1A1A',
      marginTop: '20%',
   },
   content: {
      paddingTop: 30,
   },
   textInputMobile: {
      alignSelf: 'stretch',
      width: '70%',
      backgroundColor: '#1A1A1A',
      borderWidth: 1,
      color: 'white',
   },
   LoginButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2B2B2B',
      flexDirection: 'row',
      height: 45,
   },
   passwordForgotten: {
      backgroundColor: '#ffffff',
      marginTop: 10,
   },
   activityIndicator: {
      position: 'absolute',
      alignSelf: 'center',
   },
   loginText: {
      color: '#ffffff',
      fontWeight: 'bold',
   },
   loginContainer: {
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      paddingHorizontal: 10,
      paddingVertical: 25,
   },
   mobileContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 8,
      justifyContent: 'flex-start',
      alignItems: 'center',
   },
   headerContainer: {
      width: '100%',
      flexDirection: 'column',
      paddingHorizontal: 10,
   },
   headerText: {
      fontSize: 22,
      color: 'white',
   },
   contryContainer: {
      width: '15%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: 10,
   },
   contryButton: {},
   countryCodeText: {
      color: 'white',
      fontSize: 20,
   },
   backButton: {
      position: 'absolute',
      left: 20,
      top: 60,
   },
});
