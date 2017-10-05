require('babel-register');
const express = require('express');
const router = express();
import User from '../../bdd/db.user'
import RCode from '../../bdd/db.resetCode'
import mongoose from 'mongoose'
import validator from 'validator'

import jwt from 'jsonwebtoken'
import Auth from './auth'
const ApiRoutes = express.Router();

import { Register, ForgotMdp, ForgotMdpGet } from '../account/register/'
import { Login, CheckAuth } from '../account/login'


ApiRoutes.use(Auth);

router.post('/register', Register)
router.post('/auth', CheckAuth)
router.post('/login', Login)
router.post('/forgot/new', ForgotMdpGet)
router.post('/forgot', ForgotMdp)


router.use('/api', ApiRoutes);
router.post('/api/search', (req, res) => {
	res.send({message: "successfully connected", "decoded": req.decoded});
});
module.exports = router;
// export default router;
