import jwt from 'jsonwebtoken';
import {
   HTTP_ACCESS_DENIED,
   HTTP_BAD_REQUEST,
   HTTP_CREATED,
   HTTP_NOT_FOUND,
   HTTP_OK,
} from '../../core/constants/httpStatus';
import Res from '../../helpers/responses';
import RiderModal from '../../models/rider';
import createSecret from '../../utils/secretCode';
import { createToken } from '../../utils/token';
import { isRiderValid } from '../../utils/validator/users';

const TOKEN_SECRET_KEY = 'YOUR_SECURE_PASSWORD';
/**
 * Rider Controller
 */
class RiderController {
   /**
    * Create a user
    * @param {*} req
    * @param {*} res
    * @returns {string|object} user payload
    */
   static async create(req, res) {
      const data = req.body;
      const { phone_number, date } = data;
      const { error } = isRiderValid(data);
      if (error) {
         let errorMessage = error.details[0].message;
         return Res.handleError(HTTP_BAD_REQUEST, `${errorMessage}`, res);
      }

      const riderExist = await RiderModal.findOne({ phone_number });

      if (riderExist) {
         return Res.handleError(HTTP_ACCESS_DENIED, `Úsuario já existe`, res);
      }

      const secret = createSecret();
      let rider = new RiderModal({
         phone_number,
         secret,
         date,
         activated: true,
      }).save();
      const token = createToken(rider, TOKEN_SECRET_KEY);
      return Res.handleSuccess(HTTP_CREATED, token, rider, res);
      // await RiderModal.find({ phone_number })
      //    .exec()
      //    .then(async (user) => {
      //       const token = createToken(user, TOKEN_SECRET_KEY);
      //       if (user.length === 1) {
      //          await PhoneVerification.sendVerificationPhone(rider)
      //             .then(async () => {
      //                await RiderModal.findOneAndUpdate(
      //                   { _id: user[0]?._id },
      //                   { secret },
      //                   { new: true },
      //                   (err, result) => {
      //                      if (err)
      //                         Res.handleError(HTTP_SERVER_ERROR, 'error', res);
      //                      Res.handleSuccess(HTTP_OK, token, result, res);
      //                   },
      //                );
      //             })
      //             .catch((err) => {
      //                return Res.handleError(HTTP_SERVER_ERROR, err, res);
      //             });
      //       } else {
      //          await PhoneVerification.sendVerificationPhone(rider)
      //             .then(async (data) => {
      //                const { result: phoneResult } = data;
      //                if (phoneResult === 'success') {
      //                   await rider
      //                      .save()
      //                      .then((result) => {
      //                         return Res.handleSuccess(
      //                            HTTP_CREATED,
      //                            token,
      //                            result,
      //                            res,
      //                         );
      //                      })
      //                      .catch((err) => {
      //                         return Res.handleError(
      //                            HTTP_SERVER_ERROR,
      //                            err,
      //                            res,
      //                         );
      //                      });
      //                } else {
      //                   return Res.handleError(
      //                      HTTP_SERVER_ERROR,
      //                      'VERIFICATION ERROR',
      //                      res,
      //                   );
      //                }
      //             })
      //             .catch((err) => {
      //                return Res.handleError(HTTP_SERVER_ERROR, err, res);
      //             });
      //       }
      //    });
   }
   /**
    * veriy phone
    * @param {*} req
    * @param {*} res
    * @returns {object}
    */
   static async verifyPhone(req, res) {
      const data = req.body;
      const { phone_number, secret } = data;
      await RiderModal.find({ phone_number })
         .exec()
         .then((user) => {
            if (user === null) {
               if (err) Res.handleError(HTTP_NOT_FOUND, 'NO RIDER FOUND', res);
               return;
            }
            //alterar se necessario para user[0].secret
            if (user) {
               return Res.handleSuccess(
                  HTTP_OK,
                  'RIDER ACCOUNT SUCCESSFULLY VERIFIED',
                  user,
                  res,
               );
            } else {
               Res.handleError(
                  HTTP_NOT_FOUND,
                  'RIDER ACCOUNT NOT VERIFIED',
                  res,
               );
            }
         });
   }
   /**
    * rider login
    * @param {*} req
    * @param {*} res
    * @returns {string|object}
    */
   static async login(req, res) {
      const { phone_number } = req.body;
      const user = await RiderModal.findOne({ phone_number });
      if (!user) {
         return Res.handleError(HTTP_NOT_FOUND, 'Usuario não encontrado', res);
      }
      console.log(req.body);
      const token = jwt.sign(
         {
            firstname: user.firstname,
            lastname: user.lastname,
            nationality: user.nationality,
            image: user.image,
            phone_number: user.phone_number,
            email: user.email,
            date: user.date,
         },
         TOKEN_SECRET_KEY,
         {
            expiresIn: '24h',
         },
      );
      return Res.handleSuccess(
         HTTP_OK,
         'RIDER SUCCESSFULLY LOGGED IN',
         {
            token,
            id: user.id,
            firstname: user.firstname,
         },
         res,
      );
   }
   /**
    *
    * @param {*} req
    * @param {*} res
    * @returns {object}
    */
   static async updateProfile(req, res) {
      const data = req.body;
      const { error } = isRiderValid(data);
      if (error) {
         let errorMessage = error.details[0].message;
         return Res.handleError(HTTP_BAD_REQUEST, `${errorMessage}`, res);
      }
      const { phone_number } = data;
      console.log(data);
      await RiderModal.findOneAndUpdate(
         { phone_number: phone_number },
         data,
         { new: true },
         (err, result) => {
            console.log(result);
            Res.handleSuccess(HTTP_OK, 'RIDER SUCCESSFULLY UPDATED', data, res);
         },
      );
   }
}

export default RiderController;
