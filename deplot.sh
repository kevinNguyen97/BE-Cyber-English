#!/bin/bash

pm2 stop BECyberEnglish
npm install
cd dist
pm2 start BECyberEnglish
ENDSSH