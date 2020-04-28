const fs = require('fs');
const Crawler = require("crawler");

// brings in the URLs to scrape
const { urls } = require('../researcher_URLs/userURLs.js')
// brings in user object for 'bad' user ids
const { userIds } = require('./ProblemUIDs.js')

// helper function to remove xml reserved code.
const xmlConfig = async (textBlock) => {
  let text = textBlock;
  text = await text.replace(/\&/g, '&amp;');
  text = await text.replace(/\'/g, '&apos;');
  text = await text.replace(/\"/g, '&quot;');
  text = await text.replace(/\’/g, '&#x2019;');
  text = await text.replace(/\‘/g, '&#x2018;');
  text = await text.replace(/\”/g, '&#x201D;'); //right double quotation mark
  text = await text.replace(/\“/g, '&#x201C;'); //left double quotation mark
  text = await text.replace(/\\b/g, '0x08');
  text = await text.replace(/\\/g, '&#92;');
  text = await text.replace(/\</g, '');
  text = await text.replace(/\>/g, '');
  text = await text.replace(/\'/g, '');
  text = await text.replace(/\"/g, '');
  return text;
}

// end of the file converts all the html to XML friendly escape code.
const xmlEscape = async (textBlock) => {
  let text = textBlock;
  text = await text.replace(/<br \/>/g, "&lt;br/&gt;");
  text = await text.replace(/<p>/, "&lt;p&gt;")
  text = await text.replace(/<\/p>/, "&lt;\p&gt;")
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
      // add is_researcher
      con += "<is_researcher>true</is_researcher>"

      // begin researcher fields
      con += "<researcher>"



      console.log(email0, email1, email);


      // researcher languages
      con += "<researcher_languages><researcher_language>eng</researcher_language></researcher_languages >"

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
      con += "<researcher_description><description>"
      con += "<p><strong>Position:</strong> " + posit;
      con += "</p><br /></description></researcher_description>"

      // awards/honors
      let hon = await ($('div#awards').html())


      if (hon) {
        hon = await hon.replace("Awards and Honors", "");

        hon = await hon.replace(/<p(.*?)>/g, "");
        hon = await hon.replace(/<\/p>/g, "|");
        hon = await hon.replace(/<br\/>/g, "");
        hon = await xmlConfig(hon);
        //hon = await hon.replace(/<ul>/g, "");
        //hon = await hon.replace(/<\/ul>/g, "");
        hon = await hon.replace(/\|/g, "<br />")
      } else {
        hon = ""
      }
      con += "<researcher_description><description>" + "<p><strong>Honors and Awards:</strong></p> " + hon + " </description></researcher_description>";


      // degrees/education
      let deg = await ($('div#degrees').html());


      if (deg) {
        deg = await deg.replace("Degrees", "");
        deg = await deg.replace(/<p(.*?)>/g, " | ");
        deg = await deg.replace(/<\/p>/g, "");
        deg = await deg.replace(/<br\/>/g, " | ");
        //hon = await hon.replace(/<ul>/g, "");
        //hon = await hon.replace(/<\/ul>/g, "");
        deg = await xmlConfig(deg);
        deg = await deg.replace(/\|/g, "<br /><br />")
      } else {
        deg = ""
      }


      con += "<researcher_description><description>" + "<p><strong>Education:</strong></p>" + deg + "</description></researcher_description>";

      // expertise/keywords
      let exp = await ($('div#expertise').html());
      if (exp) {
        exp = await exp.replace(/\,/g, " | ");
        exp = await exp.replace(/\:/g, " | ");
        exp = await exp.replace(/\;/g, " | ");
        exp = await exp.replace(/\-/g, " | ");

        exp = await exp.replace(/<p(.*?)>/g, "");
        exp = await exp.replace(/<\/p>/g, "");
        exp = await exp.replace(/<br\/>/g, "");
        exp = await exp.replace("Expertise", "");
        exp = await xmlConfig(exp);
        exp = await exp.replace(/\|/g, "<br />");
      } else {
        exp = ""
      }


      con += "<researcher_description><description>" + "<p><strong>Keywords:</strong></p> " + exp + "</description></researcher_description>";

      // courses
      let cour = await ($('div#courses').html());
      if (cour) {
        cour = await cour.replace(/<table(.*?)>/g, "");
        cour = await cour.replace(/<\/table(.*?)>/g, "");
        cour = await cour.replace(/<\/tbody(.*?)>/g, "");
        cour = await cour.replace(/<tbody(.*?)>/g, "");
        cour = await cour.replace(/<tr(.*?)>/g, "");
        cour = await cour.replace(/<\/tr(.*?)>/g, " | ");
        cour = await cour.replace(/<td(.*?)>/g, "");
        cour = await cour.replace(/<\/td>/g, "");
        cour = await cour.replace(/<p(.*?)>/g, "<p>");
        cour = await cour.replace("Courses Taught", "<strong>Courses Taught:</strong>");
        //cour = await xmlConfig(cour);
        cour = await cour.replace(/\|/g, "<br />");
      } else {
        cour = ""
      }

      con += "<researcher_description><description>" + cour + "</description></researcher_description>";

      // profile/description
      let desc = await ($('div#profile').text());
      desc = await xmlConfig(desc);
      con += "<researcher_description><description><p><strong>Description:</strong></p>" + desc + "</description></researcher_description>";

      // scholarship
      let schol = await ($('div#scholarship').html());
      if (schol) {
        schol = await schol.replace(/<p(.*?)>/g, "");
        schol = await schol.replace(/<\/p>/g, " | ");
        schol = await schol.replace(/<br\/>/g, "");
        //schol = await schol.replace(/<ul>/g, "");
        //schol = await schol.replace(/<\/ul>/g, "");
        schol = await xmlConfig(schol);
        schol = await schol.replace('Scholarship', '');
        schol = await schol.replace(/\|/g, "<br /><br />");
      } else {
        schol = ""
      }
      con += "<researcher_description><description><p><strong>Schololorship:</strong></p>" + schol + "</description></researcher_description>";

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


      con = await xmlEscape(con);


      // writes each user to our file.
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    // signifies the end of each researcher being scraped
    done();
  },

});
// puts closing root tag on the document
setTimeout(function () { fs.createWriteStream('./saved.xml', { flags: 'a' }).write('</users>'); }, 6000);

// list of pages to scrape.
c.queue(
  urls,

);

