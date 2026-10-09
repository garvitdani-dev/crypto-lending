import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createInitialState } from './domain.js'
import {
  ACTIVE_APPLICATION_STORAGE_KEY,
  APPLICATIONS_STORAGE_KEY,
  LEGACY_APPLICATION_STORAGE_KEY,
  applicationService,
} from './services/applicationService.js'

const values = new Map()
globalThis.localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null },
  setItem(key, value) { values.set(key, String(value)) },
  removeItem(key) { values.delete(key) },
  clear() { values.clear() },
}

beforeEach(() => values.clear())

test('migrates the previous single application into the application registry', () => {
  const legacy = createInitialState()
  legacy.application.workflowIndex = 10
  legacy.application.lfStatus = 'Offer Presented'
  localStorage.setItem(LEGACY_APPLICATION_STORAGE_KEY, JSON.stringify(legacy))

  const loaded = applicationService.load()

  assert.equal(loaded.application.id, legacy.application.id)
  assert.equal(loaded.application.workflowIndex, 10)
  assert.equal(applicationService.list().length, 1)
  assert.equal(localStorage.getItem(ACTIVE_APPLICATION_STORAGE_KEY), legacy.application.id)
  assert.ok(localStorage.getItem(APPLICATIONS_STORAGE_KEY))
})

test('creates unique applications and makes the newest record active', () => {
  const original = applicationService.load()
  const second = applicationService.create()
  const third = applicationService.create()

  assert.notEqual(second.application.id, original.application.id)
  assert.notEqual(third.application.id, second.application.id)
  assert.deepEqual(applicationService.list().map((application) => application.application.id), [
    third.application.id,
    second.application.id,
    original.application.id,
  ])
  assert.equal(applicationService.load().application.id, third.application.id)
  assert.equal(third.application.lfStatus, 'Lead')
})

test('selecting an existing application restores its independently saved progress', () => {
  const original = applicationService.load()
  const created = applicationService.create()
  created.application.workflowIndex = 10
  created.application.lfStatus = 'Offer Presented'
  created.application.submittedAt = '09 Oct 2026 · 03:00 PM IST'
  applicationService.save(created)

  assert.equal(applicationService.select(original.application.id).application.workflowIndex, 0)
  assert.equal(applicationService.select(created.application.id).application.workflowIndex, 10)
  assert.equal(applicationService.load().application.id, created.application.id)
})
