import { Router } from 'express'

const subscriptionRouter = Router()

subscriptionRouter.get('/', (req, res) => res.send({title: "GET all the subscriptions"}))

subscriptionRouter.get('/:id', (req, res) => res.send({title: "GET subscription"}))

subscriptionRouter.post('/', (req, res) => res.send({title: "CREATE subscription"}))

subscriptionRouter.put('/:id', (req, res) => res.send({title: "CANCEL subscription"}))

subscriptionRouter.delete('/:id', (req, res) => res.send({title: "DELETE subscription"}))

subscriptionRouter.get('/user/:id', (req, res) => res.send({title: "GET all the user subscriptions"}))

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: "CANCEL subscription"}))

subscriptionRouter.get('/upcoming-renewal', (req, res) => res.send({title: "GET upcoming renewal dates"}))

export default subscriptionRouter