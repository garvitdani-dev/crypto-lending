import { createInitialState, demoDate, demoTimestamp, offsetDate } from '../domain.js'
import { prepareCurrentVerificationEvidence, synchronizeVerificationWorkflow } from '../verificationWorkflow.js'

export const LEGACY_APPLICATION_STORAGE_KEY = 'lf-crypto-studio-v8'
export const APPLICATIONS_STORAGE_KEY = 'lf-crypto-studio-applications-v1'
export const ACTIVE_APPLICATION_STORAGE_KEY = 'lf-crypto-studio-active-application-v1'

const isApplication = (value) => !!value?.application?.id && !!value?.documents && !!value?.reviews
const clone = (value) => JSON.parse(JSON.stringify(value))

function normalizeApplication(application) {
  if (!isApplication(application)) return null
  const currentTimestamp = demoTimestamp()
  const legacyAmlDocument = application.documents.find((document) => document.id === 'DOC-AML-001')
  if (legacyAmlDocument?.uploadedAt === '05 Oct 2026 · 09:42 AM IST') legacyAmlDocument.uploadedAt = currentTimestamp
  if (application.collateral.priceUpdatedAt === 'Reference snapshot · 07 Oct 2026') application.collateral.priceUpdatedAt = currentTimestamp
  application.collateral.priceSource ||= 'Saved fallback rate'
  application.collateral.priceStatus ||= 'FALLBACK'
  if (application.loan?.nextPayment === '05 Nov 2026') application.loan.nextPayment = demoDate(offsetDate(30))
  if (application.offer?.expiresAt === '12 Oct 2026 · 11:59 PM IST') application.offer.expiresAt = demoTimestamp(offsetDate(3))
  synchronizeVerificationWorkflow(application)
  prepareCurrentVerificationEvidence(application)
  if (application.offer?.options?.length && application.application.workflowIndex === 9 && !application.offer.selectedId) {
    application.application.workflowIndex = 10
    application.application.lfStatus = 'Offer Presented'
  }
  return application
}

function writeRegistry(applications) {
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify({ version: 1, applications }))
}

function readRegistry() {
  try {
    const stored = JSON.parse(localStorage.getItem(APPLICATIONS_STORAGE_KEY))
    if (Array.isArray(stored?.applications) && stored.applications.length) {
      const applications = stored.applications.map(normalizeApplication).filter(Boolean)
      if (applications.length) return applications
    }
  } catch {
    // Fall through to legacy migration.
  }

  let initial = null
  try {
    initial = normalizeApplication(JSON.parse(localStorage.getItem(LEGACY_APPLICATION_STORAGE_KEY)))
  } catch {
    // Fall through to a clean initial record.
  }
  initial ||= createInitialState()
  writeRegistry([initial])
  localStorage.setItem(ACTIVE_APPLICATION_STORAGE_KEY, initial.application.id)
  return [initial]
}

function nextApplicationIdentity(applications) {
  const year = new Date().getFullYear()
  const highestApplication = applications.reduce((highest, item) => {
    const match = item.application.id.match(/(\d+)$/)
    return Math.max(highest, Number(match?.[1]) || 0)
  }, 1283)
  const highestCustomer = applications.reduce((highest, item) => {
    const match = item.application.customerId?.match(/(\d+)$/)
    return Math.max(highest, Number(match?.[1]) || 0)
  }, 884290)
  return {
    applicationId: `CRL-${year}-${String(highestApplication + 1).padStart(6, '0')}`,
    customerId: `CUS-${String(highestCustomer + 1).padStart(6, '0')}`,
  }
}

function applicationSequence(application) {
  const match = application.application.id.match(/^CRL-(\d{4})-(\d+)$/)
  if (!match) return 0
  return Number(match[1]) * 1_000_000_000 + Number(match[2])
}

function newestApplicationsFirst(applications) {
  return [...applications].sort((left, right) => applicationSequence(right) - applicationSequence(left))
}

export const applicationService = {
  load() {
    const applications = readRegistry()
    const activeId = localStorage.getItem(ACTIVE_APPLICATION_STORAGE_KEY)
    const active = applications.find((item) => item.application.id === activeId) || applications.at(-1)
    localStorage.setItem(ACTIVE_APPLICATION_STORAGE_KEY, active.application.id)
    return clone(active)
  },

  list() {
    return clone(newestApplicationsFirst(readRegistry()))
  },

  save(application) {
    if (!isApplication(application)) return
    const saved = clone(application)
    saved.application.updatedAt = demoTimestamp()
    const applications = readRegistry()
    const index = applications.findIndex((item) => item.application.id === saved.application.id)
    if (index >= 0) applications[index] = saved
    else applications.push(saved)
    writeRegistry(applications)
    localStorage.setItem(ACTIVE_APPLICATION_STORAGE_KEY, saved.application.id)
  },

  create() {
    const applications = readRegistry()
    const identity = nextApplicationIdentity(applications)
    const application = createInitialState({ ...identity, lfStatus: 'Lead' })
    application.activity = [{
      title: 'New application started',
      detail: 'A dedicated browser-saved application was created',
      status: 'COMPLETE',
      time: demoTimestamp(),
      ref: identity.applicationId,
    }]
    applications.push(application)
    writeRegistry(applications)
    localStorage.setItem(ACTIVE_APPLICATION_STORAGE_KEY, identity.applicationId)
    return clone(application)
  },

  select(applicationId) {
    const application = readRegistry().find((item) => item.application.id === applicationId)
    if (!application) return null
    localStorage.setItem(ACTIVE_APPLICATION_STORAGE_KEY, applicationId)
    return clone(application)
  },

  reset(applicationId) {
    const applications = readRegistry()
    const current = applications.find((item) => item.application.id === applicationId)
    if (!current) return this.load()
    const reset = createInitialState({
      applicationId,
      customerId: current.application.customerId,
      lfStatus: 'Lead',
    })
    const index = applications.findIndex((item) => item.application.id === applicationId)
    applications[index] = reset
    writeRegistry(applications)
    localStorage.setItem(ACTIVE_APPLICATION_STORAGE_KEY, applicationId)
    return clone(reset)
  },

  subscribe(onChange) {
    const listener = (event) => {
      if (![APPLICATIONS_STORAGE_KEY, ACTIVE_APPLICATION_STORAGE_KEY].includes(event.key)) return
      onChange(this.load(), this.list())
    }
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  },
}
