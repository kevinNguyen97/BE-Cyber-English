#!/bin/bash


npm install
npm run build

pm2 stop serveFile
pm2 delete serveFile
pm2 serve public 3001 --name serveFile

cd dist

pm2 stop BECyberEnglish
pm2 delete BECyberEnglish
pm2 start pm2Config.json --env staging

pm2 save
pm2 startup systemd