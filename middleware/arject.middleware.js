import aj from "../config/arcjet.js"

const arjectMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 2 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) return res.status(429).json({success: false, error: "Rate limit exceeded"})
      if (decision.reason.isBot()) return res.status(403).json({success: false, error: "Bot detected"})
      
      return res.status(403).json({success: false, error: "access denied"})
    }

    next()
  } catch (error) {
    console.log(`arject error`, error)
    next(error)
  }
}

export default arjectMiddleware