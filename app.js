import express from 'express'
import userRouter from './routes/user.js'
import colors from 'colors'


import connectDb from './db/index.js'


const app=express()
app.use(express.json())
app.use('/api/user',userRouter)

app.post("/sign-in",
  (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password)
      return res.json({ error: 'email/ password missing!' })
    next()
  },
  (req, res) => {
    res.send("<h1>Hello I am from your backend about in app.js</h1>");
  });

app.listen(8000, () =>{
  console.log('Server running on port 8000'.bold.blue);
})
