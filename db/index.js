import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = mongoose.connect('mongodb://127.0.0.1:27017/review_app')
.then(() => {
  console.log('Connected to MongoDB'.bold.green);
})
.catch((ex) => {
  console.log('Connection Failed to MongoDB'.red,ex);
})

export default connectDB