import test from 'node:test'
import assert from 'node:assert/strict'
import { createInitialState } from './domain.js'
import {
  applyVerificationReview,
  hasBorrowerKycEvidence,
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
  assert.equal(data.documents[0].status, 'REVIEW')
  assert.equal(data.documents[0].uploadedAt, REVIEWED_AT)
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
