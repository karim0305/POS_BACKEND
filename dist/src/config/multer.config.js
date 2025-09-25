"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
exports.multerConfig = {
    storage: new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: async (req, file) => {
            return {
                folder: 'pos_products',
                format: file.mimetype.split('/')[1],
                public_id: file.originalname.split('.')[0],
            };
        },
    }),
};
//# sourceMappingURL=multer.config.js.map