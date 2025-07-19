import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { PROFILE_REQUIREMENTS } from '../config/profileRequirements.config.js';
import { checkProfileCompletion } from '../utils/checkProfileCompletion.js';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET user profile by wallet
router.get('/profile', asyncHandler(async (req, res) => {
  const { wallet } = req.query;
  console.log('[GET /settings/profile/profile] wallet:', wallet);
  if (!wallet) return res.status(400).json({ message: 'Wallet address required' });
  const user = await User.findOne({ wallet });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const profile = user.toObject();
  const allComplete = checkProfileCompletion(profile);
  res.json({ profile, allComplete });
}));

// GET profile requirements checklist
router.get('/requirements', asyncHandler(async (req, res) => {
  const wallet = req.headers['x-wallet'];
  console.log('[GET /settings/profile/requirements] wallet:', wallet);
  let user = await User.findOne({ wallet });
  let userProfile = user ? user.toObject() : {};
  // Patch: extract firstName and lastName from name if present
  if (userProfile.name) {
    const nameParts = userProfile.name.split(' ');
    userProfile.firstName = nameParts[0] || '';
    userProfile.lastName = nameParts.slice(1).join(' ') || '';
  }
  // Patch: map email from mail
  if (userProfile.mail) {
    userProfile.email = userProfile.mail;
  }
  // Patch: ensure wallet is present
  if (userProfile.wallet) {
    userProfile.wallet = userProfile.wallet;
  }
  const checklist = PROFILE_REQUIREMENTS.map(req => ({
    ...req,
    completed: Boolean(userProfile[req.key])
  }));
  res.json({ checklist, allComplete: checkProfileCompletion(userProfile) });
}));

// POST create user profile
router.post('/profile', upload.single('avatar'), asyncHandler(async (req, res) => {
  const { wallet, firstName, lastName, email, institution, bio } = req.body;
  if (!wallet) return res.status(400).json({ message: 'Wallet address required' });
  let user = await User.findOne({ wallet });
  let avatarUrl = user && user.avatar ? user.avatar : "";
  if (req.file) {
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'mintellect/avatars' },
        (error, result) => {
          if (error) return reject(error);
          avatarUrl = result.secure_url;
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
  }

  const updateFields = {
    name: firstName + ' ' + lastName,
    mail: email,
    institution,
    bio,
    avatar: avatarUrl
  };

  if (user) {
    Object.assign(user, updateFields);
    await user.save();
    res.status(200).json({ message: 'Profile updated', user });
  } else {
    user = new User({ wallet, ...updateFields });
    await user.save();
    res.status(201).json({ message: 'Profile created', user });
  }
}));
export default router;
