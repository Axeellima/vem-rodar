import RiderController from '../../controllers/rider/auth';
import NearByController from '../../controllers/rider/nearby';
import router from '../route';
router.post('/auth/rider/create', RiderController.create);
router.post('/auth/rider/login', RiderController.login);
router.post('/auth/rider/verify', RiderController.verifyPhone);
router.put('/auth/rider/profile/update', RiderController.updateProfile);
router.get('/auth/rider/nearby', NearByController.getNearByDrivers);
export default router;
