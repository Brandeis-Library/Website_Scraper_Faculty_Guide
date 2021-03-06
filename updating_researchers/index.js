const fs = require('fs');
const Crawler = require('crawler');
const XLSX = require('xlsx');
// const axios = require('axios');
// const xpath = require('xpath');
// const dom = require('xmldom').DOMParser;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

(async function () {
  // brings in the URLs to scrape
  const { urls } = require('../researcher_URLs/userURLs.js');

  // brings in the Testing URLs to scrape
  //const { urls } = require('../researcher_URLs/userURLsTesting.js');

  // brings in user object for 'bad' user ids
  const { userIds } = require('../researcher_data/ProblemUIDs.js');

  // Ensure creation of errors before truncating
  // await fs.appendFile('./errors.csv', '', function (err) {
  //   if (err) throw err;
  //   console.log('Saved errors.csv');
  // });

  // Ensure creation of faculty_guide_data.txt before truncating
  await fs.appendFile('./faculty_guide_data.js', '', function (err) {
    if (err) throw err;
    console.log('Saved faculty_guide_data.txt');
  });

  // Truncate faculty_guide_data.txt before appending
  await fs.truncateSync('./faculty_guide_data.js');

  // Write at the top of the page.
  await fs.createWriteStream('./faculty_guide_data.js', { flags: 'a' }).write(
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
          con += `${email0}:{`;
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
              departCode = `"CC${depart.substr(digit + 7, 5)}"`;
            } else {
              departCode = 'unknown';
            }
            deptOutput += `${departCode},`;
          }
        } else {
          departOutput = 'unknown';
        }

        con += deptOutput;

        con += '],';

        //con = await xmlEscape(con);

        const title = await $('div#title').text();

        con += `title: "${title.trim()}", `;

        con += `email: "${email}"`;

        // writes each user to our file.
        fs.createWriteStream('./faculty_guide_data.js', { flags: 'a' }).write(
          con + `}, \n`
        );
      }
      // signifies the end of each researcher being scraped
      done();
    },
  });

  // puts closing root tag on the document
  c.on('drain', function () {
    fs.createWriteStream('./faculty_guide_data.js', { flags: 'a' }).write(
      `}}\n`
    );
  });

  // list of pages to scrape.
  c.queue(urls);
})();
