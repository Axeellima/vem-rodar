import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
   firstname: { type: String, required: true },
   lastname: { type: String, required: true },
   nationality: { type: String, required: false },
   image: { type: String, required: false },
   country_code: { type: String, required: false },
   phone_number: { type: String, required: true, unique: true },
   driving_licence: { type: String, required: true },
   licence_number: { type: String, required: true },
   email: { type: String, required: false },
   password: { type: String, required: true },
   secret: { type: String, required: true },
   verified: { type: Boolean, required: true, default: false },
   date: { type: String, required: true },
   location: {},
});
driverSchema.index({ location: '2dsphere' });
export default mongoose.model('drivers', driverSchema);
