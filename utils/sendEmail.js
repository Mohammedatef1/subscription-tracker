import dayjs from "dayjs"
import { emailTemplates } from "./emailTemplates.js"
import transporter, { SENDER_EMAIL } from "../config/nodemailer.js"

const sendEmail = async ( to, label, subscription ) => {
  if (!to || !subscription) throw new Error('email to or subscription is missing')

  const emailTemplate = emailTemplates.find(t => t.label === label)

  const body = emailTemplate.generateBody({
    userName : subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D YYYY"),
    planName: subscription.name,
    price: subscription.price,
    currency: subscription.currency,
    paymentMethod: subscription.paymentMethod,
    accountSettingsLink: "",
    supportLink: "",
  })

  const subject = emailTemplate.generateSubject({
    subscriptionName: subscription.name
  })

  transporter.sendMail({
    from: SENDER_EMAIL,
    to,
    subject,
    html: body
  }, (error, info) => {
    if (error) {
      console.log("Error sending this mail", error)
      return
    } else {
      console.log("successfully sended the email with info ", info)
    }
  })
}

export default sendEmail