const fs = require('fs');
const XLSX = require('xlsx');

//if (typeof require !== 'undefined') XLSX = require('xlsx');

(async function () {
  const workbook = XLSX.readFile('TestData2.xls');
  console.log('workbook ---------- ', workbook);
  const sheetNames = workbook.SheetNames;
  console.log('sheetNames -----', sheetNames);
  const sheetIndex = 1;

  var df = await XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNames[sheetIndex - 1]]
  );

  console.log('data ----------------------- ', df);

  try {
    // Ensure creation of errors before truncating
    await fs.appendFile('./errors.csv', '', function (err) {
      if (err) throw err;
      console.log('Saved errors.csv');
    });

    // Truncate errors before appending
    await fs.truncateSync('./errors.csv');

    // write headers for errors.csv
    await fs
      .createWriteStream('./errors.csv', { flags: 'as' })
      .write(`Documents, ISBN, Title, Author  \n`);

    // Ensure creation of final before truncating
    await fs.appendFile('./final.csv', '', function (err) {
      if (err) throw err;
      console.log('Saved final!');
    });

    // Truncate final before appending
    await fs.truncateSync('./final.csv');

    // write headers for final.csv
    fs.createWriteStream('./final.csv', { flags: 'a' }).write(
      `Class,ISBN,Title,Author,Year Pub,Req-Rec,Documents,AVD/AVE,URL,Link   \n`
    );

    let staffDataObjs = df.map(async staffObj => {
      let fullName = staffObj.Full_Name;

      //let basicObjs = await Promise.all(staffDataObjs);
      //console.log('basicObjs-----', basicObjs);
      // fs.createWriteStream('./errors.csv', { flags: 'a' }).write(
      //   '\n\n\n' +
      //     'basicObjs.length: ' +
      //     basicObjs.length +
      //     '\n\n\n' +
      //     JSON.stringify(basicObjs)
      // );

      // await fs
      //  .createWriteStream('./final.csv', { flags: 'a' })
      //  .write(JSON.stringify(basicObjs));
    });

    let basicObjs = await Promise.all(staffDataObjs);
  } catch (error) {
    console.log('Error inside call to Ex Libris  *************** ', error);
    fs.createWriteStream('./errors.csv', { flags: 'a' }).write(
      error.message + '\n'
    );
  }
  //console.log('data ----------------------- ', df);
  //console.log('staffDataObj ----------------------- ', staffDataObj);
  console.log('Can you see me now');
})();
