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
      if (user.titleWorkday.includes('Professor of the Practice')) {
        positionVar = 'professor_practice';
      } else if (user.titleWorkday.includes('Professor Emeritus')) {
        positionVar = 'emeritus';
      } else if (
        user.titleWorkday.includes('Chair') ||
        user.titleWorkday.includes(
          'Director' || user.titleWorkday.includes('Dir, Center')
        )
      ) {
        positionVar = 'chair_director';
      } else if (
        user.titleWorkday.startsWith('Associate Professor of the Practice')
      ) {
        positionVar = 'associate_practice';
      } else if (
        user.titleWorkday.startsWith('Distinguished Research Scientist')
      ) {
        positionVar = 'distinguished_research_scientist';
      } else if (user.titleWorkday.startsWith('Research Associate I')) {
        positionVar = 'research_associate_1';
      } else if (user.titleWorkday.startsWith('Research Associate II')) {
        positionVar = 'research_associate_2';
      } else if (user.titleWorkday.startsWith('Research Scientist I')) {
        positionVar = 'research_scientist_1';
      } else if (user.titleWorkday.startsWith('Research Scientist II')) {
        positionVar = 'research_scientist_2';
      } else if (user.titleWorkday.startsWith('Postdoctoral Fellow')) {
        positionVar = 'postdoctoral_fellow';
      } else if (user.titleWorkday.startsWith('Postdoctoral Associate')) {
        positionVar = 'postdoctoral_associate';
      } else if (user.titleWorkday.startsWith('Assistant Professor')) {
        positionVar = 'assistant_professor';
      } else if (
        user.titleWorkday.startsWith(
          'Adjunct Associate Professor of the Practice'
        )
      ) {
        positionVar = 'adjunct_associate_practice';
      } else if (user.titleWorkday.startsWith('Faculty Leave Fellow')) {
        positionVar = 'fellow';
      } else if (user.titleWorkday.includes('Kay Fellow')) {
        positionVar = 'kay_fellow';
      } else if (user.titleWorkday.includes('NRSA Postdoctoral Fellow')) {
        positionVar = 'nrsa_fellow';
      } else if (user.titleWorkday.startsWith('Adjunct Assistant Professor')) {
        positionVar = 'adjunct_assistant';
      } else if (user.titleWorkday.startsWith('Adjunct Associate Professor')) {
        positionVar = 'adjunct_associate';
      } else if (user.titleWorkday.startsWith('Adjunct Instructor')) {
        positionVar = 'adjunct_instructor';
      } else if (user.titleWorkday.startsWith('Adjunct Lecturer')) {
        positionVar = 'adjunct_lecturer';
      } else if (user.titleWorkday.startsWith('Adjunct Professor')) {
        positionVar = 'adjunct_professor';
      } else if (user.titleWorkday.startsWith('Adjunct Senior Lecturer')) {
        positionVar = 'adjunct_senior_lecturer';
      } else if (
        user.titleWorkday.startsWith('Associate Research Scientist II')
      ) {
        positionVar = 'associate_research_2';
      } else if (user.titleWorkday.startsWith('Associate Research')) {
        positionVar = 'associate_research';
      } else if (user.titleWorkday.startsWith('Sr Research Associate I')) {
        positionVar = 'senior_research_associate_1';
      } else if (user.titleWorkday.startsWith('Sr Research Associate II')) {
        positionVar = 'senior_research_associate_2';
      } else if (user.titleWorkday.startsWith('Sr Research Scientist I')) {
        positionVar = 'senior_research_scientist_1';
      } else if (user.titleWorkday.startsWith('Sr Research Scientist II')) {
        positionVar = 'senior_research_scientist_2';
      } else if (user.titleWorkday.startsWith('Senior Lecturer')) {
        positionVar = 'senior_lecturer';
      } else if (user.titleWorkday.startsWith('Lecturer')) {
        positionVar = 'lecturer';
      } else if (user.titleWorkday.startsWith('Associate Professor')) {
        positionVar = 'associate_professor';
      } else if (user.titleWorkday.startsWith('Professor')) {
        positionVar = 'professor';
      } else if (user.titleWorkday.startsWith('Instructor')) {
        positionVar = 'instructor';
      } else if (user.titleWorkday.startsWith('Poet-in-Residence')) {
        positionVar = 'scholar_in_residence';
      } else if (user.titleWorkday.startsWith('Scientist')) {
        positionVar = 'Scientist';
      } else if (user.titleWorkday.startsWith('Scholoar-in-Residence')) {
        positionVar = 'poet_in_residence';
      } else if (user.titleWorkday.startsWith('Sr Fellow')) {
        positionVar = 'senior_fellow';
      } else {
        // Can use this to test if any are in the category with a long\specific text
        positionVar = user.titleWorkday;
      }

      console.log('unet', unet);
      let str = `<user><primary_id>${user.unet}</primary_id><is_researcher>true</is_researcher><researcher><researcher_first_name>${user.firstName}</researcher_first_name><researcher_last_name>${user.lastName}</researcher_last_name><position>${positionVar}</position>${displayTitleVar}<researcher_organization_affiliations>${costCentersVar}</researcher_organization_affiliations></researcher></user>`;
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
