const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  network: {
    type: String,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  from: {
    type: String,
    required: true,
    lowercase: true,
  },
  to: {
    type: String,
    required: true,
    lowercase: true,
  },
  value: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  tokenLogo: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Event', eventSchema)