const fs = require('fs');
const XLSX = require('xlsx');

// brings in the spreadsheet obs + faculty guide scraped data
const { userEnhancedObjs } = require('./Spreadsheet_Objs_Plus_Fac_Guide.js');

//console.log('userEnhancedObjs----- ', userEnhancedObjs);

// brings in the ExLibris Analytics spreadsheet of Internal Affiliations positions and titles

const workbook = XLSX.readFile('researcherAffil.csv');

//console.log('workbook----- ', workbook);

const sheetNames = workbook.SheetNames;
console.log('sheetNames -----', sheetNames);
const sheetIndex = 1;

var df = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[sheetIndex - 1]]);
console.table(df);
