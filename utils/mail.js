//generate 6 digit otp
export const generateOTP = (otp_length = 6) => {
	let OTP = ''
	for (let i = 1; i < otp_length; i++) {
		const randomVal = Math.round(Math.random() * 9)
		OTP += randomVal
	}
	return OTP
}

export const generateMailTransporter = () =>
	nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: 'UserName',
			pass: 'Password',
		},
	})
