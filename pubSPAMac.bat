node touch.js
quasar clean
quasar build -d -m spa -t mat
cp now.json dist\spa\now.json
now deploy "dist/spa" -n "dropAndroid"

read -p "Press [Enter] key"

quasar build -d -m spa -t ios
cp now.json dist\spa\now.json
now deploy "dist/spa" -n "dropIOS"

read -p "Press [Enter] key"

now ls dropAndroid > pub-mat.txt
now ls dropIOS > pub-ios.txt

cat pub-mat.txt

cat pub-ios.txt

read -p "Press [Enter] key"
now alias ls

echo node latestIOS

node latestIOS

echo now rm dropAndroid --safe --yes
echo now rm dropIOS --safe --yes
