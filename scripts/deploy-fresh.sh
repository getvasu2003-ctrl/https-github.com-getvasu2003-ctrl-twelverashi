#!/usr/bin/env bash
# ==============================================================================
# 12Rashi Production Fresh Deployment & Cache-Busting Script
# Deploys to Firebase Hosting with zero-cache propagation delay
# ==============================================================================

set -e

PROJECT_ID="light-diorama-nmn89"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

echo "=========================================================="
echo "🚀 12Rashi: Starting Fresh Zero-Cache Deployment ($TIMESTAMP)"
echo "Target Project: $PROJECT_ID"
echo "=========================================================="

# 1. Clean previous builds and bundler cache
echo "🧹 [1/5] Purging old build artifacts and Vite cache..."
rm -rf dist
rm -rf node_modules/.vite

# 2. Bump Service Worker Cache Version to trigger client-side cache flush
echo "⚡ [2/5] Updating PWA Service Worker cache version tag..."
if [ -f "public/sw.js" ]; then
  # Replace CACHE_VERSION with unique build timestamp
  sed -i -E "s/const CACHE_VERSION = '[^']+';/const CACHE_VERSION = '12rashi-$TIMESTAMP';/" public/sw.js
  echo "   ↳ Service Worker Cache Version set to: 12rashi-$TIMESTAMP"
fi

# 3. Build optimized production bundle
echo "📦 [3/5] Compiling production build with Vite..."
npm run build

# 4. Verify CNAME for 12rashi.com
if [ -f "CNAME" ]; then
  cp CNAME dist/CNAME
  echo "   ↳ Preserved CNAME: $(cat dist/CNAME)"
fi

# 5. Deploy directly to Firebase Hosting
echo "🌐 [4/5] Uploading to Firebase Hosting ($PROJECT_ID)..."
if command -v firebase >/dev/null 2>&1; then
  firebase deploy --only hosting --project "$PROJECT_ID"
else
  npx -y firebase-tools deploy --only hosting --project "$PROJECT_ID"
fi

echo ""
echo "=========================================================="
echo "✅ [5/5] Deploy Complete! Zero-cache headers are active."
echo "Live URLs:"
echo "👉 https://www.12rashi.com"
echo "👉 https://12rashi.com"
echo "👉 https://$PROJECT_ID.web.app"
echo "=========================================================="
