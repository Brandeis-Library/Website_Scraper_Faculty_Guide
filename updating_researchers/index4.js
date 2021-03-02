const fs = require('fs');
const XLSX = require('xlsx');

(async function () {
  // brings in the spreadsheet obs + faculty guide scraped data
  const { userEnhancedObjs } = require('./Spreadsheet_Objs_Plus_Fac_Guide.js');

  //console.log('userEnhancedObjs----- ', userEnhancedObjs);

  // brings in the ExLibris Analytics spreadsheet of Internal Affiliations positions and titles
  try {
    const workbook = await XLSX.readFile('researcherAffil.csv');

    //console.log('workbook----- ', workbook);

    const sheetNames = workbook.SheetNames;
    console.log('sheetNames -----', sheetNames);
    const sheetIndex = 1;

    var df = await XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNames[sheetIndex - 1]]
    );
    console.table(df);

    // Ensure creation of final before truncating
    await fs.appendFile('./Affilation_Spreadsheet_Objs.js', '', function (err) {
      if (err) throw err;
      console.log('Saved Affilation_Spreadsheet_Objs.js!');
    });

    // Truncate final before appending
    await fs.truncateSync('./Affilation_Spreadsheet_Objs.js');

    // write headers for Spreadsheet_Objs.csv
    await fs
      .createWriteStream('./Affilation_Spreadsheet_Objs.js', { flags: 'a' })
      .write(
        `module.exports = {
    affilationObjs: {`
      );

    let affilDataObjs = await df.map(affilObj => {
      const obj = {};
      obj.unet = affilObj.Primary_Identifier;
      obj.costCenter = affilObj.Affiliation_Unit_Code;
      obj.unitName = affilObj.Affiliation_Unit_Name;

      const obj2 = `"${affilObj.Primary_Identifier}": {"unet": "${affilObj.Primary_Identifier}",
    "costCenter": "${affilObj.Affiliation_Unit_Code}", "unitName": "${affilObj.Affiliation_Unit_Name}", "unitType": "${affilObj.Affiliation_Unit_Type}", "affilPosition": "${affilObj.Affiliation_Position}", "affilPositionTitle": "${affilObj.Affiliation_Position_Title}"
    }`;

      return obj2;
    });
    let resolvedAffilDataObjs = await Promise.all(affilDataObjs);

    await fs
      .createWriteStream('./Affilation_Spreadsheet_Objs.js', { flags: 'a' })
      .write(`${resolvedAffilDataObjs}}}`);
    console.log('Can you see me now');
  } catch (error) {
    console.error(error);
  }
})();
