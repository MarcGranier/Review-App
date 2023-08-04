import User from '../models/user.js'
import EmailVerificationToken from '../models/emailVerificationToken.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { isValidObjectId } from 'mongoose'
dotenv.config()

const create = async (req, res) => {
	const { name, email, password } = req.body

	const oldUser = await User.findOne({ email })

	if (oldUser) return sendError(res, 'This email is already in use')

	const newUser = new User({ name, email, password })
	await newUser.save()

	//generate 6 digit otp
	let OTP = generateOTP()

	//store otp inside db
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: newUser._id,
		token: OTP,
	})

	await newEmailVerificationToken.save()

	//send otp to user email

	var transport = generateMailTransporter()

	transport.sendMail({
		from: 'verification@reviewapp.com',
		to: newUser.email,
		subject: 'Email Verification',
		html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>`,
	})

	res.status(201).json({
		message:
			'Please verify you email. OTP has been sent to your email account!',
	})
}

export const verifyEmail = async (req, res) => {
	const { userId, OTP } = req.body

	if (!isValidObjectId(userId)) return res.json({ error: 'Invalid user!' })

	const user = await User.findById(userId)
	if (!user) return sendError(res, 'user not found!', 404)

	if (user.isVerified) return sendError(res, 'user is already verified!')

	const token = await EmailVerificationToken.findOne({ owner: userId })
	if (!token) return sendError(res, 'token not found!')

	const isMatched = await token.compareToken(OTP)
	if (!isMatched) return sendError(res, 'Please submit a valid OTP!')

	user.isVerified = true
	await user.save()

	await EmailVerificationToken.findByIdAndDelete(token._id)

	var transport = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: 'UserName',
			pass: 'Password',
		},
	})

	transport.sendMail({
		from: 'verification@reviewapp.com',
		to: user.email,
		subject: 'Welcome Email',
		html: '<h1>Welcome to our app and thanks for choosing us.</h1>',
	})

	res.json({ message: 'Your email is verified.' })
}

export const resendEmailVerificationToken = async (req, res) => {
	const { userId } = req.body

	const user = await User.findById(userId)
	if (!user) return sendError(res, 'user not found!')

	if (user.isVerified)
		return sendError(res, 'This email id is already verified!')

	const alreadyHasToken = await EmailVerificationToken.findOne({
		owner: userId,
	})
	if (alreadyHasToken)
		return endError(
			res,
			'Only after one hour you can request for another token!'
		)

	// generate 6 digit otp
	let OTP = generateOTP()

	// store otp inside our db
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: user._id,
		token: OTP,
	})

	await newEmailVerificationToken.save()

	// send that otp to our user

	var transport = generateMailTransporter()

	transport.sendMail({
		from: 'verification@reviewapp.com',
		to: user.email,
		subject: 'Email Verification',
		html: `
      <p>You verification OTP</p>
      <h1>${OTP}</h1>
    `,
	})

	res.json({
		message: 'New OTP has been sent to your registered email account.',
	})
}

export { create }
