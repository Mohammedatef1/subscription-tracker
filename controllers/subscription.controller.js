import Subscription from "../models/subscription.model.js"

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user.userId
    })

    res.status(201).json({
      success: true,
      message: "subscription created successfully",
      data: subscription
    })

  } catch (error) {
    next(error)
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user.userId.toString() !== userId) {
      const error = new Error('Unauthorized')
      error.statusCode = 403
      throw error
    }

    const subscriptions = await Subscription.find({user : userId})
    
    res.status(200).json({
      success: true,
      message: "get all subscriptions successfully",
      data: subscriptions
    })
    
  } catch (error) {
    next(error)
  }
}