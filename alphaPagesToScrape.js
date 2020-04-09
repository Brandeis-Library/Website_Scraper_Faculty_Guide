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

      let con = await ($('div#content > div#one').html());
      con += await ($('div#content > div#two').html());
      con += await ($('div#content > div#three').html());
      con += await ($('div#content > div#four').html());
      if (typeof con === "string") {
        con = await con.replace(/<p(.*?)>/g, "");
        con = await con.replace(/<\/p>/g, "");
        con = await con.replace(/<h1(.*?)>(.*?)<\/h1>/g, "");
        con = await con.replace(/>(.*?)</g, '><')
      }

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
