import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "morgan";
import routes from "./src/routes";
import { options } from "../../util/config";


// mongoose.Promise = global.Promise;

const app = express();

dotenv.config({path: '.env'});

mongoose.connect(process.env.mongodb, options).then(
  (value) => console.info("MongoDB connected succesfully")
).catch((err) => console.log(`Connetion Error:`, err))


app.use(logger('dev'));

app.set('port', process.env.RegPORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use(function (req, res, next) {
    res.header("X-powered-by", "Some dude with a twins to feed.");

    res.header("Access-Control-Allow-Origin", "*");

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    res.header('Content-Type', 'application/json; charset=utf-8');

    if(req.method === 'OPTIONS'){
      res.header("Access-Control-Allow-Methods","POST, PUT, GET, DELETE, PATCH");
      return res.status(200).json({});
    }

    next();
});

app.use('/', routes);

const port = app.get('port')

const server = app.listen(port, function (){
    console.log(`ADP Registration is running on ${port}`);
})


export default server;

