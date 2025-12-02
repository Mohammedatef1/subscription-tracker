import {Router} from 'express'

const authRouter = Router()

authRouter.post('/sign-up', (req, res) => res.send({title: 'CREATE user'}))

authRouter.post('/sign-in', (req, res) => res.send({title: 'LOGIN user'}))

authRouter.post('/sign-out', (req, res) => res.send({title: 'LOGOUT user'}))

export default authRouter
