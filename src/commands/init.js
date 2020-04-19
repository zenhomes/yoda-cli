const fs = require('fs');
const { runExec, runSpawn } = require('../promisify');
const { logInfo, logSuccess, logError } = require('../logs');

const initializeBit = async () => {
    logInfo('Initializing bit workspace');
    const bitInitResponse = await runExec('npx bit init');
    logSuccess(bitInitResponse);
};

const updateComponentsDefaultDirectory = async (componentsDirectory) => {
    logInfo('Updating default components directory');

    const rawPackageJSON = fs.readFileSync('package.json');
    const parsedPackageJSON = JSON.parse(rawPackageJSON);

    // build new components directory
    const endsWithSlash = componentsDirectory[componentsDirectory.length - 1] === '/';
    const cleanedComponentsDirectory = endsWithSlash ? componentsDirectory : `${componentsDirectory}/`;
    const newComponentsDirectory = `${cleanedComponentsDirectory}{name}`;

    // update package.json file
    parsedPackageJSON.bit.componentsDefaultDirectory = newComponentsDirectory;

    // save to disc
    const data = JSON.stringify(parsedPackageJSON, null, 4);
    fs.writeFileSync('package.json', data);

    logSuccess('Default components directory update complete');
};

const getBitFrameworkCompiler = (framework) => {
    switch (framework) {
        case 'react':
            return 'bit.envs/compilers/react-typescript';
        default:
            return 'bit.envs/compilers/react-typescript';
    }
}

const installFrameworkCompiler = async (framework) => {
    logInfo(`Installing compiler for ${framework}`);

    const bitFrameworkCompiler = getBitFrameworkCompiler(framework);
    await runSpawn(`npx`, ['bit', 'import', `${bitFrameworkCompiler}`, '-c']);

    logSuccess(`Compiler installation complete`);
};

const createConfig = async (framework, componentsDirectory) => {
    logInfo('Setting up config');

    const config = {
        metaData: {
            framework,
            componentsDirectory,
            revision: 1,
        },
        components: {}
    };

    const data = JSON.stringify(config, null, 4);
    fs.writeFileSync('yoda.config.json', data);

    logSuccess('Config setup complete');
};


const initializeWorkspace = async ({ framework, componentsDirectory }) => {
    try {
        await initializeBit();
        await updateComponentsDefaultDirectory(componentsDirectory);
        await installFrameworkCompiler(framework);
        await createConfig(framework, componentsDirectory);

        logSuccess('Workspace initialization complete');
    } catch (error) {
        logError(error);
    }
};

module.exports = { initializeWorkspace };
