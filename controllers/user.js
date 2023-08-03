import User from '../models/user.js'

const create = async (req,res) => {
  const { name, email, password } = req.body
  
  const oldUser = await User.findOne({ email })
  
  if(oldUser) return res.status(401).json({ message: 'User already exists' })



  const newUser = new User({ name, email, password })
  await newUser.save()

  res.status(201).json({ user: newUser})


}

  

export { create }






