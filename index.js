const fs = require('fs');
const Crawler = require("crawler");
const facProfileURLArray = require('./facProfileURLArray')

// helper function to remove xml reserved code.
const xmlConfig = async (textBlock) => {
  let text = textBlock;
  text = await text.replace(/\&/g, '&amp;');
  text = await text.replace(/\</g, '');
  text = await text.replace(/\>/g, '');
  text = await text.replace(/\'/g, '');
  text = await text.replace(/\"/g, '');
  return text;
}

// starts XML file with xml definition and starting root tag.
fs.createWriteStream('./saved.xml', { flags: 'a' }).write('<?xml version="1.0" encoding="UTF-8"?><users>');

// beginning of scrapping function.
const c = new Crawler({
  maxConnections: 10,
  jQuery: {
    name: 'cheerio',
    options: {
      normalizeWhitespace: true,
      xmlMode: true
    }
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
      let con = "<researcher>";

      //researcher name
      let name = await ($('div#content > h1').text());
      name = await xmlConfig(name)
      con += "<researcher_name_variant>" + name + "</researcher_name_variant>";


      // position/title
      let posit = await ($('div#title').text());
      posit = await xmlConfig(posit)
      con += "<position>" + posit + "</position>";

      // department
      let depart = await ($('div#depts').text());
      depart = await depart.replace(/Departments\/Programs/g, "");
      depart = await xmlConfig(depart);
      con += "<researcher_organization_affiliation>" + depart + "</researcher_organization_affiliation>";

      // degrees/education
      let deg = await ($('div#degrees').text());
      deg = await xmlConfig(deg);
      deg = await deg.replace("Degrees", "");
      con += "<researcher_education>" + deg + "</researcher_education>";

      // expertise/keywords
      let exp = await ($('div#expertise').text());
      exp = await xmlConfig(exp);
      exp = await exp.replace("Expertise", "");
      con += "<researcher_keywords>" + exp + "</researcher_keywords>";

      // profile/description
      let desc = await ($('div#profile').text());
      desc = await xmlConfig(desc);
      con += "<researcher_description>" + desc + "</researcher_description>";

      // courses
      let cour = await ($('div#courses').text())
      cour = await xmlConfig(cour);
      cour = await cour.replace("Courses Taught", "");
      con += "<courses>" + cour + "</courses>";

      // awards/honors
      let hon = await ($('div#awards').text())
      hon = await xmlConfig(hon);
      con += "<researcher_honors>" + hon + "</researcher_honors>";

      // scholarship
      let schol = await ($('div#scholarship').text())
      schol = await xmlConfig(schol);
      schol = await schol.replace('Scholarship', '');
      con += "<scholarship>" + schol + "</scholarship>";

      // contact info
      let cont = ($('div#contact').text());
      cont = await xmlConfig(cont);
      con += "<contact>" + cont + "</contact>";

      // email
      let email = ($('div#contact > a').text());
      con += "<researcher_alternate_email>" + email + "</researcher_alternate_email>";

      // primary identifiier
      let email0 = email.split("@")[0];
      let email1 = email.split("@")[1];
      console.log(email0, email1);
      if (email1 !== "brandeis.edu") {
        con += "<Brandeis_primary_identifier>" + "" + "</Brandeis_primary_identifier>";
      } else {
        con += "<Brandeis_primary_identifier>" + email0 + "</Brandeis_primary_identifier>";
      }

      con += "</researcher>";


      // writes each user to our file.
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    // signifies the end of each researcher being scraped
    done();
  },

});
// puts closing root tag on the document
setTimeout(function () { return fs.createWriteStream('./saved.xml', { flags: 'a' }).write('</users>'); }, 15000);

// list of pages to scrape.
c.queue(facProfileURLArray);

