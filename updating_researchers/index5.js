const fs = require('fs');

(async function () {
  // brings in the spreadsheet obs + faculty guide scraped data
  const { userEnhancedObjs } = require('./Spreadsheet_Objs_Plus_Fac_Guide.js');

  //console.log('userEnhancedObjs----- ', userEnhancedObjs);

  // brings in the spreadsheet obs + faculty guide scraped data
  const { affilationObjs } = require('./Affilation_Spreadsheet_Objs.js');

  //console.log('affilationObjs----- ', affilationObjs);

  //userEnhancedObjs is not and array so it does not have a length.
  for (let i = 0; i < userEnhancedObjs.length; i++) {
    const positionArray = [];
    const titleArray = [];

    userEnhancedObjs[i].positionArray = positionArray;
    userEnhancedObjs[i].titleArray = titleArray;
    console.log('inside for loop +++++++ ', userEnhancedObjs[i]);
  }
  console.log('helloooo', userEnhancedObjs.length);
  //console.log(userEnhancedObjs);
  for (const user in userEnhancedObjs) {
    console.log(`${user}: ${JSON.stringify(userEnhancedObjs[user])}`);
  }
})();
