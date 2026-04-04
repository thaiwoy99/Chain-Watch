const mongoose = require('mongoose')

const webhookLogSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  webhookUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true,
  },
  statusCode: {
    type: Number,
    default: null,
  },
  attempt: {
    type: Number,
    default: 1,
  },
  error: {
    type: String,
    default: null,
  },
  deliveredAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('WebhookLog', webhookLogSchema)