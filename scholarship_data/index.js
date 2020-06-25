const fs = require('fs');
const Crawler = require('crawler');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// brings in the URLs to scrape
const { urls } = require('../researcher_URLs/userURLs.js');

// puts closing root tag on the document
c.on('drain', function () {
  fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(
    'Do I need to put anything in here?'
  );
});

// list of pages to scrape.
c.queue(urls);

encodeURI(uri);
