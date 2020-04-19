const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";

const logInfo = (output) => {
    console.log(FgBlue, output);
};

const logSuccess = (output) => {
    console.log(FgGreen, output);
};

const logWarning = (output) => {
    console.log(FgYellow, output);
};

const logError = (output) => {
    console.log(FgRed, output);
};


module.exports = {
    logInfo,
    logSuccess,
    logWarning,
    logError
};
