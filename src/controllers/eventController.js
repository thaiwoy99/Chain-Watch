const eventService = require('../services/eventService')
const logger = require('../utils/logger')

// GET /events/:address
const getEventsByAddress = async (req, res) => {
  try {
    const { address } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await eventService.getEventsByAddress(address, page, limit)

    res.status(200).json({
      success: true,
      data: result.events,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit,
      },
    })

  } catch (error) {
    logger.error('Error fetching events', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message,
    })
  }
}

module.exports = {
  getEventsByAddress,
}