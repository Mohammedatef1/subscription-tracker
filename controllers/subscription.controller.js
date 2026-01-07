import { BASE_URL } from "../config/env.js"
import { workflow } from "../config/upstash.js"
import Subscription from "../models/subscription.model.js"
import User from "../models/user.model.js"

export const getAllSubscription = async (req, res, next) => {
  try {
    const {sort, fields, limit, page, ...queryObject } = req.query

    const query = Subscription.find(queryObject);

    if (sort) {
      const sortedBy = sort.split(',').join(" ")
      query.sort(sortedBy)
    } else {
      query.sort('-createdAt')
    }

    if (fields) {
      const fieldsSrt = fields.split(',').join(' ')
      query.select(fieldsSrt)
    } else {
      query.select('-__v')
    }

    const subscriptions = await query

    res.status(200).json({
      success: true,
      message: "get all subscriptions successfully",
      data: subscriptions
    })

  } catch (error) {
    next(error)
  }
}

export const createSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    const subscription = await Subscription.create({
      ...req.body,
      user: user
    })

    const { workflowRunId } = await workflow.trigger({
      url: `${BASE_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id
      },
      headers: {
        "Content-Type": "application/json"
      },
      retries: 0
    })

    res.status(201).json({
      success: true,
      message: "subscription created successfully",
      data: subscription,
      workflowRunId
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

    const {sort, fields, limit, page, ...queryObject} = req.query;
    
    const query = Subscription.find({user : userId, ...queryObject})

    if (sort) {
      const sortedBy = sort.split(',').join(" ")
      query.sort(sortedBy)
    } else {
      query.sort('-createdAt')
    }

    if (fields) {
      const fieldsSrt = fields.split(',').join(' ')
      query.select(fieldsSrt)
    } else {
      query.select('-__v')
    }

    const subscriptions = await query
    
    res.status(200).json({
      success: true,
      message: "get all subscriptions successfully",
      data: subscriptions
    })
    
  } catch (error) {
    next(error)
  }
}