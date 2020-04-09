const fs = require('fs');
const Crawler = require("crawler");

// brings in the URLs to scrape
const alphaUrls = require('./alphaUrlsToScrape.js')

const c = new Crawler({
  maxConnections: 1,
  jQuery: {
    name: 'cheerio',
    options: {
      normalizeWhitespace: true,
      xmlMode: true
    }
  },
  // This will be called for each crawled page
  callback: async function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      // $ is Cheerio by default
      //$ is a lean implementation of core jQuery designed specifically for the server
      let $ = res.$;
      console.log("$------------------", $);

      let con = await ($('div#content').html());

      console.log("con+++++++++++++++   ", con);

      fs.createWriteStream('./userUrlsToScrape2.js', { flags: 'a' }).write(con);
    }
    // signifies the end of each researcher being scraped
    done();
  },

});


c.queue(
  alphaUrls,
);
