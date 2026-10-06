import pptxgen from 'pptxgenjs'

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'OpenAI Codex for LendFoundry'
pptx.company = 'LendFoundry'
pptx.subject = 'Executive proposal for a LendFoundry crypto-backed lending platform'
pptx.title = 'Crypto Lending on LendFoundry'
pptx.lang = 'en-US'
pptx.theme = {
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  lang: 'en-US',
}
pptx.defineSlideMaster({
  title: 'LIGHT',
  background: { color: 'F5F7FA' },
  objects: [
    { rect: { x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: '13B8A6' }, line: { color: '13B8A6' } } },
  ],
  slideNumber: { x: 12.55, y: 7.08, w: 0.35, h: 0.18, fontFace: 'Arial', fontSize: 7, color: '728095', align: 'right' },
})

const C = {
  navy: '071A2F',
  navy2: '0D2844',
  ink: '17243A',
  muted: '64748B',
  lightMuted: 'A8B6C7',
  line: 'D8E1EA',
  bg: 'F5F7FA',
  white: 'FFFFFF',
  teal: '13B8A6',
  tealDark: '087D73',
  tealLight: 'DDF7F3',
  blue: '3478F6',
  blueLight: 'E8F0FF',
  gold: 'F2B84B',
  goldLight: 'FFF3D6',
  red: 'E25B65',
  redLight: 'FCE6E8',
  slate: '334155',
  gray: 'EEF2F6',
}

const ST = pptx.ShapeType
const CT = pptx.ChartType

function addText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: opts.fontFace || 'Arial',
    fontSize: opts.fontSize || 16,
    color: opts.color || C.ink,
    bold: opts.bold || false,
    align: opts.align || 'left',
    valign: opts.valign || 'mid',
    margin: opts.margin === undefined ? 0 : opts.margin,
    breakLine: false,
    fit: 'shrink',
    ...opts,
  })
}

function rect(slide, x, y, w, h, fill, radius = 0, line = null) {
  slide.addShape(radius ? ST.roundRect : ST.rect, {
    x, y, w, h,
    rectRadius: radius,
    fill: { color: fill },
    line: line ? { color: line, width: 1 } : { color: fill, transparency: 100 },
    radius,
  })
}

function line(slide, x1, y1, x2, y2, color = C.line, width = 1, arrow = false, dash = 'solid') {
  slide.addShape(ST.line, {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color, width, dash, endArrowType: arrow ? 'triangle' : 'none' },
  })
}

function pill(slide, text, x, y, w, fill, color = C.ink, border = fill) {
  rect(slide, x, y, w, 0.34, fill, 0.14, border)
  addText(slide, text, x + 0.1, y + 0.02, w - 0.2, 0.28, { fontSize: 8.5, color, bold: true, align: 'center', charSpacing: 0.4 })
}

function card(slide, x, y, w, h, fill = C.white, border = C.line) {
  rect(slide, x, y, w, h, fill, 0.12, border)
}

function header(slide, kicker, title, subtitle = '') {
  addText(slide, kicker.toUpperCase(), 0.58, 0.3, 5.6, 0.28, { fontSize: 8.5, color: C.tealDark, bold: true, charSpacing: 1.4 })
  addText(slide, title, 0.58, 0.66, 12.05, 0.62, { fontSize: 28, color: C.navy, bold: true })
  if (subtitle) addText(slide, subtitle, 0.6, 1.28, 11.9, 0.36, { fontSize: 11.5, color: C.muted })
}

function footer(slide, source, color = C.muted) {
  line(slide, 0.58, 6.95, 12.75, 6.95, C.line, 0.7)
  addText(slide, source, 0.6, 7.01, 11.5, 0.2, { fontSize: 6.8, color, valign: 'top' })
}

function labelValue(slide, label, value, x, y, w, color = C.teal) {
  addText(slide, value, x, y, w, 0.58, { fontSize: 28, color, bold: true })
  addText(slide, label, x, y + 0.55, w, 0.38, { fontSize: 9.5, color: C.muted, bold: true })
}

function stageNode(slide, n, title, detail, x, y, w, color) {
  card(slide, x, y, w, 1.46, C.white, C.line)
  slide.addShape(ST.ellipse, { x: x + 0.16, y: y + 0.18, w: 0.42, h: 0.42, fill: { color }, line: { color } })
  addText(slide, String(n), x + 0.16, y + 0.19, 0.42, 0.39, { fontSize: 10, color: C.white, bold: true, align: 'center' })
  addText(slide, title, x + 0.7, y + 0.14, w - 0.84, 0.48, { fontSize: 13, color: C.navy, bold: true })
  addText(slide, detail, x + 0.18, y + 0.72, w - 0.36, 0.55, { fontSize: 9.2, color: C.muted, valign: 'top', breakLine: true })
}

function capabilityRow(slide, label, status, x, y, w, statusColor, statusFill) {
  addText(slide, label, x, y, w - 1.35, 0.32, { fontSize: 10.3, color: C.ink })
  pill(slide, status, x + w - 1.2, y - 0.01, 1.14, statusFill, statusColor)
  line(slide, x, y + 0.39, x + w, y + 0.39, C.line, 0.55)
}

// Slide 1 — Title
{
  const slide = pptx.addSlide()
  slide.background = { color: C.navy }
  // Atmospheric geometric background
  slide.addShape(ST.arc, { x: 7.4, y: -0.8, w: 6.8, h: 6.8, adjustPoint: 0.25, rotate: 16, fill: { color: C.navy2, transparency: 100 }, line: { color: '1E4568', width: 2, transparency: 20 } })
  slide.addShape(ST.ellipse, { x: 8.45, y: 0.55, w: 3.8, h: 3.8, fill: { color: C.teal, transparency: 92 }, line: { color: C.teal, transparency: 70, width: 1.2 } })
  slide.addShape(ST.ellipse, { x: 9.1, y: 1.2, w: 2.5, h: 2.5, fill: { color: C.blue, transparency: 90 }, line: { color: C.blue, transparency: 75, width: 1 } })

  addText(slide, 'LF  |  LENDFOUNDRY', 0.72, 0.48, 3.5, 0.3, { fontSize: 10, color: C.white, bold: true, charSpacing: 1.2 })
  pill(slide, 'EXECUTIVE PRODUCT PROPOSAL', 0.72, 1.25, 2.45, '12314B', C.tealLight, '24506E')
  addText(slide, 'Crypto Lending\non LendFoundry', 0.72, 1.78, 7.1, 1.7, { fontSize: 34, color: C.white, bold: true, breakLine: true, valign: 'top' })
  addText(slide, 'Extend proven origination and servicing with a crypto collateral control plane.', 0.75, 3.62, 6.25, 0.62, { fontSize: 16, color: 'C5D3E1', breakLine: true })

  // Visual: collateral to liquidity
  card(slide, 7.65, 2.14, 1.78, 1.5, '102F4D', '2A5576')
  card(slide, 10.62, 2.14, 1.78, 1.5, '102F4D', '2A5576')
  addText(slide, 'BTC', 7.96, 2.36, 1.15, 0.45, { fontSize: 25, color: C.gold, bold: true, align: 'center' })
  addText(slide, 'COLLATERAL', 7.88, 2.96, 1.3, 0.25, { fontSize: 8, color: C.lightMuted, bold: true, align: 'center', charSpacing: 1.0 })
  addText(slide, 'USD', 10.93, 2.36, 1.15, 0.45, { fontSize: 25, color: C.teal, bold: true, align: 'center' })
  addText(slide, 'LIQUIDITY', 10.85, 2.96, 1.3, 0.25, { fontSize: 8, color: C.lightMuted, bold: true, align: 'center', charSpacing: 1.0 })
  line(slide, 9.55, 2.74, 10.5, 2.74, C.teal, 2.6, true)
  addText(slide, 'LOCK + MONITOR', 9.53, 3.08, 1.0, 0.22, { fontSize: 6.8, color: C.lightMuted, bold: true, align: 'center' })

  rect(slide, 0.72, 5.46, 11.7, 0.02, '244662')
  labelValue(slide, 'GLOBAL OUTSTANDING BORROWS\nCEFI + DEFI LENDING APPS · Q2 2026', '$43.41B', 0.75, 5.72, 3.6, C.teal)
  addText(slide, 'A controlled extension—not a new lending stack.', 5.0, 5.78, 6.9, 0.42, { fontSize: 16, color: C.white, bold: true, align: 'right' })
  addText(slide, 'Market figure: Galaxy Research, 30 Jun 2026. Global outstanding balance; not TVL, revenue or U.S. TAM.', 0.75, 7.0, 11.5, 0.2, { fontSize: 6.8, color: C.lightMuted })
}

// Slide 2 — What and why
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '01 · WHAT & WHY', 'Crypto collateral becomes borrowing capacity', 'Borrowers unlock liquidity without voluntarily selling the asset—but accept continuous LTV and liquidation risk.')

  // Main flow
  const xs = [0.75, 3.2, 5.65, 8.1, 10.55]
  const nodes = [
    ['1', 'Borrower', 'Owns crypto'],
    ['2', 'Pledge / lock', 'Custodian or vault'],
    ['3', 'Loan funded', 'USD / stablecoin'],
    ['4', 'Repay', 'Principal + charges'],
    ['5', 'Release', 'Collateral returned'],
  ]
  nodes.forEach((n, i) => {
    card(slide, xs[i], 2.08, 1.75, 1.34, i === 2 ? C.tealLight : C.white, i === 2 ? C.teal : C.line)
    slide.addShape(ST.ellipse, { x: xs[i] + 0.58, y: 2.28, w: 0.58, h: 0.58, fill: { color: i === 2 ? C.teal : C.navy }, line: { color: i === 2 ? C.teal : C.navy } })
    addText(slide, n[0], xs[i] + 0.58, 2.32, 0.58, 0.42, { fontSize: 12, color: C.white, bold: true, align: 'center' })
    addText(slide, n[1], xs[i] + 0.1, 2.9, 1.55, 0.25, { fontSize: 11, color: C.navy, bold: true, align: 'center' })
    addText(slide, n[2], xs[i] + 0.1, 3.16, 1.55, 0.18, { fontSize: 7.8, color: C.muted, align: 'center' })
    if (i < nodes.length - 1) line(slide, xs[i] + 1.83, 2.75, xs[i + 1] - 0.1, 2.75, C.teal, 1.8, true)
  })

  // Numerical example
  card(slide, 0.75, 4.05, 4.0, 2.12, C.navy, C.navy)
  addText(slide, 'ILLUSTRATIVE CAPACITY', 1.0, 4.28, 2.4, 0.24, { fontSize: 8, color: C.teal, bold: true, charSpacing: 1.0 })
  addText(slide, '$100K', 1.0, 4.66, 1.5, 0.55, { fontSize: 29, color: C.white, bold: true })
  addText(slide, 'collateral', 1.04, 5.18, 1.4, 0.28, { fontSize: 10, color: C.lightMuted })
  addText(slide, '× 50% LTV', 2.35, 4.76, 1.25, 0.35, { fontSize: 16, color: C.gold, bold: true, align: 'center' })
  line(slide, 3.62, 4.98, 4.2, 4.98, C.teal, 2.2, true)
  addText(slide, '$50K', 3.3, 5.38, 1.15, 0.45, { fontSize: 24, color: C.teal, bold: true, align: 'center' })
  addText(slide, 'loan', 3.45, 5.8, 0.85, 0.2, { fontSize: 9, color: C.lightMuted, align: 'center' })

  // Why box
  card(slide, 5.0, 4.05, 3.45, 2.12, C.white, C.line)
  addText(slide, 'WHY BORROW?', 5.25, 4.28, 2.2, 0.25, { fontSize: 9, color: C.tealDark, bold: true, charSpacing: 0.9 })
  ;[
    ['01', 'Liquidity without a voluntary sale'],
    ['02', 'Maintain market exposure'],
    ['03', 'Collateral-driven decisioning'],
  ].forEach((r, i) => {
    pill(slide, r[0], 5.25, 4.72 + i * 0.44, 0.42, C.tealLight, C.tealDark)
    addText(slide, r[1], 5.82, 4.72 + i * 0.44, 2.28, 0.34, { fontSize: 10.2, color: C.ink })
  })

  // Risk box
  card(slide, 8.7, 4.05, 3.9, 2.12, C.goldLight, 'F5D991')
  addText(slide, 'THE TRADE-OFF', 8.95, 4.28, 2.2, 0.25, { fontSize: 9, color: '9A6B0A', bold: true, charSpacing: 0.9 })
  addText(slide, 'Price decline → higher LTV', 8.95, 4.72, 3.2, 0.34, { fontSize: 14, color: C.navy, bold: true })
  addText(slide, 'Warning → top-up / repay → liquidation', 8.95, 5.15, 3.2, 0.32, { fontSize: 10.5, color: C.slate })
  addText(slide, 'Overcollateralization reduces exposure; it does not remove price-gap, custody, oracle or execution risk.', 8.95, 5.55, 3.25, 0.46, { fontSize: 8.8, color: C.muted, breakLine: true, valign: 'top' })

  footer(slide, 'Illustrative values only. Tax treatment depends on facts; IRS treats digital assets as property and sales can create gain or loss.')
}

// Slide 3 — Workflow and LOS/LSS
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '02 · WORKFLOW', 'One loan. Five control gates. Two LendFoundry systems.', 'The prototype models 18 detailed stages; the executive view is a five-gate lifecycle with continuous monitoring.')

  const colors = [C.blue, C.teal, C.gold, C.navy2, C.tealDark]
  const items = [
    ['APPLY', 'Application · consent\nrequested terms'],
    ['VERIFY', 'KYC/AML · jurisdiction\nwallet · asset · balance'],
    ['DECIDE', 'Price · LTV · policy\nprogram · offer'],
    ['SECURE & FUND', 'Agreement · deposit/lock\nconfirmation · disbursement'],
    ['SERVICE & CLOSE', 'Monitor · repay · collect\nrelease or liquidate'],
  ]
  items.forEach((it, i) => {
    const x = 0.6 + i * 2.53
    stageNode(slide, i + 1, it[0], it[1], x, 2.02, 2.13, colors[i])
    if (i < items.length - 1) line(slide, x + 2.18, 2.76, x + 2.48, 2.76, C.teal, 2, true)
  })

  // System ownership bands
  rect(slide, 0.6, 3.82, 8.92, 0.78, C.blueLight, 0.1, 'BBD0FF')
  addText(slide, 'LOS · ORIGINATION', 0.88, 3.96, 2.3, 0.25, { fontSize: 11, color: C.blue, bold: true })
  addText(slide, 'Owns application → verification → underwriting → offer → agreement → funding decision', 3.05, 3.92, 6.1, 0.34, { fontSize: 10.2, color: C.slate })
  rect(slide, 9.72, 3.82, 3.0, 0.78, C.tealLight, 0.1, 'A7E6DE')
  addText(slide, 'LSS / LMS · SERVICING', 9.97, 3.95, 2.5, 0.25, { fontSize: 10.5, color: C.tealDark, bold: true, align: 'center' })

  // Monitoring loop
  card(slide, 0.6, 5.0, 12.12, 1.22, C.navy, C.navy)
  addText(slide, '24 / 7 COLLATERAL LOOP', 0.88, 5.22, 2.0, 0.28, { fontSize: 9, color: C.teal, bold: true, charSpacing: 1 })
  const loops = ['Observe price', 'Revalue collateral', 'Recalculate LTV', 'Notify / cure', 'Liquidate if eligible', 'Reconcile']
  loops.forEach((t, i) => {
    const x = 3.02 + i * 1.5
    pill(slide, t.toUpperCase(), x, 5.18, 1.25, i === 4 ? '47242B' : '12314B', i === 4 ? 'FFB7BD' : 'D8E6F3', i === 4 ? '8B3D45' : '274B68')
    if (i < loops.length - 1) line(slide, x + 1.28, 5.35, x + 1.45, 5.35, C.teal, 1.3, true)
  })
  addText(slide, 'Funding and release fail closed when compliance, valuation, collateral control or reconciliation is unresolved.', 0.88, 5.75, 10.9, 0.22, { fontSize: 8.8, color: C.lightMuted })

  footer(slide, 'Sources: LendFoundry API documentation and LMS overview, accessed 6 Oct 2026. Prototype workflow: src/domain.js.')
}

// Slide 4 — Market and shares
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '03 · MARKET', 'Material, concentrated—and cyclical', 'Keep outstanding loans, TVL, originations and revenue separate.')

  // Market size card
  card(slide, 0.62, 1.83, 6.05, 4.68, C.white, C.line)
  addText(slide, 'Q2 2026 OUTSTANDING BORROWS', 0.92, 2.07, 3.6, 0.28, { fontSize: 9, color: C.muted, bold: true, charSpacing: 0.8 })
  addText(slide, '$43.41B', 0.92, 2.42, 2.85, 0.62, { fontSize: 34, color: C.navy, bold: true })
  pill(slide, '−19.08% QoQ', 4.62, 2.52, 1.46, C.redLight, C.red, 'F4B9BF')
  // Stacked bar
  const barX = 0.95, barY = 3.42, barW = 5.35
  rect(slide, barX, barY, barW * 0.5295, 0.62, C.blue, 0.08, C.blue)
  rect(slide, barX + barW * 0.5295, barY, barW * 0.4705, 0.62, C.teal, 0.08, C.teal)
  addText(slide, 'CeFi  $22.98B  |  52.95%', barX + 0.12, barY + 0.13, barW * 0.5295 - 0.2, 0.28, { fontSize: 9.5, color: C.white, bold: true })
  addText(slide, 'DeFi apps  $20.43B  |  47.05%', barX + barW * 0.5295 + 0.12, barY + 0.13, barW * 0.4705 - 0.2, 0.28, { fontSize: 9.0, color: C.white, bold: true, align: 'center' })
  // broader callout
  card(slide, 0.95, 4.4, 5.35, 0.92, C.gray, C.line)
  addText(slide, '$56.16B', 1.16, 4.59, 1.55, 0.38, { fontSize: 20, color: C.navy, bold: true })
  addText(slide, 'broader crypto-collateralized lending\nincluding crypto-backed CDP stablecoins', 2.8, 4.5, 3.1, 0.54, { fontSize: 9.2, color: C.muted, breakLine: true })
  addText(slide, '40.13% below the Q3 2025 peak', 1.0, 5.62, 3.0, 0.28, { fontSize: 9.5, color: C.red, bold: true })
  addText(slide, 'Global balances; possible double counting.', 3.4, 5.62, 2.8, 0.28, { fontSize: 8.5, color: C.muted, align: 'right' })

  // Market shares card
  card(slide, 6.92, 1.83, 5.8, 4.68, C.navy, C.navy)
  addText(slide, 'DEFI ACTIVE-LOAN SHARE', 7.23, 2.07, 2.8, 0.28, { fontSize: 9, color: C.lightMuted, bold: true, charSpacing: 0.8 })
  slide.addChart(CT.doughnut, [{
    name: 'Active loans',
    labels: ['Aave', 'Morpho', 'Compound', 'Others'],
    values: [39.7, 17.0, 2.0, 41.3],
  }], {
    x: 7.14, y: 2.48, w: 2.78, h: 2.46,
    holeSize: 64,
    showLegend: false,
    showTitle: false,
    showValue: false,
    showPercent: false,
    chartColors: [C.teal, C.blue, C.gold, '40566C'],
    showBorder: false,
  })
  addText(slide, '$33.11B', 7.75, 3.28, 1.55, 0.36, { fontSize: 18, color: C.white, bold: true, align: 'center' })
  addText(slide, 'tracked active loans', 7.7, 3.65, 1.65, 0.2, { fontSize: 7.5, color: C.lightMuted, align: 'center' })
  const shares = [
    ['AAVE', '39.7%', C.teal],
    ['MORPHO', '17.0%', C.blue],
    ['COMPOUND', '2.0%', C.gold],
    ['OTHERS', '41.3%', '60758A'],
  ]
  shares.forEach((r, i) => {
    slide.addShape(ST.ellipse, { x: 10.08, y: 2.64 + i * 0.53, w: 0.14, h: 0.14, fill: { color: r[2] }, line: { color: r[2] } })
    addText(slide, r[0], 10.35, 2.56 + i * 0.53, 1.25, 0.28, { fontSize: 8.5, color: C.lightMuted, bold: true })
    addText(slide, r[1], 11.62, 2.55 + i * 0.53, 0.68, 0.28, { fontSize: 11, color: C.white, bold: true, align: 'right' })
  })
  pill(slide, 'TOP 3 TRACKED CEFI = 74.96%', 7.28, 5.31, 4.95, '12314B', C.tealLight, '2A5576')
  addText(slide, 'Tether 58.54%  ·  Maple 8.91%  ·  Nexo 7.51%', 7.45, 5.76, 4.65, 0.28, { fontSize: 9.2, color: C.lightMuted, align: 'center' })

  footer(slide, 'Sources: Galaxy Research, 17 Aug 2026 (30 Jun balances); DefiLlama Active Loans, accessed 6 Oct 2026. Different dates and methodologies.')
}

// Slide 5 — LF fit and opportunity
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '04 · LENDFOUNDRY FIT', 'Reuse the lending core. Add a crypto control plane.', 'The differentiation is configurable enterprise operations—not a proprietary liquidity pool.')

  // Existing layer
  card(slide, 0.65, 1.86, 5.75, 3.77, C.navy, C.navy)
  pill(slide, 'EXISTING LENDING LAYER', 0.93, 2.12, 2.1, '12314B', C.tealLight, '2A5576')
  addText(slide, 'LendFoundry', 0.95, 2.62, 3.6, 0.45, { fontSize: 23, color: C.white, bold: true })
  const core = [
    ['LOS', 'Application · verification · underwriting'],
    ['OFFER', 'Terms · documents · eSign · funding gate'],
    ['LSS / LMS', 'Schedules · payments · collections · closure'],
    ['PORTALS', 'Borrower · partner · back office · reporting'],
  ]
  core.forEach((r, i) => {
    pill(slide, r[0], 0.96, 3.23 + i * 0.52, 0.95, i === 2 ? C.tealDark : '183A58', C.white, i === 2 ? C.teal : '2D5575')
    addText(slide, r[1], 2.1, 3.2 + i * 0.52, 3.8, 0.34, { fontSize: 10, color: C.lightMuted })
  })

  // Plus
  slide.addShape(ST.ellipse, { x: 6.17, y: 3.26, w: 0.72, h: 0.72, fill: { color: C.teal }, line: { color: C.teal } })
  addText(slide, '+', 6.17, 3.25, 0.72, 0.62, { fontSize: 24, color: C.white, bold: true, align: 'center' })

  // New layer
  card(slide, 6.68, 1.86, 6.0, 3.77, C.white, C.line)
  pill(slide, 'NEW CRYPTO CONTROL PLANE', 6.98, 2.12, 2.5, C.goldLight, '9A6B0A', 'F1D58F')
  const crypto = [
    ['Wallet / custody', 'Control + transaction state'],
    ['Screening', 'Wallet + transaction risk'],
    ['Price / LTV', 'Dual source + continuous health'],
    ['Chain monitor', 'RPC/indexer + finality'],
    ['Liquidation', 'Approval + venue + fills'],
    ['Reconciliation', 'LOS/LMS ↔ bank ↔ custodian ↔ chain'],
  ]
  crypto.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 7.0 + col * 2.75, y = 2.76 + row * 0.82
    card(slide, x, y, 2.48, 0.63, col ? C.blueLight : C.tealLight, col ? 'C4D5FF' : 'B8E9E3')
    addText(slide, r[0], x + 0.14, y + 0.1, 2.1, 0.2, { fontSize: 9.3, color: C.navy, bold: true })
    addText(slide, r[1], x + 0.14, y + 0.33, 2.14, 0.18, { fontSize: 7.2, color: C.muted })
  })

  // Opportunity band
  card(slide, 0.65, 5.93, 12.03, 0.72, C.gray, C.line)
  addText(slide, 'BOTTOM-UP OPPORTUNITY', 0.92, 6.12, 1.75, 0.22, { fontSize: 8.5, color: C.muted, bold: true, charSpacing: 0.7 })
  addText(slide, 'Pilot  $5M', 2.85, 6.07, 1.35, 0.3, { fontSize: 12, color: C.navy, bold: true })
  line(slide, 4.22, 6.24, 4.75, 6.24, C.teal, 1.8, true)
  addText(slide, 'Initial scale  $50M', 4.9, 6.07, 1.85, 0.3, { fontSize: 12, color: C.navy, bold: true })
  line(slide, 6.8, 6.24, 7.33, 6.24, C.teal, 1.8, true)
  addText(slide, 'Multi-partner  $375M', 7.48, 6.07, 2.15, 0.3, { fontSize: 12, color: C.navy, bold: true })
  addText(slide, 'Illustrative managed balances—not forecasts', 9.7, 6.1, 2.5, 0.25, { fontSize: 8.2, color: C.red, bold: true, align: 'right' })

  footer(slide, 'LendFoundry official sources: API lifecycle, LMS boundary and 90+ integrations claim. Publicly verifiable LendFoundry market share: not identified.')
}

// Slide 6 — Competitors
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '05 · COMPETITIVE LANDSCAPE', 'Different models win on different dimensions', 'DeFi leads in automation and transparency; CeFi leads in guided UX; LendFoundry can lead in configurable enterprise operations.')

  const x0 = 0.48, y0 = 1.84
  const widths = [1.48, 2.05, 2.05, 2.05, 2.05, 2.72]
  const headers = ['DIMENSION', 'AAVE', 'COMPOUND', 'NEXO', 'LEDN', 'LF PROPOSED']
  let xpos = x0
  headers.forEach((h, i) => {
    rect(slide, xpos, y0, widths[i], 0.58, i === 5 ? C.tealDark : C.navy, 0, C.white)
    addText(slide, h, xpos + 0.08, y0 + 0.13, widths[i] - 0.16, 0.27, { fontSize: i === 0 ? 8 : 9.3, color: C.white, bold: true, align: i === 0 ? 'left' : 'center' })
    xpos += widths[i]
  })
  const rows = [
    ['MODEL', 'DeFi pool', 'DeFi market', 'CeFi credit line', 'BTC term loan', 'B2B platform'],
    ['CONTROL', 'Smart contracts', 'Smart contracts', 'Custodial', 'Qualified custody', '3rd-party custody v1'],
    ['KYC / OPS', 'Protocol-native', 'Protocol-native', 'Centralized', 'Centralized', 'LOS + back office'],
    ['ADVANTAGE', 'Scale + liquidity', 'Simple autonomous rules', 'Broad assets + speed', 'BTC clarity + transparency', 'Configurable lifecycle'],
    ['TRADE-OFF', 'Wallet / contract risk', 'Smaller + no LOS', 'Counterparty / closed rules', 'Narrower product', 'Crypto layer unbuilt'],
  ]
  rows.forEach((row, ri) => {
    let x = x0
    const y = y0 + 0.58 + ri * 0.72
    row.forEach((txt, ci) => {
      const fill = ri % 2 === 0 ? C.white : 'F9FBFD'
      rect(slide, x, y, widths[ci], 0.72, ci === 5 ? (ri % 2 ? 'E6F8F5' : 'F1FBF9') : fill, 0, C.line)
      addText(slide, txt, x + 0.09, y + 0.08, widths[ci] - 0.18, 0.55, { fontSize: ci === 0 ? 8.2 : 8.8, color: ci === 0 ? C.muted : C.ink, bold: ci === 0 || ci === 5, align: ci === 0 ? 'left' : 'center', breakLine: true })
      x += widths[ci]
    })
  })

  // Adaptation callouts
  card(slide, 0.48, 6.06, 6.15, 0.62, C.tealLight, 'A9E6DE')
  addText(slide, 'ADAPT', 0.7, 6.2, 0.75, 0.22, { fontSize: 9, color: C.tealDark, bold: true })
  addText(slide, 'Health-factor UX · real-time LTV · top-ups · transparent custody · automated evidence', 1.5, 6.15, 4.8, 0.3, { fontSize: 9.3, color: C.ink })
  card(slide, 6.82, 6.06, 6.03, 0.62, C.goldLight, 'EED28A')
  addText(slide, 'OUR EDGE', 7.04, 6.2, 0.85, 0.22, { fontSize: 9, color: '9A6B0A', bold: true })
  addText(slide, 'Configurable LOS + servicing + approvals + portals + multi-provider choice', 7.95, 6.15, 4.55, 0.3, { fontSize: 9.3, color: C.ink })

  footer(slide, 'Sources: Aave and Compound protocol docs; Nexo, Ledn and Unchained product disclosures; accessed 6 Oct 2026. Availability varies by jurisdiction.')
}

// Slide 7 — Gap analysis and custody
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '06 · GAP ANALYSIS', 'The gap is collateral control—not loan workflow', 'Wallet connection alone does not make a product non-custodial; control after deposit defines the model.')

  const panels = [
    { x: 0.62, w: 3.7, title: 'REUSE', fill: C.tealLight, border: 'A9E6DE', color: C.tealDark, rows: ['LOS intake + workflow', 'KYC / compliance orchestration', 'Offers + eSign + funding gate', 'LSS/LMS servicing + reporting'] },
    { x: 4.54, w: 3.7, title: 'EXTEND', fill: C.blueLight, border: 'C5D6FF', color: C.blue, rows: ['Asset-aware decisioning', 'Continuous LTV / exposure', 'Funding + release conditions', 'Collections with collateral remedies'] },
    { x: 8.46, w: 4.25, title: 'BUILD / INTEGRATE', fill: C.goldLight, border: 'EED28A', color: '9A6B0A', rows: ['Wallet / custody control', 'Dual-source price + chain monitor', 'Wallet / transaction screening', 'Liquidation + reconciliation'] },
  ]
  panels.forEach((p) => {
    card(slide, p.x, 1.88, p.w, 3.2, C.white, p.border)
    rect(slide, p.x, 1.88, p.w, 0.55, p.fill, 0.08, p.border)
    addText(slide, p.title, p.x + 0.2, 2.02, p.w - 0.4, 0.25, { fontSize: 10, color: p.color, bold: true, align: 'center', charSpacing: 0.8 })
    p.rows.forEach((t, i) => {
      slide.addShape(ST.ellipse, { x: p.x + 0.28, y: 2.68 + i * 0.53, w: 0.18, h: 0.18, fill: { color: p.color }, line: { color: p.color } })
      addText(slide, t, p.x + 0.58, 2.58 + i * 0.53, p.w - 0.82, 0.32, { fontSize: 10.1, color: C.ink })
    })
  })
  line(slide, 4.33, 3.49, 4.51, 3.49, C.teal, 2, true)
  line(slide, 8.25, 3.49, 8.43, 3.49, C.teal, 2, true)

  // Custody decision rail
  card(slide, 0.62, 5.42, 12.09, 1.18, C.navy, C.navy)
  addText(slide, 'CUSTODY PATH', 0.88, 5.62, 1.15, 0.24, { fontSize: 8.5, color: C.lightMuted, bold: true, charSpacing: 0.8 })
  pill(slide, 'CURRENT', 2.12, 5.58, 0.94, '3A2E19', C.goldLight, '6D572B')
  addText(slide, 'Simulated hybrid', 3.18, 5.57, 1.5, 0.3, { fontSize: 11.3, color: C.white, bold: true })
  line(slide, 4.72, 5.77, 5.12, 5.77, C.teal, 1.8, true)
  pill(slide, 'V1 RECOMMENDED', 5.25, 5.58, 1.35, '124A45', C.tealLight, '28756D')
  addText(slide, '3rd-party custody · BTC / USD\nsegregated · no rehypothecation', 6.75, 5.48, 2.66, 0.52, { fontSize: 10.1, color: C.white, bold: true, breakLine: true })
  line(slide, 9.45, 5.77, 9.83, 5.77, C.teal, 1.8, true)
  addText(slide, 'LATER', 9.95, 5.57, 0.7, 0.28, { fontSize: 8.5, color: C.lightMuted, bold: true })
  addText(slide, 'Audited contract vault\nif demand justifies risk', 10.62, 5.47, 1.72, 0.48, { fontSize: 9.3, color: C.white, breakLine: true })

  footer(slide, 'Current code: WalletConnect Mock + Fireblocks Demo Vault + LF Vault Simulator; no real keys, custody or deployed smart contract.')
}

// Slide 8 — Economics
{
  const slide = pptx.addSlide('LIGHT')
  header(slide, '07 · ECONOMICS', 'Monetize the platform. Expose the full cost stack.', 'Interest is lender/program economics; LendFoundry’s base case is implementation + SaaS + usage + servicing.')

  card(slide, 0.62, 1.9, 5.92, 3.86, C.white, C.line)
  pill(slide, 'REVENUE', 0.9, 2.17, 1.12, C.tealLight, C.tealDark, 'A7E6DE')
  const revenue = [
    ['Implementation', 'One-time'],
    ['SaaS subscription', 'Recurring'],
    ['Per funded loan', 'Usage'],
    ['Servicing / API', 'Recurring'],
    ['Spread / revenue share', 'Optional'],
  ]
  revenue.forEach((r, i) => {
    const y = 2.75 + i * 0.52
    rect(slide, 0.92, y, 3.25 + i * 0.32, 0.34, i < 4 ? C.teal : C.gold, 0.05, i < 4 ? C.teal : C.gold)
    addText(slide, r[0], 1.06, y + 0.03, 2.2, 0.25, { fontSize: 9.2, color: C.white, bold: true })
    addText(slide, r[1], 4.75, y + 0.02, 1.33, 0.25, { fontSize: 8.5, color: i === 4 ? C.white : C.muted, bold: i === 4, align: 'right' })
  })

  card(slide, 6.78, 1.9, 5.94, 3.86, C.navy, C.navy)
  pill(slide, 'COSTS + RISK', 7.06, 2.17, 1.45, '3B2A1B', C.goldLight, '6D572B')
  const costs = [
    ['Funding / liquidity', C.gold],
    ['Custody + screening + KYC/AML', C.blue],
    ['Price + RPC/indexer + gas', C.teal],
    ['Bank rails + reconciliation', '7393B0'],
    ['24/7 ops + compliance + security', C.red],
    ['Expected loss + liquidation slippage', 'A4434B'],
  ]
  costs.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 7.08 + col * 2.68, y = 2.78 + row * 0.78
    card(slide, x, y, 2.45, 0.58, '12314B', '294F6C')
    slide.addShape(ST.ellipse, { x: x + 0.14, y: y + 0.2, w: 0.16, h: 0.16, fill: { color: r[1] }, line: { color: r[1] } })
    addText(slide, r[0], x + 0.42, y + 0.09, 1.86, 0.39, { fontSize: 8.7, color: C.white, bold: true, breakLine: true })
  })

  // Equation strip
  card(slide, 0.62, 6.03, 7.42, 0.67, C.gray, C.line)
  addText(slide, 'LF contribution = implementation + subscription + usage + servicing − pass-throughs − support', 0.88, 6.19, 6.9, 0.28, { fontSize: 10.3, color: C.navy, bold: true, align: 'center' })
  card(slide, 8.25, 6.03, 4.47, 0.67, C.goldLight, 'EED28A')
  addText(slide, 'PUBLIC BENCHMARKS', 8.46, 6.12, 1.3, 0.18, { fontSize: 7.5, color: '9A6B0A', bold: true })
  addText(slide, 'Coinbase: 2% first $250K / 1% above  ·  Ledn: 2% admin fee', 9.72, 6.11, 2.7, 0.37, { fontSize: 8.3, color: C.ink, bold: true, breakLine: true, align: 'center' })

  footer(slide, 'Competitor terms accessed 6 Oct 2026; jurisdiction/product conditions vary. Proposed LF pricing and production vendor costs are not established.')
}

// Slide 9 — Prototype to production
{
  const slide = pptx.addSlide()
  slide.background = { color: C.navy }
  addText(slide, '08 · RECOMMENDATION', 0.62, 0.36, 3.0, 0.25, { fontSize: 8.5, color: C.teal, bold: true, charSpacing: 1.2 })
  addText(slide, 'The prototype proves the journey.\nThe control plane must now become real.', 0.62, 0.78, 11.65, 1.08, { fontSize: 27, color: C.white, bold: true, breakLine: true })

  // Today and gap columns
  card(slide, 0.64, 2.16, 5.72, 2.74, '0E2B47', '2A5576')
  pill(slide, 'PROTOTYPE TODAY', 0.92, 2.42, 1.65, '124A45', C.tealLight, '28756D')
  ;['Borrower + operations portals', '18-stage workflow + decisions', 'LTV / health / offer calculations', 'Monitoring, repayment, release UX'].forEach((t, i) => {
    slide.addShape(ST.ellipse, { x: 0.96, y: 3.04 + i * 0.43, w: 0.2, h: 0.2, fill: { color: C.teal }, line: { color: C.teal } })
    addText(slide, '✓', 0.96, 3.0 + i * 0.43, 0.2, 0.2, { fontSize: 8.5, color: C.navy, bold: true, align: 'center' })
    addText(slide, t, 1.32, 2.96 + i * 0.43, 4.35, 0.3, { fontSize: 10.5, color: C.white })
  })
  addText(slide, 'All providers and transactions are simulated.', 0.94, 4.55, 4.9, 0.22, { fontSize: 8.4, color: C.gold, bold: true })

  card(slide, 6.62, 2.16, 6.06, 2.74, '0E2B47', '2A5576')
  pill(slide, 'PRODUCTION GATES', 6.92, 2.42, 1.75, '3B2A1B', C.goldLight, '6D572B')
  const gates = ['Lender + funding partner', 'Legal / state / entity approval', 'Custody + price + screening + chain', 'Servicing ledger + reconciliation', 'Security review + 24/7 liquidation ops']
  gates.forEach((t, i) => {
    addText(slide, String(i + 1).padStart(2, '0'), 6.96, 3.0 + i * 0.36, 0.35, 0.22, { fontSize: 8, color: C.gold, bold: true })
    addText(slide, t, 7.42, 2.94 + i * 0.36, 4.6, 0.28, { fontSize: 9.8, color: C.white })
  })

  // Roadmap
  addText(slide, 'CONTROLLED PATH TO PILOT', 0.66, 5.28, 2.5, 0.24, { fontSize: 8.5, color: C.lightMuted, bold: true, charSpacing: 0.8 })
  const roadmap = [
    ['PHASE 0', 'Decide', 'segment · legal · partners'],
    ['PHASE 1', 'Integrate', 'real sandboxes · recon'],
    ['PHASE 2', 'Pilot', 'BTC / USD · capped exposure'],
    ['PHASE 3', 'Scale', 'automation · resilience'],
  ]
  roadmap.forEach((r, i) => {
    const x = 0.66 + i * 3.05
    card(slide, x, 5.7, 2.55, 0.92, i === 2 ? '124A45' : '12314B', i === 2 ? '28756D' : '2A5576')
    addText(slide, r[0], x + 0.16, 5.82, 0.72, 0.2, { fontSize: 7.5, color: i === 2 ? C.teal : C.lightMuted, bold: true })
    addText(slide, r[1], x + 0.85, 5.76, 1.35, 0.28, { fontSize: 12.5, color: C.white, bold: true })
    addText(slide, r[2], x + 0.16, 6.17, 2.18, 0.22, { fontSize: 7.6, color: C.lightMuted, align: 'center' })
    if (i < roadmap.length - 1) line(slide, x + 2.62, 6.15, x + 2.95, 6.15, C.teal, 1.8, true)
  })
  rect(slide, 0.66, 6.92, 12.0, 0.03, '244662')
  addText(slide, 'DECISION ASK', 0.68, 7.04, 1.1, 0.2, { fontSize: 7.5, color: C.teal, bold: true })
  addText(slide, 'Authorize Phase 0 discovery + vendor/partner RFIs—not a production build.', 1.82, 7.0, 9.8, 0.24, { fontSize: 10.3, color: C.white, bold: true })
}

// Add speaker notes as plain text via core properties is intentionally avoided for maximum compatibility.

pptx.writeFile({ fileName: 'Document Plan/Crypto_Lending_on_LendFoundry_CEO_Deck.pptx' })
