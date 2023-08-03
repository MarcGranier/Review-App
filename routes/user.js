import express from 'express'
import{ create } from '../controllers/user.js'
import { userValidator, validate } from '../middlewares/validator.js'


const router = express.Router()

router.post('/create',userValidator, validate, create)






export default router