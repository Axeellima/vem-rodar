import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
   ActivityIndicator,
   Alert,
   AppRegistry,
   Dimensions,
   Modal,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { URL_WEBSOCKET } from '../../constants/urls';
import { httpFactory } from '../../factory/httpFactory';
import styles from './styles/homecontents';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default DriverHomeContents = ({ navigation }) => {
   const mapRef = useRef(null);
   const [region, setRegion] = useState(null);
   const [allFoundedRides, setAllFoundedRides] = useState([]);
   const [foundedRider, setFoundedRider] = useState(null);
   const [searching, setSearching] = useState(false);
   const [passengerPicked, setPassengerPicked] = useState(false);
   const [destinationRegion, setDestinationRegion] = useState(null);
   const [modalCancel, setModalCancel] = useState(false);
   const [updatedRideInfo, setUpdatedRideInfo] = useState(null);
   const [refusedRides, setRefusedRides] = useState([]);
   const [rideFinish, setRideFinish] = useState(false);
   const [initialRoute, setInitialRoute] = useState(null);
   const [ridesDuration, setRidesDuration] = useState(0);
   const [isMapInfoSet, setIsMapInfoSet] = useState(false);
   const [driverInfo, setDriverInfo] = useState({
      name: '',
      id: '',
      phone_number: 0,
   });
   const [passengerAddress, setPassengerAddress] = useState('');
   const [passengerDestination, setPassengerDestination] = useState('');
   const [isLoading, setIsLoading] = useState(true);
   const [stepInstructions, setStepInstructions] = useState('');
   const [distanceInKm, setDistanceInKm] = useState(0);
   const [allSteps, setAllSteps] = useState([]);
   const [message, setMessage] = useState(null);
   const [openWebSocket, setOpenWebSocket] = useState(false);

   let locationSubscription = null;
   const socket = new WebSocket(URL_WEBSOCKET);

   const searchRider = async () => {
      const interval = 10000;
      const searchClosestRide = async () => {
         if (!foundedRider) {
            await findClosestPassenger();
         }
         if (foundedRider) {
            setSearching(false);
         } else {
            setTimeout(searchClosestRide, interval);
         }
      };
      await searchClosestRide();
   };

   const cancelRide = rideId => {
      const alreadyRefused = refusedRides.some(ride => ride === rideId);
      if (!alreadyRefused) {
         setRefusedRides(prevRefusedRides => [...prevRefusedRides, rideId]);
      } else {
      }
      reloadComponent();
   };

   const handleCancel = () => {
      // Cancela o monitoramento da localização em tempo real
      if (locationSubscription) {
         locationSubscription.remove();
      }
   };

   const reloadComponent = () => {
      setOpenWebSocket(false);
      setPassengerAddress('');
      setPassengerDestination('');
      setAllSteps([]);
      setFoundedRider(null);
      setPassengerPicked(false);
      setDestinationRegion(null);
      setModalCancel(false);
      setUpdatedRideInfo(null);
      setRideFinish(false);
      setInitialRoute(null);
      setRidesDuration(0);
   };

   const getCurrentDriverLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
         return null;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
         latitude,
         longitude,
      });

      setIsLoading(false);
      return { latitude, longitude };
   };

   const handleChangeRidesStatus = async (riderId, status) => {
      try {
         const updateData = {
            rider_names: foundedRider.rider_names,
            rider_phone_number: foundedRider.rider_phone_number,
            curr_location: foundedRider.curr_location,
            curr_lat: foundedRider.curr_lat,
            curr_long: foundedRider.curr_long,
            dest_location: foundedRider.dest_location,
            dest_long: foundedRider.dest_long,
            dest_lat: foundedRider.dest_lat,
            distance: foundedRider.distance,
            distance_unit: foundedRider.distance_unit,
            price: foundedRider.price,
            currency: foundedRider.currency,
            status: status,
            date: Date.now(),
            driver_id: driverInfo.id,
            driver_names: driverInfo.name,
            driver_phone_number: driverInfo.phone_number,
            driver_lat: region.latitude,
            driver_long: region.longitude,
         };
         const res = await httpFactory.put(
            `rides/update/${riderId}`,
            updateData,
         );
         handleCancel();
         setUpdatedRideInfo(res.data.data);
      } catch (error) {}
   };

   function calculateDistance(
      driverLat,
      driverLong,
      passangerLat,
      passangerLong,
   ) {
      const R = 6371; // Raio médio da Terra em quilômetros
      const dLat = toRadians(passangerLat - driverLat);
      const dLon = toRadians(passangerLong - driverLong);
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(toRadians(driverLat)) *
            Math.cos(toRadians(passangerLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
   }

   function calculateDistanceInMeters(
      driverLat,
      driverLong,
      passangerLat,
      passangerLong,
   ) {
      const R = 6371 * 1000; // Raio médio da Terra em metros
      const dLat = toRadians(passangerLat - driverLat);
      const dLon = toRadians(passangerLong - driverLong);
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(toRadians(driverLat)) *
            Math.cos(toRadians(passangerLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
   }

   function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
   }

   const findClosestPassenger = async () => {
      let minDistance = 0.045;
      try {
         const res = await httpFactory.post(
            `rides/getNearRides/${minDistance}`,
            {
               lat: region.latitude,
               long: region.longitude,
            },
         );
         if (res && res.data && res.data.message.length >= 1) {
            setAllFoundedRides(res.data.message);

            return;
         }
      } catch (error) {}
   };
   const getInfo = async () => {
      const name = await AsyncStorage.getItem('driverName');
      const phone_number = await AsyncStorage.getItem('driverPhone');
      const id = await AsyncStorage.getItem('driverId');
      if (!id || !name || !phone_number) {
         Alert.alert('Usuário não encontrado, faça login novamente.');
         setTimeout(() => navigation.navigate('Register'), 3000);
      }
      setDriverInfo({
         id,
         name,
         phone_number,
      });
   };
   const removeHtmlTags = text => {
      return text.replace(/<\/?[^>]+(>|$)/g, '');
   };

   const translateAndRemoveHtmlTags = async text => {
      const textWithoutHtml = removeHtmlTags(text);

      return textWithoutHtml;
   };

   const setMapRideInformations = async ({ distance, duration, steps }) => {
      const translatedInstructions = await translateAndRemoveHtmlTags(
         steps[0].html_instructions,
      );

      setDistanceInKm(distance);
      setRidesDuration(duration);
      setAllSteps(steps);
      setStepInstructions(translatedInstructions);
   };

   useEffect(() => {
      console.log(foundedRider);
      if (!region) {
         let awaitLocation = async () => await getCurrentDriverLocation();
         awaitLocation();
         return;
      }
      Location.watchPositionAsync(
         {
            accuracy: Location.LocationAccuracy.Highest,
            timeInterval: 500,
            distanceInterval: 1,
         },
         res => {
            if (openWebSocket) {
               const sendRegion = {
                  event: 'message',
                  data: {
                     raceId: updatedRideInfo._id,
                     message: [res.coords.latitude, res.coords.longitude],
                  },
               };
               socket.onopen = () => {
                  console.log('WebSocket aberto. Enviando dados...');
                  socket.send(JSON.stringify(sendRegion));
               };

               // Verifique se o estado do WebSocket é OPEN antes de definir a função onopen
               if (socket.readyState === WebSocket.OPEN) {
                  // Se o WebSocket já estiver aberto, defina a função onopen imediatamente
                  socket.onopen();
               }
            }
            setRegion({
               latitude: res.coords.latitude,
               longitude: res.coords.longitude,
            });
         },
      );
   }, [openWebSocket]);
   useEffect(() => {
      if (updatedRideInfo && !rideFinish) {
         socket.onopen = () => {
            console.log('entrou e ta td bem');

            setOpenWebSocket(true);
            // const enjoy = {
            //    event: 'joinRace',
            //    data: { raceId: updatedRideInfo?._id },
            // };
            // socket.send(JSON.stringify(enjoy));
         };

         return;
      }
   }, [region, openWebSocket]);
   useEffect(() => {
      if (!driverInfo.id || !driverInfo.phone_number) {
         getInfo();
      } else if (driverInfo.id && driverInfo.phone_number) {
         if (initialRoute && updatedRideInfo?.status === 1) {
            const distance = calculateDistanceInMeters(
               initialRoute.riderLoc.latitude,
               initialRoute.riderLoc.longitude,
               region.latitude,
               region.longitude,
            );
            console.log('distancia pro passageiro', distance);
            if (distance <= 20) {
               setPassengerPicked(true);
            }
         } else if (initialRoute && updatedRideInfo?.status === 2) {
            const lastDistance = calculateDistanceInMeters(
               initialRoute.destLoc.latitude,
               initialRoute.destLoc.longitude,
               region?.latitude,
               region?.longitude,
            );
            if (lastDistance <= 20) {
               setRideFinish(true);
            }
         }
      }
   }, [updatedRideInfo, driverInfo, region]);

   useEffect(() => {
      let mostRecentPassenger = null;
      if (allFoundedRides.length > 0 && region) {
         allFoundedRides.forEach(mainRide => {
            let alreadyRefused = refusedRides.find(ride => {
               return ride === mainRide._id;
            });
            if (alreadyRefused && mainRide.status === 0) {
               return;
            } else if (mainRide.status === 0) {
               const distance = calculateDistance(
                  region.latitude,
                  region.longitude,
                  mainRide.curr_lat,
                  mainRide.curr_long,
               );

               if (
                  !mostRecentPassenger
                  // || distance < mostRecentPassenger.distance
               ) {
                  mostRecentPassenger = {
                     ...mainRide,
                     distance: distance,
                  };
               }
            }
         });

         if (mostRecentPassenger) {
            setFoundedRider(mostRecentPassenger);
            setInitialRoute({
               driverLoc: {
                  latitude: region.latitude,
                  longitude: region.longitude,
               },
               riderLoc: {
                  latitude: mostRecentPassenger.curr_lat,
                  longitude: mostRecentPassenger.curr_long,
               },
               destLoc: {
                  latitude: mostRecentPassenger.dest_lat,
                  longitude: mostRecentPassenger.dest_long,
               },
            });
         } else {
         }
      }
   }, [refusedRides, allFoundedRides, passengerPicked]);

   return (
      <View style={styles.container}>
         <Modal transparent={true} visible={!searching}>
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  {!isLoading ? (
                     <TouchableOpacity
                        onPress={() => {
                           setSearching(true);
                           searchRider();
                        }}
                        style={styles.searchButton}
                     >
                        <Text style={styles.searchButtonText}>
                           Iniciar Busca
                        </Text>
                     </TouchableOpacity>
                  ) : (
                     <ActivityIndicator color={'white'} />
                  )}
               </View>
            </View>
         </Modal>
         {region && (
            <MapView
               ref={mapRef}
               provider={PROVIDER_GOOGLE}
               style={styles.map}
               showsUserLocation={true}
               showsBuildings={true}
               region={{
                  ...region,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
               }}
            >
               {initialRoute ? (
                  <>
                     <MapViewDirections
                        language="pt"
                        origin={
                           foundedRider?.status === 0
                              ? initialRoute.driverLoc
                              : undefined
                        }
                        destination={
                           foundedRider?.status === 0
                              ? initialRoute.destLoc
                              : updatedRideInfo?.status === 1
                              ? initialRoute.riderLoc
                              : undefined
                        }
                        apikey={'AIzaSyDvz7ZoqEAcZ_eC5rbJMhkXFIQMFyju5hU'}
                        timePrecision="now"
                        mode="DRIVING"
                        strokeColor="#0F53FF"
                        strokeWidth={8}
                        onStart={params => {}}
                        resetOnChange={rideFinish}
                        onReady={result => {
                           if (updatedRideInfo) {
                              setMapRideInformations({
                                 duration: result.duration,
                                 distance: result.distance,
                                 steps: result.legs[0].steps,
                              });
                           }
                        }}
                     />
                     {updatedRideInfo && (
                        <Marker
                           coordinate={
                              updatedRideInfo?.status === 1
                                 ? initialRoute.riderLoc
                                 : initialRoute.destLoc
                           }
                           title="Localização do Passageiro"
                           icon={{
                              name: 'default', // Nome do ícone
                              color: 'red', // Cor do ícone (opcional)
                              size: 30, // Tamanho do ícone (opcional)
                           }}
                        />
                     )}
                  </>
               ) : null}
            </MapView>
         )}
         {allSteps.length > 0 ? (
            <View
               style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  backgroundColor: '#1e1e1e',
                  height: 180,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
               }}
            >
               {allSteps ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                     <Text
                        style={{
                           color: 'white',
                           fontSize: 20,
                           textAlign: 'center',
                        }}
                     >
                        {allSteps ? stepInstructions : 'Aguarde..'}
                     </Text>
                  </View>
               ) : (
                  <ActivityIndicator color={'white'} />
               )}
            </View>
         ) : (
            <TouchableOpacity
               style={styles.drawerButton}
               onPress={() => navigation.toggleDrawer()}
            >
               <MaterialCommunityIcons name="menu" size={30} color="black" />
            </TouchableOpacity>
         )}
         <View
            style={{
               backgroundColor: '#1e1e1e',
               display: 'flex',
               flexDirection: 'row',
               alignItems: 'center',
               height: updatedRideInfo?.status !== 2 ? 230 : 230,
               justifyContent: 'space-between',
               position: 'absolute',
               bottom: 0,
               paddingHorizontal: 20,
               borderTopLeftRadius: 20,
               borderTopRightRadius: 20,
               width: '100%',
               paddingVertical: 20, // Espaçamento vertical adicionado
            }}
         >
            {!foundedRider ? ( // colocar diferente de foundedRIder
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'column',
                     width: '100%',
                     justifyContent: 'center',
                     alignItems: 'center',
                  }}
               >
                  <Text
                     style={{ color: 'white', fontSize: 24, marginBottom: 10 }}
                  >
                     Procurando passageiro
                  </Text>
                  {/* <TouchableOpacity
                     style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 200,
                        backgroundColor: '#2B2B2B',
                        paddingVertical: 12, // Ajuste de espaçamento vertical
                        paddingHorizontal: 24, // Ajuste de espaçamento horizontal
                        borderRadius: 8,
                     }}
                     onPress={() => handleCancel()}
                  >
                     <Text style={{ color: 'white', fontSize: 18 }}>
                        Cancelar
                     </Text>
                  </TouchableOpacity> */}
               </View>
            ) : (
               <View
                  style={{
                     width: '100%',
                     display: 'flex',
                     height: updatedRideInfo?.status !== 2 ? '80%' : '50%',
                     justifyContent:
                        updatedRideInfo?.status !== 2
                           ? 'space-between'
                           : 'center',
                     alignItems: 'center',
                     flexDirection: 'column',
                  }}
               >
                  <Text style={{ color: 'white', fontSize: 24 }}>
                     {foundedRider?.rider_names}
                  </Text>
                  <View
                     style={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        height: '90%',
                        justifyContent: 'space-around',
                     }}
                  >
                     <View
                        style={{
                           display: 'flex',
                           flexDirection: 'row',
                           width: '100%',
                           justifyContent: 'space-around',
                        }}
                     >
                        {updatedRideInfo?.status !== 1 &&
                        updatedRideInfo?.status !== 2 ? (
                           <View
                              style={{
                                 display: 'flex',
                                 flexDirection: 'column',
                              }}
                           >
                              <Text style={{ color: 'grey', fontSize: 18 }}>
                                 {foundedRider?.curr_location}
                              </Text>
                              <Text style={{ color: 'grey', fontSize: 18 }}>
                                 {foundedRider?.dest_location}
                              </Text>
                           </View>
                        ) : (
                           <Text style={{ color: 'grey', fontSize: 18 }}>
                              Aproximadamente {Math.round(distanceInKm)} Km
                           </Text>
                        )}
                        <Text style={{ color: 'white', fontSize: 20 }}>
                           <Text>{`R$${foundedRider?.price.toLocaleString(
                              'pt-BR',
                              {
                                 minimumFractionDigits: 2,
                              },
                           )}`}</Text>
                        </Text>
                     </View>

                     {updatedRideInfo?.status !== 1 &&
                     updatedRideInfo?.status !== 2 ? (
                        <View
                           style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              width: '100%',
                           }}
                        >
                           <TouchableOpacity
                              style={{
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 width: 150,
                                 backgroundColor: '#2B2B2B',
                                 paddingVertical: 10, // Ajuste de espaçamento vertical
                                 paddingHorizontal: 20, // Ajuste de espaçamento horizontal
                                 borderRadius: 8,
                              }}
                              onPress={() => {
                                 handleChangeRidesStatus(foundedRider?._id, 1);
                              }}
                           >
                              <Text
                                 style={{
                                    color: 'white',
                                    fontSize: 20,
                                 }}
                              >
                                 Aceitar
                              </Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                              style={{
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 width: 150,
                                 backgroundColor: '#2B2B2B',
                                 paddingVertical: 10, // Ajuste de espaçamento vertical
                                 paddingHorizontal: 20, // Ajuste de espaçamento horizontal
                                 borderRadius: 8,
                              }}
                              onPress={() => {
                                 cancelRide(foundedRider?._id);
                              }}
                           >
                              <Text
                                 style={{
                                    color: 'white',
                                    fontSize: 20,
                                 }}
                              >
                                 Recusar
                              </Text>
                           </TouchableOpacity>
                        </View>
                     ) : null}
                     {updatedRideInfo?.status === 1 && (
                        <View
                           style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                           }}
                        >
                           <Text style={{ color: 'white', fontSize: 20 }}>
                              Tempo estimado: {'  '}
                              {Math.round(ridesDuration)} Minutos
                           </Text>
                        </View>
                     )}
                  </View>
                  <Modal
                     visible={passengerPicked ? true : false}
                     transparent={true}
                     animationType="slide"
                     onRequestClose={() => {
                        setPassengerPicked(false);
                     }}
                  >
                     <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                           <TouchableOpacity
                              style={styles.modalButton}
                              onPress={() => {
                                 handleChangeRidesStatus(foundedRider?._id, 2);
                                 setPassengerPicked(false);
                              }}
                           >
                              <Text style={styles.modalOption}>
                                 Passageiro Coletado
                              </Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                              style={styles.modalButton}
                              onPress={() => {
                                 setModalCancel(true);
                              }}
                           >
                              <Text style={styles.modalOption}>Cancelar</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </Modal>

                  <Modal
                     visible={modalCancel}
                     animationType="slide"
                     transparent={true}
                  >
                     <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                           <Text style={styles.modalOption}>
                              Deseja confirmar o cancelamento?
                           </Text>

                           <TouchableOpacity
                              style={{
                                 ...styles.modalButton,
                                 width: 150,
                                 justifyContent: 'center',
                                 alignItems: 'center',
                              }}
                              onPress={() => {
                                 setModalCancel(false);
                                 handleChangeRidesStatus(foundedRider?._id, 3);
                                 reloadComponent();
                              }}
                           >
                              <Text style={styles.modalOption}>Sim</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                              style={{
                                 ...styles.modalButton,
                                 width: 150,
                                 justifyContent: 'center',
                                 alignItems: 'center',
                              }}
                              onPress={() => setModalCancel(false)}
                           >
                              <Text style={styles.modalOption}>Não</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </Modal>
                  {updatedRideInfo?.status === 2 && (
                     <View
                        style={{
                           // backgroundColor: 'cyan',
                           width: '100%',
                           flexDirection: 'row',
                           display: 'flex',
                           justifyContent: 'space-around',
                           alignItems: 'center',
                        }}
                     >
                        <Text style={{ color: 'white', fontSize: 20 }}>
                           {Math.round(ridesDuration)} Minutos
                        </Text>
                        <TouchableOpacity
                           style={{
                              ...styles.modalButton,
                              width: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                           }}
                           onPress={() => {
                              // handleChangeRidesStatus(foundedRider?._id, 3);
                              setModalCancel(true);
                           }}
                        >
                           <Text style={styles.modalOption}>Cancelar</Text>
                        </TouchableOpacity>
                     </View>
                  )}
                  <Modal
                     visible={rideFinish ? true : false}
                     animationType="slide"
                     transparent={true}
                  >
                     <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                           <Text style={styles.modalOption}>
                              Passageiro Desceu no destino?
                           </Text>

                           <TouchableOpacity
                              style={{
                                 ...styles.modalButton,
                                 width: 150,
                                 justifyContent: 'center',
                                 alignItems: 'center',
                              }}
                              onPress={() => {
                                 reloadComponent();
                                 setRideFinish(false);
                                 handleChangeRidesStatus(foundedRider?._id, 4);
                              }}
                           >
                              <Text style={styles.modalOption}>Sim</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </Modal>
               </View>
            )}
         </View>
      </View>
   );
};
AppRegistry.registerComponent('DriverHomeContents', () => DriverHomeContents);
