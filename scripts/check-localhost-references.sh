#!/bin/bash

# Script to check for hardcoded localhost references in the codebase
# This helps ensure production deployment won't have localhost conflicts

echo "🔍 Checking for hardcoded localhost references..."
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FOUND_ISSUES=0

# Check backend Python files (excluding venv)
echo "📁 Checking backend Python files..."
if grep -r "localhost:5000" backend --include="*.py" --exclude-dir=venv --exclude-dir=__pycache__ 2>/dev/null; then
    echo -e "${RED}❌ Found hardcoded localhost:5000 in backend Python files${NC}"
    FOUND_ISSUES=1
else
    echo -e "${GREEN}✓ No hardcoded localhost:5000 in backend Python files${NC}"
fi
echo ""

# Check for hardcoded http://localhost in backend (excluding venv)
echo "📁 Checking for http://localhost in backend..."
if grep -r "http://localhost" backend --include="*.py" --exclude-dir=venv --exclude-dir=__pycache__ 2>/dev/null | grep -v "# " | grep -v "development"; then
    echo -e "${YELLOW}⚠️  Found http://localhost references (check if they're in comments or dev configs)${NC}"
else
    echo -e "${GREEN}✓ No problematic http://localhost in backend${NC}"
fi
echo ""

# Check frontend config
echo "📁 Checking frontend configuration..."
if grep -r "localhost:5000" src --include="*.js" --include="*.jsx" 2>/dev/null; then
    echo -e "${RED}❌ Found hardcoded localhost:5000 in frontend${NC}"
    FOUND_ISSUES=1
else
    echo -e "${GREEN}✓ No hardcoded localhost:5000 in frontend${NC}"
fi
echo ""

# Check .env files for localhost in production configs
echo "📁 Checking .env.production files..."
if [ -f "backend/.env.production" ]; then
    if grep -i "localhost" backend/.env.production 2>/dev/null; then
        echo -e "${RED}❌ Found localhost in backend/.env.production${NC}"
        FOUND_ISSUES=1
    else
        echo -e "${GREEN}✓ No localhost in backend/.env.production${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  backend/.env.production not found${NC}"
fi

if [ -f ".env.production" ]; then
    if grep -i "localhost" .env.production 2>/dev/null; then
        echo -e "${RED}❌ Found localhost in .env.production${NC}"
        FOUND_ISSUES=1
    else
        echo -e "${GREEN}✓ No localhost in .env.production${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.production not found${NC}"
fi
echo ""

# Check nginx configs
echo "📁 Checking Nginx configurations..."
if grep -r "localhost" nginx-configs --include="*.conf" 2>/dev/null | grep -v "127.0.0.1"; then
    echo -e "${YELLOW}⚠️  Found localhost in Nginx configs (check if it's for proxy_pass)${NC}"
else
    echo -e "${GREEN}✓ Nginx configs look good${NC}"
fi
echo ""

# Summary
echo "=================================================="
if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! No hardcoded localhost conflicts found.${NC}"
    echo ""
    echo "Your application is ready for production deployment!"
    exit 0
else
    echo -e "${RED}❌ Found issues that need to be fixed before production deployment.${NC}"
    echo ""
    echo "Please review the issues above and fix them."
    echo "Hardcoded localhost URLs will cause conflicts in production."
    exit 1
fi
