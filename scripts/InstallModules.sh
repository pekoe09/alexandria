cd /var/nodejs/alexandria
sudo rm package-lock.json
sudo rm -r node_modules
sudo npm install --only=production

cd /var/nodejs/alexandria/alexandria
sudo rm package-lock.json
sudo rm -r node_modules
sudo npm install --only=production