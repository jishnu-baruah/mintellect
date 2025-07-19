import { PROFILE_REQUIREMENTS } from '../config/profileRequirements.config.js';

export const checkProfileCompletion = (userProfile) => {
  // Patch: extract firstName and lastName from name if present
  let patchedProfile = { ...userProfile };
  if (patchedProfile.name) {
    const nameParts = patchedProfile.name.split(' ');
    patchedProfile.firstName = nameParts[0] || '';
    patchedProfile.lastName = nameParts.slice(1).join(' ') || '';
  }
  // Patch: map email from mail
  if (patchedProfile.mail) {
    patchedProfile.email = patchedProfile.mail;
  }
  // Patch: ensure wallet is present
  if (patchedProfile.wallet) {
    patchedProfile.wallet = patchedProfile.wallet;
  }
  return PROFILE_REQUIREMENTS.every(req => {
    if (!req.required) return true;
    return Boolean(patchedProfile[req.key]);
  });
};
