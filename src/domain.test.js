import test from 'node:test'
import assert from 'node:assert/strict'
import { ASSETS, RISK_POLICY, calculateLtv, demoTimestamp, isIntakeLtvEligible, normalizeQuantityInput } from './domain.js'

test('intake allows 55% LTV and blocks anything higher', () => {
  assert.equal(RISK_POLICY.intakeMaxLtv, 55)
  assert.equal(isIntakeLtvEligible(55), true)
  assert.equal(isIntakeLtvEligible(55.01), false)
})

test('reference prices keep the pre-filled ETH request below the intake limit', () => {
  const collateralValue = ASSETS.ETH.price * ASSETS.ETH.quantity
  assert.equal(isIntakeLtvEligible(calculateLtv(50000, collateralValue)), true)
})

test('formats back-office timestamps from the supplied current time', () => {
  assert.equal(demoTimestamp(new Date('2026-10-09T10:45:00.000Z')), '09 Oct 2026 · 04:15 PM IST')
})

test('quantity input can be cleared and removes accidental integer leading zeroes', () => {
  assert.equal(normalizeQuantityInput(''), '')
  assert.equal(normalizeQuantityInput('0654'), '654')
  assert.equal(normalizeQuantityInput('0.65'), '0.65')
  assert.equal(normalizeQuantityInput('000.65'), '0.65')
})
