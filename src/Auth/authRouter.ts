import { Router } from 'express';
import { registerUser } from './authController';

const router = Router()
// router.get('/signup', signup_get); //signup page
router.post('/register', registerUser); //create a new user in database
// router.get('/login',  login_get);  // get login page
// router.post('/login', login_get); //auntheticate a current user
// router.get('/logout', logout); //log a user out

export const authRoutes = router;
