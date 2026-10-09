export const LF_STAGES = [
  'Lead',
  'Application Submitted',
  'Verification',
  'Bank Connect Pending',
  'Ready for Offer',
  'Offer Generated',
  'Offer Presented',
  'Offer Accepted',
  'Agreement Sent',
  'Agreement Signed',
  'Ready to Fund',
  'Funded',
  'Close',
]

export const WORKFLOW_STAGES = [
  { id: 'application', label: 'Application & consent', group: 'Application', lfStatus: 'Application Submitted' },
  { id: 'identity', label: 'Identity verification', group: 'Verification', lfStatus: 'Verification' },
  { id: 'compliance', label: 'AML & jurisdiction', group: 'Verification', lfStatus: 'Verification' },
  { id: 'wallet', label: 'Wallet verification', group: 'Crypto checks', lfStatus: 'Verification' },
  { id: 'eligibility', label: 'Collateral eligibility', group: 'Crypto checks', lfStatus: 'Verification' },
  { id: 'balance', label: 'Balance verification', group: 'Crypto checks', lfStatus: 'Verification' },
  { id: 'valuation', label: 'Collateral valuation', group: 'Underwriting', lfStatus: 'Verification' },
  { id: 'risk', label: 'LTV & risk assessment', group: 'Underwriting', lfStatus: 'Verification' },
  { id: 'program', label: 'Program qualification', group: 'Underwriting', lfStatus: 'Ready for Offer' },
  { id: 'offer', label: 'Offer generation', group: 'Offer', lfStatus: 'Offer Presented' },
  { id: 'selection', label: 'Offer selection', group: 'Offer', lfStatus: 'Offer Accepted' },
  { id: 'agreement', label: 'Agreement & e-sign', group: 'Contracting', lfStatus: 'Agreement Sent' },
  { id: 'lock', label: 'Collateral lock', group: 'Collateral', lfStatus: 'Agreement Signed' },
  { id: 'confirmation', label: 'Blockchain confirmation', group: 'Collateral', lfStatus: 'Agreement Signed' },
  { id: 'funding', label: 'Funding', group: 'Funding', lfStatus: 'Ready to Fund' },
  { id: 'monitoring', label: 'Active loan monitoring', group: 'Servicing', lfStatus: 'Funded' },
  { id: 'repayment', label: 'Repayment', group: 'Servicing', lfStatus: 'Active' },
  { id: 'release', label: 'Liquidation / collateral release', group: 'Completion', lfStatus: 'Close' },
]

export const RISK_POLICY = {
  version: 'DEMO-RISK-2026.10',
  maxInitialLtv: 60,
  intakeMaxLtv: 55,
  warningLtv: 55,
  actionLtv: 65,
  liquidationLtv: 75,
  annualRate: 9.5,
  originationFeeRate: 1,
  confirmationTarget: 12,
}

export const ASSETS = {
  ETH: { name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', price: 2710, quantity: 37, contract: 'Native asset', maxLtv: 60, eligible: true },
  BTC: { name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', price: 86600, quantity: 1.16, contract: 'Native asset', maxLtv: 55, eligible: true },
  USDC: { name: 'USD Coin', symbol: 'USDC', network: 'Ethereum', price: 1, quantity: 100000, contract: '0xA0b8…eB48', maxLtv: 70, eligible: true },
}

export const INTEGRATIONS = [
  ['Identity / KYC', 'Persona Sandbox', 'Identity and liveness'],
  ['AML & sanctions', 'ComplyAdvantage Demo', 'Customer screening'],
  ['Wallet', 'WalletConnect Mock', 'Ownership authorization'],
  ['Blockchain RPC', 'Alchemy Sandbox', 'Chain reads and transaction tracking'],
  ['Custody', 'Fireblocks Demo Vault', 'Collateral control'],
  ['Price oracle', 'Chainlink Mock Feed', 'Market valuation'],
  ['Smart contracts', 'LF Vault Simulator', 'Lock and release instructions'],
  ['E-sign', 'DocuSign Sandbox', 'Agreement evidence'],
  ['Payment rail', 'Circle Sandbox', 'USDC disbursement and repayment'],
  ['Blockchain analytics', 'TRM Labs Demo', 'Address risk screening'],
  ['Notifications', 'Twilio SendGrid Mock', 'Lifecycle and risk alerts'],
]

export function calculateCollateralValue(quantity, price) {
  return Math.max(0, Number(quantity) || 0) * Math.max(0, Number(price) || 0)
}

export function calculateLtv(loanValue, collateralValue) {
  if (!collateralValue) return 0
  return (Math.max(0, Number(loanValue) || 0) / collateralValue) * 100
}

export function isIntakeLtvEligible(ltv) {
  return Number(ltv) <= RISK_POLICY.intakeMaxLtv
}

export function calculateBorrowingCapacity(collateralValue, maxLtv = RISK_POLICY.maxInitialLtv) {
  return collateralValue * (maxLtv / 100)
}

export function calculateAvailableBorrowing(loanValue, collateralValue, maxLtv = RISK_POLICY.maxInitialLtv) {
  return Math.max(0, calculateBorrowingCapacity(collateralValue, maxLtv) - Math.max(0, Number(loanValue) || 0))
}

export function calculateHealthStatus(ltv) {
  if (ltv >= RISK_POLICY.liquidationLtv) return { key: 'liquidation', label: 'LIQUIDATION ELIGIBLE', copy: 'The demo position meets the illustrative liquidation condition.' }
  if (ltv >= RISK_POLICY.actionLtv) return { key: 'action', label: 'ACTION REQUIRED', copy: 'Add collateral or repay principal to restore the risk buffer.' }
  if (ltv >= RISK_POLICY.warningLtv) return { key: 'warning', label: 'WARNING', copy: 'The collateral buffer is narrowing. Monitor the position closely.' }
  return { key: 'healthy', label: 'HEALTHY', copy: 'The collateral position is within the illustrative operating range.' }
}

export function calculateLiquidationState(ltv) {
  return ltv >= RISK_POLICY.liquidationLtv ? 'ELIGIBLE' : 'NOT ELIGIBLE'
}

export function calculateAccruedInterest(principal, days = 18, annualRate = RISK_POLICY.annualRate) {
  return Math.max(0, Number(principal) || 0) * (annualRate / 100) * (days / 365)
}

export function calculateOutstandingBalance(principal, accruedInterest = 0, fees = 0) {
  return Math.max(0, Number(principal) || 0) + Math.max(0, Number(accruedInterest) || 0) + Math.max(0, Number(fees) || 0)
}

export function getMetrics(state) {
  const collateralValue = calculateCollateralValue(state.collateral.quantity, state.collateral.price)
  const principal = state.loan.principalOutstanding
  const ltv = calculateLtv(principal, collateralValue)
  const maxLtv = ASSETS[state.collateral.asset]?.maxLtv ?? RISK_POLICY.maxInitialLtv
  const accruedInterest = state.loan.status === 'ACTIVE' ? calculateAccruedInterest(principal, state.loan.accrualDays) : 0
  return {
    collateralValue,
    ltv,
    maxLtv,
    borrowingCapacity: calculateBorrowingCapacity(collateralValue, maxLtv),
    availableBorrowing: calculateAvailableBorrowing(principal, collateralValue, maxLtv),
    health: calculateHealthStatus(ltv),
    liquidationState: calculateLiquidationState(ltv),
    accruedInterest,
    totalOutstanding: calculateOutstandingBalance(principal, accruedInterest),
  }
}

export function demoTimestamp() {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: true, timeZone: 'Asia/Kolkata',
  }).format(new Date()).replace(',', ' ·') + ' IST'
}

export function createInitialState({
  applicationId = 'CRL-2026-001284',
  customerId = 'CUS-884291',
  lfStatus = 'Application Submitted',
} = {}) {
  return {
    application: {
      id: applicationId, customerId, lfStatus, workflowIndex: 0,
      requestedAmount: 50000, loanAsset: 'USDC', purpose: 'Business working capital',
      createdAt: demoTimestamp(), submittedAt: null, updatedAt: demoTimestamp(), decisionReason: null,
    },
    borrower: { name: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '+1 (512) 555-0187', address: '1408 West Avenue, Austin, TX 78701', jurisdiction: 'United States · Texas' },
    consent: { identity: true, blockchain: true, electronic: true },
    checks: {
      kyc: { status: '', provider: 'Persona Sandbox', reference: 'KYC-DEMO-78421', document: 'Pending', liveness: 'Pending', evidenceSubmittedAt: null },
      aml: { status: 'PENDING', sanctions: 'Pending', jurisdiction: 'Pending', walletScreening: 'Pending', reference: 'AML-DEMO-3028' },
      balance: { status: '', checkedAt: null },
      collateral: { status: '' },
      valuation: { status: '', acceptedAt: null },
      risk: { status: '', policy: RISK_POLICY.version },
      program: { status: '' },
    },
    reviews: {
      1: { documentId: 'DOC-KYC-001', reviewer: null, reviewedAt: null, comment: '' },
      2: { documentId: 'DOC-AML-001', reviewer: null, reviewedAt: null, comment: '' },
      3: { documentId: 'DOC-WALLET-001', reviewer: null, reviewedAt: null, comment: '' },
      4: { documentId: 'DOC-COLLATERAL-001', reviewer: null, reviewedAt: null, comment: '' },
      5: { documentId: 'DOC-BALANCE-001', reviewer: null, reviewedAt: null, comment: '' },
      6: { documentId: 'DOC-VALUATION-001', reviewer: null, reviewedAt: null, comment: '' },
      7: { documentId: 'DOC-RISK-001', reviewer: null, reviewedAt: null, comment: '' },
      8: { documentId: 'DOC-PROGRAM-001', reviewer: null, reviewedAt: null, comment: '' },
    },
    documents: [
      { id: 'DOC-KYC-001', type: 'Government-issued ID', name: 'Alex-Morgan-passport-demo.pdf', uploadedAt: 'Awaiting borrower upload', uploadedBy: 'Borrower', status: '', verificationStep: 1, pages: 1 },
      { id: 'DOC-AML-001', type: 'AML and sanctions report', name: 'aml-screening-demo.pdf', uploadedAt: '05 Oct 2026 · 09:42 AM IST', uploadedBy: 'System', status: 'PENDING', verificationStep: 2, pages: 2 },
      { id: 'DOC-WALLET-001', type: 'Wallet ownership evidence', name: 'wallet-signature-evidence.json', uploadedAt: 'Awaiting wallet connection', uploadedBy: 'Borrower', status: '', verificationStep: 3, pages: 1 },
      { id: 'DOC-COLLATERAL-001', type: 'Collateral eligibility report', name: 'asset-eligibility-demo.pdf', uploadedAt: 'Generated after wallet review', uploadedBy: 'System', status: '', verificationStep: 4, pages: 2 },
      { id: 'DOC-BALANCE-001', type: 'Blockchain balance snapshot', name: 'balance-snapshot-demo.json', uploadedAt: 'Generated after eligibility', uploadedBy: 'System', status: '', verificationStep: 5, pages: 1 },
      { id: 'DOC-VALUATION-001', type: 'Collateral valuation', name: 'oracle-valuation-demo.pdf', uploadedAt: 'Generated during underwriting', uploadedBy: 'System', status: '', verificationStep: 6, pages: 2 },
      { id: 'DOC-RISK-001', type: 'Risk decision worksheet', name: 'ltv-risk-decision-demo.pdf', uploadedAt: 'Generated during underwriting', uploadedBy: 'System', status: '', verificationStep: 7, pages: 3 },
      { id: 'DOC-PROGRAM-001', type: 'Program qualification', name: 'crypto-flex-qualification-demo.pdf', uploadedAt: 'Generated after risk review', uploadedBy: 'System', status: '', verificationStep: 8, pages: 2 },
    ],
    wallet: { status: 'DISCONNECTED', address: '0x71C7b2A46D0aF3e9F4A8B62dD592731e70F1D8B4', provider: 'WalletConnect Mock', ownership: '', connectedAt: null },
    collateral: { asset: 'ETH', network: 'Ethereum', quantity: 37, price: 2710, eligible: null, locked: false, released: false, vault: '0xLF28…9A10', availableBalance: 52.54, priceUpdatedAt: 'Reference snapshot · 07 Oct 2026' },
    offer: { status: 'NOT_GENERATED', id: null, version: null, createdAt: null, expiresAt: null, options: [], selectedId: null },
    agreement: { status: 'NOT_SIGNED', version: 'v1.0-demo', signedAt: null, reference: null },
    transaction: { status: 'NOT_STARTED', hash: null, block: null, confirmations: 0, from: null, to: '0xLF28…9A10' },
    funding: { status: 'NOT_READY', reference: null, fundedAt: null },
    loan: { id: `LN-${applicationId}`, status: 'PENDING', principalOutstanding: 50000, accrualDays: 18, nextPayment: '05 Nov 2026', payments: [] },
    release: { status: 'NOT_AVAILABLE', hash: null },
    activity: [{ title: 'Demo application prepared', detail: 'Pre-filled stakeholder scenario created', status: 'COMPLETE', time: demoTimestamp(), ref: applicationId }],
  }
}
