import test from 'node:test'
import assert from 'node:assert/strict'
import { ASSETS, RISK_POLICY, calculateLtv, isIntakeLtvEligible } from './domain.js'

test('intake allows 55% LTV and blocks anything higher', () => {
  assert.equal(RISK_POLICY.intakeMaxLtv, 55)
  assert.equal(isIntakeLtvEligible(55), true)
  assert.equal(isIntakeLtvEligible(55.01), false)
})

test('reference prices keep the pre-filled ETH request below the intake limit', () => {
  const collateralValue = ASSETS.ETH.price * ASSETS.ETH.quantity
  assert.equal(isIntakeLtvEligible(calculateLtv(50000, collateralValue)), true)
})
