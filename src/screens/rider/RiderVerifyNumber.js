import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
   ActivityIndicator,
   Image,
   KeyboardAvoidingView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import Toast from 'react-native-simple-toast';
import back from '../../assets/Images/back.png';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/verify';
export default RiderVerifyNumber = ({ navigation }) => {
   const [otp, setOtp] = useState('');
   const [isRequired, setRequired] = useState(0);
   const [isLoading, setLoading] = useState(0);
   const router = useRoute();
   const { phone: phone } = router.params;
   const goNext = async otp => {
      if (!otp) {
         setRequired(1);
         Toast.show('OTP is required!');
         return;
      }
      if (otp?.length < 6) {
         setRequired(1);
         Toast.show('Invalid OTP');
         return;
      }
      setLoading(1);
      try {
         const { data } = await httpFactory.post(`auth/rider/verify`, {
            secret: otp,
            phone_number: phone,
         });
         if (data?.status === 200 || data?.status === 201) {
            console.log(data.message);
            setRequired(0);
            setLoading(0);
            navigation.navigate('Register', { userId: data.data[0]._id });
         } else {
            console.log(data);
            setRequired(0);
            setLoading(0);
            Toast.show('Invalid OPT!');
         }
      } catch (err) {
         console.log(err.message);
         setRequired(0);
         setLoading(0);
         // Toast.show('Netwok Error!');
      }
   };
   return (
      <KeyboardAvoidingView style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.content}>
               <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>
                     Digite o código OTP enviado para seu número
                  </Text>
               </View>
               <View style={styles.otpContainer}>
                  <OTPTextInput
                     inputCount={6}
                     tintColor={isRequired ? '#C72C41' : '#5A87FE'}
                     textInputStyle={{
                        width: 40,
                        color: 'white',
                     }}
                     placeholderTextColor="grey"
                     placeholder="0"
                     handleTextChange={value => {
                        setOtp(value);
                     }}
                  />
               </View>
            </View>
            <View style={styles.verifyContainer}>
               <TouchableOpacity
                  disabled={isLoading}
                  style={styles.verifyButton}
                  onPress={() => {
                     // goNext(otp);
                     navigation.navigate('Register', { phone: phone });
                     console.log(phone);
                  }}
               >
                  {!isLoading ? (
                     <Text style={styles.nextText}>PRÓXIMO</Text>
                  ) : (
                     <ActivityIndicator color={'white'} />
                  )}
                  <View />
               </TouchableOpacity>
            </View>
         </View>
         <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.backButton}
         >
            <Image source={back} />
         </TouchableOpacity>
      </KeyboardAvoidingView>
   );
};
