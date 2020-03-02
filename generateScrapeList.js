const fs = require('fs');
const Crawler = require("crawler");

//The Faculty Guide links to faculty by the first letter of their last name.  
//This function is called by scrapeFacultyLinks and scrapes the links to the page for each letter

function buildAZLinks() {
  var facultyAZLinks = [];
  var facultyLinkTemplate = 'https://www.brandeis.edu/facultyguide/letter.html?letter='
  var currentLetter = 65; 
  for (i = 0; i < 26; i++){
    facultyAZLinks.push(facultyLinkTemplate + String.fromCharCode(currentLetter));
    currentLetter++;
  }
  return facultyAZLinks; 
}


//Scrape the links to each faculty pages and save as JSON
function scrapeFacultyLinks(){

  var facProfileList = new Set();

  const c = new Crawler({
    maxConnections: 10,
    jQuery: {
      name: 'cheerio',
      options: {
        normalizeWhitespace: true,
        xmlMode: true
      }
    },
    callback: function (error, res, done) {
      let $ = res.$;
        
      $('div#content a').each(function(){
        facProfileList.add('https://www.brandeis.edu/facultyguide/' + $(this).attr('href'));
      });
      done();
    }
  });

  c.queue(buildAZLinks());

  c.on('drain',function(){
    console.log(facProfileList);
    console.log("SIZE IS " + facProfileList.size);
    facultyProfileURLArray = Array.from(facProfileList);       
    fs.writeFile('facProfileURLArray.json',  JSON.stringify(facultyProfileURLArray), function(){});
  });

  
}

scrapeFacultyLinks();