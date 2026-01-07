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
  paymentMethod: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: [true, "start date is required"],
    validate: {
      validator: function (value) {
        if (value < new Date()) {
          throw new Error('start date must be in the future')
        }
      }
    }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: "Renewal date must be greater than start date"
    }
  },
  status: {
    type: String,
    enum: ["active", "canceled", "expired"],
    default: "active"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
})

subscriptionSchema.pre('save', async function () {
  if(!this.renewalDate) {
    const frequencyMap = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    }

    const frequency = this.frequency;
    this.renewalDate = new Date(this.startDate)

    if (frequency === "monthly") {
      this.renewalDate.setMonth(this.renewalDate.getMonth() + 1 )
    } else {
      this.renewalDate.setDate( this.renewalDate.getDate() + frequencyMap[frequency])
    }
  }

  if (this.renewalDate < new Date()) {
    this.status = "expired"
  }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription