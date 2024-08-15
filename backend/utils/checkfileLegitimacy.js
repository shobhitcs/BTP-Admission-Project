const fs = require('fs');
const XLSX = require('xlsx');

const checkFileLegitimacy = (filePath, expectedSchema) => {
    // check if file exists
    if (!fs.existsSync(filePath)) {
        return {
            isValid: false,
            message: 'File not found'
        };
    }
    // read the file
    const workbook = XLSX.readFile(filePath);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    // get the headers of the file
    const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0];

    // check if headers match the expected schema
    for (const expectedColumnName of expectedSchema) {
        if (!headers.includes(expectedColumnName)) {
            return {
                isValid: false,
                message: `Missing column: ${column}`
            };
        }
    }

    return {
        isValid: true,
        message: 'File is valid'
    };
};

module.exports = {checkFileLegitimacy};
