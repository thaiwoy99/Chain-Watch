const express = require('express')
const router = express.Router()
const subscriptionController = require('../controllers/subscriptionController')
const auth = require('../middleware/auth')
const { validateSubscription } = require('../middleware/validate')

// POST /subscriptions — auth + validate then create
router.post('/', auth, validateSubscription, subscriptionController.createSubscription)

// GET /subscriptions — auth then get all
router.get('/', auth, subscriptionController.getAllSubscriptions)

// GET /subscriptions/:id — auth then get one
router.get('/:id', auth, subscriptionController.getSubscriptionById)

// DELETE /subscriptions/:id — auth then delete
router.delete('/:id', auth, subscriptionController.deleteSubscription)

module.exports = router