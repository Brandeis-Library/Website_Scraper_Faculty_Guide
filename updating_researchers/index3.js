const fs = require('fs');

// brings in the faculty guide scraped data to scrape
const { researcherIds } = require('./faculty_guide_data.js');

// brings in the spreadsheet data
const { userObjs } = require('./Spreadsheet_Objs.js');

for (i = 0; i < userObjs.length; i++) {
  console.table(userObjs[i]);
  const userSpreadSheet = userObjs[i].unet;
  const userFacGuide = researcherIds[userSpreadSheet];
  console.table(userFacGuide);

  if (!userFacGuide) {
    console.log('continue');
    userObjs[i].facGuide = 'No';
    console.table(userObjs[i]);
    continue;
  }

  console.log(userObjs[i].costCenterPrimary);
  console.log(userFacGuide.depts);

  const index = userFacGuide.depts.indexOf(userObjs[i].costCenterPrimary);
  if (index > -1) {
    userFacGuide.depts.splice(index, 1);
    userFacGuide.depts.unshift(userObjs[i].costCenterPrimary);
  } else {
    userFacGuide.depts.unshift(userObjs[i].costCenterPrimary);
  }
  userObjs[i].costCenters = userFacGuide.depts;
  userObjs[i].facGuideEmail = userFacGuide.email;
  userObjs[i].facGuide = 'Yes';
  console.table(userObjs[i]);
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
