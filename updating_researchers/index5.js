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

    // Ensure creation of final before truncating
    await fs.appendFile('./Final_Data_Obj.js', '', function (err) {
      if (err) throw err;
      console.log('Final_Data_Obj.js!');
    });

    // Truncate final before appending
    await fs.truncateSync('./Final_Data_Obj.js');

    // write headers for Spreadsheet_Objs.csv
    await fs.createWriteStream('./Final_Data_Obj.js', { flags: 'a' }).write(
      `module.exports = {
    finalDataObjs: `
    );

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
      if (ccenter == 'undefined') {
        ccenter = [];
        ccenter.push(ccenterprimary);
      } else {
        ccenter = ccenter.split(',');
      }
      console.log('ccenter 2nd check ---  ', Array.isArray(ccenter));
      for (let i = 0; i < ccenter.length; i++) {
        let id = `${unet}_${ccenter[i]}`;
        console.log('id --- ', id);
        const obj = await affilationObjs[id];
        if (!obj) {
          console.log('continue +++++++++++++++++++ ');
          const affilPos = 'undefined';
          //console.log('affilPos ************ ', affilPos);
          userEnhancedObjs[user].positionArray.push(affilPos);
          const affilPostTit = 'undefined';
          //console.log('affilPostTit ************ ', affilPostTit);
          userEnhancedObjs[user].titleArray.push(affilPostTit);
          userEnhancedObjs[user].affilSheet = 'no';
          continue;
        }
        console.log(
          'affiliation Object ===  ',
          obj,
          'ccenter[i] ',
          ccenter[i],
          ccenter,
          unet
        );
        const affilPos = obj['affilPosition'];
        //console.log('affilPos ************ ', affilPos);
        userEnhancedObjs[user].positionArray.push(affilPos);
        const affilPostTit = obj['affilPositionTitle'];
        //console.log('affilPostTit ************ ', affilPostTit);
        userEnhancedObjs[user].titleArray.push(affilPostTit);
        userEnhancedObjs[user].affilSheet = 'yes';
      }

      console.log(`${user}: ${JSON.stringify(userEnhancedObjs[user])}`);
    }
    // write headers for Spreadsheet_Objs.csv
    await fs
      .createWriteStream('./Final_Data_Obj.js', { flags: 'a' })
      .write(`${JSON.stringify(userEnhancedObjs)}`);

    await fs
      .createWriteStream('./Final_Data_Obj.js', {
        flags: 'a',
      })
      .write(`}\n`);
  } catch (error) {
    console.error(error);
  }
})();
