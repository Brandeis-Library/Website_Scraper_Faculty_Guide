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
      let positionVar = '';
      const ccArr = user.costCenters.split(',');
      console.log('ccArr-----  ', ccArr);
      if (user.facGuideTitle !== 'undefined') {
        displayTitleVar = `<display_title>${user.facGuideTitle}</display_title>`;
      }
      // set affilation dept codes
      if (ccArr.length === 1) {
        costCentersVar = `<researcher_organization_affiliation><organization_code>${user.costCenterPrimary}</organization_code></researcher_organization_affiliation>`;
      } else {
        for (y = 0; y < ccArr.length; y++) {
          costCentersVar += `<researcher_organization_affiliation><organization_code>${ccArr[y]}</organization_code></researcher_organization_affiliation>`;
        }
      }

      // map title from Workday to codes for postion in Esploro
      //  user.titleWorkday === 'Professor' user.titleWorkday === '' ||
      if (
        user.titleWorkday === 'Professor' ||
        user.titleWorkday === 'Professor of Computer Science' ||
        user.titleWorkday === 'Professor of Mathematics' ||
        user.titleWorkday === 'Professor of Psychology' ||
        user.titleWorkday === 'Professor of Physics' ||
        user.titleWorkday === 'Professor of Chemistry' ||
        user.titleWorkday === 'Professor of Theater Arts' ||
        user.titleWorkday ===
          'Professor of Biology and Harold and Bernice Davis Chair in Aging and Neurodegenerative Disease'
      ) {
        positionVar = 'professor';
      } else if (user.titleWorkday === 'Postdoctoral Fellow') {
        positionVar = 'postdoctoral_fellow';
      } else if (
        user.titleWorkday === 'Assistant Professor of English' ||
        user.titleWorkday === 'Assistant Professor of Philosophy' ||
        user.titleWorkday ===
          'Assistant Professor in Education and Studies in Jewish Education' ||
        user.titleWorkday === 'Assistant Professor of Economics' ||
        user.titleWorkday === 'Assistant Professor of Psychology' ||
        user.titleWorkday ===
          'Assistant Professor of Education and Director of Teacher Education' ||
        user.titleWorkday === 'Assistant Professor of Chemistry' ||
        user.titleWorkday === 'Assistant Professor of Chemistry' ||
        user.titleWorkday ===
          'Assistant Professor of University Writing and Director of First-Year Writing' ||
        user.titleWorkday === 'Assistant Professor of Physics' ||
        user.titleWorkday === 'Assistant Research Professor of Physics' ||
        user.titleWorkday ===
          'Assistant Professor of Education and Sociology' ||
        user.titleWorkday === 'Assistant Professor of Politics' ||
        user.titleWorkday === 'Assistant Professor in Psychology' ||
        user.titleWorkday === 'Assistant Professor of Computer Science' ||
        user.titleWorkday === 'Assistant Professor'
      ) {
        positionVar = 'assistant_professor';
      } else {
        // Can use this to test if any are in the category with a long\specific text
        positionVar = user.titleWorkday;
      }

      console.log('unet', unet);
      let str = `<user><primary_id>${user.unet}</primary_id><is_researcher>true</is_researcher><researcher><researcher_first_name>${user.firstName}</researcher_first_name><researcher_last_name>${user.lastName}></researcher_last_name><position>${positionVar}</position>${displayTitleVar}<researcher_organization_affiliations>${costCentersVar}</researcher_organization_affiliations></researcher></user>`;
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
