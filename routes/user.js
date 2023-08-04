import express from 'express'
import {
	create,
	verifyEmail,
	resendEmailVerificationToken,
} from '../controllers/user.js'
import { userValidator, validate } from '../middlewares/validator.js'

const router = express.Router()

router.post('/create', userValidator, validate, create)
router.post('/verify-email', verifyEmail)
router.post('/resend-email-verification-token', resendEmailVerificationToken)

export default router
