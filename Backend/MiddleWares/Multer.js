const multer = require('multer');
const path = require('path');

const memoryStorage = multer.memoryStorage(); // Store files in memory

const fileFilter = (req, file, cb) => {
  const filetypes = /webm|mp4|ogg|mov|avi|wmv/;
  const mimetype = file.mimetype.startsWith('video/');
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only video files are allowed!'));
};

const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

module.exports = upload;