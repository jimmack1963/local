node touch.js
quasar clean
quasar build -d -m spa -t mat
quasar build -d -m spa -t ios

cp now.json dist\spa-mat\now.json
cp now.json dist\spa-ios\now.json

now deploy "dist/spa-mat" -n "dropAndroid"
now deploy "dist/spa-ios" -n "dropIOS"

pause

now ls dropAndroid > pub-mat.txt
now ls dropIOS > pub-ios.txt

cat pub-mat.txt
cat pub-ios.txt

pause
now alias ls

echo node latestIOS

node latestIOS

echo now rm dropAndroid --safe --yes
echo now rm dropIOS --safe --yes
