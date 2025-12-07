import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      const error = new Error('Unauthorized')
      error.statusCode = 401;
      throw error
    }

    const verify = jwt.verify(token, JWT_SECRET)

    if (!verify) {
      const error = new Error('Unauthorized')
      error.statusCode = 401;
      throw error
    }

    const user = jwt.decode(token)

    const existingUser = await User.findById(user.userId)

    if (!existingUser) {
      const error = new Error('Unauthorized')
      error.statusCode = 401;
      throw error
    }

    req.user = user

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      success: false,
      error: "Unauthorized"
    })
  }
}

export default authorize