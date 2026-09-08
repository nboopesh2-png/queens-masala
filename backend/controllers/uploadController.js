const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: '/tmp/uploads/' });

exports.uploadImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const path = req.file.path;
      const result = await cloudinary.uploader.upload(path, { folder: 'queens-masala' });
      // remove temp file
      fs.unlinkSync(path);
      res.json({ url: result.secure_url });
    } catch (err) {
      console.error('Upload error', err);
      res.status(500).json({ message: 'Upload failed' });
    }
  }
];
