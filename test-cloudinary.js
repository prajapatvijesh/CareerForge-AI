const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'Root',
  api_key: '786337583518245',
  api_secret: 'suvgSP1c-kMHL3tWXhdrmFh-3To',
});

cloudinary.api.ping()
  .then(res => console.log('Ping success:', res))
  .catch(err => console.error('Ping error:', err));
