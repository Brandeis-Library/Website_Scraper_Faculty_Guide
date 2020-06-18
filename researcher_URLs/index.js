const fs = require('fs');
const Crawler = require('crawler');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
// brings in the URLs to scrape
const alphaUrls = require('./URLsToScrape.js');

// Truncate userURLS.js before appending
fs.truncateSync('./userURLs.js');

// starts XML file with xml definition and starting root tag.
fs.createWriteStream('./userURLs.js', { flags: 'a' }).write(
  'module.exports = { urls: ['
);

const c = new Crawler({
  maxConnections: 1,
  rejectUnauthorized: false,
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
      //console.log("$------------------", $);
      let arrUrls = [];

      let con = await $('div#content > div#one').html();
      con += await $('div#content > div#two').html();
      con += await $('div#content > div#three').html();
      con += await $('div#content > div#four').html();
      if (typeof con === 'string') {
        con = con.replace(/<p(.*?)>/g, '');
        con = con.replace(/<\/p>/g, '');
        con = con.replace(/<h1(.*?)>(.*?)<\/h1>/g, '');
        con = con.replace(/>(.*?)</g, '><');

        let userUrlArray = con.split('</a>');

        arrUrls = await userUrlArray.map(item => {
          let first = item.indexOf('d=');
          let str =
            "'https://www.brandeis.edu/facultyguide/person.html?emplid=";
          str += item.substr(first + 2, 40);
          return (str += "',");
        });
        let removedItemToNotToBeUsed = arrUrls.pop();

        arrUrls = arrUrls.join(' ');
      }

      fs.createWriteStream('./userURLs.js', { flags: 'a' }).write(arrUrls);
    }
    // signifies the end of each researcher being scraped
    done();
  },
});

// puts closing root tag on the document
c.on('drain', function () {
  fs.createWriteStream('./userURLs.js', { flags: 'a' }).write(']}');
});

c.queue(alphaUrls);
