import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const fileTypes = ['image/jpeg', 'image/png'];

    if (fileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Only images allowed'));
    }
  },
});
