const fs = require('fs');
const Crawler = require("crawler");

// brings in the URLs to scrape
const alphaUrls = require('./alpahUrlsToScrape.js')


c.queue(
  alphaUrls,
);
