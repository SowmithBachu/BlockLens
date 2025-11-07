# BlockLens

BlockLens is a Solana-focused portfolio dashboard built with Next.js 16 and the Solana Wallet Adapter. It lets you monitor devnet balances, organise multiple wallets, request airdrops, and estimate transaction fees without leaving the browser.

## Features

- **Interactive dashboard**
  - Portfolio summary with live SOL → USD conversion using devnet prices.
  - Manage tracked wallets locally (search, export CSV, remove, copy addresses).
  - Connected wallet panel with friendly naming, balance refresh, and devnet airdrop helper that gracefully handles rate limiting.
- **Gas fee calculator (`/gasfee`)**
  - Fetches current base and prioritisation fees from the Solana network.
  - Provides preset estimates for common transaction types (simple transfer, token transfer, DEX swap, NFT transfer, smart contract call).
  - Custom calculator to estimate total cost for any number of transactions.
- **Transaction insights**
  - API endpoint for recent transaction history with signature, amount, type inference, and status.
- **API surface**
  - `GET /api/fees` – current network fee data.
  - `POST /api/wallets/transactions` – recent signatures and transaction classification.
  - `POST /api/wallets/airdrop` – devnet airdrop helper with automatic retry and faucet fallback.
  - `POST /api/wallets/sync` – balance, token, and NFT metadata sync for tracked wallets.

## Tech stack

- Next.js 16 (App Router)
- React 19
- Solana Wallet Adapter (`@solana/wallet-adapter-react`, `@solana/web3.js`)
- Tailwind CSS 4 (via `@tailwindcss/postcss`)

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   The app becomes available at [http://localhost:3000](http://localhost:3000).

3. **Optional configuration**
   - `NEXT_PUBLIC_RPC_URL` – override the default Solana devnet RPC endpoint.

> **Note:** The airdrop helper targets Solana devnet. If the faucet rejects repeated requests (HTTP 429), the app offers to open the official Solana faucet so you can top up manually.

## Available scripts

| Command        | Description                     |
|----------------|---------------------------------|
| `npm run dev`  | Start the development server.   |
| `npm run build`| Create a production build.      |
| `npm run start`| Launch the production server.   |
| `npm run lint` | Run ESLint across the project.  |

## Project structure (highlights)

```
app/
  page.tsx                # Landing page
  dashboard/page.tsx      # Main wallet dashboard
  gasfee/page.tsx         # Gas fee calculator
  api/
    fees/route.ts         # Current fee data
    wallets/
      airdrop/route.ts    # Devnet airdrop helper
      transactions/route.ts
      sync/route.ts
components/
  Navbar.tsx
  AddWalletDialog.tsx
lib/
  wallet.tsx              # Wallet context provider
```

## Deployment

BlockLens is a standard Next.js 16 App Router project and can be deployed to any Node.js-compatible platform. For the quickest setup, use [Vercel](https://vercel.com) and add any required environment variables in the dashboard.
