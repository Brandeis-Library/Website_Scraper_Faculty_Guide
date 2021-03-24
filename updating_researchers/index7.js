const fs = require('fs');

(async function () {
  try {
    // brings in the final data obj
    const { finalDataObjs } = require('./Final_Data_Obj.js');

    //console.table(finalDataObjs);

    // Truncate faculty_guide_data.txt before appending
    await fs.truncateSync('./updateRearcher.xml');

    // Write at the top of the page.
    await fs
      .createWriteStream('./updateRearcher.xml', { flags: 'a' })
      .write(
        `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="saved.xsl"?><users>`
      );

    for (const unet in finalDataObjs) {
      const user = finalDataObjs[unet];
      let displayTitleVar = '';
      let costCentersVar = '';
      const ccArr = user.costCenters.split(',');
      console.log('ccArr-----  ', ccArr);
      if (user.facGuideTitle !== 'undefined') {
        displayTitleVar = `<display_title>${user.facGuideTitle}</display_title>`;
      }

      if (ccArr.length === 1) {
        costCentersVar = `<researcher_organization_affiliation><organization_code>${user.costCenterPrimary}</organization_code></researcher_organization_affiliation>`;
      } else {
        for (y = 0; y < ccArr.length; y++) {
          costCentersVar += `<researcher_organization_affiliation><organization_code>${ccArr[y]}</organization_code></researcher_organization_affiliation>`;
        }
      }

      console.log('unet', unet);
      let str = `<user><primary_id>${user.unet}</primary_id><is_researcher>true</is_researcher><researcher><researcher_first_name>${user.firstName}</researcher_first_name><researcher_last_name>${user.lastName}></researcher_last_name><position>${user.titleWorkday}</position>${displayTitleVar}<researcher_organization_affiliations>${costCentersVar}</researcher_organization_affiliations></researcher></user>`;
      console.log('for in loop', str);
      await fs
        .createWriteStream('./updateRearcher.xml', { flags: 'a' })
        .write(str);
    }

    await fs
      .createWriteStream('./updateRearcher.xml', { flags: 'a' })
      .write('</users>');
  } catch (error) {
    console.error(error);
  }
})();
