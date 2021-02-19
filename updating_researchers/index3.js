const fs = require('fs');

(async function () {
  // brings in the faculty guide scraped data to scrape
  const { researcherIds } = require('./faculty_guide_data.js');

  // brings in the spreadsheet data
  const { userObjs } = require('./Spreadsheet_Objs.js');

  try {
    // Ensure creation of final before truncating
    await fs.appendFile(
      './Spreadsheet_Objs_Plus_Fac_Guide.js',
      '',
      function (err) {
        if (err) throw err;
        console.log('Saved Spreadsheet_Objs_Plus_Fac_Guide.js!');
      }
    );

    // Truncate final before appending
    await fs.truncateSync('./Spreadsheet_Objs_Plus_Fac_Guide.js');

    // write headers for Spreadsheet_Objs.csv
    await fs
      .createWriteStream('./Spreadsheet_Objs_Plus_Fac_Guide.js', { flags: 'a' })
      .write(
        `module.exports = {
      userEnhancedObjs: {`
      );

    for (i = 0; i < userObjs.length; i++) {
      console.table(userObjs[i]);
      const userSpreadSheet = userObjs[i].unet;
      const userFacGuide = researcherIds[userSpreadSheet];
      console.table(userFacGuide);

      if (!userFacGuide) {
        console.log('continue');
        userObjs[i].facGuide = 'No';
        console.table(userObjs[i]);
        await fs
          .createWriteStream('./Spreadsheet_Objs_Plus_Fac_Guide.js', {
            flags: 'a',
          })
          .write(
            `${userObjs[i].unet}: { fullName: "${userObjs[i].fullName}", firstName: "${userObjs[i].firstName}",lastName: "${userObjs[i].lastName}", unet: "${userObjs[i].unet}",titleWorkday: "${userObjs[i].title}",costCenterPrimary: "${userObjs[i].costCenterPrimary}",
          costCenterPrimaryLabel: "${userObjs[i].costCenterPrimaryLabel}",
          CCH: "${userObjs[i].CCH}",
          costCenters: [${userObjs[i].costCenters}],
          facGuideEmail: "${userObjs[i].facGuideEmail}",
          facGuideTitle: "${userObjs[i].facGuideTitle}",
          facGuide: "${userObjs[i].facGuide}",
        },`
          );
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
      userObjs[i].facGuideTitle = userFacGuide.title;
      userObjs[i].facGuide = 'Yes';
      console.table(userObjs[i]);
      await fs
        .createWriteStream('./Spreadsheet_Objs_Plus_Fac_Guide.js', {
          flags: 'a',
        })
        .write(
          `${userObjs[i].unet}: { fullName: "${userObjs[i].fullName}", firstName: "${userObjs[i].firstName}",lastName: "${userObjs[i].lastName}", unet: "${userObjs[i].unet}",titleWorkday: "${userObjs[i].title}",costCenterPrimary: "${userObjs[i].costCenterPrimary}",
          costCenterPrimaryLabel: "${userObjs[i].costCenterPrimaryLabel}",
          CCH: "${userObjs[i].CCH}",
          costCenters: [${userObjs[i].costCenters}],
          facGuideEmail: "${userObjs[i].facGuideEmail}",
          facGuideTitle: "${userObjs[i].facGuideTitle}",
          facGuide: "${userObjs[i].facGuide}",
        },`
        );
    }

    await fs
      .createWriteStream('./Spreadsheet_Objs_Plus_Fac_Guide.js', {
        flags: 'a',
      })
      .write(`}}\n`);
  } catch (error) {
    console.error('index3.js ERROR.....', error);
  }
})();
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
