import { createInitialState } from '../domain'
import { synchronizeVerificationWorkflow } from '../verificationWorkflow'

export const APPLICATION_STORAGE_KEY = 'lf-crypto-studio-v7'

export const applicationService = {
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(APPLICATION_STORAGE_KEY))
      if (!saved?.application?.id || !saved?.documents || !saved?.reviews) return createInitialState()
      synchronizeVerificationWorkflow(saved)
      if (saved.offer?.options?.length && saved.application.workflowIndex === 9 && !saved.offer.selectedId) {
        saved.application.workflowIndex = 10
        saved.application.lfStatus = 'Offer Presented'
      }
      return saved
    } catch {
      return createInitialState()
    }
  },

  save(application) {
    localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(application))
  },

  subscribe(onChange) {
    const listener = (event) => {
      if (event.key !== APPLICATION_STORAGE_KEY || !event.newValue) return
      try {
        onChange(JSON.parse(event.newValue))
      } catch {
        // Ignore malformed demo data written by another tab.
      }
    }
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  },
}
