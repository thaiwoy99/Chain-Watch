const Event = require('../models/Event')

// Save a new event
const createEvent = async (data) => {
  const event = new Event(data)
  await event.save()
  return event
}

// Check if event already exists by txHash
const eventExists = async (txHash) => {
  const event = await Event.findOne({ txHash })
  return !!event  // returns true or false
}

// Get all events for an address with pagination
const getEventsByAddress = async (address, page = 1, limit = 10) => {
  const skip = (page - 1) * limit

  const events = await Event.find({
    $or: [
      { from: address.toLowerCase() },
      { to: address.toLowerCase() }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Event.countDocuments({
    $or: [
      { from: address.toLowerCase() },
      { to: address.toLowerCase() }
    ]
  })

  return {
    events,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

module.exports = {
  createEvent,
  eventExists,
  getEventsByAddress,
}