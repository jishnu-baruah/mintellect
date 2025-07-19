export const PROFILE_REQUIREMENTS = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'institution', label: 'Institution', required: true },
  { key: 'avatar', label: 'Avatar', required: false, type: 'image', upload: true },
  { key: 'telegram', label: 'Join Telegram', required: false, link: 'https://t.me/yourchannel' },
  { key: 'twitter', label: 'Follow Twitter', required: false, link: 'https://twitter.com/yourprofile' },
  { key: 'wallet', label: 'Connect Wallet', required: true, link: '' }
];
