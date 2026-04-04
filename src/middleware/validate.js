const Joi = require('joi')

const validateSubscription = (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string().required().messages({
      'string.empty': 'Address is required',
      'any.required': 'Address is required',
    }),
    network: Joi.string()
      .valid('sepolia', 'amoy', 'baseSepolia', 'bscTestnet')
      .required()
      .messages({
        'any.only': 'Network must be one of: sepolia, amoy, baseSepolia, bscTestnet',
        'any.required': 'Network is required',
      }),
    webhookUrl: Joi.string().uri().required().messages({
      'string.uri': 'webhookUrl must be a valid URL',
      'any.required': 'webhookUrl is required',
    }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    })
  }

  next()
}

module.exports = { validateSubscription }