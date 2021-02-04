const fs = require('fs');
const XLSX = require('xlsx');

//if (typeof require !== 'undefined') XLSX = require('xlsx');

(async function () {
  const workbook = XLSX.readFile('TestData2.xls');
  //console.log('workbook ---------- ', workbook);
  const sheetNames = workbook.SheetNames;
  console.log('sheetNames -----', sheetNames);
  const sheetIndex = 1;

  var df = await XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNames[sheetIndex - 1]]
  );

  //console.log('data ----------------------- ', df);

  try {
    // Ensure creation of errors before truncating
    await fs.appendFile('./errors.csv', '', function (err) {
      if (err) throw err;
      console.log('Saved errors.csv');
    });

    // Truncate errors before appending
    //await fs.truncateSync('./errors.csv');

    // write headers for errors.csv
    await fs
      .createWriteStream('./errors.csv', { flags: 'as' })
      .write(`Errors for this running of the application...  \n`);

    // Ensure creation of final before truncating
    await fs.appendFile('./Spreadsheet_Objs.csv', '', function (err) {
      if (err) throw err;
      console.log('Saved Spreadsheet_Objs.csv!');
    });

    // Truncate final before appending
    await fs.truncateSync('./Spreadsheet_Objs.csv');

    // write headers for Spreadsheet_Objs.csv
    fs.createWriteStream('./Spreadsheet_Objs.csv', { flags: 'a' }).write(
      `\/\/Processed Spreadsheet Objs   \n`
    );

    // Ensure creation of final before truncating
    await fs.appendFile('./df.csv', '', function (err) {
      if (err) throw err;
      console.log('Saved df!');
    });

    // Truncate final before appending
    await fs.truncateSync('./df.csv');

    // write headers for df.csv
    await fs
      .createWriteStream('./df.csv', { flags: 'a' })
      .write(`JSON from df  \n`);

    //let staffDataObjs = await df.map(async staffObj => {
    // fs.createWriteStream('./errors.csv', { flags: 'a' }).write(
    //   '\n\n\n' +
    //     'basicObjs.length: ' +
    //     basicObjs.length +
    //     '\n\n\n' +
    //     JSON.stringify(basicObjs)
    // );
    // await fs
    //   .createWriteStream('./final.csv', { flags: 'a' })
    //   .write(JSON.stringify(basicObjs));
    //});

    // console.log(
    //   'staffDataObjs ---------',
    //   staffDataObjs,
    //   '----------  staffSataObjs ----------------'
    // );

    // let basicObjs = await Promise.all(staffDataObjs);

    let staffDataObjs = await df.map(async staffObj => {
      const FullName = staffObj.Full_Name;

      return FullName;
    });

    console.log('staffDataObjs....', staffDataObjs);
    await fs
      .createWriteStream('./df.csv', { flags: 'a' })
      .write(JSON.stringify(df));
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
