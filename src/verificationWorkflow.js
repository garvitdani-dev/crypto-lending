import { demoTimestamp } from './domain.js'

export const FIRST_VERIFICATION_STEP = 1
export const LAST_VERIFICATION_STEP = 8

export function hasBorrowerKycEvidence(data) {
  return ['Uploaded', 'Verified'].includes(data.checks.kyc.document)
    && ['Completed', 'Verified'].includes(data.checks.kyc.liveness)
}

function hasRecordedDocument(document) {
  if (!document?.uploadedAt) return false
  return !/^(Awaiting|Generated after|Generated during)/i.test(document.uploadedAt)
}

export function hasVerificationEvidence(data, step) {
  const status = getVerificationStatus(data, step)
  if (['PASS', 'FAIL', 'REVIEW'].includes(status)) return true
  if (step === 1) return hasBorrowerKycEvidence(data)
  if (step === 3) return data.wallet.status === 'CONNECTED'
  const document = data.documents?.find((item) => item.verificationStep === step)
  return hasRecordedDocument(document)
}

export function getMissingEvidenceMessage(data, step) {
  if (step === 1) return 'The borrower has not uploaded the identity document and completed the liveness check yet.'
  if (step === 3) return 'The borrower has not connected a wallet for ownership verification yet.'
  const document = data.documents?.find((item) => item.verificationStep === step)
  return document?.uploadedBy === 'System'
    ? 'The verification evidence has not been generated yet. Complete the preceding verification stage first.'
    : 'The borrower has not submitted the required verification evidence yet.'
}

export function getVerificationPresentation(data, step) {
  const status = getVerificationStatus(data, step)
  const evidenceAvailable = hasVerificationEvidence(data, step)
  if (!evidenceAvailable) {
    return {
      evidenceAvailable: false,
      status: '',
      statusLabel: '',
      description: getMissingEvidenceMessage(data, step),
    }
  }

  return {
    evidenceAvailable: true,
    status: status || 'PENDING',
    statusLabel: status === 'PASS' ? 'Passed' : status === 'FAIL' ? 'Failed' : status === 'REVIEW' ? 'Review required' : 'Pending verification',
    description: ['PASS', 'FAIL'].includes(status) ? 'Decision recorded' : status === 'REVIEW' ? 'Additional review required' : 'Evidence submitted; awaiting verification',
  }
}

export function simulateBorrowerKycEvidence(next, submittedAt = demoTimestamp()) {
  next.checks.kyc.status = 'PENDING'
  next.checks.kyc.document = 'Uploaded'
  next.checks.kyc.liveness = 'Completed'
  next.checks.kyc.evidenceSubmittedAt = submittedAt

  const document = next.documents.find((item) => item.verificationStep === 1)
  if (document) {
    document.uploadedAt = submittedAt
    document.uploadedBy = next.borrower.name
    document.status = 'PENDING'
  }
}

export function simulateBorrowerWalletConnection(next, submittedAt = demoTimestamp()) {
  next.wallet.status = 'CONNECTED'
  next.wallet.ownership = 'PENDING'
  next.wallet.connectedAt = submittedAt
  next.transaction.from = next.wallet.address

  const document = next.documents.find((item) => item.verificationStep === 3)
  if (document) {
    document.uploadedAt = submittedAt
    document.uploadedBy = next.borrower.name
    document.status = 'PENDING'
  }
}

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
    if (status === 'PASS') {
      next.checks.kyc.document = 'Verified'
      next.checks.kyc.liveness = 'Verified'
    }
    if (status === 'FAIL') {
      next.checks.kyc.document = 'Not verified'
      next.checks.kyc.liveness = 'Not verified'
    }
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

export function prepareCurrentVerificationEvidence(next, generatedAt = demoTimestamp()) {
  const step = next.application.workflowIndex
  if (step < 4 || step > LAST_VERIFICATION_STEP) return false
  const document = next.documents.find((item) => item.verificationStep === step)
  if (!document || hasRecordedDocument(document)) return false

  setVerificationDecision(next, step, 'PENDING', generatedAt)
  document.uploadedAt = generatedAt
  document.uploadedBy = 'System'
  document.status = 'PENDING'
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

  if (status === 'PASS') {
    synchronizeVerificationWorkflow(next)
    prepareCurrentVerificationEvidence(next, reviewedAt)
  }
}
