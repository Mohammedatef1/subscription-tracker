import nodemailer from "nodemailer"
import { NODEMAILER_PASSWORD } from "./env.js"

export const SENDER_EMAIL = "medoatef420@gmail.com"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: NODEMAILER_PASSWORD
  }
})

export default transporter