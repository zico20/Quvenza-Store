import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema, addAddressSchema } from '../schemas/user.schema';
import { getProfile, updateProfile, changePassword, getAddresses, addAddress, deleteAddress } from '../controllers/user.controller';

const router = Router();
router.use(verifyToken);
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.post('/change-password', changePassword);
router.get('/addresses', getAddresses);
router.post('/addresses', validate(addAddressSchema), addAddress);
router.delete('/addresses/:id', deleteAddress);
export default router;
