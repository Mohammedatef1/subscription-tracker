import { serve } from "@upstash/workflow/express";

import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import sendEmail from "../utils/sendEmail.js";

const REMINDERS = [7, 6, 5, 2, 1]

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== 'active') return

  const renewalDate = dayjs(subscription.renewalDate)

  if (renewalDate.isBefore(dayjs()) ) {
    console.log(`renewal data has passed for this subscription ${subscriptionId}`)
    return
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `${daysBefore} days before reminder`, reminderDate)
    } else {
      console.log("reminder date is passed")
      continue
    }
    
    await triggerReminder(context, `${daysBefore} days before reminder`, subscription)
  }
})

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email')
  })
}

const sleepUntilReminder = async (context, label, reminderDate) => {
  console.log(`setting a reminder it will triggered in ${reminderDate}`)
  return await context.sleepUntil(label, reminderDate.toDate())
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`triggering the reminder`)
    await sendEmail(
      subscription.user.email,
      label,
      subscription
    )
  })
}