const fs = require('fs');
const Crawler = require('crawler');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// brings in the URLs to scrape
const { urls } = require('../researcher_URLs/userURLs.js');

// brings in user object for 'bad' user ids
const { userIds } = require('./ProblemUIDs.js');

// Place reserved for functions to remove code jobs.

// starts CSV file with column headings.
fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(
  `ALAMID, DOI`
);

// beginning of scrapping function.
const c = new Crawler({
  maxConnections: 1,
  jQuery: {
    name: 'cheerio',
    options: {
      normalizeWhitespace: true,
      xmlMode: true,
    },
  },

  callback: async function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      // $ is Cheerio by default
      //$ is a lean implementation of core jQuery designed specifically for the server
      let $ = res.$;
      // beginning of code scrape each section of a researcher
      let con = '';

      // writes each user to our file.
      fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(con);

      // signifies the end of each researcher being scraped
      done();
    }
  },
});

// puts closing root tag on the document
c.on('drain', function () {
  fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(
    'Do I need to put anything in here?'
  );
});

// list of pages to scrape.
c.queue(urls);

encodeURI(uri);
