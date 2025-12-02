import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'email address is required'],
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "please provide a valid email address",
    ],
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, "password is required"],
    min: [6, "password must be 6 charts at least"],
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User