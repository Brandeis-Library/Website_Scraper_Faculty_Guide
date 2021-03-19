const fs = require('fs');

(async function () {
  // brings in the final data obj
  const { finalDataObjs } = require('./Final_Data_Obj.js');

  // Ensure creation of spreadsheet before truncating
  await fs.appendFile('./Final_Data_Spreadsheet.csv', '', function (err) {
    if (err) throw err;
    console.log('Final_Data_Spreadsheet.csv!');
  });

  // Truncate final before appending
  await fs.truncateSync('./Final_Data_Spreadsheet.csv');

  // write headers for Final_Data_Spreadsheet.csv
  await fs
    .createWriteStream('./Final_Data_Spreadsheet.csv', { flags: 'a' })
    .write(
      `Unet,Last_Name,First_Name,Full_Name,Title_Workday,costCenterPrimary,costCenterPrimaryLabel,CCH,costCenters,facGuideEmail,facGuideTitle,facGuide,positionArray,titleArray,affilSheet, \n`
    );

  for (const objUnet in finalDataObjs) {
    //console.log(`${objUnet}: ${JSON.stringify(finalDataObjs[objUnet])}`);
    const obj = finalDataObjs[objUnet];
    console.log('obj-------- ', obj);
    // write each obj line for Final_Data_Spreadsheet.csv
    fs.createWriteStream('./Final_Data_Spreadsheet.csv', { flags: 'a' }).write(
      `${obj['unet']},${obj['lastName']},${obj['firstName']},${obj['fullName']},"${obj['titleWorkday']}",${obj['costCenterPrimary']},"${obj['costCenterPrimaryLabel']}","${obj['CCH']}","[${obj['costCenters']}]",${obj['facGuideEmail']},"${obj['facGuideTitle']}",${obj['facGuide']},"${obj['positionArray']}","${obj['titleArray']}",${obj['affilSheet']}, \n`
    );
  }

  try {
  } catch (error) {
    console.error(error);
  }
})();
