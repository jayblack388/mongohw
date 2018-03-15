const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(res) {  
  axios.get("http://www.kotaku.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    const scrape = [];
    $("article").each(function(i, element) {
      let header = $(this)
        .children("header")
        .children("h1")
        .children("a");
      let content = $(this)
        .children("div.item__content")
        .children("div.excerpt")
        .children("p");
      const result = {};
      result.title = header
        .text();
      result.link = header
        .attr("href");
      result.summary = content
        .text();
      scrape.push(result);
    });
    db.Headline.create(result)
        .then((dbArticle) => {
          res.send("Scrape Complete");
        }) 
        .catch((err) => {
          console.log(err);
        });
  });
}
db.Headline.find({}).then((headlineArray)=>{

})


// Create a find all headlines query 
// Filter and compare the "scrape" array object's titles to the all headlines object's titles
