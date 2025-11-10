#!/bin/bash
# SLV-Genius Cloud Deployment Script
# This script helps deploy the full stack to testnet and cloud

set -e

echo "======================================================"
echo " SLV-Genius Cloud Deployment"
echo "======================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Smart Contract Deployment
echo -e "${YELLOW}Step 1: Smart Contract Deployment${NC}"
echo "Note: Smart contract deployment requires Cardano CLI setup"
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""

# Step 2: Backend Deployment Options
echo -e "${YELLOW}Step 2: Choose Backend Deployment Method${NC}"
echo "1. Railway (Recommended - Easy setup)"
echo "2. Render (Free tier available)"
echo "3. Manual Docker deployment"
echo ""
read -p "Select option (1-3): " backend_option

case $backend_option in
  1)
    echo -e "${GREEN}Deploying to Railway...${NC}"
    cd backend-dex-api-server-feature-two-way-orders
    
    if ! command -v railway &> /dev/null; then
      echo "Installing Railway CLI..."
      npm install -g @railway/cli
    fi
    
    echo "Please login to Railway:"
    railway login
    
    echo "Initializing Railway project..."
    railway init
    
    echo "Adding PostgreSQL database..."
    railway add postgresql
    
    echo "Adding Redis..."
    railway add redis
    
    echo "Setting environment variables..."
    railway variables set NODE_ENV=production
    railway variables set CARDANO_NETWORK=preprod
    railway variables set CORS_ORIGIN=https://slv-genius.netlify.app
    
    echo "Deploying..."
    railway up
    
    echo -e "${GREEN}Backend deployed! Get your API URL from Railway dashboard${NC}"
    ;;
  2)
    echo -e "${GREEN}Deploying to Render...${NC}"
    echo "1. Go to https://render.com"
    echo "2. Create PostgreSQL database (name: slv-genius-db)"
    echo "3. Create Redis instance (name: slv-genius-redis)"
    echo "4. Create Web Service:"
    echo "   - Connect GitHub repo: SLV-Genius"
    echo "   - Root Directory: backend-dex-api-server-feature-two-way-orders"
    echo "   - Build Command: yarn install && yarn build"
    echo "   - Start Command: yarn start"
    echo "   - Health Check: /health"
    echo "5. Add environment variables from .env.production"
    echo ""
    echo "See render.yaml for configuration reference"
    ;;
  3)
    echo -e "${GREEN}Manual Docker Deployment${NC}"
    echo "Build and push Docker image, then deploy to your cloud provider"
    echo "See Dockerfile in backend-dex-api-server-feature-two-way-orders/"
    ;;
esac

# Step 3: Frontend Update
echo ""
echo -e "${YELLOW}Step 3: Update Frontend API URL${NC}"
read -p "Enter your backend API URL (e.g., https://api.slv-genius.railway.app): " api_url

if [ -n "$api_url" ]; then
  cd Front-end-dex-client-feat-two-way-orders
  
  echo "Setting Netlify environment variables..."
  netlify env:set VITE_API_URL "$api_url" --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c
  netlify env:set VITE_CARDANO_NETWORK preprod --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c
  
  echo "Rebuilding frontend..."
  yarn build
  
  echo "Deploying to Netlify..."
  netlify deploy --prod --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c --site 9c08589d-1f89-433f-a70c-967457d36436
  
  echo -e "${GREEN}Frontend deployed!${NC}"
fi

# Step 4: Verification
echo ""
echo -e "${YELLOW}Step 4: Verification${NC}"
echo "1. Check backend health: curl $api_url/health"
echo "2. Visit frontend: https://slv-genius.netlify.app"
echo "3. Test wallet connection"
echo "4. Test two-way order placement"
echo ""
echo -e "${GREEN}Deployment complete!${NC}"

