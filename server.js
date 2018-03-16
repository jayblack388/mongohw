const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const scrape = require("./app/scripts/scrape");

const db = require("./app/models");

const PORT = 8080;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, './app/public')));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraperhw");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + '/app/public/index.html'));
})

app.get("/scrape/:id", function(req, res) {
  const choice = req.params.id
  scrape(choice, res);
});

app.get("/headlines", function(req, res) {
  db.Headline.find({})
    .populate("notes")
    .then(function(dbArticles) {
      res.json(dbArticles)
    })
    .catch(function(err) {
      res.json(err)
    })
});

app.get("/notes", function(req, res) {
  db.Note.find({})
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/headlines/:id", function(req, res) {
  db.Headline.find({
    _id: req.params.id
  })
  .populate("notes")
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
    res.json(err)
  })
});

app.post("/headlines/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Headline.findOneAndUpdate({
      _id: req.params.id
    },{ 
      $push: {notes: dbNote._id}
    },{
      new: true
    }).populate("notes")
  }).then(function(dbHeadline) {
    res.json(dbHeadline);
  })
  .catch(function(err) {
    res.json(err);
  })
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
