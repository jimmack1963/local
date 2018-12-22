node touch.js
call quasar clean
call quasar build -d -m spa -t mat
call quasar build -d -m spa -t ios

copy now.json dist\spa-mat\
copy now.json dist\spa-ios\

start cmd /c now deploy "dist/spa-mat" -n "dropAndroid"
start cmd /c now deploy "dist/spa-ios" -n "dropIOS"

pause

call now ls dropAndroid > pub-mat.txt
call now ls dropIOS > pub-ios.txt

type pub-mat.txt
type pub-ios.txt

pause
now alias ls | sort /+90


echo node latest

node latest

echo now rm dropAndroid --safe --yes
echo now rm dropIOS --safe --yes
