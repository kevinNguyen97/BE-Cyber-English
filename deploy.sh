#!/bin/bash

pm2 stop BECyberEnglish
npm install
npm run build
cd dist
pm2 start BECyberEnglish
ENDSSH