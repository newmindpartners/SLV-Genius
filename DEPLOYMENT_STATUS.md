# SLV-Genius Deployment Status & Next Steps

## ✅ Completed Setup

### 1. **Deployment Configuration Files Created**
- ✅ `DEPLOYMENT_GUIDE.md` - Comprehensive step-by-step guide
- ✅ `deploy-to-cloud.sh` - Automated deployment script
- ✅ `verify-deployment.sh` - Verification script
- ✅ `backend-dex-api-server-feature-two-way-orders/render.yaml` - Render cloud config
- ✅ `backend-dex-api-server-feature-two-way-orders/railway.json` - Railway cloud config
- ✅ All files committed to GitHub

### 2. **Frontend Already Deployed**
- ✅ Netlify site: https://slv-genius.netlify.app
- ✅ Site ID: `9c08589d-1f89-433f-a70c-967457d36436`
- ✅ Authentication token configured

### 3. **Project Structure Verified**
- ✅ Backend: Node.js/TypeScript with Fastify, Prisma, Redis
- ✅ Frontend: React/Vite with Redux, connects via `VITE_API_URL`
- ✅ Smart Contract: Aiken-based order validators for two-way orders

## 🚀 Next Steps - Deploy to Cloud

### Step 1: Deploy Backend API (Choose One Method)

#### Option A: Railway (Recommended - Easiest)
```bash
cd backend-dex-api-server-feature-two-way-orders
railway login
railway init
railway add postgresql
railway add redis
railway variables set NODE_ENV=production
railway variables set CARDANO_NETWORK=preprod
railway variables set CORS_ORIGIN=https://slv-genius.netlify.app
railway up
```
**Get your API URL from Railway dashboard** (e.g., `https://slv-genius-api.railway.app`)

#### Option B: Render (Free Tier Available)
1. Go to https://render.com
2. Create PostgreSQL database → Copy connection string
3. Create Redis instance → Copy connection string
4. Create Web Service:
   - Connect GitHub repo: `SLV-Genius`
   - Root Directory: `backend-dex-api-server-feature-two-way-orders`
   - Build: `yarn install && yarn build`
   - Start: `yarn start`
   - Health Check: `/health`
5. Add environment variables (see `DEPLOYMENT_GUIDE.md`)

#### Option C: Use Automated Script
```bash
./deploy-to-cloud.sh
```
Follow the interactive prompts.

### Step 2: Update Frontend to Use Cloud API

Once you have your backend API URL:

```bash
cd Front-end-dex-client-feat-two-way-orders

# Set environment variables in Netlify
netlify env:set VITE_API_URL https://your-api-url.railway.app --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c
netlify env:set VITE_CARDANO_NETWORK preprod --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c

# Rebuild and deploy
yarn build
netlify deploy --prod --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c --site 9c08589d-1f89-433f-a70c-967457d36436
```

### Step 3: Deploy Smart Contract to Testnet

**Prerequisites:**
- Install Aiken compiler
- Install Cardano CLI
- Set up preprod testnet node (or use Blockfrost API)

**Steps:**
1. Compile contract:
```bash
cd "Smart contract"
aiken build
```

2. Deploy using Cardano CLI (see `DEPLOYMENT_GUIDE.md` for detailed instructions)

3. Record:
   - Reference script UTxO
   - Policy ID
   - Validator hashes

4. Update backend configuration with these values

### Step 4: Run Database Migrations

After backend is deployed:

```bash
# SSH into your cloud service or use Railway/Render shell
cd backend-dex-api-server-feature-two-way-orders
yarn prisma migrate deploy
```

### Step 5: Verify Everything Works

Run verification script:
```bash
./verify-deployment.sh
```

Or manually check:
1. **Backend Health**: `curl https://your-api-url/health`
2. **Frontend**: Visit https://slv-genius.netlify.app
3. **Test Two-Way Order**:
   - Connect wallet (Nami, Eternl)
   - Select trading pair
   - Place two-way order
   - Verify on-chain via Cardano explorer

## 📋 Environment Variables Checklist

### Backend (Cloud Provider)
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (from PostgreSQL service)
- [ ] `REDIS_URL` (from Redis service)
- [ ] `CARDANO_NETWORK=preprod`
- [ ] `CORS_ORIGIN=https://slv-genius.netlify.app`
- [ ] `JWT_SECRET` (generate secure random string)
- [ ] `APP_PORT=3000` (or provider's port)

### Frontend (Netlify)
- [ ] `VITE_API_URL` (your backend URL)
- [ ] `VITE_CARDANO_NETWORK=preprod`

## 🔍 Troubleshooting

### Backend Issues
- **Database connection fails**: Verify `DATABASE_URL` format and network access
- **Redis connection fails**: Check `REDIS_URL` and authentication
- **API not responding**: Check logs, verify port configuration

### Frontend Issues
- **Blank page**: Check browser console, verify `VITE_API_URL` is set
- **API calls fail**: Check CORS configuration, verify backend is running
- **Build errors**: Check Netlify build logs

### Smart Contract Issues
- **Transaction fails**: Verify sufficient ADA for fees, check validator script
- **Reference script not found**: Ensure UTxO exists and is correctly referenced

## 📚 Documentation

- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Deployment Script**: `deploy-to-cloud.sh`
- **Verification Script**: `verify-deployment.sh`
- **Backend Docs**: `backend-dex-api-server-feature-two-way-orders/docs/`
- **Frontend Docs**: `Front-end-dex-client-feat-two-way-orders/README.md`

## 🎯 Quick Start Commands

```bash
# Deploy backend to Railway
cd backend-dex-api-server-feature-two-way-orders
railway login && railway init && railway add postgresql && railway add redis
railway variables set NODE_ENV=production CARDANO_NETWORK=preprod
railway up

# Update frontend
cd ../Front-end-dex-client-feat-two-way-orders
netlify env:set VITE_API_URL $(railway domain) --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c
yarn build && netlify deploy --prod --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c --site 9c08589d-1f89-433f-a70c-967457d36436

# Verify
./verify-deployment.sh
```

## 📞 Support

If you encounter issues:
1. Check deployment logs in your cloud provider dashboard
2. Review `DEPLOYMENT_GUIDE.md` for detailed instructions
3. Verify all environment variables are set correctly
4. Test locally first with `docker-compose up`

---

**Status**: Ready for cloud deployment! 🚀
**Last Updated**: $(date)

