
const fs = require('fs');
const path = require('path');
const errorLogDir = path.join(__dirname, '../../error_logs');
const controllerErrorLog = path.join(__dirname, '../../error_logs/controller_error_logs');
const serviceErrorLog = path.join(__dirname, '../../error_logs/service_error_logs');
if (!fs.existsSync(errorLogDir)) {
    fs.mkdirSync(errorLogDir);
}
if (!fs.existsSync(controllerErrorLog)) {
    fs.mkdirSync(controllerErrorLog)
}
if (!fs.existsSync(serviceErrorLog)) {
    fs.mkdirSync(serviceErrorLog)
}
function getLogFileName(baseDir) {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    let fileType = "";
    if (baseDir == controllerErrorLog) {
        fileType = "controller_error_";
    } else if (baseDir == serviceErrorLog) {
        fileType = "service_error_";
    }
    return path.join(baseDir, `${fileType}${formattedDate}.log`);
}
function logControllerError(error) {
    const logFilePath = getLogFileName(controllerErrorLog);
    const errorMessage = `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`;
    fs.appendFile(logFilePath, errorMessage, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
}
function logServerError(error) {
    const logFilePath = getLogFileName(serviceErrorLog);
    const errorMessage = `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`;
    fs.appendFile(logFilePath, errorMessage, (err) => {
        if (err) console.error('Failed to write to server error log file:', err);
    });
}
module.exports = { logControllerError, logServerError };
