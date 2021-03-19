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

    await fs
      .createWriteStream('./updateRearcher.xml', { flags: 'a' })
      .write('</users>');
  } catch (error) {
    console.error(error);
  }
})();
