import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import {
   AppRegistry,
   Dimensions,
   Modal,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Toast from 'react-native-simple-toast';
import car from '../../assets/Images/car2.png';
import PaymentModal from '../../components/PaymentModal';
import AwaitModal from '../../components/awaitModal';
import { URL_WEBSOCKET } from '../../constants/urls';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/homecontents';

const marker = require('../../assets/Images/marker.png');
const taxiImage = require('../../assets/Images/taxi3.png');
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const API_KEY = 'AIzaSyDvz7ZoqEAcZ_eC5rbJMhkXFIQMFyju5hU';
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default RiderHomeContents = ({ navigation }) => {
   const [region, setRegion] = useState(null);
   const [DATA, setDATA] = useState([
      { size: 'XL', time: '3mins', price: ' UGX 50000-70000', time: '2mins' },
      { size: 'SM', price: ' UGX 5000-7000', time: '1mins' },
      { size: 'L', price: ' UGX 15000-5000', time: '2mins' },
      { size: 'XXL', price: ' UGX 70000-100000', time: '4mins' },
   ]);
   const [phone, setPhone] = useState(0);
   const [firstname, setFirstname] = useState('');
   const [isModalVisible, setModalVisible] = useState(false);
   const [pickup, setPickup] = useState(null);
   const [destination, setDestination] = useState(null);
   const bottomSheetRef = useRef(null);
   const [ridesAccept, setRidesAccept] = useState(false);
   const [isButtonVisible, setIsButtonVisible] = useState(false);
   const [searchingDriver, setSearchingDriver] = useState(false);
   const [ridePrice, setRidePrice] = useState(9);
   const [address, setAddress] = useState(null);
   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState(null);
   const [driverInfo, setDriverInfo] = useState(null);
   const [estimatedTime, setEstimatedTime] = useState(null);
   const [driverIsClose, setDriverIsClose] = useState(false);
   const [actualRegion, setActualRegion] = useState(null);
   const [driverRegion, setDriverRegion] = useState(null);
   const [destinationRegion, setDestinationRegion] = useState(null);
   const [modalCancel, setModalCancel] = useState(false);
   const [rideStatus, setRideStatus] = useState(0);
   const [riderCanceled, setRiderCanceled] = useState(false);
   const [openWebSocket, setOpenWebSocket] = useState(false);
   const [ridesDuration, setRidesDuration] = useState(0);
   const [currLocation, setCurrLocation] = useState(null);
   const [destLocation, setDestLocation] = useState(null);
   const [searchingMessage, setSearchingMessage] = useState(
      'Procurando Motorista...',
   );
   const socket = new WebSocket(URL_WEBSOCKET);
   // const router = useRoute();

   // const { phone, firstname } = router.params;

   useEffect(() => {
      const getInfo = async () => {
         try {
            const name = await AsyncStorage.getItem('userName');
            const phone = await AsyncStorage.getItem('userPhone');
            setFirstname(name);
            setPhone(phone);
         } catch {}
      };
      getInfo();
   }, []);

   useEffect(() => {
      if (driverInfo) {
         socket.onopen = () => {
            console.log('entrou e ta td bem');
            setOpenWebSocket(true);
            const enjoy = {
               event: 'joinRace',
               data: { raceId: driverInfo?._id },
            };
            socket.send(JSON.stringify(enjoy));
         };
         socket.onmessage = event => {
            console.log('message', event.data);
            const message = JSON.parse(event.data);
            if (message.event === 'message') {
               const locationData = message.data;
               console.log('Localização do motorista:', locationData);
               setDriverRegion({
                  latitude: locationData[0],
                  longitude: locationData[1],
               });
            }
         };
      } else if (!driverInfo && openWebSocket) {
         socket.close();
         setOpenWebSocket(false);
      }
   }, [driverInfo, region, openWebSocket]);

   const snapPoints = useMemo(() => ['25%', '80%'], []);

   const handleSheetChanges = useCallback(index => {
      console.log('handleSheetChanges', index);
   }, []);

   const handleSnapPress = useCallback(() => {
      const maxSnapIndex = snapPoints.length - 1;
      bottomSheetRef.current?.snapToIndex(maxSnapIndex);
   }, [snapPoints]);

   const handlePlacePress = useCallback(() => {
      handleSnapPress();
   }, [handleSnapPress]);

   function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Raio médio da Terra em quilômetros
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
   }
   function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
   }
   function calculateTimeDistance(
      driverLat,
      driverLong,
      destinationLat,
      destinationLong,
   ) {
      const distance = calculateDistance(
         driverLat,
         driverLong,
         destinationLat,
         destinationLong,
      );
      const timeLeft = distance / 50;
      const timeLeftMinutes = timeLeft * 60;
      return timeLeftMinutes;
   }

   const createRide = async () => {
      const { data } = await httpFactory.post(`rides/create`, {
         rider_names: String(firstname),
         rider_phone_number: String(phone),
         curr_location: currLocation,
         curr_lat: pickup ? pickup.lat : region?.latitude,
         curr_long: pickup ? pickup.lng : region?.longitude,
         dest_location: destLocation,
         dest_long: destination?.lng,
         dest_lat: destination?.lat,
         distance: 20,
         distance_unit: '50',
         price: ridePrice ? ridePrice : 9,
         currency: 'sim',
         status: 0,
         date: Date.now(),
      });
      console.log('CORRIDA CRIADA', data.data);
      setSearchingMessage('Esperando Motorista aceitar...');
      loopingNewRide(data.data._id);
   };

   const loopingNewRide = async id => {
      let rideAccepted = false;

      setRidesAccept(true);
      let startTime = Date.now();

      while (rideStatus !== 4 || !riderCanceled || rideStatus !== 3) {
         const res = await httpFactory.get(`rides/find/${id}`);
         if (res.data.message.status === 1) {
            setDriverInfo(res.data.message);
            setRideStatus(1);
            setSearchingMessage('Motorista encontrado!!');
            setTimeout(() => {
               setSearchingDriver(false);
            }, 2000);
            rideAccepted = true;
         } else if (res.data.message.status === 2) {
            setRideStatus(2);
         } else if (res.data.message.status === 3) {
            setRiderCanceled(true);
            reloadComponent();
            updateRide(3);
            Toast.show('Sua corrida foi cancelada');
            break;
         } else if (res.data.message.status === 4) {
            setRideStatus(4);
            setRiderCanceled(true);
            break;
         }

         if (
            Date.now() - startTime > 3 * 60 * 1000 &&
            res?.data?.message?.status === 0
         ) {
            updateRide(3);
            setSearchingMessage('Nenhum Motorista encontrado!');
            break;
         }
         await new Promise(resolve => setTimeout(resolve, 6000));
      }
   };
   const searchRideLoop = async (lat, long, initialDistance) => {
      setSearchingDriver(true);
      handlePlacePress();
      let distance = initialDistance;
      let intervalId = null;
      if (riderCanceled) {
         return null;
      }
      const search = async () => {
         const res = await httpFactory.post(`rides/nearby/find/${distance}`, {
            lat: lat,
            long: long,
         });
         if (res.data.message.length > 0) {
            clearInterval(intervalId);
            createRide();
         } else {
            console.log('distancia:', distance);
            distance += 1000;
            setRidePrice(ridePrice + distance / 200);
            if (distance > 8000) {
               setSearchingMessage('Sem motorista disponível');
               setTimeout(() => {
                  setSearchingMessage('Procurando Motorista...');
                  setSearchingDriver(false);
                  clearInterval(intervalId);
               }, 2000);
            }
         }
      };
      intervalId = setInterval(search, 6000);
   };

   const checkGPS = async () => {
      const status = await Location.getProviderStatusAsync();
      if (status.locationServicesEnabled) {
         console.log('GPS is enabled');
      } else {
         console.log('GPS is disabled');
      }
   };

   const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
         console.error('Permission to access location was denied');
         return;
      }

      const location = await Location.getCurrentPositionAsync({
         accuracy: Location.Accuracy.Highest,
         maximumAge: 10000,
      }).catch(err => {
         // console.error(err);
      });

      if (location) {
         // setLocation(location);
         setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         });
         fetchAddress(location.coords.latitude, location.coords.longitude);
      }
   };

   const fetchAddress = async (latitude, longitude) => {
      try {
         const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBDWSR_1EWIYWtUlCrR2XpnQ7s4Wg-0H_4`,
         );
         // console.log(response.data);
         if (
            response.data &&
            response.data.results &&
            response.data.results.length > 0
         ) {
            // console.log(response.data.results);
            setAddress(response.data.results[0].formatted_address);
         }
      } catch (error) {
         console.error('Error fetching address:', error);
      }
   };

   const updateRide = async status => {
      const updateData = {
         rider_names: driverInfo.rider_names,
         rider_phone_number: driverInfo.rider_phone_number,
         curr_location: driverInfo.curr_location,
         curr_lat: driverInfo.curr_lat,
         curr_long: driverInfo.curr_long,
         dest_location: driverInfo.dest_location,
         dest_long: driverInfo.dest_long,
         dest_lat: driverInfo.dest_lat,
         distance: driverInfo.distance,
         distance_unit: driverInfo.distance_unit,
         price: ridePrice,
         currency: driverInfo.currency,
         status: status,
         date: Date.now(),
         driver_id: driverInfo.driver_id,
         driver_names: driverInfo.driver_names,
         driver_phone_number: driverInfo.driver_phone_number,
         driver_lat: driverInfo.driver_lat,
         driver_long: driverInfo.driver_long,
      };
      const res = await httpFactory.put(
         `rides/update/${driverInfo._id}`,
         updateData,
      );
      console.log(res.data);
   };

   useEffect(() => {
      checkGPS();
      getLocation();
      if (driverInfo) {
         const time = calculateTimeDistance(
            driverInfo?.driver_lat,
            driverInfo?.driver_long,
            driverInfo?.curr_lat,
            driverInfo?.curr_long,
         );
         setEstimatedTime(time);
         console.log('tempo estimado', estimatedTime);
         if (estimatedTime <= 0.1 && estimatedTime !== null) {
            console.log('caiu no time estimated,', estimatedTime);
            setDriverIsClose(true);
         }

         setActualRegion({
            latitude: driverInfo?.curr_lat,
            longitude: driverInfo?.curr_long,
         });
         setDestinationRegion({
            latitude: driverInfo?.dest_lat,
            longitude: driverInfo?.dest_long,
         });
      }
   }, [driverInfo]);

   useEffect(() => {
      if (destination !== null) {
         setIsButtonVisible(true);
      }
   }, [destination, pickup]);

   const reloadComponent = () => {
      setRiderCanceled(false);
      setPickup(null);
      setDestination(null);
      setRidesAccept(false);
      setIsButtonVisible(false);
      setSearchingDriver(false);
      setRidePrice(5);
      setPaymentModalOpen(false);
      setPaymentMethod(null);
      setDriverInfo(null);
      setEstimatedTime(null);
      setDriverIsClose(false);
      setDriverRegion(null);
      setDestinationRegion(null);
      setModalCancel(false);
      setRideStatus(0);
      setSearchingMessage('Procurando Motorista...');
   };

   return (
      <View>
         <View style={styles.mapContainer}>
            <TouchableOpacity
               style={styles.drawerButton}
               onPress={() => navigation.toggleDrawer()}
               // onPress={() => console.log(typeof firstname)}
            >
               <MaterialCommunityIcons name="menu" size={30} color="black" />
            </TouchableOpacity>
            <View>
               <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  showsUserLocation={true}
                  showsBuildings={true}
                  region={region}
               >
                  {driverRegion && actualRegion && destinationRegion && (
                     <>
                        {rideStatus === 1 && driverRegion ? (
                           <>
                              <MapViewDirections
                                 origin={actualRegion}
                                 destination={
                                    driverRegion ? driverRegion : null
                                 }
                                 apikey={process.env.API_GOOGLE_KEY}
                                 strokeColor="#0F53FF"
                                 strokeWidth={8}
                                 timePrecision="now"
                                 mode="DRIVING"
                                 onStart={params => {
                                    console.log(
                                       `Direções começadas para ${params.destination}`,
                                    );
                                 }}
                                 onReady={params => {}}
                                 optimizeWaypoints={true}
                                 precision="high"
                              />
                              <Marker
                                 coordinate={driverRegion ? driverRegion : null}
                                 icon={car}
                                 title="Destino"
                              />
                           </>
                        ) : null}
                        {rideStatus === 2 && (
                           <>
                              <MapViewDirections
                                 origin={driverRegion}
                                 destination={destinationRegion}
                                 apikey={process.env.API_GOOGLE_KEY}
                                 strokeColor="#0F53FF"
                                 strokeWidth={8}
                                 timePrecision="now"
                                 mode="DRIVING"
                                 onStart={params => {
                                    console.log(
                                       `Direções começadas para ${params.destination}`,
                                    );
                                 }}
                                 onReady={result => {
                                    setRidesDuration(result.duration);
                                    console.log(
                                       'Tempo de viagem do passageiro ao destino:',
                                       result.duration,
                                    );
                                 }}
                                 optimizeWaypoints={true}
                                 precision="high"
                              />
                              <Marker
                                 coordinate={driverRegion ? driverRegion : null}
                                 icon={car}
                                 title="Atual"
                              />
                              <Marker
                                 coordinate={
                                    destinationRegion ? destinationRegion : null
                                 }
                                 title="Destino"
                              />
                           </>
                        )}
                     </>
                  )}
               </MapView>
            </View>
            {searchingDriver && (
               <AwaitModal
                  searchingDriver={searchingDriver}
                  searchingMessage={searchingMessage}
                  setSearchingDriver={setSearchingDriver}
                  reloadComponent={reloadComponent}
               />
            )}
            {!ridesAccept ? (
               <BottomSheet
                  ref={bottomSheetRef}
                  index={0}
                  snapPoints={snapPoints}
                  onChange={handleSheetChanges}
                  backgroundStyle={{ backgroundColor: '#1A1A1A' }}
                  handleStyle={{ backgroundColor: '#1A1A1A' }}
                  handleIndicatorStyle={{ backgroundColor: 'white' }}
               >
                  <View style={{ ...styles.bottomSheetContainer, zIndex: 2 }}>
                     <ScrollView
                        contentContainerStyle={styles.tripContainer}
                        horizontal={false}
                        keyboardShouldPersistTaps="handled"
                     >
                        <View
                           style={{
                              ...styles.searchBoxView,
                           }}
                        >
                           <ScrollView
                              contentContainerStyle={{
                                 flex: 1,
                                 width: '100%',
                                 height: '100%',
                              }}
                              horizontal={true}
                              keyboardShouldPersistTaps="handled"
                           >
                              <GooglePlacesAutocomplete
                                 keyboardShouldPersistTaps="handled"
                                 listViewDisplayed={false}
                                 fetchDetails={true}
                                 placeholder={'Localização atual'}
                                 textInputProps={{
                                    onFocus: handlePlacePress,
                                    placeholderTextColor: 'white',
                                 }}
                                 styles={{
                                    container: {
                                       backgroundColor: 'black',
                                    },
                                    textInputContainer: {
                                       backgroundColor: 'black',
                                    },
                                    textInput: {
                                       backgroundColor: 'black',
                                       color: 'white',
                                    },
                                    predefinedPlacesDescription: {
                                       color: '#1faadb',
                                    },
                                 }}
                                 onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    if (details) {
                                       setPickup(details.geometry.location);
                                       setCurrLocation(
                                          data.structured_formatting.main_text,
                                       );
                                    }
                                 }}
                                 query={{
                                    key: API_KEY,
                                    language: 'pt',
                                 }}
                              />
                           </ScrollView>
                        </View>

                        <View
                           style={{
                              ...styles.searchBoxView,
                           }}
                        >
                           <ScrollView
                              contentContainerStyle={{
                                 flex: 1,
                                 width: '100%',
                                 height: '100%',
                              }}
                              keyboardShouldPersistTaps="handled"
                              horizontal={true}
                           >
                              <GooglePlacesAutocomplete
                                 keyboardShouldPersistTaps="handled"
                                 placeholder="Seu destino"
                                 listViewDisplayed={false}
                                 fetchDetails={true}
                                 textInputProps={{
                                    onFocus: handlePlacePress, //
                                    placeholderTextColor: 'white',
                                 }}
                                 styles={{
                                    container: {
                                       backgroundColor: 'black',
                                    },
                                    textInputContainer: {
                                       backgroundColor: 'black',
                                    },
                                    textInput: {
                                       backgroundColor: 'black',
                                       color: 'white',
                                    },
                                 }}
                                 onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    if (details) {
                                       setDestination(
                                          details.geometry.location,
                                       );
                                       setDestLocation(
                                          data.structured_formatting.main_text,
                                       );
                                    }
                                    // console.log(data);
                                 }}
                                 query={{
                                    key: API_KEY,
                                    language: 'pt',
                                 }}
                              />
                           </ScrollView>
                        </View>
                     </ScrollView>
                     {isButtonVisible && (
                        <View
                           style={{
                              width: '100%',
                              alignItems: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'absolute',
                              bottom: 30,
                           }}
                        >
                           {paymentMethod && (
                              <View
                                 style={{
                                    width: '90%',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                 }}
                              >
                                 <TouchableOpacity
                                    onPress={() => {
                                       setPaymentModalOpen(true);
                                    }}
                                    style={styles.container}
                                 >
                                    <View style={styles.iconContainer}>
                                       <Ionicons
                                          name={
                                             paymentMethod === 1
                                                ? 'card'
                                                : paymentMethod === 2
                                                ? 'wallet-outline'
                                                : 'qr-code'
                                          }
                                          size={24}
                                          color="lightblue"
                                       />
                                    </View>
                                    <View style={styles.leftContainer}>
                                       <Text style={styles.text}>
                                          {paymentMethod === 1
                                             ? 'Cartão'
                                             : paymentMethod === 2
                                             ? 'Dinheiro do app'
                                             : 'Pix'}
                                       </Text>
                                    </View>

                                    <View style={styles.arrowIconContainer}>
                                       <Ionicons
                                          name="chevron-forward"
                                          size={24}
                                          color="white"
                                       />
                                    </View>
                                 </TouchableOpacity>
                              </View>
                           )}
                           {paymentMethod === null && (
                              <TouchableOpacity
                                 style={{
                                    width: '90%',
                                    borderBottomColor: 'grey',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderBottomWidth: 2,
                                    marginBottom: 8,
                                 }}
                                 onPress={() => {
                                    setPaymentModalOpen(true);
                                 }}
                              >
                                 <Text style={{ color: 'grey', fontSize: 16 }}>
                                    Escolha forma de pagamento
                                 </Text>
                              </TouchableOpacity>
                           )}
                           {paymentModalOpen && (
                              <PaymentModal
                                 paymentModalOpen={paymentModalOpen}
                                 setPaymentModalOpen={setPaymentModalOpen}
                                 setPaymentMethod={setPaymentMethod}
                              />
                           )}
                           <View
                              style={{
                                 ...styles.bookButtonContainer,
                                 width: '90%',
                                 backgroundColor: !isButtonVisible
                                    ? '#555555'
                                    : '#2B2B2B',
                              }}
                           >
                              <TouchableOpacity
                                 // disabled={!isButtonVisible}
                                 style={styles.bookButton}
                                 onPress={() => {
                                    if (
                                       !destination ||
                                       !paymentMethod ||
                                       (!address && !pickup)
                                    ) {
                                       Toast.show(
                                          'Coloque todas as informações',
                                       );
                                       return;
                                    }
                                    handlePlacePress();
                                    setIsButtonVisible(true);
                                    searchRideLoop(
                                       region?.latitude,
                                       region?.longitude,
                                       3000,
                                    );
                                 }}
                              >
                                 <Text style={styles.bookText}>BUSCAR</Text>
                              </TouchableOpacity>
                           </View>
                        </View>
                     )}
                  </View>
               </BottomSheet>
            ) : (
               <View
                  style={{
                     width: '100%',
                     backgroundColor: '#2B2B2B',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'flex-start',
                     height: 300,
                     padding: 20,
                     // paddingBottom: 80,
                  }}
               >
                  <View
                     style={{
                        flexDirection: 'row',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                     }}
                  >
                     <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ color: 'white', fontSize: 26 }}>
                           {driverInfo?.driver_names}
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14 }}>
                           {driverInfo?.driver_phone_number}
                        </Text>
                     </View>
                     <View>
                        <Ionicons name="cash" size={24} color="lightgreen" />
                        <Text style={{ color: 'white', fontSize: 20 }}>
                           R$ {driverInfo?.price}
                        </Text>
                     </View>
                  </View>
                  <View
                     style={{
                        width: '100%',
                        display: 'flex',
                        height: 100,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 20,
                     }}
                  >
                     {!driverIsClose && rideStatus === 1 ? (
                        <Text style={{ color: 'white', fontSize: 16 }}>
                           Chegará em aproximadamente{' '}
                           {Math.floor(estimatedTime)} minutos
                        </Text>
                     ) : null}
                     {rideStatus === 2 ? (
                        <Text style={{ color: 'white', fontSize: 16 }}>
                           Chegará em aproximadamente{' '}
                           {Math.floor(ridesDuration)} minutos
                        </Text>
                     ) : null}
                     <Modal
                        visible={modalCancel}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                     >
                        <View style={styles.modalContainer}>
                           <View style={styles.modalContent}>
                              <Text
                                 style={{ ...styles.modalText, color: 'white' }}
                              >
                                 Tem certeza que deseja cancelar?
                              </Text>
                              <View style={styles.modalButtons}>
                                 <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                       reloadComponent();
                                       updateRide(3);
                                    }}
                                 >
                                    <Text style={styles.modalButtonText}>
                                       Confirmar
                                    </Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setModalCancel(false)}
                                 >
                                    <Text style={styles.modalButtonText}>
                                       Cancelar
                                    </Text>
                                 </TouchableOpacity>
                              </View>
                           </View>
                        </View>
                     </Modal>

                     <Modal transparent={true} visible={rideStatus === 4}>
                        <View style={styles.modalContainer}>
                           <View style={styles.modalContent}>
                              <View
                                 style={{
                                    ...styles.modalButtons,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                 }}
                              >
                                 <Text
                                    style={{
                                       ...styles.modalButtonText,
                                       marginBottom: 10,
                                    }}
                                 >
                                    Obrigado por viajar conosco
                                 </Text>
                                 <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => reloadComponent()}
                                 >
                                    <Text style={styles.modalButtonText}>
                                       Concluido
                                    </Text>
                                 </TouchableOpacity>
                              </View>
                           </View>
                        </View>
                     </Modal>
                  </View>
               </View>
            )}
         </View>
      </View>
   );
};
AppRegistry.registerComponent('RiderHomeContents', () => RiderHomeContents);
