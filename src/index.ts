import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { readFileSync } from "fs";
import * as https from "https";
import * as helmet from "helmet";
import routes from "./routes";
import cors = require("cors");
import config from "./config/config";

createConnection()
  .then(async () => {
    //ssl

    // create express app
    const app = express();
    //for an Webinterface
    app.use(express.static("public"));

    // Call midlewares
    app.use(helmet());
    app.use(bodyParser.json());
    // Cors config
    app.use(cors());

    //Set all routes from routes folder
    app.use("/", routes);

    if (config.environment === "prod") {
      const options = {
        key: readFileSync("/etc/letsencrypt/live/api.sv-hag.de/privkey.pem"),
        cert: readFileSync("/etc/letsencrypt/live/api.sv-hag.de/fullchain.pem")
      };
      // start server https
      https.createServer(options, app).listen(3000, function() {
        console.log(
          "server started with cors and https at https://localhost:3000 or with the reverse proxy at https://api.sv-hag.de"
        );
      });
    } else {
      // start server http
      app.listen(3000, () => {
        console.log("Dev server started on port 3000!");
      });
    }
  })
  .catch(error => console.log(error));
