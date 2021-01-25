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
fs.truncateSync('./researcher_data.txt');

// Write at the top of the page.
fs.createWriteStream('./researcher_data.txt', { flags: 'a' }).write(
  `module.exports = {
    researcherIds: { `
);

// Count for bad Brandeis emails to create a 'safe'
let emailCount = 1;

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

      // primary identifiier
      let email = await $('div#contact > a').text();
      let email0 = email.split('@')[0];
      let email1 = email.split('@')[1];

      if (email1 !== 'brandeis.edu') {
        con += 'badEmail' + emailCount + ':{';
        emailCount++;
      } else {
        let newId = userIds[email0];

        if (newId !== undefined) {
          email0 = newId;
        }
        console.log('Brandeis id:', email0);
        con += email0 + `:{`;
      }

      //department name list
      let departName = await $('div#depts').html();

      let departNameArray = [];
      let deptOutput = 'depts: [';

      if (departName) {
        departName = departName.replace(/Departments\/Programs/g, '');
        departName = departName.replace(/<p(.*?)>/g, '');
        departName = departName.replace(/<\/p>/g, '');
        departName = departName.replace(/<br\/>/g, '');
        departName = departName.replace(/<\/a>/g, '</a>|');
        departNameArray = departName.split('|');

        for (x = 0; x < departNameArray.length - 1; x++) {
          let depart = departNameArray[x];
          let digit = 0;
          let departCode = '';

          if (depart) {
            digit = depart.indexOf('deptid=');
          } else {
            digit = -1;
          }

          if (digit > 0) {
            departCode = 'CC' + depart.substr(digit + 7, 5);
          } else {
            departCode = 'unknown';
          }
          deptOutput += departCode + ',';
        }
      } else {
        departOutput = 'unknown';
      }

      con += deptOutput;

      con += ']';

      //con = await xmlEscape(con);

      // writes each user to our file.
      fs.createWriteStream('./researcher_data.txt', { flags: 'a' }).write(
        con + `}, \n`
      );
    }
    // signifies the end of each researcher being scraped
    done();
  },
});

// puts closing root tag on the document
c.on('drain', function () {
  fs.createWriteStream('./researcher_data.txt', { flags: 'a' }).write(`}}\n`);
});

// list of pages to scrape.
c.queue(urls);
