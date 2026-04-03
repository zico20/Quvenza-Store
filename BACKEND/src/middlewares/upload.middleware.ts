import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { UPLOAD_MAX_SIZE, UPLOAD_ALLOWED_TYPES } from '../config/constants';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: UPLOAD_MAX_SIZE },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (UPLOAD_ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Invalid file type. Allowed: ${UPLOAD_ALLOWED_TYPES.join(', ')}`));
  },
});
