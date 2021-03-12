#!/bin/bash

pm2 stop BECyberEnglish
pm2 delete BECyberEnglish
npm install
npm run build
cd dist
pm2 start BECyberEnglish