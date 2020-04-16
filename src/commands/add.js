const fs = require('fs');
const { runSpawn } = require('../promisify');
const { logSuccess, logError } = require('../logs');

const getConfig = async () => {
    const rawConfig = fs.readFileSync('zenbit.config.json');
    const parsedConfig = JSON.parse(rawConfig);
    return parsedConfig;
};

const buildComponentPath = async (componentFolder) => {
    const config = await getConfig();
    const componentsDirectory = config.metaData.componentsDirectory;
    const actualPath = `${componentsDirectory}${componentFolder}`;

    if (!fs.existsSync(actualPath)) {
        throw new Error('Directory does not exist!');
    }

    return actualPath;
};

const addComponentToConfigAndBit = async (componentFolder, options) => {
    const config = await getConfig();
    const componentPath = await buildComponentPath(componentFolder);

    const id = options.componentId ? options.componentId : componentFolder;
    const configComponents = config.components;

    // if component is not tracked in config, add to config for tracking
    if (!configComponents[id]) {
        configComponents[id] = {
            version: '0.0.0',
            path: componentPath,
            componentId: id,
            published: false
        }
        const data = JSON.stringify(config, null, 4);
        fs.writeFileSync('zenbit.config.json', data);
    }

    // add to bit even if it has been added before
    await runSpawn(`npx`, ['bit', 'add', `${componentPath}`, '-i', `${id}`]);
};


const addComponent = async (path, options) => {
    try {
        await addComponentToConfigAndBit(path, options);
        logSuccess(`${path} added successfully`);
    } catch (error) {
        logError(error);
    }
};

module.exports = { addComponent, addComponentToConfigAndBit, getConfig };
