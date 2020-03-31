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

      //researcher name
      //let name = await ($('div#content > h1').text());
      //name = await xmlConfig(name)

      //con += "<researcher_name_variants><researcher_name_variant>" + name + "</researcher_name_variant></researcher_name_variants>";

      console.log(email0, email1, email);






      //department code
      let depart = await ($('div#depts').html());
      //depart = await depart.replace(/Departments\/Programs/g, "");
      //depart = await depart.replace(/)

      //console.log("departName", departName);
      //depart = await xmlConfig(depart);

      let digit = 0;
      if (depart) {
        digit = depart.indexOf("deptid=");
      } else {
        digit = -1;
      }

      let departCode = "";
      if (digit > 0) {
        departCode = "CC" + depart.substr(digit + 7, 5)
      } else {
        departCode = "unknown";
      }
      con += "<researcher_organization_affiliations><researcher_organization_affiliation><organization_code>" + departCode + "</organization_code></researcher_organization_affiliation></researcher_organization_affiliations>";

      con += "<researcher_descriptions>"
      // position/title
      let posit = await ($('div#title').text());
      posit = await xmlConfig(posit)
      con += "<researcher_description>"
      con += "position: " + posit;
      con += "</researcher_description>"

      //department name list
      let departName = await ($('div#depts').text());
      //console.log("departName------  ", departname)

      if (departName) {
        departName = await departName.replace(/Departments\/Programs/g, "");
        departName = await xmlConfig(departName);
      } else {
        departName = "unknown"
      }

      con += "<researcher_description>"
      con += "Department and Program List:  " + departName
      con += "</researcher_description>"

      // awards/honors
      let hon = await ($('div#awards').text())
      hon = await xmlConfig(hon);
      con += "<researcher_description>" + hon + "</researcher_description>";
      con += "</researcher_descriptions>";

      // degrees/education
      // let deg = await ($('div#degrees').text());
      // deg = await xmlConfig(deg);
      // deg = await deg.replace("Degrees", "");
      // con += "<researcher_educations><researcher_education>" + deg + "<researcher_education></researcher_educations>";

      // research topics
      //con += "<researcher_topics><researcher_topic>No Data</ researcher_topic></ researcher_topics >"

      // researcher associations
      //con += "<researcher_associations><researcher_association>" + "</ researcher_association></ researcher_associations >"


      // researcher languages
      //con += "<researcher_languages><researcher_language>English</ researcher_language></ researcher_languages >"

      // expertise/keywords
      // let exp = await ($('div#expertise').text());
      // exp = await xmlConfig(exp);
      // exp = await exp.replace("Expertise", "");
      // con += "<researcher_keywords><researcher_keyword>" + exp + "</researcher_keyword></researcher_keywords>";

      // profile/description
      // let desc = await ($('div#profile').text());
      // desc = await xmlConfig(desc);
      // con += "<researcher_descriptions><researcher_description>" + desc + "</researcher_description></researcher_descriptions>";

      // courses
      //let cour = await ($('div#courses').text())
      //cour = await xmlConfig(cour);
      //cour = await cour.replace("Courses Taught", "");
      //con += "<researcher_description>" + cour + "</researcher_description>";

      // scholarship
      //let schol = await ($('div#scholarship').text())
      //schol = await xmlConfig(schol);
      //schol = await schol.replace('Scholarship', '');
      //con += "<researcher_description>" + schol + "</researcher_description>";



      // contact info
      //let cont = ($('div#contact').text());
      //cont = await xmlConfig(cont);
      //con += "<contact>" + cont + "</contact>";

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


      con += "</researcher></user>";


      // writes each user to our file.
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    // signifies the end of each researcher being scraped
    done();
  },

});
// puts closing root tag on the document
setTimeout(function () { fs.createWriteStream('./saved.xml', { flags: 'a' }).write('</users>'); }, 200000);

// list of pages to scrape.
c.queue(
  urls,

);

