const scrape = require("../scripts/scrape");

module.exports = (app, db) => {
  app.get("/scrape/:id", function(req, res) {
    const choice = req.params.id;
    scrape(choice, res);
  });

  app.get("/headlines", function(req, res) {
    db.Headline.find({})
      .populate("notes")
      .then(function(dbArticles) {
        res.json(dbArticles);
      })
      .catch(function(err) {
        res.json(err);
      });
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
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.delete("/notes/:id", function(req, res) {
    const thisId = req.params.id;
    db.Note.findById(thisId).then(function(note) {
      note.remove();
      res.json({});
    })
  });

  app.post("/headlines/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Headline.findOneAndUpdate(
          {
            _id: req.params.id
          },
          {
            $push: { notes: dbNote._id }
          },
          {
            new: true
          }
        ).populate("notes");
      })
      .then(function(dbHeadline) {
        res.json(dbHeadline);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
