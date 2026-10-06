import { demoTimestamp } from './domain.js'

export const FIRST_VERIFICATION_STEP = 1
export const LAST_VERIFICATION_STEP = 8

export function getVerificationStatus(data, step) {
  if (step === 1) return data.checks.kyc.status
  if (step === 2) return data.checks.aml.status
  if (step === 3) return data.wallet.ownership
  if (step === 4) return data.checks.collateral.status
  if (step === 5) return data.checks.balance.status
  if (step === 6) return data.checks.valuation.status
  if (step === 7) return data.checks.risk.status
  if (step === 8) return data.checks.program.status
  return null
}

export function setVerificationDecision(next, step, status, decidedAt = demoTimestamp()) {
  if (step === 1) {
    next.checks.kyc.status = status
    next.checks.kyc.document = status === 'PASS' ? 'Verified' : status === 'FAIL' ? 'Not verified' : 'Pending'
    next.checks.kyc.liveness = status === 'PASS' ? 'Verified' : status === 'FAIL' ? 'Not verified' : 'Pending'
  }
  if (step === 2) {
    next.checks.aml.status = status
    next.checks.aml.sanctions = status === 'PASS' ? 'Clear' : status === 'FAIL' ? 'Match found' : 'Pending'
    next.checks.aml.jurisdiction = status === 'PASS' ? 'Eligible' : status === 'FAIL' ? 'Not eligible' : 'Pending'
    next.checks.aml.walletScreening = status === 'PASS' ? 'Clear' : status === 'FAIL' ? 'Review failed' : 'Pending'
  }
  if (step === 3) next.wallet.ownership = status
  if (step === 4) {
    next.checks.collateral.status = status
    next.collateral.eligible = status === 'PASS' ? true : status === 'FAIL' ? false : null
  }
  if (step === 5) {
    next.checks.balance.status = status
    next.checks.balance.checkedAt = ['PASS', 'FAIL'].includes(status) ? decidedAt : null
  }
  if (step === 6) {
    next.checks.valuation.status = status
    next.checks.valuation.acceptedAt = status === 'PASS' ? decidedAt : null
  }
  if (step === 7) next.checks.risk.status = status
  if (step === 8) next.checks.program.status = status
}

export function synchronizeVerificationWorkflow(next) {
  let step = next.application.workflowIndex
  if (step < FIRST_VERIFICATION_STEP || step > LAST_VERIFICATION_STEP) return false

  const startingStep = step
  while (step <= LAST_VERIFICATION_STEP && getVerificationStatus(next, step) === 'PASS') step += 1
  if (step === startingStep) return false

  next.application.workflowIndex = step
  next.application.lfStatus = step > LAST_VERIFICATION_STEP ? 'Ready for Offer' : 'Verification'
  return true
}

export function applyVerificationReview(next, {
  step,
  status,
  comment,
  reviewer = 'Nina Morgan',
  reviewedAt = demoTimestamp(),
}) {
  setVerificationDecision(next, step, status, reviewedAt)
  next.reviews[step] = { ...next.reviews[step], reviewer, reviewedAt, comment }

  const document = next.documents.find((item) => item.verificationStep === step)
  if (document) document.status = status

  if (status === 'PASS') synchronizeVerificationWorkflow(next)
}
