import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"]
  },
  price: {
    type: Number,
    min: [0, "price must be greater than 0"],
    required: [true, "price is required"]
  },
  currency: {
    type: String,
    enum: ['USD', "BHD",'EGP'],
    default: 'USD'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: [true, "frequency is required"]
  },
  startDate: {
    type: Date,
    required: [true, "start date is required"],
    validate: {
      validator: (value) => {
        if (value >= new Date.now()) {
          throw new Error('start date must be in the past')
        }
      }
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: (value) => {
        if (value < new Date.now()) {
          throw new Error('end date must be in the future')
        }
      }
    }
  },
  status: {
    type: String,
    enum: ["active", "canceled", "expired"],
    default: "active"
  },
  
})