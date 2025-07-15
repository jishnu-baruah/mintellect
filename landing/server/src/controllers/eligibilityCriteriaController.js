import { getDefaultCriteria } from "../services/eligibilityScorer.js"

/**
 * Get the current eligibility criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEligibilityCriteria = async (req, res) => {
  const criteria = getDefaultCriteria()

  return res.status(200).json({
    success: true,
    data: criteria,
  })
}

