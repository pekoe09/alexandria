cd /var/nodejs/alexandria
npm install --only=production
npm audit fix

cd /var/nodejs/alexandria/alexandria
npm install --only=production
npm audit fix