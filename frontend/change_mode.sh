#!/bin/bash

if [ "$1" == "dev" ]; then
sed -i 's/VITE_APP_MODE=.*/VITE_APP_MODE=development/' .env.local
echo "✅ Switched to DEVELOPMENT mode"
elif [ "$1" == "prod" ]; then
sed -i 's/VITE_APP_MODE=.*/VITE_APP_MODE=production/' .env.local
echo "✅ Switched to PRODUCTION mode"
else
echo "Usage: ./switch-mode.sh [dev|prod]"
fi