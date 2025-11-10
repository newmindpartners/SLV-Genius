# SLV-Genius Deployment Guide - Testnet & Cloud

This guide provides step-by-step instructions for deploying the complete SLV-Genius stack to testnet and cloud.

## Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose
- Aiken compiler (for smart contracts)
- Cardano CLI (for testnet deployment)
- Render account (or alternative: Railway, Fly.io)
- Netlify account (already configured)

## Step 1: Smart Contract Deployment to Testnet

### 1.1 Install Aiken
```bash
# Option 1: Direct download
curl -L https://github.com/aiken-lang/aiken/releases/latest/download/aiken-x86_64-apple-darwin.tar.gz | tar -xz
sudo mv aiken /usr/local/bin/

# Option 2: Via Cargo (if Rust is installed)
cargo install aiken --git https://github.com/aiken-lang/aiken --tag v1.0.0
```

### 1.2 Compile Smart Contract
```bash
cd "Smart contract"
aiken build
```

### 1.3 Deploy to Cardano Preprod Testnet

**Note:** The smart contract uses reference scripts and requires:
- Configuration datum with fee addresses
- NFT policy ID for order tracking
- Fill and cancel validator hashes

**Deployment Steps:**
1. Set up Cardano CLI with preprod testnet:
```bash
export CARDANO_NODE_SOCKET_PATH=/path/to/preprod-node.socket
export MAGIC="--testnet-magic 1"  # Preprod magic number
```

2. Create deployment transaction:
```bash
# Build the validator
aiken build

# Get the compiled script
VALIDATOR_SCRIPT="plutus.json"  # Output from aiken build

# Create reference script UTxO
cardano-cli transaction build \
  --testnet-magic 1 \
  --tx-in <funding-utxo> \
  --tx-out <config-address>+2000000 \
  --tx-out-reference-script-file $VALIDATOR_SCRIPT \
  --change-address <your-address> \
  --out-file tx.unsigned

# Sign and submit
cardano-cli transaction sign --tx-body-file tx.unsigned --signing-key-file payment.skey --testnet-magic 1 --out-file tx.signed
cardano-cli transaction submit --testnet-magic 1 --tx-file tx.signed
```

3. Record the reference script UTxO and policy ID for backend configuration.

## Step 2: Backend API Deployment to Cloud

### 2.1 Prepare Environment Variables

Create `.env.production` in `backend-dex-api-server-feature-two-way-orders/`:
```env
NODE_ENV=production
APP_PORT=3000
CARDANO_NETWORK=preprod
DATABASE_URL=<from-cloud-provider>
REDIS_URL=<from-cloud-provider>
CORS_ORIGIN=https://slv-genius.netlify.app
JWT_SECRET=<generate-secure-random-string>
```

### 2.2 Deploy to Render

1. **Create Render Account**: Go to https://render.com and sign up

2. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Name: `slv-genius-db`
   - Plan: Free tier (or paid for production)
   - Copy connection string to `DATABASE_URL`

3. **Create Redis Instance**:
   - New → Redis
   - Name: `slv-genius-redis`
   - Plan: Free tier
   - Copy connection string to `REDIS_URL`

4. **Deploy Web Service**:
   - New → Web Service
   - Connect GitHub repository: `SLV-Genius`
   - Root Directory: `backend-dex-api-server-feature-two-way-orders`
   - Build Command: `yarn install && yarn build`
   - Start Command: `yarn start`
   - Environment Variables: Add all from `.env.production`
   - Health Check Path: `/health`

5. **Run Database Migrations**:
   ```bash
   # SSH into Render service or use Render Shell
   yarn prisma migrate deploy
   ```

### 2.3 Alternative: Deploy to Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
railway login
```

2. Initialize project:
```bash
cd backend-dex-api-server-feature-two-way-orders
railway init
railway add postgresql
railway add redis
```

3. Set environment variables:
```bash
railway variables set NODE_ENV=production
railway variables set CARDANO_NETWORK=preprod
railway variables set CORS_ORIGIN=https://slv-genius.netlify.app
```

4. Deploy:
```bash
railway up
```

### 2.4 Verify Backend Deployment

```bash
# Check health endpoint
curl https://your-api-url.render.com/health

# Should return: {"status":"ok"}
```

## Step 3: Frontend Deployment Update

### 3.1 Update API URL

The frontend needs to point to the cloud API:

1. **For Netlify Deployment**:
```bash
cd Front-end-dex-client-feat-two-way-orders

# Set environment variable in Netlify
netlify env:set VITE_API_URL https://your-api-url.render.com
netlify env:set VITE_CARDANO_NETWORK preprod

# Rebuild and deploy
yarn build
netlify deploy --prod
```

2. **Or update `vite.config.ts`** to use environment variables:
```typescript
export default defineConfig(({ mode }) => ({
  // ... existing config
  define: {
    'process.env': {
      NODE_ENV: mode,
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || 'https://your-api-url.render.com'),
      VITE_CARDANO_NETWORK: JSON.stringify(process.env.VITE_CARDANO_NETWORK || 'preprod'),
    },
  },
}));
```

### 3.2 Verify Frontend

1. Visit https://slv-genius.netlify.app
2. Open browser console (F12)
3. Check Network tab - API calls should go to cloud backend
4. Test wallet connection
5. Test two-way order placement

## Step 4: End-to-End Verification

### 4.1 Test Smart Contract Integration

1. **Place Two-Way Order**:
   - Connect wallet (Nami, Eternl, or similar)
   - Select trading pair (e.g., ADA/GENS)
   - Set buy limit: 100 tokens at 0.10 ADA
   - Set sell limit: 50 tokens at 0.15 ADA
   - Submit order

2. **Verify On-Chain**:
   - Check Cardano testnet explorer (preprod.cardanoscan.io)
   - Find transaction with order NFT mint
   - Verify order appears in order book

3. **Test Order Filling**:
   - Place matching order from another wallet
   - Verify partial/full fill executes
   - Check balances update correctly

### 4.2 Monitor Logs

**Backend Logs (Render)**:
- Dashboard → Service → Logs
- Check for errors, API requests, transaction submissions

**Frontend Logs (Netlify)**:
- Dashboard → Site → Deploys → Build logs
- Check for build errors

**Smart Contract**:
- Monitor Cardano testnet for transaction failures
- Check validator script execution

## Step 5: Production Checklist

- [ ] Smart contract deployed to testnet
- [ ] Reference script UTxO recorded
- [ ] Backend API deployed and healthy
- [ ] Database migrations completed
- [ ] Redis connected and working
- [ ] Frontend pointing to cloud API
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] Two-way orders working end-to-end
- [ ] Error monitoring (Sentry) configured
- [ ] Logs accessible and monitored

## Troubleshooting

### Backend Issues

**Database Connection Failed**:
- Verify `DATABASE_URL` format
- Check database is running
- Verify network access from Render service

**Redis Connection Failed**:
- Verify `REDIS_URL` format
- Check Redis instance is running
- Verify password/auth if required

**API Not Responding**:
- Check service logs in Render dashboard
- Verify `APP_PORT` matches Render's port (usually 10000)
- Check health endpoint: `/health`

### Frontend Issues

**Blank Page**:
- Check browser console for errors
- Verify API URL is correct
- Check CORS headers from backend
- Verify environment variables in Netlify

**API Calls Failing**:
- Check Network tab in browser DevTools
- Verify backend is running
- Check CORS configuration

### Smart Contract Issues

**Transaction Fails**:
- Verify sufficient ADA for fees
- Check validator script is correct
- Verify reference script UTxO exists
- Check configuration datum is valid

## Support

For issues or questions:
- Check project documentation in `/docs`
- Review deployment logs
- Test locally first with `docker-compose up`

