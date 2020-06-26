const fs = require('fs');
const Crawler = require('crawler');
const axios = require('axios').default;
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
// helper function to remove xml reserved code.
const xmlConfig = textBlock => {
  let text = textBlock;
  // text = text.replace(/\&/g, '&amp;');
  // text = text.replace(/\'/g, '&apos;');
  // text = text.replace(/\"/g, '&quot;');
  // text = text.replace(/\’/g, '&#x2019;');
  // text = text.replace(/\‘/g, '&#x2018;');
  // text = text.replace(/\”/g, '&#x201D;'); //right double quotation mark
  // text = text.replace(/\“/g, '&#x201C;'); //left double quotation mark
  // text = text.replace(/\\b/g, '0x08');
  // text = text.replace(/\\/g, '&#92;');
  text = text.replace(/\</g, '');
  text = text.replace(/\>/g, '');
  // text = text.replace(/\'/g, '');
  // text = text.replace(/\"/g, '');
  return text;
};

// starts CSV file with column headings.
fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(
  `ALAMID, DOI` + '\n'
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
      let id = '';

      // Alma Primary ID
      let email = await $('div#contact > a').text();
      let email0 = email.split('@')[0];
      let email1 = email.split('@')[1];
      console.log(email0, email1, email);
      if (email1 !== 'brandeis.edu') {
        con += 'unknown_Alma_ID';
      } else {
        id = email0 + ', ';

        con += id;
        // let newId = userIds[email0];

        // if (newId !== undefined) {
        //   email0 = newId;
        //   con += email0;
        // }
      }

      // Scholarship
      let schol = await $('div#scholarship').html();
      if (schol) {
        schol = schol.replace('<p class="label">Scholarship</p>', '');
        schol = schol.replace(/<p(.*?)>/g, '');
        schol = schol.replace(/<\/p>/g, ' | ');
        schol = schol.replace(/<U(.*?)>/g, '');
        schol = schol.replace(/<\/U>/g, '');
        schol = schol.replace(/<br\/>/g, '');
        schol = schol.replace(/\|\|/, '');
        schol = await xmlConfig(schol);

        //schol = schol.replace(/\|\|/g, '<li>');
        //schol = schol.replace(/\|/g, '/n');
        schol = schol.replace(/<br \/>/, '');
      } else {
        schol = '';
      }
      let scholArr = schol.split(' | ');
      console.log('scholArr', scholArr);

      async function getScholarshipDOIs(scholArr) {
        console.log('scholArr', scholArr);
        let len = scholArr.length;
        let str = '';
        for (let x = 0; x < len; x++) {
          let item = scholArr.shift();
          item = encodeURI(item);
          console.log('item encodeURI', item);
          let result = await axios.get(
            `https://api.crossref.org/works?sort=relevance&order=desc&select=DOI&query.bibliographic=${item}`
          );
          console.log('Result', result);
          //console.log('result.item[0].DOI', result.item[0].DOI);
        }
      }

      getScholarshipDOIs(scholArr);
      //con += ;
      // writes each user to our file.
      fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(
        con + '\n'
      );

      // signifies the end of each researcher being scraped
      done();
    }
  },
});

// puts closing root tag on the document
c.on('drain', function () {
  fs.createWriteStream('./doi_researcher.csv', { flags: 'a' }).write(
    '\n' + 'Do I need to put anything in here?'
  );
});

// list of pages to scrape.
c.queue(urls);

//encodeURI(uri);
