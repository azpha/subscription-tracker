import { Router } from 'express';
import AuthController from '../controllers/Auth.js'
import AuthUtils from '../services/Authentication.js';

const router = Router()
router.get('/logout', AuthUtils.verifyJwt, AuthController.LogoutAccount)
router.get('/@me', AuthUtils.verifyJwt, AuthController.FetchAuthedAccount)
router.post('/login', AuthController.LoginAccount)
router.post('/register', AuthController.RegisterAccount)

export default router;