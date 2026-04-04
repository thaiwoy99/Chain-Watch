const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')
const auth = require('../middleware/auth')

// GET /events/:address — auth then get events
router.get('/:address', auth, eventController.getEventsByAddress)

module.exports = router