var fs = require('fs');
var Crawler = require("crawler");



var c = new Crawler({
  maxConnections: 10,
  jQuery: {
    name: 'cheerio',
    options: {
      normalizeWhitespace: true,
      xmlMode: true
    }
  },
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      let con = "<user>";
      con += "<name>" + ($('div#content > h1').text()) + "</name>";
      //con += ($('div#content > h1').html());
      con += "<title>" + ($('div#title').text()) + "</title>";
      con += "<department>" + ($('div#depts').text()) + "</department>";
      con += "<degrees>" + ($('div#degrees').text()) + "</degrees>";
      con += "<expertise>" + ($('div#expertise').text()) + "</expertise>";
      con += "<profile>" + ($('div#expertise').text()) + "</profile>";
      con += "<courses>" + ($('div#courses').text()) + "</courses>";
      con += "<awards>" + ($('div#awards').text()) + "</awards>";
      con += "<scholarship>" + ($('div#scholarship').text()) + "</scholarship>";
      //con += "<pictureURL>" + ($('div#photo > img.attr("src")').text()) + "</pictureURL>"; does not currently work.
      con += "<contact>" + ($('div#contact').text()) + "</contact>";
      let email = ($('div#contact > a').text());
      let email0 = email.split("@")[0];
      let email1 = email.split("@")[1];

      if (email1 !== "@brandeis.edu") {
        con += "<primary>" + "" + "</primary>";
      } else {
        con += "<primary>" + email0 + "</primary>";
      }

      con += "<email>" + email + "</email>";
      if (email1)

        con += "</user>";
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    done();
  }
});

c.queue(
  [
    'https://www.brandeis.edu/facultyguide/person.html?emplid=947183d5d9a73455f3dff7ebcf3bf398d9815bef',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=0203b89f93c966048429830926729b410a600e79',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2d33bfcf3e8d075ca7e63e9a9775face67e35a9d'
  ]
);
