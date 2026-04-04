const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  network: {
    type: String,
    required: true,
    enum: ['sepolia', 'amoy', 'baseSepolia', 'bscTestnet'],
  },
  webhookUrl: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Subscription', subscriptionSchema)