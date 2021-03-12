#!/bin/bash

pm2 stop BECyberEnglish
pm2 stop serveFile
npm install
npm run build
pm2 start serveFile
cd dist
pm2 start BECyberEnglish