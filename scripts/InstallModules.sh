cd /var/nodejs/alexandria
sudo rm package-lock.json
sudo rm -r node_modules
sudo npm install --only=production

cp -f /var/envs/alexandria/.env /var/nodejs/alexandria