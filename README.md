# SvAPI

## Development

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
   e.g.
   `{ "type": "mysql", "host": "localhost", "port": 3306, "username": "user", "password": "secret", "database": "db", "synchronize": true, "logging": false, "entities": [ "src/entity/**/*.ts" ], "migrations": [ "src/migration/**/*.ts" ], "subscribers": [ "src/subscriber/**/*.ts" ], "cli": { "entitiesDir": "src/entity", "migrationsDir": "src/migration", "subscribersDir": "src/subscriber" } }`
3. comment in index.ts:
   'const options = {
   key: readFileSync("/etc/letsencrypt/live/api.sv-hag.de/privkey.pem"),
   cert: readFileSync("/etc/letsencrypt/live/api.sv-hag.de/fullchain.pem")
   };
   // start server https
   https.createServer(options, app).listen(3000, function() {
   console.log(
   "server started with cors at https://localhost:3000 or with the reverse proxy at https://api.sv-hag.de"
   );
   });

   outcomment in index.ts:
   ``//start server http
   // app.listen(3000, () => {
   // console.log("Server started on port 3000!");
   // });`

4. Run `npm start` command

##Deployment

1. install pm2: `npm install pm2`
2. add your key and cert in index.ts and comment `options` out
3. comment start `server http` and comment `start server https` out
4. Run `sudo pm2 start src/index.ts` to start the server
