const fs = require('fs');
const Crawler = require('crawler');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// brings in the URLs to scrape
//const { urls } = require('../researcher_URLs/userURLs.js');

// brings in the Testing URLs to scrape
const { urls } = require('../researcher_URLs/userURLsTesting.js');

// brings in user object for 'bad' user ids
const { userIds } = require('./ProblemUIDs.js');

// brings in the function to test for position
const { positionMatch } = require('./positionMatch.js');

// Truncate saved.xml before appending
fs.truncateSync('./saved.xml');

// helper function to remove xml reserved code.
const xmlConfig = textBlock => {
  let text = textBlock;
  text = text.replace(/\&/g, '&amp;');
  text = text.replace(/\'/g, '&apos;');
  text = text.replace(/\"/g, '&quot;');
  text = text.replace(/\’/g, '&#x2019;');
  text = text.replace(/\‘/g, '&#x2018;');
  text = text.replace(/\”/g, '&#x201D;'); //right double quotation mark
  text = text.replace(/\“/g, '&#x201C;'); //left double quotation mark
  text = text.replace(/\\b/g, '0x08');
  text = text.replace(/\\/g, '&#92;');
  text = text.replace(/\</g, '');
  text = text.replace(/\>/g, '');
  text = text.replace(/\'/g, '');
  text = text.replace(/\"/g, '');
  return text;
};

// end of the file converts all the html to XML friendly escape code.
const xmlEscape = textBlock => {
  let text = textBlock;
  text = text.replace(/<br \/>/g, '&lt;br/&gt;');
  text = text.replace(/<p>/g, '&lt;p&gt;');
  text = text.replace(/<\/p>/g, '&lt;/p&gt;');
  text = text.replace(/<strong>/g, '&lt;strong&gt;');
  text = text.replace(/<\/strong>/g, '&lt;/strong&gt;');
  text = text.replace(/<h3>/g, '&lt;h3&gt;');
  text = text.replace(/<\/h3>/g, '&lt;/h3&gt;');
  text = text.replace(/<li>/g, '&lt;li&gt;');
  text = text.replace(/<\/li>/g, '&lt;/li&gt;');
  text = text.replace(/<ul>/g, '&lt;ul&gt;');
  text = text.replace(/<\/ul>/g, '&lt;/ul&gt;');
  text = text.replace(/<ol>/g, '&lt;ol&gt;');
  text = text.replace(/<\/ol>/g, '&lt;/ol&gt;');
  return text;
};

// starts XML file with xml definition and starting root tag.
fs.createWriteStream('./saved.xml', { flags: 'a' }).write(
  `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="saved.xsl"?><users>`
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
      let con = '<user>';

      // primary identifiier
      let email = await $('div#contact > a').text();
      let email0 = email.split('@')[0];
      let email1 = email.split('@')[1];

      if (email1 !== 'brandeis.edu') {
        con += '<primary_id>' + 'unknown' + '</primary_id>';
      } else {
        let newId = userIds[email0];

        if (newId !== undefined) {
          email0 = newId;
        }

        con += '<primary_id>' + email0 + '</primary_id>';
      }
      // add is_researcher
      con += '<is_researcher>true</is_researcher>';

      // begin researcher fields
      con += '<researcher>';

      // Show some data of each reasearcher in the console to give an update to the process
      console.log(email0, email1, email);

      // researcher languages
      con +=
        '<researcher_languages><researcher_language>eng</researcher_language></researcher_languages>';

      // position/title
      let posit = await $('div#title').text();
      posit = await xmlConfig(posit);

      let titleVar = '<title>' + posit + '</title>';
      let positVar =
        '<position>' + (await positionMatch(posit)) + '</position>';

      //department name list
      let departName = await $('div#depts').html();

      let departNameArray = [];
      let deptOutput = '';
      con += '<researcher_organization_affiliations>';
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
          deptOutput +=
            '<researcher_organization_affiliation><organization_code>' +
            departCode +
            '</organization_code>' +
            positVar +
            titleVar +
            '</researcher_organization_affiliation>';
        }
      } else {
        departOutput = 'unknown';
      }

      con += deptOutput;
      con += '</researcher_organization_affiliations>';

      // expertise/keywords
      let exp = await $('div#expertise').html();
      if (exp) {
        exp = exp.replace(/\,/g, ' | ');
        exp = exp.replace(/\:/g, ' | ');
        exp = exp.replace(/<p(.*?)>/g, '');
        exp = exp.replace(/<\/p>/g, '');
        exp = exp.replace(/<br\/>/g, '');
        exp = exp.replace('Expertise', '');
        exp = exp = await xmlConfig(exp);
        exp = exp.replace(
          /\|/g,
          '</value></researcher_keyword><researcher_keyword><value>'
        );
      } else {
        exp = '';
      }

      //con +=
      '<researcher_keywords><researcher_keyword><value>' +
        exp +
        '</value></researcher_keyword></researcher_keywords>';

      //beginning of researcher description fields
      //con += '</description></researcher_description>';
      con += '<researcher_descriptions>';

      // awards/honors
      let hon = await $('div#awards').html();

      if (hon) {
        hon = hon.replace('Awards and Honors', '');
        hon = hon.slice(0, -6);
        hon = hon.replace(/<p(.*?)>/g, '');
        hon = hon.replace(/<\/p>/g, '|');
        hon = hon.replace(/<br\/>/g, '');
        hon = await xmlConfig(hon);
        hon = hon.replace(/\|/, '');
        hon = hon.replace(/\|/g, '</li><li>');
      } else {
        hon = '';
      }
      con +=
        '<researcher_description><description>' +
        '<h3><strong>Honors and Awards:</strong></h3><ul><li>' +
        hon +
        '</li></ul></description></researcher_description>';

      // degrees/education
      let deg = await $('div#degrees').html();

      if (deg) {
        deg = deg.slice(0, -6);
        deg = deg.replace('Degrees', '');
        deg = deg.replace(/<p(.*?)>/g, '');
        deg = deg.replace(/<\/p>/g, '');
        deg = deg.replace(/<br\/>/g, ' | ');
        deg = await xmlConfig(deg);
        deg = deg.replace(/\|/g, '</li><li>');
      } else {
        deg = '';
      }

      con +=
        '<researcher_description><description>' +
        '<h3><strong>Education: </strong></h3><ul><li>' +
        deg +
        '</li></ul></description></researcher_description>';

      // expertise/keywords
      exp = await $('div#expertise').html();
      if (exp) {
        exp = exp.replace(/\,/g, ' | ');
        exp = exp.replace(/\:/g, ' | ');
        exp = exp.replace(/<p(.*?)>/g, '');
        exp = exp.replace(/<\/p>/g, '');
        exp = exp.replace(/<br\/>/g, '');
        exp = exp.replace('Expertise', '');
        exp = exp = await xmlConfig(exp);
        exp = exp.replace(/\|/g, '</li><li>');
      } else {
        exp = '';
      }

      con +=
        '<researcher_description><description>' +
        '<h3><strong>Keywords:</strong></h3><ul><li>' +
        exp +
        '</li></ul></description></researcher_description>';

      // courses
      let cour = await $('div#courses').html();
      if (cour) {
        cour = cour.replace(/<table(.*?)>/g, '');
        cour = cour.replace(/<\/table(.*?)>/g, '');
        cour = cour.replace(/<\/tbody(.*?)>/g, '');
        cour = cour.replace(/<tbody(.*?)>/g, '');
        cour = cour.replace(/<tr(.*?)>/g, ' || ');
        cour = cour.replace(/<\/tr(.*?)>/g, ' | ');
        cour = cour.replace(/<td(.*?)>/g, '');
        cour = cour.replace(/<\/td>/g, '');
        cour = cour.replace(/<p(.*?)>/g, '');
        cour = cour.replace(/<\/p>/g, '');
        cour = cour.replace('Courses Taught', '');
        cour = cour.replace(/\|\|/g, '<li>');
        cour = cour.replace(/\|/g, '</li>');
      } else {
        cour = '';
      }

      con +=
        '<researcher_description><description><h3><strong>Courses Taught:</strong></h3><ul>' +
        cour +
        '</ul></description></researcher_description>';

      // profile/description
      let desc = await $('div#profile').text();
      desc = await xmlConfig(desc);
      //con +=
      '<researcher_description><description><h3><strong>Description:</strong></h3>' +
        desc +
        '</description ></researcher_description > ';

      // scholarship
      let schol = await $('div#scholarship').html();
      if (schol) {
        schol = schol.replace(/<p(.*?)>/g, '  ||  ');
        schol = schol.replace(/<\/p>/g, ' | ');
        schol = schol.replace(/<U(.*?)>/g, '');
        schol = schol.replace(/<\/U>/g, '');
        schol = schol.replace(/<br\/>/g, '');
        schol = schol.replace(/\|\|/, '');
        schol = await xmlConfig(schol);
        schol = schol.replace('Scholarship', '');
        schol = schol.replace(/\|\|/g, '<li>');
        schol = schol.replace(/\|/g, '</li><br />');
        schol = schol.replace(/<br \/>/, '');
      } else {
        schol = '';
      }
      con +=
        '<researcher_description><description><h3><strong>Scholarship:</strong></h3><ul>' +
        schol +
        '</ul></description></researcher_description>';

      con += '</researcher_descriptions>';

      con += '</researcher></user>';

      con = await xmlEscape(con);

      // writes each user to our file.
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    // signifies the end of each researcher being scraped
    done();
  },
});

// puts closing root tag on the document
c.on('drain', function () {
  fs.createWriteStream('./saved.xml', { flags: 'a' }).write('</users>');
});

// list of pages to scrape.
c.queue(urls);
