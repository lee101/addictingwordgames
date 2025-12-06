#!/bin/bash

set -e

echo "Production Deployment for addictingwordgames"
echo "============================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}Step 1: Running grunt build${NC}"
if command -v grunt &> /dev/null; then
    grunt nunjucks
    echo -e "${GREEN}Grunt build complete${NC}"
else
    echo -e "${YELLOW}Grunt not found, skipping template compile${NC}"
fi

echo -e "\n${YELLOW}Step 2: Syncing static files to R2${NC}"
R2_ENDPOINT="https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com"

aws s3 sync ./static s3://addictingwordgamesstatic/static --endpoint-url "$R2_ENDPOINT" --size-only

echo -e "${GREEN}Static files synced to R2${NC}"

echo -e "\n${YELLOW}Step 3: Clearing Cloudflare cache${NC}"
if [[ -f "../netwrck/clear_caches.py" && -n "$CLOUDFLARE_API_KEY" ]]; then
    python3 ../netwrck/clear_caches.py
    echo -e "${GREEN}Cache cleared${NC}"
else
    echo -e "${YELLOW}Skipping cache clear (set CLOUDFLARE_API_KEY to enable)${NC}"
fi

echo -e "\n${GREEN}Deployment complete!${NC}"
echo "Static assets: https://addictingwordgamesstatic.addictingwordgames.com/static/"
echo "Next: Upload app and restart server"
