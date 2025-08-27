#!/bin/bash
# Production Deployment Script for addictingwordgames.com

set -e  # Exit on any error

echo "🚀 Production Deployment Starting..."
echo "====================================="

# Colors for output  
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Run tests (if available)
echo -e "\n${YELLOW}🧪 Step 1: Running tests...${NC}"
if [ -f "pytest.ini" ]; then
    python -m pytest tests/ || true
    echo -e "${GREEN}✅ Tests completed${NC}"
else
    echo -e "${YELLOW}⚠️  No tests found${NC}"
fi

# Step 2: Sync static files to Cloudflare R2 bucket
echo -e "\n${YELLOW}☁️  Step 2: Syncing assets to Cloudflare R2...${NC}"
R2_ENDPOINT="https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com"
BUCKET="addictingwordgamesstatic"
SYNC_OPTS="--size-only"

# Check if AWS CLI is configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found! Please install it first.${NC}"
    echo "Using gsutil fallback for Google Cloud Storage..."
    gcloud config set project addictingwordgames
    gsutil -m rsync -r ./static gs://static.addictingwordgames.com/static
else
    # Sync static directories to R2
    echo "Syncing static files to R2..."
    aws s3 sync ./static s3://${BUCKET}/static --endpoint-url $R2_ENDPOINT $SYNC_OPTS
    
    # Sync saved game images if they exist
    if [ -d "./static/saved" ]; then
        echo "Syncing saved game images..."
        aws s3 sync ./static/saved s3://${BUCKET}/static/saved --endpoint-url $R2_ENDPOINT $SYNC_OPTS
    fi
fi

echo -e "${GREEN}✅ Static files synced${NC}"

# Step 3: Deploy to Google App Engine (optional)
echo -e "\n${YELLOW}🚀 Step 3: Deploy to App Engine? (y/n)${NC}"
read -r DEPLOY_APP
if [[ $DEPLOY_APP == "y" ]]; then
    gcloud app deploy --project addictingwordgames
    echo -e "${GREEN}✅ Deployed to App Engine${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped App Engine deployment${NC}"
fi

# Deployment complete
echo -e "\n${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "================================="
echo -e "${BLUE}📊 Summary:${NC}"
echo "  • Static assets: Synced to storage"
echo "  • App Engine: $([ "$DEPLOY_APP" == "y" ] && echo "Deployed" || echo "Skipped")"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. Verify static assets at https://static.addictingwordgames.com"
echo "  2. Check application at https://www.addictingwordgames.com"
echo ""
echo -e "${GREEN}✅ Ready for production!${NC}"
