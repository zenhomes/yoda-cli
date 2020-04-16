const { exec, spawn } = require('child_process');

const runExec = (commandString) => (
    new Promise((resolve, reject) => {
        exec(commandString, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    })
);

const runSpawn = (commandString, params) => (
    new Promise((resolve, reject) => {
        const command = spawn(commandString, params);

        command.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        command.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        command.on('error', (error) => {
            reject(error.message);
        });

        command.on('close', (code) => {
            resolve(code);
        });
    })
);


module.exports = {
    runExec,
    runSpawn
};
