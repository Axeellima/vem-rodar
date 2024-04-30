import NearbyController from '../../controllers/rider/nearby';
import RidesController from '../../controllers/rider/rides';
import router from '../route';
router.post('/rides/create', RidesController.create);
router.get('/rides/findall', RidesController.listRides);
router.put('/rides/update/:ride_id', RidesController.update);
router.delete('/rides/delete/:ride_id', RidesController.deleteRide);
router.get('/rides/find/:ride_id', RidesController.readRide);
router.post('/rides/nearby/find/:distance', NearbyController.getNearByDrivers);
router.post('/rides/getNearRides/:distance', RidesController.getNearRides);
export default router;