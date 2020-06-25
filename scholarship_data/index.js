const fs = require('fs');
const Crawler = require('crawler');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// brings in the URLs to scrape
//const { urls } = require('../researcher_URLs/userURLs.js');

// brings in the Testing URLs to scrape
const { urls } = require('../researcher_URLs/userURLsTesting.js');

// brings in user object for 'bad' user ids
const { userIds } = require('../researcher_data/ProblemUIDs.js');

// Truncate saved.xml before appending
fs.truncateSync('./doi_researcher.csv');

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
  // This will be called for each crawled page
  callback: async function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      // $ is Cheerio by default
      //$ is a lean implementation of core jQuery designed specifically for the server
      let $ = res.$;
      // beginning of code scrape each section of a researcher
      let con = '';

      // Alma Primary ID
      let email = await $('div#contact > a').text();
      let email0 = email.split('@')[0];
      let email1 = email.split('@')[1];

      if (email1 !== 'brandeis.edu') {
        con += 'unknown_Alma_ID';
      } else {
        let newId = userIds[email0];

        if (newId !== undefined) {
          email0 = newId;
        }

        console.log(email0, email1, email);
      }

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

//encodeURI(uri);
