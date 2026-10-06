# LendFoundry Crypto Studio Prototype

A presentation-ready React prototype for a crypto-backed lending journey. It preserves the LF Express loan lifecycle and extends it with simulated wallet, collateral, valuation, blockchain, monitoring, repayment, liquidation, and release capabilities.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run lint
```

## Demo journey

The two portals are intentionally separated:

- Borrower portal: `http://localhost:5173/`
- Lending back office: `http://localhost:5173/backoffice`
- Back-office username: `operations@lendfoundry.com`
- Back-office password: `Demo@123`

Start from the borrower landing page and use the pre-filled Alex Morgan application. Verification approvals, risk/program decisions, offer generation, blockchain confirmation, rejection, and funding are performed from the back office. Borrower actions include application submission, wallet connection, offer selection, e-sign, collateral authorization, monitoring, repayment, and release.

The **Demo controls** drawer can simulate provider outcomes and Healthy, Warning, Action Required, or Liquidation Eligible market states.

## Important

This is a frontend-only concept prototype. All people, policies, thresholds, provider responses, signatures, transactions, balances, market data, funding, repayments, and blockchain activity are fictional simulations. Nothing in the prototype is a production lending rule or a legally binding financial action.
