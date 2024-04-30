import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('screen');
export default styles = StyleSheet.create({
   wrapper: {
      flex: 1,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1A1A1A',
   },
   container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '95%',
      marginTop: '20%',
   },
   content: {
      width: '95%',
      height: '50%',
      paddingTop: 30,
   },
   verifyContainer: {
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      paddingHorizontal: 10,
      paddingVertical: 25,
   },
   verifyButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2B2B2B',
      flexDirection: 'row',
      height: 45,
      // marginTop: 15,
   },
   nextText: {
      color: '#ffffff',
      fontWeight: 'bold',
   },
   headerContainer: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 10,
      // paddingVertical: 5,
   },
   headerText: {
      fontSize: 22,
      color: 'white',
   },
   otpInputs: {
      tintColor: '#42A5F5',
   },
   otpContainer: {
      // width: '80%',
   },
   backButton: {
      position: 'absolute',
      left: 20,
      top: 60,
   },
});
