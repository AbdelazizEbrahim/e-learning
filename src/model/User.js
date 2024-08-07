import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: {type: String},
});

// export function clearModel() {
//   Object.keys(mongoose.models).forEach((modelName) => {
//     delete mongoose.models[modelName];
//   });
// }

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;