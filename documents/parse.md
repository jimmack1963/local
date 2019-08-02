npm install -g parse-server mongodb-runner
mongodb-runner start
setx VERBOSE 1
parse-server --appId piak --masterKey MonkeysAreSweet --databaseURI mongodb://localhost/test

curl -X POST \
-H "X-Parse-Application-Id: piak" \
-H "Content-Type: application/json" \
-d '{"score":1337,"playerName":"Jim Mack","cheatMode":false}' \
http://localhost:1337/parse/classes/GameScore

curl -X GET \
  -H "X-Parse-Application-Id: piak" \
  http://localhost:1337/parse/classes/GameScore/rQCW2DwTym
  
curl -X GET -H "X-Parse-Application-Id: piak" http://localhost:1337/parse/classes/GameScore  
  
  
https://www.npmjs.com/package/parse-server#running-parse-server
