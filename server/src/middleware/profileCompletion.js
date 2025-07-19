import { checkProfileCompletion } from '../utils/checkProfileCompletion.js';
import User from '../models/user.model.js';

export async function requireProfileCompletion(req, res, next) {
  // Always allow requirements endpoint for any wallet
  if (req.path === '/requirements') return next();
  // Always allow POST to /settings/profile/profile for new users
  if (req.method === 'POST' && req.path === '/profile') return next();

  // Get wallet from query, header, or user object
  const wallet = req.query.wallet || req.headers['x-wallet'] || (req.user && req.user.wallet);
  if (!wallet) return res.status(401).json({ message: 'Wallet address required' });
  const user = await User.findOne({ wallet });
  if (!user) return res.status(401).json({ message: 'User not found' });
  if (!checkProfileCompletion(user)) {
    if (!req.path.startsWith('/settings/profile')) {
      return res.status(403).json({
        message: 'Please complete your profile to use Mintellect. Finish the steps below to unlock the full app experience.'
      });
    }
  }
  req.user = user;
  next();
}
