const fs = require('fs');
const XLSX = require('xlsx');

// brings in the spreadsheet obs + faculty guide scraped data
const { userEnhancedObjs } = require('./Spreadsheet_Objs_Plus_Fac_Guide.js');

// brings in the ExLibris Analytics spreadsheet of Internal Affiliations positions and titles
//const { researchAffil } = require('./researcherAffil.xls');

console.log('userEnhancedObjs----- ', userEnhancedObjs);
