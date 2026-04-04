const Subscription = require('../models/Subscription')

// Create a new subscription
const createSubscription = async (data) => {
  const subscription = new Subscription(data)
  await subscription.save()
  return subscription
}


// Get all subscriptions
const getAllSubscriptions = async () => {
  const subscriptions = await Subscription.find({ active: true })
  return subscriptions
}

// Get a single subscription by id
const getSubscriptionById = async (id) => {
  const subscription = await Subscription.findById(id)
  return subscription
}

// Delete a subscription
const deleteSubscription = async (id) => {
  const subscription = await Subscription.findByIdAndDelete(id)
  return subscription
}

// Get all active subscriptions for a network
const getActiveSubscriptionsByNetwork = async (network) => {
  const subscriptions = await Subscription.find({ network, active: true })
  return subscriptions
}

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscription,
  getActiveSubscriptionsByNetwork,
}