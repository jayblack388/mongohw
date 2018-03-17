const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const scrape = require("./app/scripts/scrape");

const PORT = process.env.PORT || 8080;

const app = express();

app.set('view engine', 'ejs');
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, './app/public')));

const databaseUri ="mongodb://localhost/scraperhw";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

mongoose.Promise = Promise;

const db = require("./app/models");

const routes = require("./app/routes");

routes.html(app)
routes.api(app, db);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
