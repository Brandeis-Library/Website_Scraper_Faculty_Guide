const fs = require('fs');

// brings in the faculty guide scraped data to scrape
const { researcherIds } = require('./faculty_guide_data.js');

// brings in the spreadsheet data
const { userObjs } = require('./Spreadsheet_Objs.js');

for (i = 0; i < userObjs.length; i++) {
  console.log(userObjs[i].unet);
  const user = userObjs[i].unet;
  console.log(researcherIds[user]);
}

/*
Possible actions

match spreadsheet with faculty guide

match faculty guide with spreadsheet

list userObjs not in faculty guide

list users in faculty guide not in spreadsheet

get list of user titles
  from just spreadsheet or faculty guide
  combine the two in one record for analysis.

*/
