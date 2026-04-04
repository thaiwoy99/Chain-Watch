const subscriptionService = require('../services/subscriptionService');
const logger = require('../utils/logger')

const createSubscription = async (req, res) => {
  try {
        const { address, network, webhookUrl } = req.body

    const subscription = await subscriptionService.createSubscription({ address, network, webhookUrl });
    logger.success(`New subscription created for address ${address} on ${network}`)

    res.status(201).json({
        message: 'Subscription created successfully',
        data: subscription,
        status: 'success',


    });
  } catch (error){
    logger.error('Error creating subscription', error)
    res.status(500).json({
        message: 'Error creating subscription',
        error: error.message,
        status: 'error',
    });
  }
};

const getAllSubscriptions = async(req,res)=>{
    try{
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json({
            message: 'Subscriptions retrieved successfully',
            data: subscriptions,
            status: 'success',
        });
    } catch (error){
        logger.error('Error retrieving subscriptions', error)
        res.status(500).json({
            message: 'Error retrieving subscriptions',
            error: error.message,
            status: 'error',
        });
    }
}

// GET /subscriptions/:id
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(req.params.id)

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      })
    }

    res.status(200).json({
      success: true,
      data: subscription,
    })

  } catch (error) {
    logger.error('Error fetching subscription', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message,
    })
  }
}

// DELETE /subscriptions/:id
const deleteSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.deleteSubscription(req.params.id)

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      })
    }

    logger.success(`Subscription deleted for address ${subscription.address}`)

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    })

  } catch (error) {
    logger.error('Error deleting subscription', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscription',
      error: error.message,
    })
  }
}

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscription,
}