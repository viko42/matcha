const express = require('express');
const router = express();
import User from '../../bdd/db.user'
import RCode from '../../bdd/db.resetCode'
import mongoose from 'mongoose'
import validator from 'validator'

require('babel-register');
import { Register, ForgotMdp, ForgotMdpGet } from '../account/register/'
// import bodyParser from 'body-parser'

// User.remove(function(err) {
// 	if (err) throw err;
// 	console.log('User successfully deleted!');
// });
// router.use(require('../account/register/'))

router.post('/register', Register)
router.post('/forgot/new', ForgotMdpGet)
router.post('/forgot', ForgotMdp)

module.exports = router;
// export default router;
