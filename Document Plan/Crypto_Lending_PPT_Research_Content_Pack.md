# Crypto Lending on LendFoundry

## PPT Research & Content Pack for a Technical CEO

**Prepared:** 6 October 2026  
**Recommended deck length:** 8 slides  
**Purpose:** Source pack for a presentation-generation AI. This is not the PowerPoint itself.  
**Scope reviewed:** the React prototype, its source code and tests, all relevant files in `Document Plan`, the repository's LendFoundry blueprint material, the supplied `Crypto Lending Research.pdf`, and current external sources.

### Evidence labels used throughout

- **CURRENTLY IMPLEMENTED:** functioning client-side behavior in the React prototype.
- **SIMULATED:** a deterministic local simulation; no production provider or transaction exists.
- **UI ONLY:** a screen or control without corresponding real processing.
- **PROPOSED:** a target capability or architecture, not present today.
- **EXTERNAL DEPENDENCY:** a third-party service, regulated partner, funding source, or external system required for production.

> **Non-negotiable presentation rule:** put a visible `PROTOTYPE — SIMULATED PROVIDERS AND TRANSACTIONS` badge on every prototype screenshot. Do not describe the current application as production, connected to a blockchain, or non-custodial.

---

## 1. Executive Summary

### CEO takeaway

Crypto-backed lending lets a borrower unlock cash or stablecoin liquidity without first selling a crypto asset. The asset is pledged or locked as collateral, the loan is governed by loan-to-value (LTV), and a price decline can trigger a top-up, repayment, or liquidation.

The market is material but cyclical. Galaxy Research reported **$43.41 billion of combined CeFi and DeFi-lending-app outstanding crypto-collateralized borrows at 30 June 2026**; the broader measure was **$56.16 billion** when the crypto-backed portion of collateralized-debt-position stablecoins was included. These are global outstanding balances—not revenue, originations, U.S. TAM, or TVL—and Galaxy warns of possible double counting. [Galaxy Research, 17 Aug 2026](https://www.galaxy.com/insights/research/crypto-leverage-report-q2-2026-defi-lending-decline-futures-open-interest)

The product opportunity is not “build another Aave.” LendFoundry can reuse its strongest capabilities—application intake, configurable verification and underwriting, offers, documents/e-sign, funding gates, portals, servicing, payments, collections, and reporting—then add a focused **crypto collateral control plane**: wallet/custody connectivity, chain observation, wallet screening, asset policy, price validation, continuous LTV, liquidation orchestration, and reconciliation.

### Prototype verdict

The current React application is a credible **experience and workflow demonstrator**. It implements an 18-stage borrower/back-office journey, deterministic LTV and interest calculations, configurable-looking risk states, offer selection, simulated collateral lock, funding, monitoring, repayment, liquidation, release, and an audit-style activity feed. It is nevertheless a **frontend-only local simulation**: React state is stored in browser `localStorage`; provider calls use fake delays and hard-coded responses; no wallet SDK, blockchain node, oracle, custodian, e-sign, payment rail, KYC/AML provider, smart contract, backend ledger, or LendFoundry API is connected.

### Recommended direction

1. **Business model:** platform-led enablement for lenders, not LendFoundry balance-sheet lending in the first phase.
2. **MVP product:** U.S.-first hypothesis; one borrower segment; **BTC collateral, USD loan, regulated third-party custody, no rehypothecation**, conservative configurable LTV, human-controlled liquidation with maker-checker approval.
3. **Architecture:** keep LOS as the origination/workflow system; use LSS/LMS as the post-funding loan record; add a crypto gateway, valuation/risk service, custody/chain adapters, event ledger/reconciliation, and liquidation/execution adapter.
4. **Custody:** current prototype is a **simulated hybrid journey**, not purely non-custodial. Recommend third-party custodial control for v1; evaluate an audited smart-contract vault only as a later, separate model.
5. **Go/no-go before production:** legal/entity/state-product analysis, a committed lender and funding partner, custody and liquidation agreements, vendor RFIs, bottom-up unit economics, security design, 24/7 operating model, and crash/liquidation drills.

---

## 2. What Is Crypto Lending?

### Slide-ready definition

**Crypto lending converts a volatile digital asset into borrowing capacity.** The borrower provides crypto collateral; the lender/platform verifies identity, asset eligibility, ownership/control, value, and risk; funds are disbursed; the collateral remains controlled or locked; the position is monitored continuously; repayment releases the collateral, while a breach can trigger liquidation.

### Why it exists

- Access liquidity for working capital or major expenses **without voluntarily selling** the asset.
- Maintain potential upside exposure to the collateral while the loan is outstanding.
- Use overcollateralization instead of—or alongside—traditional credit underwriting.
- Obtain a faster, programmable collateral workflow where eligible.
- For U.S. tax messaging, say only: **“Borrowing may avoid an immediate voluntary sale; liquidation or other disposition can create tax consequences. Obtain tax advice.”** The IRS treats digital assets as property and a sale for dollars can generate gain or loss. [IRS digital-asset FAQs, updated 15 Dec 2025](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-digital-asset-transactions)

### Illustrative numerical example — not a product term

```text
$100,000 eligible crypto collateral
× 50% initial LTV
= $50,000 maximum initial loan

If collateral falls to $70,000:
$50,000 ÷ $70,000 = 71.4% LTV
→ warning/action zone or liquidation risk, depending on policy
```

**Key formula:** `LTV = eligible debt ÷ eligible collateral value × 100`.

**Risk message:** overcollateralization reduces credit exposure but does not eliminate price gaps, stale/oracle errors, custody failure, execution slippage, liquidity shortfall, fraud, or operational risk.

---

## 3. Crypto Lending Workflow

### Complete lifecycle found in the prototype

The code defines these 18 stages:

1. Application & consent
2. Identity verification / KYC
3. AML, sanctions & jurisdiction
4. Wallet verification
5. Collateral eligibility
6. Balance verification
7. Collateral valuation
8. LTV & risk assessment
9. Program qualification
10. Offer generation
11. Offer selection
12. Agreement & e-sign
13. Collateral lock
14. Blockchain confirmation
15. Funding
16. Active loan monitoring
17. Repayment
18. Liquidation or collateral release

### One-slide compression

Use a five-gate horizontal lifecycle rather than 18 equal boxes:

```text
1 APPLY                 2 VERIFY                    3 DECIDE
Application             KYC / AML / jurisdiction   Price + valuation
Consent                 Wallet/control             LTV + policy
Requested terms         Asset + balance            Program + offer
       ───────────────────────►──────────────────────────►

4 SECURE & FUND                              5 SERVICE & CLOSE
Agreement/eSign → deposit/lock → confirmation → funding
                  Continuous price/LTV monitoring
                  → repay + release  OR  top-up / liquidate
```

### Production control gates

- **No offer:** unresolved mandatory identity, sanctions, jurisdiction, wallet, asset, balance, valuation, or risk checks.
- **No funding:** unsigned agreement; stale valuation; collateral not received/controlled; insufficient confirmations; reconciliation mismatch; funding rail or compliance hold.
- **No release:** principal, accrued interest, and permitted fees not fully settled; destination not verified/screened; custody or ledger mismatch.
- **Liquidation:** must be an operational workflow—fresh price evidence, policy decision, approvals, execution, fills, fees, debt settlement, surplus return, accounting, and audit—not merely a UI status.

---

## 4. LendFoundry LOS/LSS Mapping

### Terminology note

LendFoundry public marketing uses **LSS** for loan servicing software, while current developer documentation and the local blueprint use **LMS**. The developer documentation places the boundary at funding: LOS handles application, verification, underwriting, approval and the decision to fund; LMS maintains the funded loan, repayment schedules, payments, allocations, delinquency and closure. This pack uses **“LSS/LMS servicing layer”** once, then “servicing layer.” [LendFoundry API overview](https://developers.lendfoundry.com/reference/welcome-to-lendfoundry-api) and [LMS overview](https://developers.lendfoundry.com/docs/overview).

| Crypto-lending requirement | Existing LendFoundry capability | Production extension | Classification |
|---|---|---|---|
| Application, borrower profile, consent | LOS intake and portals | Add asset, network, wallet/custody intent, crypto disclosures | **REUSE / MINOR EXTENSION** |
| Identity/KYC/KYB | LOS verification integrations/work queues | Select approved provider and crypto product rules | **REUSE / EXTEND** |
| Customer AML, sanctions, jurisdiction | LOS rules, exceptions, audit workflow | Approved-state/product/entity matrix | **EXTEND** |
| Wallet/address screening | Not a traditional loan check | Wallet and transaction analytics, risk evidence, ongoing monitoring | **NEW / EXTERNAL** |
| Wallet control verification | Not traditional | Signature challenge or custodial account binding | **NEW** |
| Asset/network eligibility | Product configuration is reusable | Canonical asset/chain/contract registry; haircuts and exposure caps | **NEW POLICY DOMAIN** |
| On-chain/custody balance | Not traditional | Custodian, RPC and/or indexer adapters with timestamp/finality | **NEW / EXTERNAL** |
| Price and collateral valuation | General underwriting data pattern | Dual prices, median/outlier logic, staleness and fallback policy | **NEW CRITICAL SERVICE** |
| Initial LTV decision | Decisioning/rules can be reused | Crypto formulas, asset limits, concentration and volatility buffers | **EXTEND** |
| Continuous health monitoring | Traditional servicing monitors payments | Event-driven collateral/debt recalculation, alerts and escalation | **NEW + SERVICING EXTENSION** |
| Program qualification / offer | LOS rules and offer lifecycle | Crypto-specific terms, collateral quantity, liquidation disclosures | **REUSE / EXTEND** |
| Agreement/e-sign | LOS document and e-sign pattern | Collateral control, liquidation, risk, chain and custody terms | **REUSE / EXTEND** |
| Collateral deposit/lock | No traditional equivalent | Custodian/vault instructions, allowlists, idempotent transaction state | **NEW / EXTERNAL** |
| Blockchain confirmation | No traditional equivalent | RPC/indexer or custody confirmation, reorg/finality policy | **NEW / EXTERNAL** |
| Funding gate | LOS funding decision/workflow | Require reconciled collateral control and fresh risk snapshot | **REUSE / EXTEND** |
| Disbursement | Existing payment integration pattern | USD partner rail first; stablecoin rail later if selected | **EXTEND / EXTERNAL** |
| Loan boarding, schedules, accruals | LSS/LMS | Add collateral and crypto event references | **REUSE / EXTEND** |
| Repayment and collections | LSS/LMS payments, allocations, delinquency | Crypto payment option, 24/7 collateral remedies, collateral-sale proceeds | **REUSE / EXTEND** |
| Liquidation | Some conceptual overlap with recovery/collections | Price trigger, approvals, execution venue, partial fills, surplus return | **NEW CRYPTO ENGINE** |
| Payoff and release | LSS closure workflow | Custody/vault release, destination screening, chain reconciliation | **EXTEND + NEW** |
| Reporting and audit | LOS/LSS reporting/activity | On-chain/custody proof, risk snapshots, provider evidence, recon breaks | **REUSE / EXTEND** |

### What is publicly supportable about LendFoundry's position

- LOS covers application through approval and funding; servicing covers payments, accounting and collections. [Official API](https://developers.lendfoundry.com/reference/welcome-to-lendfoundry-api)
- Official marketing describes an API-first, cloud-native embedded-lending platform and advertises **90+ ready API integrations**. [LendFoundry embedded lending](https://lendfoundry.com/embedded-lending-platform/) and [loan onboarding](https://lendfoundry.com/solutions/loan-servicing-software/loan-onboarding/)
- The local blueprint shows borrower, back-office and affiliate portal patterns; configurable verification/work-item flows; offer/agreement/funding stages; integrations such as Plaid, DocuSign, Equifax and LexisNexis; and LMS endpoints for schedules, payments, payoff and accounting.
- **Publicly verifiable LendFoundry market-share data not identified.** Public customer count and processed-loan-volume evidence suitable for a market-share claim was also not identified. Do not invent either.

---

## 5. Market Size & Market Opportunity

### Use one primary market definition on the slide

**Recommended headline:**

> **$43.41B outstanding crypto-collateralized borrows across tracked CeFi lenders and DeFi lending applications at Q2 2026 end.**

Breakdown:

- **CeFi open borrows:** $22.98B; down $2.45B or 9.62% quarter over quarter.
- **DeFi lending-app outstanding borrows:** $20.43B; down $7.79B or 27.61% quarter over quarter.
- **Combined:** $43.41B; down $10.24B or 19.08% quarter over quarter.
- **Broader measure including crypto-backed CDP stablecoins:** $56.16B; down $11.33B or 16.78% quarter over quarter and 40.13% below the Q3 2025 peak of $78.69B.

Source and date: [Galaxy Research, “The State of Crypto Leverage Q2 2026,” 17 Aug 2026](https://www.galaxy.com/insights/research/crypto-leverage-report-q2-2026-defi-lending-decline-futures-open-interest), figures as of 30 June 2026.

### Metric discipline

| Metric | What it means | Appropriate use |
|---|---|---|
| Outstanding loans / borrows | Principal currently owed | Category scale and lender/protocol share |
| Originations | Loans funded during a period or lifetime | Flow and operating scale |
| TVL | Assets locked/supplied in contracts | Capital/collateral footprint; **not loan balance** |
| Deposits | Assets customers place with a platform | Funding or custody scale; **not loans** |
| Fees | Gross user-paid protocol/platform fees | Gross transaction economics |
| Revenue | Amount retained by the protocol/company | Monetization; definitions vary |

### TAM → SAM → SOM framework

- **TAM context:** $43.41B global CeFi + DeFi-app outstanding borrows. Use only as category scale. It is not LendFoundry software revenue and may contain double counting.
- **SAM:** lenders in selected U.S. states that can lawfully offer overcollateralized BTC-backed USD credit through an approved custodian and funding structure, and that need third-party origination/servicing technology. **Not established from available sources.** It requires a state/product/entity map and buyer discovery.
- **SOM:** a bottom-up partner capacity model, not an arbitrary global market percentage.

### Illustrative SOM scenarios — scenarios, not forecasts

| Scenario | Partner and portfolio assumption | Managed outstanding balance |
|---|---|---:|
| Pilot | 1 lender × 100 active loans × $50K average balance | $5M |
| Initial scale | 2 lenders × 500 active loans × $50K | $50M |
| Multi-partner scale | 5 lenders × 1,000 active loans × $75K | $375M |

For scale context only, 0.1%, 0.5%, and 1.0% of the $43.41B global category equal **$43.41M, $217.05M, and $434.10M** of outstanding loan volume. These are not forecasts and should not be presented as attainable market share.

### How to size the actual software opportunity

```text
Annual platform opportunity
= qualified lender partners
× (implementation fee + annual subscription + expected usage/servicing fees)
```

The decisive variables are qualified design partners, annual contract value, implementation/support burden, vendor pass-throughs, 24/7 operations, and liability allocation—not the global loan balance alone.

---

## 6. Market Share / Major Players

### Q2 2026 CeFi share — Galaxy's tracked loan-book set

| Provider | Share of tracked CeFi open borrows | Interpretation |
|---|---:|---|
| Tether | 58.54% | Dominant secured-lending balance in the tracked set |
| Maple | 8.91% | Institutional/on-chain credit platform |
| Nexo | 7.51% | Centralized retail/private credit line |
| Others combined | 25.04% | Includes heterogeneous business models and jurisdictions |

Top three = **74.96%** of Galaxy's tracked CeFi market. Galaxy states that private third-party lender values were not formally vetted and notes major differences in products, customers and jurisdictions. Do not label this “U.S. retail market share.” [Galaxy Research, 17 Aug 2026](https://www.galaxy.com/insights/research/crypto-leverage-report-q2-2026-defi-lending-decline-futures-open-interest)

### Current DeFi active-loan snapshot — different metric and date

DefiLlama reported **$33.109B total active loans** across its tracked protocols on 6 October 2026:

| Protocol | Active loans | Calculated share of snapshot |
|---|---:|---:|
| Aave | $13.147B | 39.7% |
| Morpho | $5.627B | 17.0% |
| Compound Finance | $0.668B | 2.0% |
| All others | $13.667B | 41.3% |

Source: [DefiLlama Active Loans, accessed 6 Oct 2026](https://defillama.com/active-loans). Shares are calculated from the displayed snapshot and can move continuously. Do not compare this snapshot directly to Galaxy's 30 June quarter-end values without labeling the date/methodology difference.

### Why Sky/Maker is not in the primary comparison

Sky/Maker is a major collateralized-debt-position stablecoin ecosystem. Its outstanding stablecoin debt belongs in Galaxy's broader $56.16B definition, but it is not a like-for-like term lender or LOS/LSS software competitor. Include it as a separate CDP category in an appendix if needed; do not blend its stablecoin supply with lending-app active loans.

### Relevant player groups

- **DeFi/non-custodial protocols:** Aave, Morpho, Compound; Sky/Maker as adjacent CDP model.
- **CeFi/custodial lenders:** Nexo, Ledn; Unchained as a collaborative multisig reference.
- **Embedded distribution:** Coinbase's interface to Morpho on Base.
- **Institutional lending operations software / potential partner class:** Membrane Labs and August are closer architecture benchmarks than retail lenders; validate their current capabilities in a buying process.

---

## 7. Competitor Analysis

### CEO comparison matrix

| Capability | Aave | Compound III | Nexo | Ledn | Proposed LendFoundry v1 |
|---|---|---|---|---|---|
| Model | Permissionless pooled liquidity protocol | Autonomous base-asset lending market | Centralized revolving credit line | Centralized BTC-backed term loan | B2B lending platform for partner lenders |
| Collateral control | User signs with self-custody wallet; protocol smart contracts control supplied collateral | Protocol contracts hold supplied collateral | Assets transferred into Nexo account/control | Qualified independent custody; collateral held in custody | Third-party custodian recommended; policy and workflow in LF |
| KYC/AML | Base protocol is permissionless; interfaces may impose controls | Base protocol is permissionless; interfaces may impose controls | Centralized onboarding | Centralized onboarding | LOS-orchestrated KYC/KYB/AML + wallet screening |
| Collateral | Multiple assets/markets/chains | Market-specific collateral assets | BTC, ETH and 100+ assets advertised | BTC-focused | BTC only for recommended MVP |
| Borrowed asset | Pool liquidity; market-specific | One base asset per market | Fiat or stablecoins where available | USD/local fiat/stablecoins; loan denominated USD | USD first; stablecoin optional later |
| Pricing | Variable, utilization driven | Variable, market driven | Tier/LTV/loyalty-driven marketing; from 1.9% | Published 9.25%–11.49% APR snapshot | Partner-configured; **not established** |
| LTV reference | Asset/market parameters; health factor | Borrow and liquidation collateral factors | BTC/ETH 50%; stablecoins 90% advertised | Typical 50% initial LTV | Configurable conservative policy; **not selected** |
| Liquidation | Permissionless when health factor <1; partial/full based on conditions | Any address can call `absorb`; protocol reserves acquire collateral | Automated partial repayment/sale at critical LTV | Alerts at 70%/75%; automatic partial sale at 80% LTV | Human-controlled custodian execution for pilot; automate later |
| Traditional loan workflow | Minimal | Minimal | Own consumer platform | Own term-loan operations | Strong LOS workflow, documents, approvals and back office |
| Servicing | Protocol state and wallet UX | Protocol state | Platform-managed | Statements, top-ups, payments, renewals | LSS/LMS schedules, payments, allocations, collections, closure |
| Main strength | Scale, liquidity, transparency, automation | Compact autonomous money-market design | Breadth and instant reusable credit | BTC specialization, custody transparency, simple borrower terms | Configurable enterprise workflows across origination + servicing |
| Main limitation for LF's target | Wallet/gas/contract/oracle risk; weak traditional-loan operations | Same; smaller scale; no lender operating workflow | Centralized counterparty/custody exposure; closed rules | Narrow collateral/product range; custody and lender-specific operating model | Crypto control plane, partners, security and 24/7 ops do not yet exist |

Sources: [Aave introduction](https://aave.com/help/aave-101/introduction-to-aave), [Aave liquidation FAQ](https://aave.com/faq), [Compound liquidation docs](https://docs.compound.finance/liquidation/), [Nexo borrow](https://nexo.com/borrow), [Ledn homepage](https://www.ledn.io/), [Ledn loan overview](https://help.ledn.io/hc/en-us/articles/28282750963607-What-is-a-Dollar-Loan), and [Ledn liquidation](https://help.ledn.io/hc/en-us/articles/28302717485079-What-Happens-If-the-value-of-your-collateral-significantly-decreases).

### Notable differentiators to study

- **Aave:** self-custody wallet entry, health factor, transparent parameterization, automated/on-chain liquidation, multi-chain scale.
- **Compound:** separation of initial borrowing factors from liquidation factors; reserve-backed `absorb` process; explicit discounted collateral sale mechanics.
- **Morpho/Coinbase:** embed an on-chain protocol behind a familiar regulated-account interface; Coinbase sponsors gas and adds its own processing/platform fees. [Coinbase loan introduction](https://help.coinbase.com/en-gb/coinbase/trading-and-funding/loan/loan-intro)
- **Nexo:** instant reusable credit line, broad collateral, top-up/swap flexibility, partial repayment.
- **Ledn:** BTC-only clarity, visible loan-health workflow, qualified independent custody, monthly Open Book reporting, explicit top-up and liquidation communications.
- **Unchained:** segregated BTC in 2-of-3 multisig with keys held by borrower, Unchained and a key agent; no rehypothecation. [Unchained collateral model](https://help.unchained.com/what-is-loan-collateral-and-what-does-unchained-do-with-it)

---

## 8. Competitor Advantages & Disadvantages

| Player | What it does better than the current prototype | Disadvantage / trade-off | LendFoundry response |
|---|---|---|---|
| Aave | Live liquidity, audited/deployed protocol, real wallets, on-chain transparency, automatic continuous risk | Contract/oracle/network risk; complex wallet UX; no traditional LOS, agreement or lender operations | Adapt health-factor UX and event-driven monitoring; retain enterprise workflow and regulated controls |
| Compound | Proven autonomous collateral and reserve mechanics; clear market-level risk parameters | Narrower borrower/lender operating workflow; interface and chain complexity | Separate initial and liquidation parameters; model reserves and execution outcomes explicitly |
| Morpho/Coinbase | Crypto complexity hidden behind familiar account UX; embedded distribution; sponsored gas | Protocol plus interface dependencies; variable rates and layered fees; on-chain risk remains | Build partner-branded UX while preserving provider abstraction and loan-system auditability |
| Nexo | Broad collateral, instant reusable credit, simple no-credit-check story | Centralized custody and counterparty trust; rules and jurisdiction availability are platform-controlled | Offer lender-configurable products, approvals and multi-partner integrations rather than one closed balance sheet |
| Ledn | Focused BTC product, mature servicing, published risk triggers, custody transparency and operating history | Limited collateral breadth; 12-month product structure; reliance on custody/funding partners | Use BTC-only focus as an MVP strength; add configurable terms, portals and enterprise back-office tooling |
| Unchained | Borrower-visible segregated multisig control and no rehypothecation | BTC-only and operationally more complex; collaborative signing/recovery model | Evaluate collaborative custody as a future premium or business-loan model |

### Claims LendFoundry can credibly make

- Configurable application, verification, underwriting, offer and funding workflows.
- Borrower and back-office portal patterns.
- Post-funding servicing capability: schedules, payments, allocations, delinquency, closure, collections and reporting.
- API/microservice and integration orientation.

### Claims it should not make yet

- Deep crypto liquidity, production blockchain integration, audited smart contracts, custody, automated liquidation, 24/7 crypto operations, or proven crypto-loan performance.
- Crypto-lending market share, production customer adoption, approved risk thresholds, regulatory coverage, or production vendor selection.

---

## 9. What We Can Adapt

### From DeFi

- Wallet-based initiation and cryptographic control verification.
- Transparent collateral quantity, price source, debt, LTV/health, and thresholds.
- Event-driven repricing and continuous health calculation.
- Configurable warning, cure and liquidation states.
- Immutable transaction references and on-chain evidence.
- Automated rules, but with enterprise override, approval and exception controls.

### From CeFi lenders

- A simple “do not sell; unlock liquidity” borrower proposition.
- Fiat/stablecoin disbursement choice only where operationally and legally supported.
- Top-up, partial repayment, payoff, excess-collateral release and clear warning communications.
- Customer support, statements, downloadable activity, and human exception handling.
- Segregated custody, no-rehypothecation option, transparent collateral reporting.

### From LendFoundry

- LOS application intake, verification orchestration, configurable underwriting, tasks and manual review.
- Versioned offers, documents, e-sign and funding conditions.
- LSS/LMS loan subledger, schedules, payments, allocations, servicing, collections and closure.
- Borrower, partner and operations portals; audit trail and reporting.
- Provider abstraction and multi-lender product configuration.

### Product equation

> **Crypto-native collateral controls + LendFoundry origination and servicing = an enterprise crypto-backed lending platform.**

The differentiator should be operational reliability and configurability for lenders—not token speculation or a proprietary liquidity pool.

---

## 10. Gap Analysis

### Reuse / extend / build

```text
LendFoundry Core
│
├── LOS: intake, verification, workflow, offer, documents, funding gate ─ REUSE
├── Decisioning and compliance orchestration ────────────────────────── EXTEND
├── LSS/LMS: subledger, schedules, payments, collections, closure ───── REUSE / EXTEND
│
└── Crypto Control Plane ─────────────────────────────────────────────── NEW
    ├── Wallet and custody adapters
    ├── Wallet / transaction screening
    ├── Asset, chain and contract registry
    ├── RPC / indexer / custody event observation
    ├── Dual-source price and valuation service
    ├── Continuous LTV / health and exposure engine
    ├── Deposit, confirmation and reconciliation state machine
    ├── Liquidation / execution adapter
    └── Collateral release and on-chain reporting
```

### Gap register

| Gap | Why it matters | MVP treatment |
|---|---|---|
| Wallet connectivity/control | Address possession is not identity or collateral control | Signature challenge and/or custodian account binding |
| Canonical asset registry | Symbols alone do not identify chain/token; wrapped assets differ | BTC-only policy first; canonical IDs and network allowlist |
| Chain/RPC/indexer | Transactions can be pending, fail, reorg, or duplicate | Two data paths where practical; explicit finality and idempotency |
| Custody control | Determines legal and technical ability to block/release/sell | Qualified third-party custody contract and API |
| Wallet/transaction screening | Customer screening alone misses address and flow risk | Pre-deposit and ongoing blockchain analytics |
| Price/oracle | Wrong or stale price can cause bad funding or liquidation | Two sources; freshness, outlier, degraded-mode and freeze rules |
| Continuous LTV | Traditional underwriting is episodic; collateral risk is 24/7 | Event-driven service with deterministic versioned calculations |
| Liquidation | Requires authority, venue, price, fills, fees and surplus handling | Manual/maker-checker pilot; custodian or approved venue execution |
| Reconciliation | LOS/LMS, bank, custodian and chain records will diverge | Canonical event ledger, daily and intraday breaks, retry and exception queues |
| Crypto repayment/release | Settlement can be irreversible and destination-sensitive | USD repayment first; verified release address and dual approval |
| Security/key management | Loss or unauthorized signing can be catastrophic | Keep keys with qualified custodian in MVP; no keys in LF services |
| 24/7 operations | Markets do not close | On-call ownership, runbooks, circuit breakers and incident drills |
| Smart-contract assurance | Contract bugs and upgrade keys create loss risk | No proprietary contract in baseline MVP; audit if later introduced |
| Regulatory/licensing | Role depends on who lends, holds, transmits and sells | Counsel-approved responsibility and state/product/entity matrix |

### Regulatory design implications, not legal conclusions

- FinCEN says administrator/exchanger activity can be money transmission depending on actual activity, not the product label. [FinCEN guidance](https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering)
- OFAC obligations apply to digital and fiat transactions; a tailored risk-based program should include appropriate screening. [OFAC FAQ 560](https://ofac.treasury.gov/faqs/560)
- New York identifies custody/control, transmission, exchange and other activities as virtual-currency business activity and separately notes software alone may not require a BitLicense while operating it can. [NYDFS licensing](https://www.dfs.ny.gov/virtual_currency_businesses)
- Therefore the architecture must make the lender, custodian, funds mover, collateral controller and liquidation executor explicit before a legal conclusion is possible.

---

## 11. Custodial vs Non-Custodial

### Current prototype classification

**SIMULATED HYBRID CUSTODY/CONTROL — not purely non-custodial.**

Why:

1. The borrower “connects” a `WalletConnect Mock` address and authorizes a simulated collateral transaction.
2. The collateral is then represented as locked in an `LF Vault Simulator`, with `Fireblocks Demo Vault` named as the custody integration.
3. After lock, the application's local state—not a real borrower wallet, custodian, or smart contract—controls whether collateral is “released” or “liquidated.”
4. No key custody, deployed contract, on-chain balance, allowance, transaction signature, or vault authority exists in the code.

The prototype copy “your keys remain yours” is defensible only for the connected source wallet before transfer; it does not establish who controls deposited collateral. Rewrite this copy before an executive demo.

### Model comparison

| Dimension | Custodial | Non-custodial / smart-contract vault |
|---|---|---|
| Collateral control after deposit | Custodian/platform under legal agreement | Smart-contract rules; borrower retains wallet keys but cannot freely withdraw locked collateral |
| User experience | Can abstract wallets, gas and confirmations | Wallet connection, signatures, gas/finality and chain education |
| Operational recovery | Human/custodian workflows can support exceptions | Contract/admin-key design determines recovery |
| Transparency | Depends on custody reporting and segregation | On-chain collateral and rules are inspectable |
| Primary risks | Counterparty, segregation, key management, insolvency, regulatory burden | Contract bugs, oracle manipulation, upgrade/admin keys, network congestion, MEV, finality |
| Liquidation | Platform/custodian executes under contract | Bots/keepers or protocol participants execute on chain |
| LendFoundry integration | Custody, screening, valuation and execution APIs | Wallet, RPC/indexer, contracts, oracle, keepers and transaction monitoring |
| MVP fit | Stronger fit for controlled enterprise lending | Higher engineering/security burden; stronger crypto-native positioning |

### Recommendation

**v1: third-party custodial, BTC-only, USD loan, segregated collateral, no rehypothecation, human-controlled liquidation.** This aligns with the internal strategy documents and LendFoundry's partner-led enterprise model, avoids making an unaudited smart contract the critical path, and keeps keys outside LendFoundry.

**Later option:** an audited non-custodial vault for stablecoin-native or self-custody use cases once demand, jurisdiction, liquidity, contract ownership, oracle design, audits, bug bounty, upgrade governance, emergency pause and liquidation mechanics are separately approved.

**Middle model to evaluate:** collaborative 2-of-3 multisig, inspired by Unchained, can reduce a single custodian's unilateral control but introduces signing, recovery and operating complexity.

---

## 12. Processing Charges / Unit Economics

### Potential revenue streams

| Revenue line | Who earns it | Applicability |
|---|---|---|
| Implementation / integration fee | LendFoundry | Strong fit for B2B launch |
| SaaS subscription / minimum commitment | LendFoundry | Core platform model |
| Per application / verification / funded loan fee | LendFoundry or provider | Usage-based option |
| Servicing fee per active loan | LendFoundry | Fits LSS/LMS value |
| Origination / processing fee | Lender/platform, if permitted and disclosed | Product- and jurisdiction-dependent |
| Interest spread or revenue share | Funding lender/program operator | Only if commercial model allocates it |
| Liquidation administration/execution fee | Lender/custodian/venue | Must be contractually and legally supported |
| Custody, network, withdrawal/release fee | Usually pass-through or provider | Disclose clearly; avoid hidden margin |
| Enterprise API / premium monitoring | LendFoundry | Potential differentiated pricing |

### Cost stack

- Funding/liquidity cost and capital partner economics.
- Expected loss, price-gap risk, slippage and liquidation shortfall.
- Custody, wallet infrastructure, key controls and insurance.
- KYC/KYB, customer AML/sanctions, wallet and transaction analytics.
- RPC/node/indexer, blockchain gas and transaction acceleration.
- Market data/oracle licenses and fallback source.
- Bank/payment rails, stablecoin mint/redeem where relevant, reconciliation.
- E-sign, documents, notifications, statements and support.
- Security reviews, penetration tests, incident response; smart-contract audit and bug bounty if applicable.
- Legal, licensing, compliance monitoring, reporting and 24/7 operations.

### Unit-economics equation

```text
Loan/program contribution
= permitted processing/origination revenue
 + interest spread or partner revenue share
 + servicing/platform/API revenue
 - funding cost
 - custody + screening + KYC/AML + oracle + RPC/indexer
 - bank/stablecoin settlement + gas
 - support + 24/7 operations + compliance allocation
 - expected loss + liquidation slippage/shortfall
 - partner revenue share
```

For a pure software model, separate lender economics from LendFoundry economics:

```text
LendFoundry contribution
= implementation + subscription + usage + servicing fees
 - third-party pass-throughs
 - cloud/monitoring/support
 - implementation and ongoing compliance/security burden
```

### Public pricing references — competitor terms, not proposed pricing

- **Coinbase/Morpho:** Coinbase currently discloses a one-time processing fee of **2% on the first $250,000 and 1% above $250,000**, added to principal and accruing interest; a platform fee can also apply. [Coinbase fee page, accessed 6 Oct 2026](https://help.coinbase.com/en/coinbase/trading-and-funding/loan/fee)
- **Ledn:** homepage advertised **9.25%–11.49% APR**, 50% initial LTV, and $757M loans outstanding at the 1 Sep 2026 attestation. Its help center states a **2% administrative fee** at origination; product/jurisdiction terms vary. [Ledn homepage](https://www.ledn.io/) and [Dollar Loan help](https://help.ledn.io/hc/en-us/articles/28282750963607-What-is-a-Dollar-Loan)
- **Ledn liquidation:** automatic sale at 80% LTV and a 0.50% trade spread. [Ledn help, 1 Oct 2026](https://help.ledn.io/hc/en-us/articles/28302717485079-What-Happens-If-the-value-of-your-collateral-significantly-decreases)
- **Nexo:** advertises rates from 1.9%, BTC/ETH at 50% LTV, stablecoins at 90%, and 100+ collateral assets; actual rate depends on program/tier/LTV and jurisdiction. [Nexo borrow, accessed 6 Oct 2026](https://nexo.com/borrow)
- **DeFi:** borrowers pay variable interest, network gas, and asset-specific liquidation bonuses/penalties; Aave says liquidation bonuses depend on the collateral asset. [Aave FAQ](https://aave.com/faq)

### What is not established

- Production vendor prices, capital cost, loss/slippage assumptions, legal fees, insurance and support staffing.
- Proposed LendFoundry pricing or willingness to pay.
- The internal documents contain illustrative $10K loan and per-funded-loan models. They are planning examples, not market benchmarks; keep them out of the headline deck unless leadership explicitly approves the assumptions.

---

## 13. Current Prototype Assessment

### React architecture

- **CURRENTLY IMPLEMENTED:** React 19 + Vite single-page application; borrower and back-office experiences; hash-based borrower navigation and `/backoffice` path selection.
- **CURRENTLY IMPLEMENTED:** domain calculations and initial demo state in `src/domain.js`; verification state transitions in `src/verificationWorkflow.js`; browser persistence and cross-tab synchronization in `src/services/applicationService.js`.
- **CURRENTLY IMPLEMENTED:** local automated test for sequential verification progression.
- **No integration SDKs:** package dependencies are only React/ReactDOM plus build/lint tooling. There is no wallet, Web3, RPC, custody, provider, router, backend or API client library.
- **SIMULATED:** action delays use `setTimeout`; all data remains a serializable client-side object.

### Capability inventory

| Capability | Prototype evidence | Accurate status |
|---|---|---|
| Borrower landing and intake | Personal details, request, collateral, consent | **CURRENTLY IMPLEMENTED UI + local state** |
| Borrower workspace | 18-stage workflow, status cards, actions | **CURRENTLY IMPLEMENTED UI/workflow simulation** |
| Back-office portal | Login, dashboard, application queue, case tabs, manual decisions | **CURRENTLY IMPLEMENTED UI; auth is UI ONLY** |
| KYC / liveness | Persona Sandbox label; manual PASS/FAIL/REVIEW | **SIMULATED / EXTERNAL DEPENDENCY** |
| AML, sanctions, jurisdiction | ComplyAdvantage/TRM demo labels; local statuses | **SIMULATED / EXTERNAL DEPENDENCY** |
| Wallet connect and control | Fixed EVM address; WalletConnect Mock; local “ownership” status | **SIMULATED** |
| Asset eligibility | ETH/BTC/USDC allowlist and fixed max LTV | **CURRENTLY IMPLEMENTED calculation with hard-coded demo policy** |
| Balance/provenance | 2.84 ETH fixed available balance | **SIMULATED** |
| Price/oracle | ETH $50K, BTC $100K, USDC $1; editable price | **SIMULATED / hard-coded** |
| Collateral value / LTV / capacity | Deterministic formulas | **CURRENTLY IMPLEMENTED locally** |
| Risk bands | 55% warning, 65% action, 75% liquidation; demo scenarios 45/58/68/78% | **CURRENTLY IMPLEMENTED with illustrative hard-coded policy** |
| Offer generation | Three formula-driven offers with fixed terms/rates/fees | **CURRENTLY IMPLEMENTED locally; terms are illustrative** |
| eSign | DocuSign Sandbox reference and status | **SIMULATED / EXTERNAL DEPENDENCY** |
| Collateral lock/vault | Fake tx hash/block; LF Vault Simulator; Fireblocks Demo Vault label | **SIMULATED; no contract/custody** |
| Blockchain confirmation | Sets confirmation count to 12 | **SIMULATED** |
| Funding | Fixed Circle demo reference; activates loan | **SIMULATED / EXTERNAL DEPENDENCY** |
| Loan monitoring | Principal, simple accrued interest, collateral value, current LTV and health | **CURRENTLY IMPLEMENTED calculation/UI** |
| Repayment | Local principal reduction/full payoff | **SIMULATED; no payment allocation or settlement** |
| Liquidation | Local quantity sold = principal/price; closes loan | **SIMULATED; omits fills, fees, slippage, venue and surplus accounting** |
| Collateral release | Fake release transaction and close status | **SIMULATED** |
| Integration health | Provider list and status cards | **UI ONLY** |
| Portfolio KPIs and sample cases | Fixed counts and sample records | **UI ONLY / DEMO DATA** |
| Activity/audit feed | Local timestamped events | **CURRENTLY IMPLEMENTED UI; not immutable/audit-grade** |

### Demo policy and data—never present as approved terms

- Applicant: Alex Morgan; application `CRL-2026-001284`; $50K USDC request for business working capital.
- Starting collateral: 2 ETH at $50K each = $100K; 50% LTV; wallet balance 2.84 ETH.
- Assets: ETH 60% max LTV, BTC 55%, USDC 70%.
- Risk policy: `DEMO-RISK-2026.10`; 55% warning, 65% action, 75% liquidation; 9.5% annual rate; 1% origination fee; 12 confirmations.
- Offer A: 12 months, 9.5%, 1% fee, monthly interest, max 50% LTV.
- Offer B: 18 months, 8.9%, 1.25% fee, principal + interest, max 45% LTV.
- Offer C: 24 months, 10.25%, 0.75% fee, interest-only/principal at maturity, max 55% LTV.
- Accrued interest uses a simple annual formula with 18 seeded accrual days; it is not a production amortization/accounting engine.

### Simulated provider names in code

Persona Sandbox; ComplyAdvantage Demo; WalletConnect Mock; Alchemy Sandbox; Fireblocks Demo Vault; Chainlink Mock Feed; LF Vault Simulator; DocuSign Sandbox; Circle Sandbox; TRM Labs Demo; Twilio SendGrid Mock.

These are **demo labels, not vendor selections or functioning sandboxes**.

### Verification performed

- `npm test`: 1 test passed.
- `npm run build`: production bundle built successfully.
- `npm run lint`: completed without reported errors.

This verifies code health at prototype scale, not production security or functional integration.

---

## 14. Production Gaps

### Prototype → production conversion

| Prototype today | Production requirement |
|---|---|
| Browser `localStorage` application | Authenticated backend, durable database, encryption, tenancy, retention and access controls |
| UI-only back-office login | SSO/MFA/RBAC, segregation of duties, maker-checker, session and audit controls |
| Mock WalletConnect and fixed address | Real supported wallets or custodial account creation; signed challenge; approved networks |
| Hard-coded asset symbols | Governed asset/chain/contract registry; wrapped-asset distinction; exposure limits |
| Mock balance | Custody/RPC/indexer evidence, confirmations, provenance and reconciliation |
| Single editable mock price | Licensed primary + independent fallback, freshness, outlier and degraded-mode policy |
| Local LTV | Versioned risk service using eligible debt and haircutted collateral; continuous recomputation |
| Manual local PASS statuses | Real provider webhooks/APIs, evidence retention, retries and exception queues |
| Vault simulator | Qualified custodian integration or audited deployed contract; address allowlists |
| Fake blockchain transaction | Signed submission, nonce/replacement, pending/confirmed/failed/reorg states and finality |
| Circle demo funding reference | Lender-controlled USD rail, treasury approval, proof of funds and bank reconciliation |
| Simple principal reduction | Loan subledger allocations for principal, interest, fees, suspense, reversals and charge-offs |
| One-click simulated liquidation | Authority check, fresh prices, approvals, venue orders, partial fills, slippage, fee and surplus accounting |
| Fake release | Payoff quote, settlement finality, verified destination, dual approval and custody/chain reconciliation |
| Local activity feed | Tamper-evident audit evidence with actor, source, policy version and provider/transaction IDs |
| Demo controls | Test harness isolated from production and impossible to invoke in production |
| Basic unit test | Contract/integration/e2e/security/performance/chaos and economic-invariant coverage |

### Documentation vs implementation differences

| Topic | Project documentation | React implementation | Presentation treatment |
|---|---|---|---|
| Recommended MVP asset | BTC only | ETH default; BTC and USDC also enabled | State documents' BTC-only recommendation; label code as broad demo |
| Loan rail | USD first | USDC default and Circle Sandbox label | Say funding rail is undecided; recommend USD v1 |
| Custody | Regulated third party; no rehypothecation | Fireblocks Demo Vault + LF Vault Simulator labels | Simulated hybrid; no custodian selected |
| Smart contract | Avoid proprietary contract in baseline MVP | “Smart contract” simulator in UI | Simulation is not a deployed/audited contract |
| Prices | Multiple sources, fallback, freshness | One editable mock price | Production gap |
| Systems of record | LOS, servicing, crypto gateway, custody/chain and reconciliation boundaries | One browser state object | Proposed architecture, not current architecture |
| Traditional credit checks | Existing LF/Plaid/bureau capabilities discussed as reusable | No Plaid, bureau, FICO, DTI or income verification in this React app | Do not attribute base-blueprint features to the prototype |
| Liquidation | Human-controlled pilot with runbook | Local “simulate liquidation” button | UX proof only; operational mechanism missing |

---

## 15. Recommended Architecture

### CEO-level view

```text
Borrower / Partner / Operations Portals
                  │
       LendFoundry Experience + APIs
                  │
      ┌───────────┴───────────┐
      │                       │
  LOS / ORIGINATION       LSS/LMS / SERVICING
  application             loan subledger
  verification            schedules + accruals
  decisioning             payments + allocation
  offer + documents       delinquency + collections
  funding gate            payoff + closure
      │                       │
      └───────────┬───────────┘
                  │ versioned events / commands
        CRYPTO COLLATERAL CONTROL PLANE
  ┌────────────────────────────────────────────┐
  │ Crypto Gateway                            │
  │ wallet/custody adapters · asset registry  │
  │ deposit/release transaction state         │
  ├────────────────────────────────────────────┤
  │ Risk & Valuation                          │
  │ dual prices · haircuts · LTV/health       │
  │ thresholds · portfolio exposure           │
  ├────────────────────────────────────────────┤
  │ Chain Observation + Compliance            │
  │ RPC/indexer · finality · wallet screening │
  ├────────────────────────────────────────────┤
  │ Liquidation / Execution Adapter            │
  │ approvals · orders · fills · surplus      │
  ├────────────────────────────────────────────┤
  │ Event Ledger + Reconciliation              │
  │ LOS/LMS ↔ bank ↔ custodian ↔ chain        │
  └────────────────────────────────────────────┘
                  │
      Custodian | Banks | Price Sources
  Blockchain Analytics | RPC/Indexer | Venue
```

### Authority boundaries

- **LOS:** authoritative for application, verification evidence, underwriting decision, approved terms, documents and funding authorization.
- **Servicing layer:** authoritative for funded loan balance, schedules, accruals, payments, delinquency, payoff and closure.
- **Custodian / chain:** authoritative for asset control and settlement facts.
- **Valuation service:** authoritative for versioned price decision snapshots—not for raw market truth.
- **Reconciliation ledger:** records how external facts map to loan and accounting entries; it does not silently overwrite discrepancies.

### Design principles

- No PII on-chain.
- Idempotent commands and webhooks; explicit transaction state machines.
- Canonical asset identifiers, network IDs and destination allowlists.
- Two-person approval for sensitive custody, liquidation and release actions.
- At least two price paths and documented stale/outlier/degraded-mode behavior.
- Separate “observed,” “confirmed,” “reconciled,” and “accounted” states.
- Circuit breakers for price, RPC, custody, liquidity and reconciliation failures.
- Provider portability: adapters rather than provider logic embedded in LOS screens.
- 24/7 monitoring, runbooks and recovery objectives designed before launch.
- Baseline MVP uses no proprietary smart contract. If a contract is later added: independent audits, formal invariants, upgrade governance, timelock, pause design, bug bounty and key ceremony are required.

### Phased plan

1. **Phase 0 — decide:** borrower segment, lender/entity, approved states, funding, custody/control, asset, rail, risk policy and economics.
2. **Phase 1 — integration proof:** real read-only price, custodian/RPC sandbox, wallet screening, transaction/reconciliation model; no real money.
3. **Phase 2 — controlled pilot:** BTC/USD, capped exposures, third-party custody, manual approvals/liquidation, 24/7 runbook.
4. **Phase 3 — harden:** automation, redundancy, reconciliation scale, independent security assessment, partner reporting.
5. **Phase 4 — optional expansion:** more assets/rails or audited non-custodial vault as separately governed products.

---

## 16. Recommended 6–8 Slide Storyboard

### Recommendation: use all 8 slides

The required story spans market, mechanism, platform fit, competition, custody, economics and prototype proof. Eight concise slides are clearer than compressing unlike concepts into six.

### Slide 1 — Crypto Lending: Liquidity Without Selling

**Key message:** Crypto collateral becomes borrowing capacity; continuous LTV turns price volatility into an operational credit risk.

**Main visual:** `Crypto asset → controlled collateral → cash / stablecoin liquidity`, with a return arrow after repayment.

**On-slide copy:**

- Borrower pledges crypto; lender advances cash/stablecoin.
- Repay → collateral released. Price falls → top-up, repay or liquidation.
- **Illustrative:** $100K collateral × 50% LTV = $50K loan.
- **$43.41B outstanding** tracked CeFi + DeFi lending-app borrows at Q2 2026 end.

**Footer:** Galaxy, 30 Jun 2026; global outstanding balance, not TVL/revenue/U.S. TAM; possible double count.

### Slide 2 — One Loan, Five Control Gates

**Key message:** Crypto lending extends a familiar loan lifecycle with collateral-control and continuous-risk gates.

**Main visual:** five-stage workflow from Section 3, with a continuous monitoring loop under Secure/Fund and Service/Close.

**On-slide labels only:**

`Apply → Verify → Decide → Secure & Fund → Service & Close`

Under each, 2–3 micro-labels. End with branch: `Repay → Release` or `Threshold breach → Liquidate`.

**Speaker note:** the prototype represents all 18 detailed stages; production gates must fail closed.

### Slide 3 — A Large, Concentrated—and Cyclical—Market

**Key message:** category scale is real, but balances fell in Q2; the opportunity must be sized as software, not assumed loan-book share.

**Main visual:**

- Stacked bar: $22.98B CeFi + $20.43B DeFi apps = $43.41B.
- Side callout: broader $56.16B includes crypto-backed CDP stablecoins.
- Small DeFi donut, 6 Oct snapshot: Aave 39.7%, Morpho 17.0%, Compound 2.0%, others 41.3% of DefiLlama active loans.

**Supporting facts:** broader category -16.78% QoQ; top three tracked CeFi lenders 74.96%.

**Do not show:** CAGR from generic market-report vendors; “LendFoundry can win 1%.”

### Slide 4 — LendFoundry Core + Crypto Control Plane

**Key message:** most of the loan lifecycle is reusable; collateral control is the net-new product.

**Main visual:** two-layer architecture.

```text
LendFoundry: LOS + decisioning + compliance + offers/eSign + LSS/LMS
                              +
Crypto layer: custody/wallet + screening + price/LTV + chain + liquidation + recon
                              =
Enterprise crypto-backed lending platform
```

**Supporting facts:** LOS owns application-to-funding; servicing owns post-funding loan record; 90+ integration claim from LF official site. State: “Publicly verifiable LF market share not identified.”

### Slide 5 — Compete on Enterprise Lending; Adapt Crypto-Native Controls

**Key message:** DeFi wins on automation/transparency; CeFi wins on usability/support; LendFoundry can win on configurable enterprise lifecycle and partner choice.

**Main visual:** compact 5-column matrix: Aave, Compound, Nexo, Ledn, LF proposed. Rows: custody, product model, compliance, servicing/back office, main differentiator.

**Two callout boxes:**

- **Adapt:** wallet/health UX, real-time LTV, top-ups, transparent custody, automated evidence.
- **Build:** custody/chain gateway, dual pricing, wallet screening, liquidation, reconciliation, 24/7 operations.

### Slide 6 — Custody Is the First Architecture Decision

**Key message:** wallet connection does not equal non-custody; control after deposit defines the model.

**Main visual:** split screen.

- Custodial: borrower → qualified custodian → controlled release/sale.
- Non-custodial: borrower wallet → audited contract vault → on-chain release/liquidation.

**Center badge:** `Current prototype = SIMULATED HYBRID`.

**Recommendation strip:** `v1: third-party custody, BTC, USD, no rehypothecation, manual liquidation → later: audited smart-contract option if demand warrants`.

### Slide 7 — Economics: Monetize the Platform, Expose the Full Cost Stack

**Key message:** interest is lender economics; LendFoundry's base case is implementation + SaaS + usage + servicing.

**Main visual:** two mini-waterfalls.

```text
Lender/program: fees + spread/share − funding − loss/slippage − providers − operations
LendFoundry: implementation + subscription + usage + servicing − pass-throughs − support
```

**Public reference callouts:** Coinbase processing fee 2% first $250K / 1% above; Ledn 9.25%–11.49% APR snapshot and 2% admin fee. Label competitor terms and date.

**Footer:** proposed LF pricing and vendor cost are not established.

### Slide 8 — Prototype Proves the Journey; Production Requires the Control Plane

**Key message:** the UX and workflow are demonstrable; capital, custody, compliance and execution remain to be built and contracted.

**Main visual:** three-column maturity path.

| PROVEN IN PROTOTYPE | NEXT: REAL INTEGRATIONS | PILOT / PRODUCTION GATES |
|---|---|---|
| Borrower + ops portals | KYC/AML + wallet screening | Legal/state/entity approval |
| 18-stage workflow | Custodian + bank rail | Lender + funding partner |
| LTV/risk/offer UX | Dual price + RPC/indexer | Security assessment + runbooks |
| Monitoring + repay/release UX | Servicing ledger + reconciliation | Crash/liquidation drills + caps |

**Decision ask:** authorize Phase 0 discovery and vendor/partner RFIs—not a production build.

### Optional 6-slide cut

If constrained to six slides: combine Slides 3 + 4 as “Market & LendFoundry Opportunity”; combine Slides 5 + 6 as “Competitive Model & Custody Choice.” Keep economics and prototype/roadmap separate.

---

## 17. Visual Assets Required

| Slide | Asset | Creation guidance |
|---|---|---|
| 1 | Collateral-to-liquidity hero | Simple vector; BTC/crypto token enters a secure vault, USD/USDC exits; no photorealistic coins |
| 2 | Five-gate lifecycle | Horizontal icons with continuous-monitoring loop and repay/release vs liquidation branch |
| 3 | Market stacked bar + share donut | Build from exact, dated data in this pack; visually separate Galaxy quarter-end and DefiLlama current snapshot |
| 3/5 | Competitor logos | Use official brand assets only; logos are identifiers, not endorsements |
| 4 | Two-layer architecture | Existing LF layer in navy; net-new crypto control plane in teal/orange; external partners in gray |
| 5 | Competitor matrix | Use check/partial/new icons, not dense paragraphs; maximum five columns |
| 6 | Custodial vs non-custodial | Make post-deposit control visually explicit; add “simulated hybrid” marker for current prototype |
| 7 | Unit economics | Formula/waterfall without invented dollar values; competitor terms as small dated callouts |
| 8 | Prototype screenshots | Capture current app: landing/position, borrower workflow, back-office verification, loan monitoring and liquidation/release state |

### Screenshot rules

- Re-capture the current crypto prototype at consistent 16:9 browser dimensions.
- Add a visible `SIMULATED` watermark and crop out demo credentials/PII-like test data where unnecessary.
- Do not use the `crypto-prototype/report` screenshots as proof of the crypto prototype: inspected examples show the traditional NEIF financing application and LendFoundry offer flow, useful only as heritage/reference imagery.
- Prefer four cropped screens in a single storyboard over a full-page unreadable screenshot.

### Visual language

- Navy = existing LendFoundry capability.
- Teal/green = healthy collateral and reusable capability.
- Amber = extension / warning.
- Red = liquidation/security/regulatory gate.
- Gray with dashed border = proposed/external dependency.
- Solid border = implemented; dotted border = simulated; plus icon = net new.

---

## 18. External Sources

### Market and share evidence

| Source | Publication / access date | Metric and number | Meaning | Slide |
|---|---|---|---|---|
| [Galaxy Research — State of Crypto Leverage Q2 2026](https://www.galaxy.com/insights/research/crypto-leverage-report-q2-2026-defi-lending-decline-futures-open-interest) | 17 Aug 2026; figures 30 Jun | CeFi $22.98B; DeFi apps $20.43B; combined $43.41B; broader incl. CDP $56.16B; broader -16.78% QoQ | Global outstanding borrows; warns of possible double counting | 1, 3 |
| Same Galaxy report | 17 Aug 2026 | CeFi shares: Tether 58.54%, Maple 8.91%, Nexo 7.51%; top three 74.96% | Share of Galaxy's tracked CeFi loan books, not U.S. retail share | 3 |
| [DefiLlama Active Loans](https://defillama.com/active-loans) | Accessed 6 Oct 2026 | Total $33.109B; Aave $13.147B; Morpho $5.627B; Compound $0.668B | Live protocol active-loan snapshot; not TVL | 3 |

### LendFoundry evidence

| Source | Publication / access date | Claim | Meaning | Slide |
|---|---|---|---|---|
| [LendFoundry API welcome](https://developers.lendfoundry.com/reference/welcome-to-lendfoundry-api) | Accessed 6 Oct 2026 | LOS application-to-approval; LMS servicing, payments, accounting, collections | Official lifecycle boundary/capabilities | 4 |
| [LendFoundry LMS overview](https://developers.lendfoundry.com/docs/overview) | Accessed 6 Oct 2026 | Funding is LOS/LMS delineation; LMS records schedules, payments, delinquencies, closures | Source for mapping | 4 |
| [LendFoundry LOS](https://lendfoundry.com/solutions/loan-origination-software/) | Accessed 6 Oct 2026 | LOS manages application through approval/funding; servicing covers post-funding | Public product terminology | 4 |
| [LendFoundry embedded lending](https://lendfoundry.com/embedded-lending-platform/) and [onboarding](https://lendfoundry.com/solutions/loan-servicing-software/loan-onboarding/) | Accessed 6 Oct 2026 | API-first/cloud-native positioning; 90+ ready integrations claim | Capability proxy, not market share | 4 |

### Competitor mechanics and pricing

| Source | Publication / access date | Metric / claim | Meaning | Slide |
|---|---|---|---|---|
| [Aave V3 introduction](https://aave.com/help/aave-101/introduction-to-aave) | Accessed 6 Oct 2026 | Self-custodial wallets, permissionless smart contracts, overcollateralized borrowing, utilization-based rates | DeFi operating model | 5, 6 |
| [Aave FAQ](https://aave.com/faq) | Accessed 6 Oct 2026 | HF <1 liquidatable; up to 50% or 100% debt depending on health/size; asset-specific bonus | Health and liquidation design | 5 |
| [Compound liquidation docs](https://docs.compound.finance/liquidation/) | Accessed 6 Oct 2026 | Separate borrow/liquidation factors; `absorb`; reserves acquire and sell collateral | Alternative liquidation design | 5 |
| [Coinbase loan introduction](https://help.coinbase.com/en-gb/coinbase/trading-and-funding/loan/loan-intro) | Accessed 6 Oct 2026 | Morpho on Base; variable market rate + Coinbase fee; processing fee; no fixed term/minimum payment; sponsored gas | Embedded DeFi UX | 5, 7 |
| [Coinbase processing fee](https://help.coinbase.com/en/coinbase/trading-and-funding/loan/fee) | Accessed 6 Oct 2026 | 2% first $250K, 1% above; fee capitalized into principal | Public fee reference | 7 |
| [Nexo borrow](https://nexo.com/borrow) | Accessed 6 Oct 2026 | From 1.9%; BTC/ETH 50% LTV; stablecoins 90%; 100+ assets; $50–$2M | Current marketing terms; tier/jurisdiction-dependent | 5, 7 |
| [Ledn homepage](https://www.ledn.io/) | Accessed 6 Oct 2026; attestation 1 Sep | $757M outstanding; $11.5B lifetime funded; 46% average LTV; 9.25%–11.49% APR; qualified custodian | CeFi scale and product reference | 5, 7 |
| [Ledn Dollar Loan](https://help.ledn.io/hc/en-us/articles/28282750963607-What-is-a-Dollar-Loan) | 10 Sep 2026 | Typical 50% LTV; 12 months; 2% admin fee | Product and fee benchmark | 5, 7 |
| [Ledn collateral-decline workflow](https://help.ledn.io/hc/en-us/articles/28302717485079-What-Happens-If-the-value-of-your-collateral-significantly-decreases) | 1 Oct 2026 | Alerts 70%/75%; auto liquidation 80%; 0.50% trade spread | Monitoring/liquidation UX benchmark | 5, 7 |
| [Unchained collateral model](https://help.unchained.com/what-is-loan-collateral-and-what-does-unchained-do-with-it) | Accessed 6 Oct 2026 | BTC-only, segregated 2-of-3 multisig, no rehypothecation | Hybrid/collaborative custody reference | 6 |

### Compliance and tax design sources

| Source | Date | Claim | Use |
|---|---|---|---|
| [FinCEN CVC guidance](https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering) | 18 Mar 2013; current official page accessed 6 Oct 2026 | Administrators/exchangers accepting/transmitting or buying/selling CVC can be money transmitters absent exception | Role/funds-flow analysis |
| [OFAC FAQ 560](https://ofac.treasury.gov/faqs/560) | 19 Mar 2018; accessed 6 Oct 2026 | Sanctions obligations apply to digital and fiat transactions; risk-based controls expected | Sanctions and wallet/transaction screening |
| [NYDFS virtual-currency licensing](https://www.dfs.ny.gov/virtual_currency_businesses) | Accessed 6 Oct 2026 | Custody/control, transmission, exchange and other activities can require authorization in New York | State/product/entity design |
| [NYDFS custodial structures](https://www.dfs.ny.gov/industry-guidance/industry-letters/il20250930-updated-guidance-custodial-structures) | 30 Sep 2025 | Separate accounting/segregation and on-chain/book reconciliation expected for regulated custodians | Custody and reconciliation controls |
| [IRS digital-asset FAQs](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-digital-asset-transactions) | Updated 15 Dec 2025 | Digital assets treated as property; sales can create gain/loss | Careful “borrow vs sell” wording |

### Source cautions

- Product terms and live balances can change; re-check immediately before the final deck is generated.
- Competitor pages are first-party marketing or help content, not independent assurance.
- DefiLlama values are live and methodology-specific.
- Galaxy combines sources with varying disclosure quality and explicitly flags possible double counting.
- No reliable public LendFoundry market share was identified.

---

## 19. Assumptions

1. Research cut-off is **6 October 2026**; market data carries its own dated snapshot.
2. The recommended product is **platform-led lender enablement**, not LendFoundry lending its own capital.
3. A **U.S.-first** exploration is assumed because the supplied research asks about the U.S.; state coverage is not established.
4. Business-purpose borrowers are a stronger initial hypothesis than consumer lending, but the segment is not approved and business-purpose status does not remove all legal obligations.
5. BTC/USD/third-party-custody/no-rehypothecation is a recommendation from the internal documents—not a committed product decision.
6. All prototype borrower identities, prices, balances, terms, transactions, provider responses and portfolio counts are fictional demo data.
7. The code's ETH/BTC/USDC support is a UI demonstration, not an approved asset list.
8. The prototype has no production smart contract; the vault is a simulation.
9. Galaxy's $43.41B is global outstanding borrowing and may double count some CeFi borrowing through DeFi; it is not U.S. TAM or software revenue.
10. Current protocol balances and shares use DefiLlama's active-loans definition, not TVL.
11. Any percentage-based market capture shown is a scale illustration, not a forecast.
12. Rates, fees, thresholds and jurisdictions vary and must be validated at launch.
13. The term “qualified custodian” and the legal characterization of control require counsel and provider diligence for the selected structure.
14. No source establishes actual prospective-customer demand, willingness to pay, approved budget, or delivery estimate.

---

## 20. Open Questions for Technical Leadership

### Business and legal

1. Is LendFoundry only the software provider, or also program manager, lender, servicer, collateral agent, funds mover, or liquidation decision-maker?
2. Is the first borrower a business, consumer, institution, miner, or crypto-native treasury—and what is the permitted loan purpose?
3. Which U.S. states, entities and licensing/partner structures are in scope?
4. Which lender supplies capital, and who owns credit/liquidation loss?
5. What annual contract value and implementation model would justify 24/7 product obligations?

### Product and risk

6. BTC only or multiple assets? USD, USDC, or both? One network or several?
7. What are approved initial LTV, warning, cure, liquidation and concentration limits—and who can change them?
8. Is rehypothecation prohibited? What segregation, proof and insolvency protections are required?
9. What is the cure period during fast markets? Partial or full liquidation? Who receives surplus?
10. Are credit bureau/income/cash-flow checks needed in addition to collateral for the chosen segment?

### Architecture and operations

11. Custodial, collaborative multisig, non-custodial contract, or multiple separately governed products?
12. Which system is authoritative for loan debt, collateral quantity/control, price snapshots, accounting and customer-visible status?
13. Which custody, price, blockchain analytics, RPC/indexer, bank and execution providers enter the RFI?
14. What are finality, reorg, stale-price, outage, duplicate-webhook and reconciliation-break policies?
15. Does v1 require a smart contract? If yes, who owns upgrade/admin keys, pause authority, audits and incident response?
16. Who operates the 24/7 risk desk, and what are alert-to-decision and decision-to-execution service levels?
17. What exposure caps and real-money pilot limits define a safe launch?
18. What are the go/no-go metrics: design partners, economics, reconciliation accuracy, price freshness, liquidation time, exceptions and loss tolerance?

### Recommended immediate decision

Authorize a **Phase 0 validation package**, not a production build:

- 5–8 lender/custodian/crypto-finance interviews and at least one design partner.
- Counsel-produced role/funds-flow/state-product matrix.
- RFI for custody, screening, price, RPC/indexing and liquidation/execution.
- Bottom-up software and lender unit economics with vendor quotes.
- Architecture threat model and crash/liquidation tabletop.
- Technical proof using real sandbox/read-only data and full reconciliation, with no real-money lending.

**Decision gate:** proceed to a capped pilot only when the lender, funding, custody/control, legal path, liquidation authority, economics and 24/7 operating ownership are all explicit.

