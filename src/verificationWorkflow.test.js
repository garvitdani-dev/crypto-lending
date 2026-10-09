import test from 'node:test'
import assert from 'node:assert/strict'
import { createInitialState } from './domain.js'
import {
  applyVerificationReview,
  getVerificationPresentation,
  hasBorrowerKycEvidence,
  hasVerificationEvidence,
  simulateBorrowerWalletConnection,
  simulateBorrowerKycEvidence,
  synchronizeVerificationWorkflow,
} from './verificationWorkflow.js'

const REVIEWED_AT = '06 Oct 2026 · 10:46 AM IST'

function verificationState(step = 1) {
  const data = createInitialState()
  data.application.workflowIndex = step
  data.application.lfStatus = 'Verification'
  return data
}

test('approving the current verification records PASS and advances to the next action', () => {
  const data = verificationState()

  applyVerificationReview(data, {
    step: 1,
    status: 'PASS',
    comment: 'Identity evidence approved.',
    reviewedAt: REVIEWED_AT,
  })

  assert.equal(data.checks.kyc.status, 'PASS')
  assert.equal(data.documents[0].status, 'PASS')
  assert.deepEqual(data.reviews[1], {
    ...data.reviews[1],
    reviewer: 'Nina Morgan',
    reviewedAt: REVIEWED_AT,
    comment: 'Identity evidence approved.',
  })
  assert.equal(data.application.workflowIndex, 2)
  assert.equal(data.checks.aml.status, 'PENDING')
})

test('a non-current review cannot skip an earlier pending verification', () => {
  const data = verificationState()

  applyVerificationReview(data, {
    step: 2,
    status: 'PASS',
    comment: 'Compliance evidence approved.',
    reviewedAt: REVIEWED_AT,
  })

  assert.equal(data.checks.aml.status, 'PASS')
  assert.equal(data.application.workflowIndex, 1)
})

test('loading a previously passed current verification repairs the workflow position', () => {
  const data = verificationState()
  data.checks.kyc.status = 'PASS'

  assert.equal(synchronizeVerificationWorkflow(data), true)
  assert.equal(data.application.workflowIndex, 2)
})

test('approving the final verification moves the application to Ready for Offer', () => {
  const data = verificationState(8)

  applyVerificationReview(data, {
    step: 8,
    status: 'PASS',
    comment: 'Program approved.',
    reviewedAt: REVIEWED_AT,
  })

  assert.equal(data.application.workflowIndex, 9)
  assert.equal(data.application.lfStatus, 'Ready for Offer')
})

test('borrower simulation uploads identity evidence without approving KYC', () => {
  const data = verificationState()

  simulateBorrowerKycEvidence(data, REVIEWED_AT)

  assert.equal(hasBorrowerKycEvidence(data), true)
  assert.equal(data.checks.kyc.status, 'PENDING')
  assert.equal(data.checks.kyc.document, 'Uploaded')
  assert.equal(data.checks.kyc.liveness, 'Completed')
  assert.equal(data.documents[0].status, 'PENDING')
  assert.equal(data.documents[0].uploadedAt, REVIEWED_AT)
})

test('missing borrower evidence stays blank and cannot be reviewed', () => {
  const data = verificationState()

  assert.deepEqual(getVerificationPresentation(data, 1), {
    evidenceAvailable: false,
    status: '',
    statusLabel: '',
    description: 'The borrower has not uploaded the identity document and completed the liveness check yet.',
  })
  assert.equal(hasVerificationEvidence(data, 3), false)
  assert.equal(getVerificationPresentation(data, 3).statusLabel, '')
})

test('connecting a wallet submits pending evidence without passing verification', () => {
  const data = verificationState(3)

  simulateBorrowerWalletConnection(data, REVIEWED_AT)

  assert.equal(data.wallet.status, 'CONNECTED')
  assert.equal(data.wallet.ownership, 'PENDING')
  assert.equal(data.wallet.connectedAt, REVIEWED_AT)
  assert.equal(data.documents[2].status, 'PENDING')
  assert.equal(data.documents[2].uploadedAt, REVIEWED_AT)
  assert.equal(getVerificationPresentation(data, 3).statusLabel, 'Pending verification')
})

test('approving submitted wallet evidence records passed and prepares the next check', () => {
  const data = verificationState(3)
  simulateBorrowerWalletConnection(data, REVIEWED_AT)

  applyVerificationReview(data, {
    step: 3,
    status: 'PASS',
    comment: 'Wallet ownership confirmed.',
    reviewedAt: REVIEWED_AT,
  })

  assert.equal(getVerificationPresentation(data, 3).statusLabel, 'Passed')
  assert.equal(data.application.workflowIndex, 4)
  assert.equal(data.checks.collateral.status, 'PENDING')
  assert.equal(data.documents[3].status, 'PENDING')
  assert.equal(data.documents[3].uploadedAt, REVIEWED_AT)
})

test('requesting additional KYC review preserves borrower evidence', () => {
  const data = verificationState()
  simulateBorrowerKycEvidence(data, REVIEWED_AT)

  applyVerificationReview(data, {
    step: 1,
    status: 'REVIEW',
    comment: 'Please review the uploaded image.',
    reviewedAt: REVIEWED_AT,
  })

  assert.equal(hasBorrowerKycEvidence(data), true)
  assert.equal(data.checks.kyc.status, 'REVIEW')
})
