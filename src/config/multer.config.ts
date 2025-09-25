import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder: 'pos_products',                // 👈 Cloudinary folder
        format: file.mimetype.split('/')[1],   // jpg / png / jpeg
        public_id: file.originalname.split('.')[0], // optional
      };
    },
  }),
};
