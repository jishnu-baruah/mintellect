import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  ocid: { type: String }, // On-Chain ID for blockchain integration
  name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  institution: { type: String },
  bio: { type: String },
  userTier: { type: String, enum: ['free', 'premium'], default: 'free' },
  credits: { type: Number, default: 0 },
  avatar: { type: String }, // URL to avatar image
  refreshToken: { type: String },
  telegram: { type: String },
  twitter: { type: String },
  orcid: { type: String },
  wallet: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
