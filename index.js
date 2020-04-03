const fs = require('fs');
const Crawler = require("crawler");

// brings in the URLs to scrape
const { urls } = require('./userUrlsToScrape.js')
// brings in user object for 'bad' user ids
const { userIds } = require('./ProblemUIDs.js')

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
  maxConnections: 1,
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
      let con = "<user>";

      // primary identifiier
      let email = await ($('div#contact > a').text());
      let email0 = email.split("@")[0];
      let email1 = email.split("@")[1];

      if (email1 !== "brandeis.edu") {
        con += "<primary_id>" + "unknown" + "</primary_id>";
      } else {
        let newId = userIds[email0];

        if (newId !== undefined) {
          email0 = newId
        }


        con += "<primary_id>" + email0 + "</primary_id>";
      }

      con += "<researcher>"



      console.log(email0, email1, email);


      // researcher languages
      con += "<researcher_languages><researcher_language>English</researcher_language></researcher_languages >"

      //department name list
      let departName = await ($('div#depts').html());
      //console.log("departName------  ", departname)
      let departNameArray = []
      let deptOutput = "";
      con += "<researcher_organization_affiliations>"
      if (departName) {
        departName = await departName.replace(/Departments\/Programs/g, "");
        //departName = await departName.replace(/<\/a>/g, " $ ");
        departName = await departName.replace(/<p(.*?)>/g, "");
        departName = await departName.replace(/<\/p>/g, "");
        //departName = await departName.replace(/<a(.*?)>/g, " | ");
        departName = await departName.replace(/<br\/>/g, "");
        departName = await departName.replace(/<\/a>/g, "</a>|");

        departNameArray = departName.split("|");

        for (x = 0; x < departNameArray.length - 1; x++) {
          let depart = departNameArray[x];
          let digit = 0;
          let departCode = "";

          if (depart) {
            digit = depart.indexOf("deptid=");
          } else {
            digit = -1;
          }

          if (digit > 0) {
            departCode = "CC" + depart.substr(digit + 7, 5)
          } else {
            departCode = "unknown";
          }
          deptOutput += "<researcher_organization_affiliation><organization_code>" + departCode + "</organization_code></researcher_organization_affiliation>";
        }


      } else {
        departOutput = "unknown"

      }

      con += deptOutput
      con += "</researcher_organization_affiliations>"

      //beginning of researcher description fields
      con += "<researcher_descriptions>"

      // position/title
      let posit = await ($('div#title').text());
      posit = await xmlConfig(posit)
      con += "<researcher_description>"
      con += "Position: " + posit;
      con += "</researcher_description>"

      // awards/honors
      let hon = await ($('div#awards').text())
      hon = await hon.replace("Awards and Honors", "");
      hon = await xmlConfig(hon);
      con += "<researcher_description>" + "Honors and Awards:  " + hon + "</researcher_description>";


      // degrees/education
      let deg = await ($('div#degrees').text());
      deg = await xmlConfig(deg);
      deg = await deg.replace("Degrees", "");
      con += "<researcher_description>" + "Education:  " + deg + "</researcher_description>";

      // expertise/keywords
      let exp = await ($('div#expertise').html());
      if (exp) {
        //exp = await xmlConfig(exp);
        exp = await exp.replace(/<p(.*?)>/g, "");
        exp = await exp.replace(/<\/p>/g, "");
        exp = await exp.replace("Expertise", "");
        exp = await exp.replace(/,/g, " | ");
        exp = await exp.replace(/:/g, " | ");
        exp = await exp.replace(/;/g, " | ");
        exp = await exp.replace(/-/g, " | ");
      } else {
        exp = ""
      }

      con += "<researcher_description>" + "Expertise:  " + exp + "</researcher_description>";

      // courses
      let cour = await ($('div#courses').text())
      cour = await xmlConfig(cour);
      //cour = await cour.replace("Courses Taught", "");
      con += "<researcher_description>" + cour + "</researcher_description>";

      // profile/description
      let desc = await ($('div#profile').text());
      desc = await xmlConfig(desc);
      con += "<researcher_description>Description:  " + desc + "</researcher_description>";

      // scholarship
      let schol = await ($('div#scholarship').text())
      schol = await xmlConfig(schol);
      schol = await schol.replace('Scholarship', '');
      con += "<researcher_description>Schololorship:  " + schol + "</researcher_description>";

      con += "</researcher_descriptions>";

      // contact info
      //let cont = ($('div#contact').text());
      //cont = await xmlConfig(cont);
      //con += "<contact>" + cont + "</contact>";



      // research topics
      //con += "<researcher_topics><researcher_topic>No Data</ researcher_topic></ researcher_topics >"

      // researcher associations
      //con += "<researcher_associations><researcher_association>" + "</ researcher_association></ researcher_associations >"

      // external affiliations
      //con += "<researcher_external_organization_affiliations><researcher_external_organization_affiliation>" + "</researcher_external_organization_affiliation></researcher_external_organization_affiliations>";

      // previous external affiliations
      //con += "<researcher_previous_external_organization_affiliations><researcher_previous_external_organization_affiliation>" + "</researcher_previous_external_organization_affiliation></researcher_previous_external_organization_affiliations>";


      // researcher webpage
      //con += "<researcher_webpages><researcher_webpage>" + "</ researcher_webpage></ researcher_webpages>"

      // previous organization affiliations
      //con += "<researcher_previous_organization_affiliations><researcher_previous_organization_affiliation>" + "</ researcher_previous_organization_affiliation></researcher_previous_organization_affiliations>";

      // email
      //con += "<researcher_alternate_emails><researcher_alternate_email>" + "</ researcher_alternate_email></ researcher_alternate_emails>"

      //researcher name
      //let name = await ($('div#content > h1').text());
      //name = await xmlConfig(name)

      //con += "<researcher_name_variants><researcher_name_variant>" + name + "</researcher_name_variant></researcher_name_variants>";


      con += "</researcher></user>";


      // writes each user to our file.
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    // signifies the end of each researcher being scraped
    done();
  },

});
// puts closing root tag on the document
setTimeout(function () { fs.createWriteStream('./saved.xml', { flags: 'a' }).write('</users>'); }, 120000);

// list of pages to scrape.
c.queue(
  urls,

);

