const fs = require('fs');

(async function () {
  try {
    // brings in the spreadsheet obs + faculty guide scraped data
    const {
      userEnhancedObjs,
    } = require('./Spreadsheet_Objs_Plus_Fac_Guide.js');

    //console.log('userEnhancedObjs----- ', userEnhancedObjs);

    // brings in the spreadsheet obs + faculty guide scraped data
    const { affilationObjs } = require('./Affilation_Spreadsheet_Objs.js');

    //console.log('affilationObjs----- ', affilationObjs);

    for (const user in userEnhancedObjs) {
      //console.log(`${user}: ${JSON.stringify(userEnhancedObjs[user])}`);
      const positionArray = [];
      const titleArray = [];
      userEnhancedObjs[user].positionArray = positionArray;
      userEnhancedObjs[user].titleArray = titleArray;
      const objStringified = JSON.stringify(userEnhancedObjs[user]);
      const unet = userEnhancedObjs[user].unet;
      let ccenter = userEnhancedObjs[user].costCenters;
      let ccenterprimary = userEnhancedObjs[user].costCenterPrimary;

      console.log('ccenter root -- ', ccenter);
      console.log('ccenter 1st check ---  ', Array.isArray(ccenter));

      console.log('ccenter[0] ---', ccenter[0]);
      if (!ccenter[0]) {
        ccenter.pop();
        ccenter.push(ccenterprimary);
      } else {
        ccenter = ccenter.split(',');
      }
      console.log('ccenter 2nd check ---  ', Array.isArray(ccenter));
      for (let i = 0; i < ccenter.length; i++) {
        let id = `${unet}_${ccenter[i]}`;
        console.log('id --- ', id);
        const obj = await affilationObjs[id];
        console.log(
          'affiliation Object ===  ',
          obj,
          'ccenter[i] ',
          ccenter[i],
          ccenter,
          unet
        );
        //userEnhancedObjs[user].positionArray.push(obj[affilPosition]);
        //userEnhancedObjs[user].titleArray.push(obj[affilPositionTitle]);
      }

      //console.log(`${user}: ${objStringified}`);
    }
  } catch (error) {
    console.error(error);
  }
})();
