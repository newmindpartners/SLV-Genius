#!/bin/bash
# Verification script for SLV-Genius deployment

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "======================================================"
echo " SLV-Genius Deployment Verification"
echo "======================================================"

# Check 1: Backend Health
echo -e "\n${YELLOW}1. Checking Backend API...${NC}"
read -p "Enter backend API URL (e.g., https://api.slv-genius.railway.app): " api_url

if [ -n "$api_url" ]; then
  health_response=$(curl -s "$api_url/health" || echo "FAILED")
  if [[ "$health_response" == *"ok"* ]] || [[ "$health_response" == *"status"* ]]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
  else
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo "Response: $health_response"
  fi
else
  echo -e "${YELLOW}⚠ Skipping backend check (no URL provided)${NC}"
fi

# Check 2: Frontend
echo -e "\n${YELLOW}2. Checking Frontend...${NC}"
frontend_url="https://slv-genius.netlify.app"
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$frontend_url" || echo "000")

if [ "$frontend_status" == "200" ]; then
  echo -e "${GREEN}✓ Frontend is accessible${NC}"
  echo "URL: $frontend_url"
else
  echo -e "${RED}✗ Frontend returned status: $frontend_status${NC}"
fi

# Check 3: Environment Variables
echo -e "\n${YELLOW}3. Checking Netlify Environment Variables...${NC}"
netlify_vars=$(netlify env:list --auth nfp_jMfNLRhW4Y39i35FGgz9efCKggH6JDz2ab4c --site 9c08589d-1f89-433f-a70c-967457d36436 2>&1 || echo "")

if [[ "$netlify_vars" == *"VITE_API_URL"* ]]; then
  echo -e "${GREEN}✓ VITE_API_URL is set${NC}"
  echo "$netlify_vars" | grep VITE_API_URL
else
  echo -e "${YELLOW}⚠ VITE_API_URL not found in Netlify env vars${NC}"
fi

# Check 4: Smart Contract (if Cardano CLI available)
echo -e "\n${YELLOW}4. Smart Contract Status...${NC}"
if command -v cardano-cli &> /dev/null; then
  echo -e "${GREEN}✓ Cardano CLI is installed${NC}"
  echo "Run smart contract deployment manually (see DEPLOYMENT_GUIDE.md)"
else
  echo -e "${YELLOW}⚠ Cardano CLI not found - smart contract deployment requires manual setup${NC}"
fi

# Summary
echo -e "\n======================================================"
echo " Verification Summary"
echo "======================================================"
echo "Backend: $([ -n "$api_url" ] && echo "Configured" || echo "Not checked")"
echo "Frontend: https://slv-genius.netlify.app"
echo "Smart Contract: Manual deployment required"
echo ""
echo "Next Steps:"
echo "1. Deploy smart contract to testnet (see DEPLOYMENT_GUIDE.md)"
echo "2. Test two-way order placement on frontend"
echo "3. Monitor backend logs for transaction submissions"
echo "4. Verify orders appear on-chain via Cardano explorer"

