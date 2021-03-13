#!/bin/bash

pm2 stop BECyberEnglish
pm2 stop serveFile
pm2 delete serveFile
npm install
npm run build
pm2 serve public 3001 --name serveFile
cd dist
pm2 start pm2Config.json --env staging
pm2 save