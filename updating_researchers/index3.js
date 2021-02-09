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
