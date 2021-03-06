const fs = require('fs');
const XLSX = require('xlsx');

//if (typeof require !== 'undefined') XLSX = require('xlsx');

(async function () {
  const workbook = XLSX.readFile('TestData3.xls');
  //console.log('workbook ---------- ', workbook);
  const sheetNames = workbook.SheetNames;
  console.log('sheetNames -----', sheetNames);
  const sheetIndex = 1;

  var df = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNames[sheetIndex - 1]]
  );

  try {
    // Ensure creation of final before truncating
    await fs.appendFile('./Spreadsheet_Objs.js', '', function (err) {
      if (err) throw err;
      console.log('Saved Spreadsheet_Objs.js!');
    });

    // Truncate final before appending
    await fs.truncateSync('./Spreadsheet_Objs.js');

    // write headers for Spreadsheet_Objs.csv
    await fs.createWriteStream('./Spreadsheet_Objs.js', { flags: 'a' }).write(
      `module.exports = {
        userObjs:`
    );

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

    let staffDataObjs = await df.map(staffObj => {
      const obj = {};
      if (staffObj.Full_Name) {
        obj.fullName = staffObj.Full_Name;
      }

      if (staffObj.First_Name) {
        obj.firstName = staffObj.First_Name;
      }

      if (staffObj.Last_Name) {
        obj.lastName = staffObj.Last_Name;
      }

      if (staffObj.Email) {
        const num = staffObj.Email.indexOf('@');
        obj.email = staffObj.Email;
        obj.unet = staffObj.Email.slice(0, num);
        obj.unet.replace('.', '_');
      }

      if (staffObj.Business_Title) {
        obj.title = staffObj.Business_Title;
      }

      if (staffObj.Cost_Centers) {
        const num = staffObj.Cost_Centers.indexOf(' ');
        obj.costCenterPrimary = staffObj.Cost_Centers.slice(0, num);
        obj.costCenterPrimaryLabel = staffObj.Cost_Centers.slice(num + 1);
      }

      if (staffObj.Cost_Center_Hierarchy) {
        obj.CCH = staffObj.Cost_Center_Hierarchy;
      }

      if (staffObj.Management_Level) {
        obj.ML = staffObj.Management_Level;
      }

      if (staffObj.Worker_Type) {
        obj.WT = staffObj.Worker_Type;
      }

      return obj;
    });

    console.log('staffDataObjs....', staffDataObjs);
    let resolvedStaffDataObjs = await Promise.all(staffDataObjs);
    await fs
      .createWriteStream('./df.csv', { flags: 'a' })
      .write(JSON.stringify(df));

    await fs
      .createWriteStream('./Spreadsheet_Objs.js', { flags: 'a' })
      .write(JSON.stringify(resolvedStaffDataObjs));
  } catch (error) {
    console.log('Error inside call to Ex Libris  *************** ', error);
    await fs
      .createWriteStream('./errors.csv', { flags: 'a' })
      .write(error.message + '\n');
  }
  //console.log('data ----------------------- ', df);
  //console.log('staffDataObj ----------------------- ', staffDataObj);

  // write  for df.csv
  await fs
    .createWriteStream('./Spreadsheet_Objs.js', { flags: 'a' })
    .write(`}`);
  console.log('Can you see me now');
})();
