import express from 'express'
import { NODE_ENV, PORT } from './config/env.js'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import subscriptionRouter from './routes/subscription.route.js'
import { connectToDatabase } from './database/mongodb.js'
import errorMiddleware from './middleware/error.middleware.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

app.get('/', (req, res) => {
  res.send('Welcome to subscription-tracker')
})

app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`start listening on port ${PORT}`)
  try {
    await connectToDatabase()

    console.log(`database is running in ${NODE_ENV} environment`)
  } catch (error) {
    console.log(error)
  }
})

export default app