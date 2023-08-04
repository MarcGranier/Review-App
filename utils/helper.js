export const SendError = (res, error, statusCode = 401) => {
	res.status(StatusCode).json({ error })
}
