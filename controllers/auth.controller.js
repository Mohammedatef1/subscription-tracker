import { mongoose } from "mongoose"
import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import {JWT_SECRET, JWT_EXPIRES_IN} from "../config/env.js"
import bcrypt from "bcryptjs"

export const SignUp = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const {name, email, password} = req.body

    const existingUser = await User.findOne({email});

    if (existingUser) {
      const error = new Error('user already exists')
      error.statusCode = 409
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUsers = await User.create([{name, email, password: hashedPassword}], {session})

    const token = jwt.sign({userId : newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

    await session.commitTransaction()
    session.endSession()

    res.status(209).json({
      success: true,
      message: 'user created successfully',
      data: {
        token,
        user: newUsers[0]
      }
    })

  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}

export const SignIn = (req, res, next) => {

}

export const SignOut = (req, res, next) => {

}